import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export const invisibleComputer = {
  vi: '/blog/the-invisible-computer/',
  en: '/en/blog/the-invisible-computer/',
} as const;

// Only show a language choice for posts with a real English translation.
export default function ArticleLanguageSwitcher({
  language,
}: {
  language: 'vi' | 'en';
}): ReactNode {
  return (
    <nav
      className={styles.switcher}
      aria-label={language === 'en' ? 'Article language' : 'Ngôn ngữ bài viết'}
    >
      <Link
        to={invisibleComputer.vi}
        lang="vi"
        className={language === 'vi' ? styles.active : undefined}
        aria-current={language === 'vi' ? 'page' : undefined}
      >
        VI
      </Link>
      <span aria-hidden="true" className={styles.separator}>/</span>
      <Link
        to={invisibleComputer.en}
        lang="en"
        className={language === 'en' ? styles.active : undefined}
        aria-current={language === 'en' ? 'page' : undefined}
      >
        EN
      </Link>
    </nav>
  );
}
