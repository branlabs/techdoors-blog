# Prompt gửi cho code agent — Bản đọc thử Under the Hood #02

> Dùng skill `$techdoors-under-the-hood-writer`, đọc `SKILL.md`, các reference liên quan và hai bản #01 trong repository. Viết một bản đọc thử tiếng Việt khoảng 900–1.200 từ cho **Under the Hood #02 — Máy ảo bên trong máy ảo**.
>
> Trước khi viết, tự trả lời sáu câu hỏi trong story card *purpose before mechanism*. Mở bằng sự tò mò nối tiếp #01. Để người đọc dần hiểu vì sao một kỹ sư muốn chỉnh và thử chính hệ thống ảo hóa trong khi máy chủ vật lý còn chạy các workload khác. Hai máy Ubuntu trực tiếp trên L0 là đủ nếu mục tiêu chỉ là chạy hai máy. Hãy để sự khác biệt ấy dẫn đến L1, nơi kỹ sư có thể vận hành hypervisor riêng, và L2, máy khách của nó.
>
> Làm rõ QEMU, KVM, điều kiện để L0 cung cấp khả năng ảo hóa cho L1 và phần tài nguyên vẫn chia sẻ với máy chủ vật lý. Giữ giọng văn TechDoors, giới thiệu thuật ngữ khi cần và để đoạn kết thay đổi cách độc giả hiểu lựa chọn ban đầu. Chi tiết gọi lại ở cuối là tùy chọn.
>
> Dành phần ngắn gần cuối cho thí nghiệm dự kiến dùng Terraform, libvirt và cloud-init. Nêu bằng chứng nào sẽ xác nhận KVM thực sự chạy L2. Giữ OpenStack ngoài phạm vi. Ghi rõ trạng thái thực nghiệm và không bịa kết quả.
>
> Đây là bản đọc thử đã được phép viết thẳng. Tự biên tập theo `review-rubric.md` rồi trả toàn văn trong cuộc trò chuyện, kèm ghi chú ngắn về bước ngoặt và điều cần xác minh. Không tạo file bài viết, chạy lab, mở PR, merge hay xuất bản cho yêu cầu đọc thử này.
