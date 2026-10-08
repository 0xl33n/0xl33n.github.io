import layoutStyles from '@/components/article/ArticleLayout.module.css';
import ReaderShell from '@/components/article/ReaderShell';
import JsonLd from '@/components/seo/JsonLd';
import TopicSidebar from '@/components/writeups/TopicSidebar';
import WriteupList from '@/components/writeups/WriteupList';
import { profile } from '@/content/profile';
import { ogImage } from '@/lib/ogImages';
import { absoluteUrl } from '@/lib/site';
import { getAllWriteups } from '@/lib/writeups';
import { groupWriteupsByTopic } from '@/lib/writeupTopics';

const TITLE = 'Writeups';
const DESCRIPTION = `Technical writeups by ${profile.name} on reverse engineering, mobile and application security.`;

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl('/writeups/') },
  openGraph: {
    type: 'website',
    url: absoluteUrl('/writeups/'),
    title: `${TITLE} · ${profile.name}`,
    description: DESCRIPTION,
    images: [ogImage('writeups', `${TITLE} · ${profile.name}`)],
  },
};

/** Just what the list shows, so article bodies aren't sent to the browser. */
function toSummary({ slug, title, description, date, topic, tags, isDraft, readingMinutes }) {
  return { slug, title, description, date, topic, tags, isDraft, readingMinutes };
}

/** /writeups/: every published Markdown file in content/writeups/, grouped by topic, newest first. */
export default function WriteupsPage() {
  const writeups = getAllWriteups();
  const groups = groupWriteupsByTopic(writeups.map(toSummary));

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: TITLE,
          description: DESCRIPTION,
          url: absoluteUrl('/writeups/'),
          hasPart: writeups.map((writeup) => ({
            '@type': 'TechArticle',
            headline: writeup.title,
            url: absoluteUrl(`/writeups/${writeup.slug}/`),
          })),
        }}
      />

      <ReaderShell closeHref="/#writeups" showProgress={false}>
        <main id="main" className={layoutStyles.page}>
          {groups.length > 0 && <TopicSidebar groups={groups} total={writeups.length} />}
          <div className={layoutStyles.article}>
            <header className={layoutStyles.header}>
              <p className={layoutStyles.kicker}>
                {writeups.length} {writeups.length === 1 ? 'writeup' : 'writeups'}
              </p>
              <h1 className={layoutStyles.title}>{TITLE}</h1>
              <p className={layoutStyles.standfirst}>{DESCRIPTION}</p>
            </header>
            <WriteupList groups={groups} />
          </div>
        </main>
      </ReaderShell>
    </>
  );
}
