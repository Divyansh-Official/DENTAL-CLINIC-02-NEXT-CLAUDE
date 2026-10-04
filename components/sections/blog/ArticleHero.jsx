import Link from 'next/link';
import Enter from '@/components/motion/Enter';
import Icon from '@/components/ui/Icon';
import DetailHero from '@/components/sections/shared/DetailHero';
import { Breadcrumbs } from '@/components/sections/shared/PageHero';

/**
 * Article opening — the page a journal card zooms open into: the article's
 * photograph fills the screen, with the category, title, standfirst and
 * byline at its foot. The byline links to the author's profile when they are
 * on the team.
 */
export default function ArticleHero({ post, author, date, dateTime, crumbs, labels = {}, back, glass = true }) {
  const chip = 'chip glass-dark min-h-9 px-4 text-[14px] text-white';

  return (
    <DetailHero image={post.image} back={back} glass={glass}>
      <Enter delay={0}>
        <Breadcrumbs crumbs={crumbs} homeLabel={labels.home} label={labels.breadcrumb} align="left" />
      </Enter>
      {post.category ? (
        <Enter as="p" delay={60} className="t-eyebrow mt-7">
          {post.category}
        </Enter>
      ) : null}
      <Enter as="h1" delay={110} className="t-hero mt-3 max-w-[18ch] text-[clamp(2.3rem,1.45rem+3.6vw,4.6rem)]">
        {post.title}
      </Enter>
      {post.excerpt ? (
        <Enter as="p" delay={170} className="t-lead mt-5 max-w-2xl">
          {post.excerpt}
        </Enter>
      ) : null}
      <Enter delay={230} className="mt-7 flex flex-wrap items-center gap-2.5">
        {post.author ? (
          author ? (
            <Link href={author.href} className={`${chip} hover:bg-white/20`}>
              <Icon name="user" size={15} />
              {post.author}
            </Link>
          ) : (
            <span className={chip}>
              <Icon name="user" size={15} />
              {post.author}
            </span>
          )
        ) : null}
        {date ? (
          <time dateTime={dateTime} className={chip}>
            <Icon name="calendar" size={15} />
            {date}
          </time>
        ) : null}
        {post.readTime ? (
          <span className={chip}>
            <Icon name="clock" size={15} />
            {post.readTime}
          </span>
        ) : null}
      </Enter>
    </DetailHero>
  );
}
