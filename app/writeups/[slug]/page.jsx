import { notFound } from 'next/navigation';
import ArticleContent from '@/components/article/ArticleContent';
import contentStyles from '@/components/article/ArticleContent.module.css';
import ArticleFooter from '@/components/article/ArticleFooter';
import ArticleHeader from '@/components/article/ArticleHeader';
import layoutStyles from '@/components/article/ArticleLayout.module.css';
import ReaderShell from '@/components/article/ReaderShell';
import TableOfContents from '@/components/article/TableOfContents';
import JsonLd from '@/components/seo/JsonLd';
import { profile } from '@/content/profile';
import { ogImage } from '@/lib/ogImages';
import { absoluteUrl } from '@/lib/site';
import { getAdjacentWriteups, getAllWriteups, getWriteup } from '@/lib/writeups';

/** Only show a table of contents when there's enough structure to navigate. */
const MIN_HEADINGS_FOR_TOC = 4;

// One page per Markdown file in content/writeups/, generated at build time.
export const dynamicParams = false;

/** Placeholder path used only when there are no writeups: it renders the 404 page. */
const NO_WRITEUPS_PLACEHOLDER = '_none';

export function generateStaticParams() {
  const slugs = getAllWriteups().map(({ slug }) => ({ slug }));
  // A static export must generate at least one page per dynamic route, so an
  // empty writeups folder (or all drafts) would otherwise fail the build.
  return slugs.length > 0 ? slugs : [{ slug: NO_WRITEUPS_PLACEHOLDER }];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const writeup = getWriteup(slug);
  if (!writeup) return {};

  const url = absoluteUrl(`/writeups/${slug}/`);
  return {
    title: writeup.title,
    description: writeup.description,
    keywords: writeup.tags,
    alternates: { canonical: url },
    robots: writeup.isDraft ? { index: false } : undefined,
    openGraph: {
      type: 'article',
      url,
      title: writeup.title,
      description: writeup.description,
      authors: [profile.name],
      ...(writeup.date && { publishedTime: writeup.date }),
      tags: writeup.tags,
      images: [ogImage(slug, writeup.title)],
    },
  };
}

export default async function WriteupPage({ params }) {
  const { slug } = await params;
  const writeup = getWriteup(slug);
  if (!writeup) notFound();

  const { newer, older } = getAdjacentWriteups(slug);
  const showTableOfContents = writeup.headings.length >= MIN_HEADINGS_FOR_TOC;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: writeup.title,
          description: writeup.description,
          url: absoluteUrl(`/writeups/${slug}/`),
          image: ogImage(slug, writeup.title).url,
          ...(writeup.date && { datePublished: writeup.date }),
          ...(writeup.topic && { articleSection: writeup.topic }),
          keywords: writeup.tags.join(', '),
          author: { '@type': 'Person', name: profile.name, url: absoluteUrl('/') },
        }}
      />

      <ReaderShell fileName={`${slug}.md`} closeHref="/writeups/">
        <main id="main" className={layoutStyles.page}>
          {showTableOfContents && <TableOfContents headings={writeup.headings} variant="sidebar" />}

          <article className={layoutStyles.article}>
            <ArticleHeader writeup={writeup} />
            {showTableOfContents && <TableOfContents headings={writeup.headings} variant="inline" />}
            <div className={contentStyles.prose}>
              <ArticleContent tree={writeup.tree} />
            </div>
            <ArticleFooter newer={newer} older={older} />
          </article>
        </main>
      </ReaderShell>
    </>
  );
}
