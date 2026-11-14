import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import OriginalHeader from '@theme-original/BlogPostItem/Header';
import HeaderTitle from '@theme/BlogPostItem/Header/Title';
import ArticleLanguageSwitcher, {invisibleComputer} from '../../../components/ArticleLanguageSwitcher';
import ArticleLanguageMetadata from '../../../components/ArticleLanguageSwitcher/Metadata';
import styles from './styles.module.css';

const dateFormat = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'Asia/Ho_Chi_Minh',
});
const englishDateFormat = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Ho_Chi_Minh',
});

function formatVietnameseDate(date: string): string {
  const parts = dateFormat.formatToParts(new Date(date));
  const day = parts.find((part) => part.type === 'day')?.value ?? '';
  const month = parts.find((part) => part.type === 'month')?.value ?? '';
  const year = parts.find((part) => part.type === 'year')?.value ?? '';
  return `${day}.${month}.${year}`;
}

// The English article uses the same reading layout as its Vietnamese original.
export default function BlogPostItemHeader(): ReactNode {
  const {metadata, isBlogPostPage} = useBlogPost();
  if (!isBlogPostPage) return <OriginalHeader />;

  const {date, readingTime, permalink} = metadata;
  // Docusaurus blog metadata uses full absolute permalinks in production.
  const articlePath = new URL(permalink, 'https://techdoors.io').pathname;
  const english = articlePath.startsWith('/en/blog/');
  const language = english ? 'en' : 'vi';
  const paired = articlePath === invisibleComputer.vi || articlePath === invisibleComputer.en;
  const authorName = metadata.authors?.[0]?.name ?? 'Brandon';

  return (
    <header>
      {paired && <ArticleLanguageMetadata language={language} />}
      <HeaderTitle />
      <div className={styles.metadataRow}>
        <div className={styles.byline} data-testid="article-byline">
          <Link to="/about/" className={styles.author} rel="author">
            {authorName}
          </Link>
          <span className={styles.separator} aria-hidden="true">·</span>
          <time dateTime={date} itemProp="datePublished">
            {english ? englishDateFormat.format(new Date(date)) : formatVietnameseDate(date)}
          </time>
          {typeof readingTime === 'number' && (
            <>
              <span className={styles.separator} aria-hidden="true">·</span>
              <span data-testid="article-reading-time">
                {Math.max(1, Math.ceil(readingTime))} {english ? 'min read' : 'phút đọc'}
              </span>
            </>
          )}
        </div>
        {paired && <ArticleLanguageSwitcher language={language} />}
      </div>
    </header>
  );
}
