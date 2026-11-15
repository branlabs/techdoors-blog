import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function Footer(): ReactNode {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.identity}>
            <Link to="/" className={styles.brand}>
              <img src="/img/mark.svg" alt="" width="22" height="25" />
              TechDoors
            </Link>
            <p>Ghi chép về hạ tầng.</p>
          </div>
          <nav aria-label="Liên kết cuối trang">
            <Link to="/blog">Bài viết</Link>
            <Link to="/projects">Dự án</Link>
            <Link to="/about">Giới thiệu</Link>
          </nav>
        </div>
        <div className={styles.bottom}>
          <span>
            © {new Date().getFullYear()} TechDoors
            <button
              type="button"
              className={styles.privacySettings}
              onClick={() => window.dispatchEvent(new Event('techdoors:analytics-settings'))}
            >
              Tùy chọn thống kê
            </button>
          </span>
          <span lang="en">Keep opening doors.</span>
        </div>
      </div>
    </footer>
  );
}
