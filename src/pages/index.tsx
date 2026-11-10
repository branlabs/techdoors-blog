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
            <h1 id="hero-title">
              Mở cửa vào
              <br />
              thế giới <span>hạ tầng.</span>
            </h1>
            <p className={styles.intro}>
              Ghi chép về những hệ thống mình xây dựng, vận hành và học hỏi.
            </p>
            <Link className="td-button" to="/blog">
              Khám phá bài viết <Arrow />
            </Link>
          </div>
          <div className={styles.visual}>
            <Portal showCaption={false} />
          </div>
        </section>
        <RecentArticles posts={posts} />
      </main>
    </Layout>
  );
}
