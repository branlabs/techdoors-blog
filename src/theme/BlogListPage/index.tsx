import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import BlogListPaginator from '@theme/BlogListPaginator';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/BlogListPage';
import PostCard from '../../components/PostCard';
import {topics} from '../../types/content';
import styles from './styles.module.css';

export default function BlogListPage(props: Props): ReactNode {
  const {items, metadata} = props;
  return (
    <Layout title={metadata.blogTitle} description={metadata.blogDescription}>
      <SearchMetadata tag="blog_posts_list" />
      <BlogListPageStructuredData {...props} />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className="eyebrow">TECHDOORS / TẤT CẢ BÀI VIẾT</p>
          <h1>Những điều được ghi lại.</h1>
          <p>
            Từ một câu hỏi nhỏ đến cách hiểu một hệ thống.
            <br />
            Ghi chép về hạ tầng, vận hành và những điều còn muốn tìm hiểu.
          </p>
        </header>
        <nav className={styles.topics} aria-label="Lọc bài viết theo chủ đề">
          <Link to="/blog" className={styles.active} aria-current="page">
            Tất cả
          </Link>
          {topics.map((topic) => (
            <Link to={`/blog/tags/${topic.slug}/`} key={topic.slug}>
              {topic.label}
            </Link>
          ))}
        </nav>
        <section aria-label="Danh sách bài viết" className={styles.list}>
          {items.map(({content}, index) => (
            <PostCard
              key={content.metadata.permalink}
              post={content.metadata}
              headingLevel={2}
              index={(metadata.page - 1) * metadata.postsPerPage + index}
            />
          ))}
        </section>
        <BlogListPaginator metadata={metadata} />
      </main>
    </Layout>
  );
}
