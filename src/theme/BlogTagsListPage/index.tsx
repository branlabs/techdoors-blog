import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import SearchMetadata from '@theme/SearchMetadata';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/BlogTagsListPage';
import Arrow from '../../components/Arrow';
import styles from './styles.module.css';

export default function BlogTagsListPage({tags}: Props): ReactNode {
  return (
    <Layout
      title="Các chủ đề"
      description="Khám phá các ghi chép TechDoors theo chủ đề, từ ảo hóa và Linux đến kiến trúc hạ tầng."
    >
      <SearchMetadata tag="blog_tags_list" />
      <main className={styles.page}>
        <header className={styles.header}>
          <p className="eyebrow">TECHDOORS / MỤC LỤC CHỦ ĐỀ</p>
          <h1>Đi từ điều bạn tò mò.</h1>
          <p>
            {tags.length} chủ đề, nhiều cánh cửa vào thế giới hạ tầng.
            <br />
            Chọn một hướng để bắt đầu đọc.
          </p>
        </header>
        <ul className={styles.topics}>
          {tags.map((tag, index) => (
            <li key={tag.permalink}>
              <Link to={tag.permalink}>
                <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{tag.label}</h2>
                  <span className={styles.count}>{tag.count} bài viết</span>
                </div>
                <Arrow diagonal />
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/blog" className={styles.back}>
          ← Tất cả bài viết
        </Link>
      </main>
    </Layout>
  );
}
