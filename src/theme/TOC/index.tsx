import type {ReactNode} from 'react';
import OriginalTOC from '@theme-original/TOC';
import type {Props} from '@theme/TOC';
import styles from './styles.module.css';

export default function TOC(props: Props): ReactNode {
  return (
    <nav aria-label="Mục lục bài viết" className={styles.landmark}>
      <OriginalTOC {...props} />
    </nav>
  );
}
