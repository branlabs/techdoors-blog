import type {ReactNode} from 'react';
import styles from './styles.module.css';

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  compact?: boolean;
};

export function PageShell({children}: {children: ReactNode}): ReactNode {
  return (
    <main className={styles.page} data-editorial-shell>
      {children}
    </main>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  compact = false,
}: PageHeaderProps): ReactNode {
  return (
    <header
      className={`${styles.header}${compact ? ` ${styles.headerCompact}` : ''}`}
      data-editorial-header
    >
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {description && <p className={styles.description}>{description}</p>}
    </header>
  );
}
