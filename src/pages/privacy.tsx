import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import {PageHeader, PageShell} from '../components/PageShell';
import styles from './privacy.module.css';

export default function Privacy(): ReactNode {
  return (
    <Layout
      title="Quyền riêng tư"
      description="Cách TechDoors thống kê lượt đọc bằng Umami và xử lý dữ liệu truy cập."
    >
      <PageShell>
        <PageHeader
          eyebrow="TECHDOORS / PRIVACY"
          title="Quyền riêng tư"
          description="Một vài điều bạn nên biết về thống kê lượt đọc trên TechDoors."
        />
        <div className={styles.body}>
          <h2>Thống kê lượt đọc</h2>
          <p>
            TechDoors sử dụng Umami Cloud để thống kê lượt xem trang, số lượt truy cập,
            nguồn giới thiệu và khu vực địa lý ước tính như quốc gia, vùng hoặc thành phố.
            Công cụ này chạy tự động khi trang được mở, không dùng cookie theo dõi
            và không yêu cầu bạn tạo tài khoản.
          </p>
          <h2>Vị trí và địa chỉ IP</h2>
          <p>
            Vị trí được ước tính từ kết nối mạng, không phải GPS và có thể không chính xác.
            Umami xử lý địa chỉ IP tạm thời để tạo chỉ số lượt truy cập và xác định vị trí
            gần đúng, nhưng không lưu IP dưới dạng trường trong bản ghi analytics tiêu chuẩn.
            Nhà cung cấp và hạ tầng vận hành có thể lưu IP trong nhật ký bảo mật riêng.
          </p>
          <h2>Giới hạn và lựa chọn</h2>
          <p>
            TechDoors không gắn định danh riêng để theo dõi một người qua các website
            và không bán dữ liệu độc giả. Trình theo dõi được cấu hình tôn trọng tín hiệu
            Do Not Track khi trình duyệt hỗ trợ. Bạn cũng có thể dùng cài đặt trình duyệt
            hoặc công cụ chặn theo dõi để hạn chế thống kê.
          </p>
          <p>
            Xem thêm{' '}
            <a href="https://umami.is/privacy" rel="noopener noreferrer">
              chính sách quyền riêng tư của Umami
            </a>{' '}
            về cách họ xử lý dữ liệu và nhật ký vận hành.
          </p>
        </div>
      </PageShell>
    </Layout>
  );
}
