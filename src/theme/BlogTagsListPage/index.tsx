import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import {useLocation} from '@docusaurus/router';
import SearchMetadata from '@theme/SearchMetadata';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/BlogTagsListPage';
import Arrow from '../../components/Arrow';
import styles from './styles.module.css';

export default function BlogTagsListPage({tags}: Props): ReactNode {
  const english = useLocation().pathname.startsWith('/en/blog/');
  return (
    <Layout
      title={english ? 'Topics' : 'Các chủ đề'}
      description={english
        ? 'Explore TechDoors articles about Linux, virtualization, and infrastructure.'
        : 'Khám phá các ghi chép TechDoors theo chủ đề, từ ảo hóa và Linux đến kiến trúc hạ tầng.'}
    >
      {english && (
        <Head>
          <html lang="en" />
          <meta property="og:locale" content="en_US" />
        </Head>
      )}
      <SearchMetadata tag="blog_tags_list" />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className="eyebrow">{english ? 'TECHDOORS / TOPICS' : 'TECHDOORS / MỤC LỤC CHỦ ĐỀ'}</p>
          <h1>{english ? 'Follow your curiosity.' : 'Đi từ điều bạn tò mò.'}</h1>
          <p>
            {english
              ? `${tags.length} topics to explore. Choose where to start reading.`
              : `${tags.length} chủ đề, nhiều cánh cửa vào thế giới hạ tầng. Chọn một hướng để bắt đầu đọc.`}
          </p>
        </header>
        <ul className={styles.topics}>
          {tags.map((tag, index) => (
            <li key={tag.permalink}>
              <Link to={tag.permalink}>
                <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{tag.label}</h2>
                  <span className={styles.count}>{english ? `${tag.count} ${tag.count === 1 ? 'article' : 'articles'}` : `${tag.count} bài viết`}</span>
                </div>
                <Arrow diagonal />
              </Link>
            </li>
          ))}
        </ul>
        <Link to={english ? '/en/blog/' : '/blog/'} className={styles.back}>
          {english ? '← All articles' : '← Tất cả bài viết'}
        </Link>
      </main>
    </Layout>
  );
}
