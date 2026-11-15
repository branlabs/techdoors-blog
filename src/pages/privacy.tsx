import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import {PageHeader, PageShell} from '../components/PageShell';
import styles from './privacy.module.css';

export default function Privacy(): ReactNode {
  return (
    <Layout
      title="Quyền riêng tư"
      description="Cách TechDoors thống kê lượt đọc và tôn trọng lựa chọn của người truy cập."
    >
      <PageShell>
        <PageHeader
          eyebrow="TECHDOORS / PRIVACY"
          title="Quyền riêng tư"
          description="Ghi chú ngắn về cách mình thống kê lượt đọc trên TechDoors."
        />
        <div className={styles.body}>
          <h2>Thống kê truy cập</h2>
          <p>
            TechDoors sử dụng Google Analytics 4 để hiểu số lượt truy cập, bài viết được đọc,
            nguồn giới thiệu và khu vực địa lý ước tính như quốc gia, vùng hoặc thành phố.
            Mình không thu thập hay hiển thị danh sách IP truy cập trong website.
          </p>
          <h2>Bạn có quyền lựa chọn</h2>
          <p>
            Google Analytics chỉ được tải sau khi bạn chọn “Cho phép thống kê”.
            Nếu không đồng ý, website vẫn hoạt động bình thường. Bạn có thể đổi lựa chọn
            bất cứ lúc nào bằng nút “Tùy chọn thống kê” ở cuối trang.
          </p>
          <h2>Dữ liệu và giới hạn</h2>
          <p>
            Khi được cho phép, Google Analytics có thể dùng cookie và xử lý thông tin về
            hoạt động truy cập theo chính sách của Google. Vị trí địa lý là ước tính,
            không phải địa điểm chính xác của người đọc. Những lượt đọc không đồng ý
            thống kê có thể không xuất hiện trong báo cáo.
          </p>
          <p>
            Tìm hiểu thêm trong{' '}
            <a href="https://policies.google.com/privacy" rel="noopener noreferrer">
              chính sách quyền riêng tư của Google
            </a>.
          </p>
        </div>
      </PageShell>
    </Layout>
  );
}
