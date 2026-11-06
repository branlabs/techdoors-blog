import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import styles from './info.module.css';

const placeholders = [
  {
    number: '01',
    title: '[Tên dự án homelab]',
    description:
      '[Mô tả mục tiêu của lab, phần cứng hoặc môi trường sử dụng và câu hỏi kỹ thuật bạn muốn giải đáp.]',
    scope: 'Homelab / Linux / Infrastructure',
  },
  {
    number: '02',
    title: '[Tên dự án nền tảng]',
    description:
      '[Mô tả một thử nghiệm về nền tảng, tự động hóa hoặc quan sát hệ thống. Ghi rõ phạm vi và giới hạn trước khi chia sẻ.]',
    scope: 'Kubernetes / CI/CD / Observability',
  },
];

export default function Projects(): ReactNode {
  return (
    <Layout
      title="Dự án"
      description="Không gian dành cho các dự án và thử nghiệm kỹ thuật của TechDoors. Hiện gồm các khung nội dung mẫu, chưa phải dự án đã thực hiện."
    >
      <main className={styles.page}>
        <header className={styles.header}>
          <p className="eyebrow">02 / DỰ ÁN & THỬ NGHIỆM</p>
          <h1>Nơi ý tưởng được thử.</h1>
          <p>
            Khu vực dành cho lab, công cụ và thử nghiệm kỹ thuật. Các mục dưới đây là{' '}
            <strong>khung nội dung mẫu</strong>, sẽ được thay bằng dự án thực tế khi có tài liệu để
            chia sẻ.
          </p>
        </header>
        <section className={styles.projects} aria-label="Khung nội dung dự án">
          {placeholders.map((project) => (
            <article className={styles.project} key={project.number}>
              <span className={styles.badge}>{project.number} / Placeholder — chưa triển khai</span>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <dl>
                <dt>HƯỚNG NỘI DUNG DỰ KIẾN</dt>
                <dd>{project.scope}</dd>
                <dt>MÃ NGUỒN & BÀI VIẾT</dt>
                <dd>Chưa có — bổ sung khi dự án được công bố.</dd>
              </dl>
            </article>
          ))}
        </section>
        <p className={styles.endnote}>
          Đây là các vị trí chờ nội dung, chưa mô tả sản phẩm đang hoạt động hay thành tựu cá nhân.
        </p>
      </main>
    </Layout>
  );
}
