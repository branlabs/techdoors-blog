import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {PageHeader, PageShell} from '../components/PageShell';
import {projects} from '../data/projects';
import styles from './info.module.css';

export default function Projects(): ReactNode {
  return (
    <Layout
      title="Dự án"
      description="Các dự án homelab và thử nghiệm kỹ thuật của TechDoors, bắt đầu với CloudPlay - OpenStack GPU Gaming Lab."
    >
      <PageShell>
        <PageHeader
          eyebrow="02 / DỰ ÁN & THỬ NGHIỆM"
          title="Nơi ý tưởng được thử."
          description="Không gian ghi lại những dự án homelab và thử nghiệm kỹ thuật về hạ tầng."
        />
        <section className={styles.projects} aria-label="Các dự án" data-editorial-content>
          {projects.map((project) => (
            <article className={styles.project} key={project.id}>
              <div className={styles.projectBody}>
                <div className={styles.projectHeading}>
                  <span className={styles.projectNumber}>{project.number}</span>
                  <h2>
                    {project.detailsReady ? <Link to={project.href}>{project.name}</Link> : project.name}
                  </h2>
                </div>
                <p className={styles.projectSubtitle}>{project.subtitle}</p>
                <p className={styles.projectDescription}>{project.description}</p>
                <div className={styles.projectFooter}>
                  <ul className={styles.projectTags} aria-label={`Công nghệ của ${project.name}`}>
                    {(project.previewTags ?? project.topics).map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  {project.detailsReady ? (
                    <Link className={styles.projectCta} to={project.href}>
                      Khám phá dự án <span aria-hidden="true">↗</span>
                    </Link>
                  ) : (
                    <p className={styles.projectProgress}>Đang hoàn thiện nội dung</p>
                  )}
                </div>
              </div>
              {project.preview && (
                <div className={styles.projectPreview}>
                  <img
                    src={project.preview.src}
                    alt={project.preview.alt}
                    width="264"
                    height="210"
                    loading="lazy"
                  />
                </div>
              )}
            </article>
          ))}
        </section>
      </PageShell>
    </Layout>
  );
}
