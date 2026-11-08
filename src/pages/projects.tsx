import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import styles from './info.module.css';

const projects = [
  {
    number: '01',
    category: 'Dự án Homelab',
    title: 'BranLabs CloudPlay - OpenStack GPU Gaming Lab',
    description:
      'Xây dựng hệ thống Cloud Gaming trên OpenStack, sử dụng PCI GPU Passthrough, Windows VM, Sunshine và Moonlight để streaming game từ xa ở 1080p60.',
    topics: 'OpenStack / KVM / GPU Passthrough / Cloud Gaming',
  },
];

export default function Projects(): ReactNode {
  return (
    <Layout
      title="Dự án"
      description="Các dự án homelab và thử nghiệm kỹ thuật của TechDoors, bắt đầu với BranLabs CloudPlay — OpenStack GPU Gaming Lab."
    >
      <main className={styles.page}>
        <header className={styles.header}>
          <p className="eyebrow">02 / DỰ ÁN & THỬ NGHIỆM</p>
          <h1>Nơi ý tưởng được thử.</h1>
          <p>Không gian ghi lại những dự án homelab và thử nghiệm kỹ thuật về hạ tầng.</p>
        </header>
        <section className={styles.projects} aria-label="Các dự án">
          {projects.map((project) => (
            <article className={styles.project} key={project.number}>
              <span className={styles.badge}>
                {project.number} / {project.category}
              </span>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <dl>
                <dt>CHỦ ĐỀ</dt>
                <dd>{project.topics}</dd>
              </dl>
            </article>
          ))}
        </section>
      </main>
    </Layout>
  );
}
