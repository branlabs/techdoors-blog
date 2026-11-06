import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Arrow from '../../components/Arrow';
import styles from '../../pages/info.module.css';

export default function NotFound(): ReactNode {
  return (
    <Layout
      title="Không tìm thấy trang"
      description="Trang bạn tìm có thể đã đổi địa chỉ. Quay về TechDoors để tiếp tục khám phá."
    >
      <Head>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://techdoors.io/404.html" />
      </Head>
      <main className={styles.notfound}>
        <p className="eyebrow">404 / CÁNH CỬA NÀY CHƯA MỞ</p>
        <h1>Có vẻ bạn đã đi lạc.</h1>
        <p>
          Đường dẫn có thể đã thay đổi hoặc trang chưa tồn tại.
          <br />
          Hãy bắt đầu lại từ một cánh cửa quen thuộc.
        </p>
        <div>
          <Link to="/" className="td-button">
            Về trang chủ <Arrow />
          </Link>
          <Link to="/blog" className="td-button td-button-outline">
            Đọc bài viết
          </Link>
        </div>
      </main>
    </Layout>
  );
}
