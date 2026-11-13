export type PostTag = {label: string; permalink: string};

export type PostSummary = {
  title: string;
  description: string;
  permalink: string;
  date: string;
  readingTime?: number;
  tags: PostTag[];
};

export const topics = [
  {label: 'Under the Hood', slug: 'under-the-hood'},
  {label: 'Virtualization', slug: 'virtualization'},
  {label: 'Linux', slug: 'linux'},
  {label: 'Infrastructure', slug: 'infrastructure'},
] as const;
