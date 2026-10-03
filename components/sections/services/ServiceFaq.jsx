import Accordion from '@/components/ui/Accordion';
import Reveal from '@/components/ui/Reveal';

/** Service detail: the questions patients ask about this treatment. */
export default function ServiceFaq({ items = [], title, group }) {
  if (!Array.isArray(items) || !items.length) return null;

  return (
    <div className="mt-14">
      <Reveal as="h2" className="t-title">
        {title}
      </Reveal>
      <Reveal className="mt-4">
        <Accordion items={items} group={group} />
      </Reveal>
    </div>
  );
}
