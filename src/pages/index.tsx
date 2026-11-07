import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';
import Arrow from '../components/Arrow';
import Portal from '../components/Portal';
import RecentArticles from '../components/RecentArticles';
import type {PostSummary} from '../types/content';
import styles from './index.module.css';

export default function Home(): ReactNode {
  const {posts} = usePluginData('techdoors-content') as {posts: PostSummary[]};
  return (
    <Layout
      title="Ghi chép về hạ tầng và kỹ thuật"
      description="Mở cửa vào thế giới hạ tầng cùng TechDoors — blog kỹ thuật cá nhân về DevOps, SRE, Kubernetes, Platform Engineering và những điều học được khi xây dựng hệ thống."
    >
      <main id="main-content" className={styles.home}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroText}>
            <p className="eyebrow">
              <span className={styles.dot} /> BLOG KỸ THUẬT CÁ NHÂN
            </p>
            <h1 id="hero-title">
              Mở cửa vào
              <br />
              thế giới <span>hạ tầng.</span>
            </h1>
            <p className={styles.intro}>
              Những ghi chép về cách hệ thống được xây dựng,
              <br className={styles.desktopBreak} /> vận hành và cải thiện. Mỗi bài viết, thêm một
              góc nhìn.
            </p>
            <div className={styles.actions}>
              <Link className="td-button" to="/blog">
                Khám phá bài viết <Arrow />
              </Link>
              <Link className={styles.aboutLink} to="/about">
                Về TechDoors <Arrow diagonal />
              </Link>
            </div>
            <div className={styles.heroNote}>
              <span aria-hidden="true">~/techdoors</span>
              <span>Học. Thử. Hiểu. Chia sẻ.</span>
            </div>
          </div>
          <div className={styles.visual}>
            <Portal />
          </div>
        </section>
        <div className={styles.subjectLine}>
          <span>HẠ TẦNG TỐT BẮT ĐẦU TỪ SỰ TÒ MÒ.</span>
          <span aria-hidden="true">↓ GHI CHÉP TỪ BÊN TRONG HỆ THỐNG</span>
        </div>
        <RecentArticles posts={posts} />
        <section className={styles.follow} aria-labelledby="follow-title">
          <div>
            <p className="eyebrow">MỘT CÁCH ĐỌC CHẬM HƠN</p>
            <h2 id="follow-title">Bài mới, trong trình đọc của bạn.</h2>
            <p>Theo dõi qua RSS. Đọc khi có thời gian, theo nhịp của bạn.</p>
          </div>
          <a href="/blog/rss.xml" className="td-button td-button-outline">
            Theo dõi RSS <Arrow diagonal />
          </a>
        </section>
      </main>
    </Layout>
  );
}
