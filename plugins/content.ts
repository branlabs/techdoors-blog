import type {LoadContext, Plugin} from '@docusaurus/types';
import type {PostSummary} from '../src/types/content';

type LoadedBlog = {
  blogPosts: {metadata: PostSummary & {unlisted?: boolean; frontMatter?: {unlisted?: boolean}}}[];
};

// Derive the home page and related posts from the blog plugin's actual content.
// Adding an MD/MDX post never requires maintaining a second post list.
export default function contentPlugin(_context: LoadContext): Plugin {
  return {
    name: 'techdoors-content',
    allContentLoaded({allContent, actions}) {
      const blog = allContent['docusaurus-plugin-content-blog']?.default as LoadedBlog | undefined;
      const posts = (blog?.blogPosts ?? [])
        .filter(({metadata}) => !metadata.unlisted && !metadata.frontMatter?.unlisted)
        .map(({metadata}) => ({
        title: metadata.title,
        description: metadata.description,
        permalink: metadata.permalink,
        date: metadata.date,
        readingTime: metadata.readingTime,
        tags: metadata.tags,
      }));
      actions.setGlobalData({posts});
    },
  };
}
