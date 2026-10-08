#!/usr/bin/env python
"""Generate branded 1200x630 blog thumbnails.

Two modes per entry in thumb_plan.json:
  photo   — verified Unsplash photo + dark gradient + SAMAAT tag + logo + title
  graphic — duotone gradient (per-entry hue) + sound-wave arcs + big figure
            text + SAMAAT tag + logo + title (no photo: fully brand-designed)

Usage:
  python scripts/make_thumbnails.py            # all entries
  python scripts/make_thumbnails.py slug1 ...  # subset
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content" / "blog"
OUT = ROOT / "public" / "images" / "blog"
SRC_CACHE = ROOT / "scratch" / "thumb-src"
LOGO = ROOT / "public" / "samaat-logo.png"
FONT = r"C:\Windows\Fonts\segoeuib.ttf"
W, H = 1200, 630

PLAN = json.loads((Path(__file__).parent / "thumb_plan.json").read_text())


def fetch_image(url: str, slug: str) -> Image.Image:
    cache = SRC_CACHE / f"{slug}.jpg"
    if cache.exists():
        return Image.open(cache).convert("RGB")
    req = Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    with urlopen(req, timeout=60) as r:
        data = r.read()
    cache.parent.mkdir(parents=True, exist_ok=True)
    cache.write_bytes(data)
    return Image.open(cache).convert("RGB")


def rounded_logo() -> Image.Image:
    logo = Image.open(LOGO).convert("RGBA")
    dark = ROOT / "scripts" / "assets" / "logo-dark.png"
    if dark.exists():
        logo = Image.open(dark).convert("RGBA")
    pad = 26
    panel = Image.new("RGBA", (logo.width + pad * 2, logo.height + pad * 2), (255, 255, 255, 0))
    d = ImageDraw.Draw(panel)
    d.rounded_rectangle([0, 0, panel.width - 1, panel.height - 1], radius=20, fill=(255, 255, 255, 244))
    panel.alpha_composite(logo, (pad, pad))
    return panel


def brand_bits(card: Image.Image, kicker: str):
    d = ImageDraw.Draw(card)
    f_k = ImageFont.truetype(FONT, 30)
    kw = d.textlength(kicker, font=f_k)
    d.rounded_rectangle([56, 46, 56 + kw + 46, 102], radius=28, fill=(4, 56, 62, 225))
    d.text((79, 56), kicker, font=f_k, fill=(126, 231, 205, 255))
    panel = rounded_logo()
    card.alpha_composite(panel, (W - panel.width - 46, 38))
    return panel.height


def draw_title(d: ImageDraw.Draw, title: str, y_bottom: int, max_w: int = W - 116):
    f_big = ImageFont.truetype(FONT, 60)
    f_small = ImageFont.truetype(FONT, 48)
    for f in (f_big, f_small):
        lines, line = [], ""
        for word in title.split():
            trial = (line + " " + word).strip()
            if d.textlength(trial, font=f) <= max_w:
                line = trial
                continue
            lines.append(line)
            line = word
        lines.append(line)
        if len(lines) <= 2:
            break
    lines = lines[:2]
    f_use = f_big if len(lines) == 1 else f_small
    lh = int(f_use.size * 1.24)
    y = y_bottom - len(lines) * lh
    for ln in lines:
        d.text((62, y + 3), ln, font=f_use, fill=(0, 0, 0, 150))
        d.text((60, y), ln, font=f_use, fill=(255, 255, 255, 248))
        y += lh


def make_photo(spec: dict, slug: str) -> Image.Image:
    photo = fetch_image(spec["image"], slug)
    ratio = max(W / photo.width, H / photo.height)
    photo = photo.resize((int(photo.width * ratio) + 1, int(photo.height * ratio) + 1), Image.LANCZOS)
    l, t = (photo.width - W) // 2, (photo.height - H) // 2
    photo = photo.crop((l, t, l + W, t + H))
    photo = ImageEnhance.Brightness(photo).enhance(0.95)
    card = photo.convert("RGBA")
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    for y in range(H):
        frac = y / H
        a = int(215 * max(0.0, frac - 0.34) / 0.66)
        d.line([(0, y), (W, y)], fill=(10, 38, 43, a))
    d.rectangle([0, 0, W, H], fill=(2, 35, 41, 40))
    card.alpha_composite(ov)
    return card


def make_graphic(spec: dict) -> Image.Image:
    card = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(card)
    c1, c2 = spec["grad"]  # two hex colors
    r1, g1, b1 = tuple(int(c1[i:i + 2], 16) for i in (1, 3, 5))
    r2, g2, b2 = tuple(int(c2[i:i + 2], 16) for i in (1, 3, 5))
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)],
               fill=(int(r1 + (r2 - r1) * t), int(g1 + (g2 - g1) * t), int(b1 + (b2 - b1) * t)))
    # sound-wave arcs from left, subtle strokes
    wave = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    wd = ImageDraw.Draw(wave)
    rot = spec.get("arc_rot", 0)
    for i, rad in enumerate(range(220, 1180, 90)):
        alpha = 34 if (i + rot) % 2 == 0 else 52
        a0 = -64 + rot * 22
        wd.arc([-520, H // 2 - rad - 60 * rot, 180 + rad, H // 2 + rad - 60 * rot],
               start=a0, end=a0 + 128, fill=(255, 255, 255, alpha), width=10)
    wave = wave.filter(ImageFilter.GaussianBlur(1.2))
    card.alpha_composite(wave)
    # big figure line, mid card
    f_fig = ImageFont.truetype(FONT, 118)
    fig = spec.get("figure", "")
    if fig:
        fw = d.textlength(fig, font=f_fig)
        d.text((W // 2 - fw // 2 + 3, spec.get("figure_y", 200) + 4), fig, font=f_fig, fill=(0, 0, 0, 90))
        d.text((W // 2 - fw // 2, spec.get("figure_y", 200)), fig, font=f_fig, fill=(126, 231, 205, 255))
    return card


def make(slug: str, spec: dict):
    if spec["mode"] == "photo":
        card = make_photo(spec, slug)
    else:
        card = make_graphic(spec)
    brand_bits(card, spec["kicker"])
    draw_title(ImageDraw.Draw(card), spec["title"], H - 64)
    out = OUT / f"{slug}.webp"
    out.parent.mkdir(parents=True, exist_ok=True)
    card.convert("RGB").save(out, "WEBP", quality=82, method=4)
    print(f"ok {spec['mode']:>7} {slug}")


def main():
    targets = sys.argv[1:] or sorted(PLAN.keys())
    for slug in targets:
        make(slug, PLAN[slug])
    print(f"done: {len(targets)} thumbnails")


if __name__ == "__main__":
    main()
