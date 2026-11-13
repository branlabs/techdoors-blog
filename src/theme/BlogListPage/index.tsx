import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';
import BlogListPaginator from '@theme/BlogListPaginator';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import SearchMetadata from '@theme/SearchMetadata';
import type {Props} from '@theme/BlogListPage';
import PostCard from '../../components/PostCard';
import {topics, type PostSummary} from '../../types/content';
import styles from './styles.module.css';

// Only show filters when they distinguish a meaningful set of published posts.
// Use all public posts rather than the current pagination page.
function usefulTopics(posts: PostSummary[]) {
  if (posts.length < 4) return [];
  return topics.filter(({slug}) => {
    const route = `/tags/${slug}/`;
    const hasTag = (post: PostSummary) => post.tags.some((tag) => tag.permalink.endsWith(route));
    return posts.some(hasTag) && posts.some((post) => !hasTag(post));
  });
}

export default function BlogListPage(props: Props): ReactNode {
  const {items, metadata} = props;
  const {posts} = usePluginData('techdoors-content') as {posts: PostSummary[]};
  const filterTopics = usefulTopics(posts);
  const showFilters = filterTopics.length >= 2;
  return (
    <Layout title={metadata.blogTitle} description={metadata.blogDescription}>
      <SearchMetadata tag="blog_posts_list" />
      <BlogListPageStructuredData {...props} />
      <main className={styles.page}>
        <header className={`${styles.header} ${styles.indexHeader}`}>
          <p className="eyebrow">TECHDOORS / BÀI VIẾT</p>
          <h1>Những điều được ghi lại.</h1>
          <p>Ghi chép về hạ tầng, thử nghiệm và những điều mình muốn hiểu rõ hơn.</p>
        </header>
        {showFilters && (
          <nav className={styles.topics} aria-label="Lọc bài viết theo chủ đề">
            <Link to="/blog" className={styles.active} aria-current="page">
              Tất cả
            </Link>
            {filterTopics.map((topic) => (
              <Link to={`/blog/tags/${topic.slug}/`} key={topic.slug}>
                {topic.label}
              </Link>
            ))}
          </nav>
        )}
        <section aria-label="Danh sách bài viết" className={styles.list}>
          {items.map(({content}) => (
            <PostCard key={content.metadata.permalink} post={content.metadata} headingLevel={2} />
          ))}
        </section>
        <BlogListPaginator metadata={metadata} />
      </main>
    </Layout>
  );
}
