import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {topics} from '../types/content';
import styles from './info.module.css';

export default function About(): ReactNode {
  return (
    <Layout
      title="Giới thiệu"
      description="Về TechDoors: một không gian ghi chép kỹ thuật bằng tiếng Việt, tập trung vào hạ tầng, vận hành và việc học qua thực hành."
    >
      <main className={styles.page}>
        <header className={styles.header}>
          <p className="eyebrow">01 / GIỚI THIỆU</p>
          <h1>Đằng sau cánh cửa.</h1>
          <p>
            TechDoors là một không gian ghi chép kỹ thuật cá nhân. Một nơi để sắp xếp điều đã học,
            đặt thêm câu hỏi và chia sẻ cách tiếp cận hệ thống.
          </p>
        </header>
        <div className={styles.split}>
          <div className={styles.prose}>
            <h2>Một blog, một cách học.</h2>
            <p>
              Hạ tầng có nhiều lớp. Từ một tiến trình Linux đến một cụm Kubernetes, mỗi lớp đều có
              những lựa chọn và giới hạn riêng. TechDoors dành chỗ cho việc tìm hiểu chúng từng
              bước.
            </p>
            <p>
              Blog hướng đến những bài viết có bối cảnh rõ ràng, giải thích lựa chọn kỹ thuật và để
              lại đủ thông tin cho người đọc tự kiểm chứng. Các ví dụ lab, ghi chú và thử nghiệm sẽ
              được phân biệt với kinh nghiệm production khi có nội dung tương ứng.
            </p>
            <h2>Về người viết</h2>
            <div className={styles.placeholder}>
              <span className={styles.badge}>Nội dung chờ cập nhật</span>
              <p>
                <strong>[Tên hoặc biệt danh của bạn]</strong>
              </p>
              <p>
                [Viết vài dòng về bản thân, lĩnh vực đang tìm hiểu và lý do bạn bắt đầu blog. Chỉ
                thêm kinh nghiệm, vai trò hoặc thành tựu đã được xác thực.]
              </p>
            </div>
            <h2>Cùng mở thêm một cánh cửa.</h2>
            <p>
              Bạn có thể bắt đầu với{' '}
              <Link to="/blog/chao-mung-den-voi-techdoors/">bài viết chào mừng</Link>, xem{' '}
              <Link to="/projects">khu vực dự án</Link> hoặc theo dõi{' '}
              <a href="/blog/rss.xml">RSS</a> để đọc những ghi chép tiếp theo.
            </p>
          </div>
          <aside className={styles.aside}>
            <p className="eyebrow">PHẠM VI GHI CHÉP</p>
            <h2>Từ dòng lệnh đến nền tảng.</h2>
            <p>Những chủ đề TechDoors sẽ cùng bạn tìm hiểu.</p>
            <div className={styles.tags}>
              {topics.map((topic) => (
                <Link key={topic.slug} to={`/blog/tags/${topic.slug}/`}>
                  {topic.label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
