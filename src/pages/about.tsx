import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './info.module.css';

export default function About(): ReactNode {
  return (
    <Layout
      title="Giới thiệu"
      description="Chào, mình là Brandon — người viết TechDoors. Những câu chuyện nhỏ về hạ tầng, máy ảo và những điều diễn ra phía sau màn hình."
    >
      <main className={styles.page}>
        <header className={styles.header}>
          <p className="eyebrow">VỀ TECHDOORS</p>
          <h1>Chào, mình là Brandon.</h1>
          <p>
            Mình thích tìm hiểu những điều diễn ra phía sau màn hình — từ một chiếc máy ảo
            cho đến những hệ thống đang âm thầm vận hành mỗi ngày.
          </p>
        </header>
        <div className={styles.split}>
          <div className={styles.prose}>
            <h2>Vì sao có TechDoors?</h2>
            <p>
              Mình làm việc với hạ tầng và thường xuyên gặp những khái niệm nghe rất quen,
              nhưng càng hỏi “vì sao?” lại càng thấy nhiều điều đáng khám phá.
            </p>
            <p>
              TechDoors là nơi mình ghi lại hành trình ấy: một câu hỏi nhỏ, một lần thử,
              đôi khi là một hiểu lầm được tháo gỡ. Mình muốn những chuyện kỹ thuật khó
              hình dung trở nên dễ đọc hơn, kể cả với người mới bắt đầu.
            </p>
            <h2>Mình viết như thế nào?</h2>
            <p>
              Mình quan tâm Linux, Kubernetes, ảo hóa, observability và những hệ thống
              tự dựng để học hỏi. Khi kể về một thử nghiệm, mình cố gắng phân biệt điều
              đã kiểm chứng với điều vẫn còn đang tìm hiểu.
            </p>
            <h2>Bắt đầu từ một cánh cửa</h2>
            <p>
              Bạn có thể đọc <Link to="/blog/chiec-may-tinh-vo-hinh/">Chiếc máy tính vô hình</Link>
              {' '}— câu chuyện mở đầu series <em>Under the Hood</em> — hoặc ghé
              {' '}<Link to="/blog/">tất cả bài viết</Link> để chọn một câu hỏi khiến bạn tò mò.
            </p>
          </div>
          <aside className={styles.aside}>
            <p className="eyebrow">CÁC CHỦ ĐỀ ĐANG MỞ</p>
            <h2>Từ câu hỏi nhỏ đến hệ thống lớn.</h2>
            <p>Những cánh cửa đầu tiên để bắt đầu khám phá.</p>
            <div className={styles.tags}>
              <Link to="/blog/tags/under-the-hood/">Under the Hood</Link>
              <Link to="/blog/tags/virtualization/">Virtualization</Link>
              <Link to="/blog/tags/linux/">Linux</Link>
              <Link to="/blog/tags/infrastructure/">Infrastructure</Link>
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
