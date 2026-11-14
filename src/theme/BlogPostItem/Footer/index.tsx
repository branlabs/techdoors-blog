import type {ReactNode} from 'react';
import Footer from '@theme-original/BlogPostItem/Footer';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import {usePluginData} from '@docusaurus/useGlobalData';
import Link from '@docusaurus/Link';
import Arrow from '../../../components/Arrow';
import type {PostSummary} from '../../../types/content';
import styles from './styles.module.css';

export default function BlogPostItemFooter(): ReactNode {
  const {metadata, isBlogPostPage} = useBlogPost();
  const {posts} = usePluginData('techdoors-content') as {posts: PostSummary[]};
  const related = posts
    .filter(
      (post) =>
        post.permalink !== metadata.permalink &&
        post.tags.some((tag) =>
          metadata.tags.some((current) => current.permalink === tag.permalink),
        ),
    )
    .slice(0, 2);
  return (
    <>
      <Footer />
      {isBlogPostPage && !metadata.permalink.startsWith('/en/blog/') && (
        <section className={styles.related} aria-labelledby="related-heading">
          <p className="eyebrow">MỞ THÊM MỘT CÁNH CỬA</p>
          <h2 id="related-heading">
            {related.length ? 'Ghi chép liên quan' : 'Tiếp tục khám phá'}
          </h2>
          {related.length ? (
            <div className={styles.links}>
              {related.map((post) => (
                <Link key={post.permalink} to={post.permalink}>
                  {post.title}
                  <Arrow diagonal />
                </Link>
              ))}
            </div>
          ) : (
            <>
              <p>
                Trong lúc chờ ghi chép tiếp theo, bạn có thể tìm hiểu thêm về blog hoặc chọn một chủ
                đề để đọc.
              </p>
              <div className={styles.links}>
                <Link to="/about">
                  Về TechDoors <Arrow diagonal />
                </Link>
                <Link to="/blog/tags/">
                  Khám phá các chủ đề <Arrow diagonal />
                </Link>
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}
