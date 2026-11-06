import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';
import Arrow from '../components/Arrow';
import Portal from '../components/Portal';
import PostCard from '../components/PostCard';
import {topics, type PostSummary} from '../types/content';
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
        <div className={styles.editorial}>
          <section aria-labelledby="recent-title" className={styles.recent}>
            <div className={styles.sectionHeading}>
              <h2 id="recent-title">
                Ghi chép mới nhất
                <span className={styles.count}>{String(posts.length).padStart(2, '0')}</span>
              </h2>
              <Link to="/blog" className={styles.allPosts}>
                Tất cả bài viết <Arrow />
              </Link>
            </div>
            {posts.slice(0, 3).map((post, index) => (
              <PostCard key={post.permalink} post={post} index={index} />
            ))}
            <div className={styles.smallNote}>
              <span aria-hidden="true">↳</span> Blog vừa mở cửa. Những ghi chép tiếp theo sẽ xuất
              hiện tại đây.
            </div>
          </section>
          <aside className={styles.topics} aria-labelledby="topics-title">
            <p className="eyebrow">CÁC CHỦ ĐỀ</p>
            <h2 id="topics-title">Đi từ điều bạn tò mò.</h2>
            <div className={styles.topicLinks}>
              {topics.map((topic) => (
                <Link to={`/blog/tags/${topic.slug}/`} key={topic.slug}>
                  {topic.label}
                  <Arrow diagonal />
                </Link>
              ))}
            </div>
            <Link to="/blog/tags/" className={styles.tagIndex}>
              Xem mục lục chủ đề <Arrow />
            </Link>
          </aside>
        </div>
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
