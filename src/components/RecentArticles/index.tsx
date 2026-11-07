import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import type {PostSummary} from '../../types/content';
import styles from './styles.module.css';

const dateFormat = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Asia/Ho_Chi_Minh',
});

export default function RecentArticles({posts}: {posts: PostSummary[]}): ReactNode {
  return (
    <section aria-labelledby="recent-title" className={styles.section}>
      <div className={styles.heading}>
        <h2 id="recent-title">Bài viết mới</h2>
        <Link to="/blog" className={styles.allPosts}>
          Xem tất cả
        </Link>
      </div>
      {posts.slice(0, 5).map((post) => (
        <article key={post.permalink} className={styles.post}>
          <p className={styles.meta}>
            <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
            <span aria-hidden="true">·</span>
            <span>{Math.max(1, Math.ceil(post.readingTime ?? 1))} phút đọc</span>
          </p>
          <h3>
            <Link to={post.permalink}>{post.title}</Link>
          </h3>
          <p className={styles.description}>{post.description}</p>
        </article>
      ))}
    </section>
  );
}
