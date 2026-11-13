import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './info.module.css';

export default function About(): ReactNode {
  return (
    <Layout
      title="Giới thiệu"
      description="Một chút về Brandon, người viết TechDoors: nơi ghi lại những điều đã học, đã thử và những câu hỏi kỹ thuật còn muốn tìm hiểu."
    >
      <main className={styles.page}>
        <header className={`${styles.header} ${styles.aboutHeader}`}>
          <p className="eyebrow">TECHDOORS / ABOUT</p>
          <h1>Một chút về mình</h1>
        </header>
        <div className={styles.aboutStory}>
          <p>
            Mình là Brandon. Công việc của mình gắn với Linux, Kubernetes và những hệ thống vận hành
            phía sau các ứng dụng mà chúng ta sử dụng mỗi ngày.
          </p>
          <p>
            Có những thứ mình dùng rất thường xuyên, nhưng đến khi thử giải thích chúng cho người
            khác, mình mới nhận ra vẫn còn nhiều điều chưa hiểu. TechDoors bắt đầu từ những lần như
            vậy.
          </p>
          <p>
            Đây là nơi mình ghi lại những gì đã học, đã thử và đôi khi đã làm sai. Có bài viết xuất
            phát từ công việc, có bài chỉ đơn giản đến từ một buổi tối tò mò về cách thứ gì đó hoạt
            động.
          </p>
          <p>
            Mình thích bắt đầu từ những điều tưởng chừng đơn giản, tìm hiểu từng lớp bên dưới rồi
            kể lại theo cách dễ hiểu nhất có thể. Không phải lúc nào cũng có một câu trả lời hoàn
            chỉnh, và điều đó cũng chẳng sao.
          </p>
          <p>
            Nếu đây là lần đầu bạn ghé TechDoors, hãy thử bắt đầu với{' '}
            <Link to="/blog/the-invisible-computer/">Chiếc máy tính vô hình</Link> — bài viết đầu
            tiên trong series <em>Under the Hood</em>.
          </p>
        </div>
      </main>
    </Layout>
  );
}
