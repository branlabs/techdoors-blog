import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import type {PostSummary} from '../../types/content';
import Arrow from '../Arrow';
import styles from './styles.module.css';

const dateFormat = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Asia/Ho_Chi_Minh',
});

export default function PostCard({
  post,
  headingLevel = 3,
}: {
  post: PostSummary;
  headingLevel?: 2 | 3;
}): ReactNode {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const date = dateFormat.format(new Date(post.date)).replaceAll('/', '.');
  // A series label belongs beside the date; topic tags stay in the article.
  const series = post.tags.find(({label}) => label === 'Under the Hood');
  return (
    <article className={styles.card}>
      <div className={styles.body}>
        <div className={styles.meta}>
          {series && (
            <>
              <span className={styles.series}>{series.label}</span>
              <span aria-hidden="true">·</span>
            </>
          )}
          <time dateTime={post.date}>{date}</time>
          <span aria-hidden="true">·</span>
          <span>{Math.max(1, Math.ceil(post.readingTime ?? 1))} phút đọc</span>
        </div>
        <Heading>
          <Link to={post.permalink}>
            {post.title}
            <Arrow diagonal />
          </Link>
        </Heading>
        <p>{post.description}</p>
      </div>
    </article>
  );
}
