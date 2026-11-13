import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import OriginalHeader from '@theme-original/BlogPostItem/Header';
import HeaderTitle from '@theme/BlogPostItem/Header/Title';
import styles from './styles.module.css';

const dateFormat = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Asia/Ho_Chi_Minh',
});

function formatDate(date: string): string {
  const parts = dateFormat.formatToParts(new Date(date));
  const day = parts.find((part) => part.type === 'day')?.value ?? '';
  const month = parts.find((part) => part.type === 'month')?.value ?? '';
  const year = parts.find((part) => part.type === 'year')?.value ?? '';
  return `${day}.${month}.${year}`;
}

// Only simplify the full-article header. Keep the upstream preview layout intact.
export default function BlogPostItemHeader(): ReactNode {
  const {metadata, isBlogPostPage} = useBlogPost();
  if (!isBlogPostPage) return <OriginalHeader />;

  const {date, readingTime} = metadata;
  const authorName = metadata.authors?.[0]?.name ?? 'Brandon';

  return (
    <header>
      <HeaderTitle />
      <div className={styles.byline} data-testid="article-byline">
        <Link to="/about/" className={styles.author} rel="author">
          {authorName}
        </Link>
        <span className={styles.separator} aria-hidden="true">·</span>
        <time dateTime={date} itemProp="datePublished">{formatDate(date)}</time>
        {typeof readingTime === 'number' && (
          <>
            <span className={styles.separator} aria-hidden="true">·</span>
            <span data-testid="article-reading-time">
              {Math.max(1, Math.ceil(readingTime))} phút đọc
            </span>
          </>
        )}
      </div>
    </header>
  );
}
