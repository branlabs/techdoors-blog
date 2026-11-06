import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import type {PostSummary} from '../../types/content';
import Arrow from '../Arrow';
import styles from './styles.module.css';

export default function PostCard({
  post,
  index = 0,
  headingLevel = 3,
}: {
  post: PostSummary;
  index?: number;
  headingLevel?: 2 | 3;
}): ReactNode {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const date = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date(post.date));
  return (
    <article className={styles.card}>
      <div className={styles.index} aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <time dateTime={post.date}>{date}</time>
          <span aria-hidden="true">/</span>
          <span>{Math.max(1, Math.ceil(post.readingTime ?? 1))} phút đọc</span>
        </div>
        <Heading>
          <Link to={post.permalink}>
            {post.title}
            <Arrow diagonal />
          </Link>
        </Heading>
        <p>{post.description}</p>
        <div className={styles.tags}>
          {post.tags.slice(0, 3).map((tag) => (
            <Link key={tag.permalink} to={tag.permalink}>
              {tag.label}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
