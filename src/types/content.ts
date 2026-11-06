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
  {label: 'DevOps', slug: 'devops'},
  {label: 'SRE', slug: 'sre'},
  {label: 'Kubernetes', slug: 'kubernetes'},
  {label: 'Platform Engineering', slug: 'platform-engineering'},
  {label: 'Observability', slug: 'observability'},
  {label: 'CI/CD', slug: 'ci-cd'},
  {label: 'Linux', slug: 'linux'},
  {label: 'Infrastructure', slug: 'infrastructure'},
  {label: 'Homelab', slug: 'homelab'},
  {label: 'OpenStack', slug: 'openstack'},
] as const;
