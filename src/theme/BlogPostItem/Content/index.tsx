import type {ReactNode} from 'react';
import Content from '@theme-original/BlogPostItem/Content';
import TOCCollapsible from '@theme/TOCCollapsible';
import type {Props} from '@theme/BlogPostItem/Content';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import styles from './styles.module.css';

export default function BlogPostItemContent(props: Props): ReactNode {
  const {toc, metadata, isBlogPostPage} = useBlogPost();
  const frontMatter = metadata.frontMatter;
  return (
    <>
      {isBlogPostPage && !frontMatter.hide_table_of_contents && toc.length > 0 && (
        <div className={styles.mobileTOC}>
          <TOCCollapsible
            toc={toc}
            minHeadingLevel={frontMatter.toc_min_heading_level}
            maxHeadingLevel={frontMatter.toc_max_heading_level}
          />
        </div>
      )}
      <Content {...props} />
    </>
  );
}
