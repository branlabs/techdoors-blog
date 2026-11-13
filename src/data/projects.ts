export interface ProjectSummary {
  id: string;
  number: string;
  name: string;
  title: string;
  category: string;
  description: string;
  topics: readonly string[];
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
  category: 'Dự án Homelab',
  description:
    'Xây dựng hệ thống Cloud Gaming trên OpenStack, sử dụng PCI GPU Passthrough, Windows VM, Sunshine và Moonlight. Đã thử streaming 1080p60 trong mạng nội bộ; chưa kiểm thử game thực tế.',
  topics: ['OpenStack', 'KVM', 'GPU Passthrough', 'Cloud Gaming'],
  status: 'Bản thử nghiệm - chưa kiểm thử game',
  startedLabel: 'Đầu tháng 11/2026',
  updatedOn: '2026-11-08',
  updatedLabel: '08/11/2026',
  href: '/projects/cloudplay/',
  updatesHref: '/projects/cloudplay/updates/',
};

export const projects: readonly ProjectSummary[] = [cloudplay];
