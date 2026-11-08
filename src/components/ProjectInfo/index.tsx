import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import type {ProjectSummary} from '../../data/projects';
import styles from './styles.module.css';

export function ProjectMeta({project}: {project: ProjectSummary}): ReactNode {
  return (
    <p className={styles.meta}>
      <span>{project.status}</span>
      <span>Cập nhật nội dung: <time dateTime={project.updatedOn}>{project.updatedLabel}</time></span>
    </p>
  );
}

export function ProjectLinks({
  project,
  active,
}: {
  project: ProjectSummary;
  active?: 'overview' | 'updates';
}): ReactNode {
  return (
    <nav className={styles.links} aria-label={`Điều hướng dự án ${project.name}`}>
      <Link to={project.href} aria-current={active === 'overview' ? 'page' : undefined}>
        Tổng quan
      </Link>
      <Link to={project.updatesHref} aria-current={active === 'updates' ? 'page' : undefined}>
        Nhật ký cải tiến
      </Link>
      <Link to={project.articleHref}>Đọc bài hành trình</Link>
    </nav>
  );
}
