import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/BlogTagsPostsPage';
import PostCard from '../../components/PostCard';
import styles from '../BlogListPage/styles.module.css';

export default function BlogTagsPostsPage({tag, items, listMetadata}: Props): ReactNode {
  return (
    <Layout
      title={`${tag.label} — Bài viết`}
      description={tag.description ?? `Các ghi chép về ${tag.label} trên TechDoors.`}
    >
      <SearchMetadata tag="blog_tags_posts" />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className="eyebrow">TECHDOORS / CHỦ ĐỀ</p>
          <h1>{tag.label}</h1>
          <p>
            {tag.description}
            <br />
            {tag.count} bài viết trong chủ đề này.
          </p>
        </header>
        <nav className={styles.topics} aria-label="Điều hướng chủ đề">
          <Link to="/blog/tags/">← Tất cả chủ đề</Link>
          <Link to="/blog">Tất cả bài viết</Link>
        </nav>
        <section aria-label={`Bài viết về ${tag.label}`} className={styles.list}>
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
