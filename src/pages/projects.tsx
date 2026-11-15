import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {projects} from '../data/projects';
import styles from './info.module.css';

export default function Projects(): ReactNode {
  return (
    <Layout
      title="Dự án"
      description="Các dự án homelab và thử nghiệm kỹ thuật của TechDoors, bắt đầu với CloudPlay - OpenStack GPU Gaming Lab."
    >
      <main className={styles.page}>
        <header className={styles.header}>
          <p className="eyebrow">02 / DỰ ÁN & THỬ NGHIỆM</p>
          <h1>Nơi ý tưởng được thử.</h1>
          <p>Không gian ghi lại những dự án homelab và thử nghiệm kỹ thuật về hạ tầng.</p>
        </header>
        <section className={styles.projects} aria-label="Các dự án">
          {projects.map((project) => (
            <article className={styles.project} key={project.id}>
              <span className={styles.badge}>
                {project.number} / {project.category}
              </span>
              <h2>
                {project.detailsReady ? <Link to={project.href}>{project.name}</Link> : project.name}
              </h2>
              <p className={styles.projectSubtitle}>{project.subtitle}</p>
              <p className={styles.projectDescription}>{project.description}</p>
              {!project.detailsReady && (
                <p className={styles.projectProgress}>Đang hoàn thiện nội dung</p>
              )}
            </article>
          ))}
        </section>
      </main>
    </Layout>
  );
}
