/**
 * Structured data emitter, server-rendered into the initial HTML where
 * crawlers read it. Nulls are dropped, so a page can pass a schema that may
 * not exist — an FAQ block with no questions — without guarding.
 */
export default function JsonLd({ schema }) {
  const graph = (Array.isArray(schema) ? schema : [schema]).filter(Boolean);
  if (!graph.length) return null;

  return (
    <script
      type="application/ld+json"
      /* A closing-tag sequence inside JSON would end the script element early. */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph.length === 1 ? graph[0] : graph).replace(/</g, '\\u003c') }}
    />
  );
}
