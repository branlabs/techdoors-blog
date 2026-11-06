import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Arrow from '../../components/Arrow';
import styles from './styles.module.css';

export default function Footer(): ReactNode {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div>
            <Link to="/" className={styles.brand}>
              <img src="/img/mark.svg" alt="" width="22" height="25" />
              TechDoors
            </Link>
            <p>
              Ghi chép về hạ tầng.
              <br />
              Mở thêm một cánh cửa.
            </p>
          </div>
          <nav aria-label="Liên kết cuối trang">
            <Link to="/blog">Bài viết</Link>
            <Link to="/projects">Dự án</Link>
            <Link to="/about">Giới thiệu</Link>
            <Link to="/blog/tags/">Chủ đề</Link>
          </nav>
          <nav aria-label="Theo dõi TechDoors">
            <a href="/blog/rss.xml">
              RSS <Arrow diagonal />
            </a>
            <a href="/blog/atom.xml">
              Atom <Arrow diagonal />
            </a>
            <a
              href="https://github.com/branlabs/techdoors-blog"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <Arrow diagonal />
              <span className="sr-only"> (mở tab mới)</span>
            </a>
          </nav>
        </div>
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} TechDoors</span>
          <span>Được viết bằng sự tò mò. Được xây với Docusaurus.</span>
          <span lang="en">Keep opening doors.</span>
        </div>
      </div>
    </footer>
  );
}
