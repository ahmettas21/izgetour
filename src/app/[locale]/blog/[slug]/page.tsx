import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { BLOG_POSTS, getBlogPost, getRelatedPosts } from '@/data/blog-posts';
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const post of BLOG_POSTS) {
    params.push({ locale: 'tr', slug: post.slug });
    params.push({ locale: 'en', slug: post.slug });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Blog Yazısı Bulunamadı' };

  const isTR = locale === 'tr';
  return {
    title: isTR ? post.title : post.titleEn,
    description: isTR ? post.summary : post.summaryEn,
    openGraph: {
      title: isTR ? post.title : post.titleEn,
      description: isTR ? post.summary : post.summaryEn,
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations('blog');
  const isTR = locale === 'tr';

  const post = getBlogPost(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(post);

  // Helper to render markdown-like content with headings
  function renderContent(content: string) {
    const lines = content.split('\n');
    let inList = false;
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];

    const flushList = (key: string) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={key} className="mb-5 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-600 dark:text-gray-300 marker:text-[var(--brand)]">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Heading ##
      if (trimmed.startsWith('## ')) {
        flushList(`list-${idx}`);
        elements.push(
          <h2
            key={idx}
            className="mb-3 mt-8 text-xl font-bold text-gray-900 dark:text-white"
          >
            {trimmed.replace('## ', '')}
          </h2>
        );
        return;
      }

      // Heading ###
      if (trimmed.startsWith('### ')) {
        flushList(`list-${idx}`);
        elements.push(
          <h3
            key={idx}
            className="mb-2 mt-6 text-lg font-semibold text-gray-900 dark:text-white"
          >
            {trimmed.replace('### ', '')}
          </h3>
        );
        return;
      }

      // List item
      if (trimmed.startsWith('- **') || trimmed.startsWith('- ')) {
        inList = true;
        const text = trimmed.replace(/^- \*\*(.*?)\*\*(.*)$/, '$1$2').replace(/^- /, '');
        listItems.push(
          <li key={idx} className="text-sm text-gray-600 dark:text-gray-300">
            {trimmed.startsWith('- **') ? (
              <>
                <strong className="font-semibold text-gray-900 dark:text-white">
                  {trimmed.match(/- \*\*(.*?)\*\*/)?.[1]}
                </strong>
                {trimmed.replace(/- \*\*(.*?)\*\*/, '')}
              </>
            ) : (
              text
            )}
          </li>
        );
        return;
      }

      // Empty line
      if (trimmed === '') {
        flushList(`list-${idx}`);
        return;
      }

      // Paragraph
      flushList(`list-${idx}`);
      elements.push(
        <p key={idx} className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {trimmed}
        </p>
      );
    });

    flushList('list-final');
    return elements;
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Cover Image */}
      <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden">
        <Image
          src={post.coverImage}
          alt={isTR ? post.title : post.titleEn}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Back button */}
        <Link
          href={`/${locale}/blog`}
          className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:left-6 sm:top-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {isTR ? 'Blog\'a Dön' : 'Back to Blog'}
        </Link>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
          <div className="mx-auto max-w-4xl">
            <span className="mb-3 inline-block rounded-full bg-[var(--brand)]/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {isTR ? post.category : post.categoryEn}
            </span>
            <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              {isTR ? post.title : post.titleEn}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/80">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.date).toLocaleDateString(isTR ? 'tr-TR' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime} {isTR ? 'dk okuma' : 'min read'}
              </span>
              <span>{post.author}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* Main content */}
          <article className="prose-custom max-w-none">
            {renderContent(isTR ? post.content : post.contentEn)}
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Share button */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                {isTR ? 'Bu Yazıyı Paylaş' : 'Share This Post'}
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      const url = window.location.href;
                      const text = isTR ? post.title : post.titleEn;
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
                        '_blank'
                      );
                    }
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-colors hover:bg-[var(--brand)] hover:text-white dark:bg-gray-700 dark:text-gray-400"
                  aria-label="Share on Twitter"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition-colors hover:bg-[var(--brand)] hover:text-white dark:bg-gray-700 dark:text-gray-400"
                  aria-label="Copy link"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
              <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                <Tag className="h-3.5 w-3.5" />
                {isTR ? 'Etiketler' : 'Tags'}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(isTR ? post.tags : post.tagsEn).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  {isTR ? 'Benzer Yazılar' : 'Related Posts'}
                </h4>
                <div className="space-y-4">
                  {relatedPosts.map((rp) => (
                    <Link
                      key={rp.id}
                      href={`/${locale}/blog/${rp.slug}`}
                      className="group flex gap-3"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={rp.coverImage}
                          alt={isTR ? rp.title : rp.titleEn}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold leading-snug text-gray-900 transition-colors group-hover:text-[var(--brand)] dark:text-white line-clamp-2">
                          {isTR ? rp.title : rp.titleEn}
                        </p>
                        <span className="text-[10px] text-gray-400">
                          {rp.readTime} {isTR ? 'dk okuma' : 'min read'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="border-t border-gray-100 bg-gray-50 py-12 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {isTR ? 'Daha Fazla İçerik Keşfet' : 'Discover More Content'}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {isTR
              ? 'Seyahat ipuçları, rehberler ve daha fazlası için blogumuzu takip edin.'
              : 'Follow our blog for travel tips, guides, and more.'}
          </p>
          <Link
            href={`/${locale}/blog`}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--brand-dark)]"
          >
            <ArrowLeft className="h-4 w-4" />
            {isTR ? 'Tüm Yazılar' : 'All Posts'}
          </Link>
        </div>
      </section>
    </main>
  );
}
