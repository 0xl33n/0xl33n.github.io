import CrtOverlay from '@/components/layout/CrtOverlay';
import TerminalWindow from '@/components/layout/TerminalWindow';
import AwardsSection from '@/components/sections/AwardsSection';
import ContactSection from '@/components/sections/ContactSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import HeroSection from '@/components/sections/HeroSection';
import NeofetchSection from '@/components/sections/NeofetchSection';
import SiteFooter from '@/components/sections/SiteFooter';
import StackSection from '@/components/sections/StackSection';
import WorkSection from '@/components/sections/WorkSection';
import WritingSection from '@/components/sections/WritingSection';
import JsonLd from '@/components/seo/JsonLd';
import Divider from '@/components/ui/Divider';
import { education, experience, profile, skillGroups } from '@/content/profile';
import { absoluteUrl } from '@/lib/site';
import { jetbrainsMono } from './fonts';
import styles from './page.module.css';

/**
 * Homepage. A Server Component: sections are static markup rendered at build
 * time; only the terminal window chrome is a Client Component.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: profile.name,
          jobTitle: profile.role,
          description: profile.description,
          url: absoluteUrl('/'),
          sameAs: Object.values(profile.links).filter(Boolean),
          worksFor: experience[0] && { '@type': 'Organization', name: experience[0].organization },
          alumniOf: education.map((entry) => ({ '@type': 'CollegeOrUniversity', name: entry.school })),
          knowsAbout: skillGroups.find((group) => group.label === 'security')?.items,
        }}
      />

      <div className={jetbrainsMono.className}>
        <CrtOverlay />

        <TerminalWindow>
          <main id="main" className={styles.content}>
            <HeroSection />
            <Divider />
            <NeofetchSection />
            <Divider />
            <ExperienceSection />
            <Divider />
            <AwardsSection />
            <Divider />
            <WorkSection />
            <Divider />
            <WritingSection />
            <Divider />
            <StackSection />
            <Divider />
            <ContactSection />
            <SiteFooter />
          </main>
        </TerminalWindow>
      </div>
    </>
  );
}
