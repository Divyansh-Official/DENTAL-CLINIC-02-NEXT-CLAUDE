import Reveal from '@/components/motion/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import TextLink from '@/components/ui/TextLink';
import PostCard from '@/components/cards/PostCard';

/** Home: the three latest journal articles. */
export default function ArticlesPreview({ posts = [], section = {}, labels = {} }) {
  if (!posts.length) return null;

  return (
    <section className="tone-gray section">
      <div className="shell">
        <SectionHeader align="left" eyebrow={section.eyebrow} title={section.title} accent={section.accent}>
          {section.cta?.href ? <TextLink href={section.cta.href}>{section.cta.label}</TextLink> : null}
        </SectionHeader>
        <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal as="li" key={post.slug} index={index} className={index === 2 ? 'sm:hidden lg:block' : undefined}>
              <PostCard post={post} date={post.displayDate} labels={labels} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
