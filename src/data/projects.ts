export interface ProjectSummary {
  id: string;
  number: string;
  name: string;
  title: string;
  subtitle: string;
  category: string;
  detailsReady: boolean;
  description: string;
  topics: readonly string[];
  previewTags?: readonly string[];
  preview?: {src: string; alt: string};
  status: string;
  startedLabel: string;
  updatedOn: string;
  updatedLabel: string;
  href: string;
  updatesHref: string;
  articleHref?: string;
}

// Shared identity and current status. Historical articles retain their own dated snapshots.
export const cloudplay: ProjectSummary = {
  id: 'cloudplay',
  number: '01',
  name: 'CloudPlay',
  title: 'CloudPlay - OpenStack GPU Gaming Lab',
  subtitle: 'OpenStack GPU Gaming Lab',
  category: 'Dự án Homelab',
  detailsReady: false,
  description:
    'Provision một máy ảo Windows trên OpenStack để chơi game từ xa, sử dụng GPU passthrough, Sunshine và Moonlight.',
  topics: ['OpenStack', 'KVM', 'GPU Passthrough', 'Cloud Gaming'],
  previewTags: ['OpenStack', 'KVM', 'GPU', 'Gaming'],
  preview: {
    src: '/img/cloudplay-preview.svg',
    alt: 'Minh họa màn hình máy tính và tay cầm chơi game',
  },
  status: 'Bản thử nghiệm - chưa kiểm thử game',
  startedLabel: 'Đầu tháng 11/2026',
  updatedOn: '2026-11-08',
  updatedLabel: '08/11/2026',
  href: '/projects/cloudplay/',
  updatesHref: '/projects/cloudplay/updates/',
};

export const projects: readonly ProjectSummary[] = [cloudplay];
