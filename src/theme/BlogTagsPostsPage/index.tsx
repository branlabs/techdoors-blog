import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/BlogTagsPostsPage';
import PostCard from '../../components/PostCard';
import styles from '../BlogListPage/styles.module.css';

export default function BlogTagsPostsPage({tag, items, listMetadata}: Props): ReactNode {
  const english = useLocation().pathname.startsWith('/en/blog/');
  return (
    <Layout
      title={english ? `${tag.label} — Articles` : `${tag.label} — Bài viết`}
      description={tag.description ?? (english ? `Notes about ${tag.label} on TechDoors.` : `Các ghi chép về ${tag.label} trên TechDoors.`)}
    >
      {english && (
        <Head>
          <html lang="en" />
          <meta property="og:locale" content="en_US" />
        </Head>
      )}
      <SearchMetadata tag="blog_tags_posts" />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className="eyebrow">{english ? 'TECHDOORS / TOPIC' : 'TECHDOORS / CHỦ ĐỀ'}</p>
          <h1>{tag.label}</h1>
          <p>
            {tag.description}
            <br />
            {english ? `${tag.count} ${tag.count === 1 ? 'article' : 'articles'} in this topic.` : `${tag.count} bài viết trong chủ đề này.`}
          </p>
        </header>
        <nav className={styles.topics} aria-label={english ? 'Topic navigation' : 'Điều hướng chủ đề'}>
          <Link to={english ? '/en/blog/tags/' : '/blog/tags/'}>
            {english ? '← All topics' : '← Tất cả chủ đề'}
          </Link>
          <Link to={english ? '/en/blog/' : '/blog/'}>
            {english ? 'All articles' : 'Tất cả bài viết'}
          </Link>
        </nav>
        <section aria-label={english ? `Articles about ${tag.label}` : `Bài viết về ${tag.label}`} className={styles.list}>
          {items.map(({content}) => (
            <PostCard
              key={content.metadata.permalink}
              post={content.metadata}
              headingLevel={2}
            />
          ))}
        </section>
        <BlogListPaginator metadata={listMetadata} />
      </main>
    </Layout>
  );
}
