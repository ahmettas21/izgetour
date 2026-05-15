import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/data/blog-posts';
import { Calendar, Clock, Tag } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata = (): Metadata => ({
  title: 'Blog',
  description: 'İzgeTour seyahat blogu — seyahat ipuçları, turistik yerler, vize rehberi ve daha fazlası.',
});

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ kat?: string }>;
}) {
  const { locale } = await params;
  const { kat } = await searchParams;
  const t = await getTranslations('blog');

  const isTR = locale === 'tr';

  // Filter by category if provided
  const filteredPosts = kat
    ? BLOG_POSTS.filter((p) => p.category === kat || p.categoryEn === kat)
    : BLOG_POSTS;

  // For grid layout: first post large (featured), remaining in grid
  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--brand)]/10 via-white to-white dark:from-[var(--brand)]/5 dark:via-gray-950 dark:to-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block rounded-full bg-[var(--brand-light)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--brand)]">
              {isTR ? 'İzgeTour Blog' : 'İzgeTour Blog'}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              {isTR ? 'Seyahat İpuçları ve Rehberler' : 'Travel Tips & Guides'}
            </h1>
            <p className="mt-4 text-base text-gray-500 dark:text-gray-400 sm:text-lg">
              {isTR
                ? 'Türkiye\'nin en güzel rotaları, vize rehberleri ve seyahat ipuçları'
                : "Turkey's most beautiful routes, visa guides, and travel tips"}
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-800">
          <Link
            href={`/${locale}/blog`}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              !kat
                ? 'bg-[var(--brand)] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            {isTR ? 'Tümü' : 'All'}
          </Link>
          {BLOG_CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={`/${locale}/blog?kat=${encodeURIComponent(isTR ? cat.key : cat.keyEn)}`}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                kat === cat.key || kat === cat.keyEn
                  ? 'bg-[var(--brand)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {isTR ? cat.key : cat.keyEn}
            </Link>
          ))}
        </div>
      </section>

      {/* Blog Posts */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        {filteredPosts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {isTR ? 'Bu kategoride henüz yazı bulunamadı.' : 'No posts found in this category yet.'}
            </p>
            <Link
              href={`/${locale}/blog`}
              className="mt-3 inline-block text-sm font-semibold text-[var(--brand)] hover:underline"
            >
              {isTR ? 'Tüm yazılara dön' : 'Back to all posts'}
            </Link>
          </div>
        )}

        {/* Featured post (large) */}
        {featuredPost && (
          <Link
            href={`/${locale}/blog/${featuredPost.slug}`}
            className="group mb-10 block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[16/10] md:aspect-auto md:h-full min-h-[250px]">
                <Image
                  src={featuredPost.coverImage}
                  alt={isTR ? featuredPost.title : featuredPost.titleEn}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:from-transparent md:to-transparent" />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <span className="mb-3 inline-block w-fit rounded-full bg-[var(--brand-light)] px-2.5 py-0.5 text-xs font-semibold text-[var(--brand)]">
                  {isTR ? featuredPost.category : featuredPost.categoryEn}
                </span>
                <h2 className="mb-3 text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-[var(--brand)] dark:text-white sm:text-2xl">
                  {isTR ? featuredPost.title : featuredPost.titleEn}
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-3">
                  {isTR ? featuredPost.summary : featuredPost.summaryEn}
                </p>
                <div className="mt-auto flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(featuredPost.date).toLocaleDateString(isTR ? 'tr-TR' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {featuredPost.readTime} {isTR ? 'dk okuma' : 'min read'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Remaining posts grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {remainingPosts.map((post, idx) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.slug}`}
              className={`group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 ${
                idx === 0 ? 'lg:col-span-2 lg:grid lg:grid-cols-2' : ''
              }`}
            >
              <div className={`relative ${idx === 0 ? 'aspect-[16/10] lg:aspect-auto lg:h-full min-h-[200px]' : 'aspect-[16/10]'}`}>
                <Image
                  src={post.coverImage}
                  alt={isTR ? post.title : post.titleEn}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className={`p-5 ${idx === 0 ? 'lg:flex lg:flex-col lg:justify-center' : ''}`}>
                <span className="mb-2 inline-block rounded-full bg-[var(--brand-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand)]">
                  {isTR ? post.category : post.categoryEn}
                </span>
                <h3 className="mb-2 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-[var(--brand)] dark:text-white line-clamp-2">
                  {isTR ? post.title : post.titleEn}
                </h3>
                <p className="mb-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
                  {isTR ? post.summary : post.summaryEn}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString(isTR ? 'tr-TR' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime} {isTR ? 'dk' : 'min'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
