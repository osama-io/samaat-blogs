/**
 * Renders one or more JSON-LD blocks into the static HTML.
 * Server component: the script tag ships with the page, no JS execution needed.
 */
export default function JsonLd({ data, id }: { data: object | object[]; id: string }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}