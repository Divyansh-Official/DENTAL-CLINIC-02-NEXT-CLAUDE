import Hero from '@/components/sections/Hero';
import StatsBar from '@/components/sections/StatsBar';
import ServicesGrid from '@/components/sections/ServicesGrid';
import AboutSection from '@/components/sections/AboutSection';
import ProcessSection from '@/components/sections/ProcessSection';
import Testimonials from '@/components/sections/Testimonials';
import SmileBanner from '@/components/sections/SmileBanner';
import BlogPreview from '@/components/sections/BlogPreview';
import ReadyBanner from '@/components/sections/ReadyBanner';
import { isEnabled } from '@/lib/data';

/* Home already carries the Dentist and WebSite schema from the root layout. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <ServicesGrid />
      <AboutSection />
      <ProcessSection />
      {isEnabled('testimonials') ? <Testimonials /> : null}
      <SmileBanner />
      {isEnabled('blog') ? <BlogPreview /> : null}
      <ReadyBanner />
    </>
  );
}
