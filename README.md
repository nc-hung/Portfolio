# Portfolio Detailed Content - Hung Nguyen (Senior Software Engineer)

Tài liệu này liệt kê chi tiết toàn bộ nội dung được hiển thị trên Portfolio cá nhân (`docs/index.html`).

---

## 🚀 1. Hero Section (Phần đầu trang)
- **Tiêu đề chính (Main Headline)**: Hệ thống vận hành, chuẩn từng đồng. (Back-office systems, money-accurate.)
- **Vai trò chuyên môn**: Full-stack Engineer (Senior Software Engineer | Full-stack & Mobile).
- **Giới thiệu tóm tắt**: Tôi xây phần mềm quản lý đơn hàng, hoá đơn, công nợ và tự động hoá bằng AI cho doanh nghiệp.
- **Chỉ số ấn tượng**:
    - **5+ Năm kinh nghiệm**
    - **20+ Dự án đã làm**

---

## 🛠️ 2. Tôi giúp gì (Services)
1. **Hoá đơn, công nợ, sổ cái**: Đơn hàng, hoá đơn, đối soát thanh toán FIFO, bảng kê NCC, số học tiền chính xác.
2. **Tự động hoá & internal tool bằng AI**: Chatbot, tích hợp POS/ERP, báo cáo do AI tạo, QR thanh toán, nhắc nợ tự động.
3. **Dashboard quản trị**: React + MUI sạch, nhanh, phân quyền, audit log. Đội ngũ dùng được ngay từ ngày đầu.
4. **Cứu & ổn định hệ thống cũ**: Đọc codebase lạ nhanh, vá lỗi, tăng tốc, hoàn thiện mà không cần viết lại.
5. **Chọn hạ tầng & tối ưu chi phí**: Hạ tầng trong nước (Viettel IDC), hệ sinh thái Zalo (ZNS/OA/Mini App) và Google Cloud — chọn đúng nền tảng để tối ưu chi phí vận hành.

### Quy trình làm việc (Process)
1. **Trao đổi**: Hiểu rõ bài toán nghiệp vụ, edge case và tiêu chí thành công.
2. **Báo giá**: Giá theo cột mốc, timeline trung thực. Không "tính sau".
3. **Xây dựng**: Giao tăng dần, kiểm thử bằng lần chạy thật, cập nhật thường xuyên.
4. **Bàn giao**: Deploy thật, tài liệu vận hành, bảo hành sửa lỗi sau bàn giao.

---

## 🏆 3. Dự án tiêu biểu (Selected Work)

### A. Nền tảng "Thử thách 90 ngày" (IVY Kể Chuyện × OX Multimedia) — 2026, dự án chủ lực
- **Loại hình**: Monorepo · 2 app Next.js.
- **Mô tả**: Nền tảng học tập theo thử thách 90 ngày: học viên nộp bài mỗi ngày trên app mobile-first, còn admin/trợ giảng theo dõi tiến độ, chấm check giải, import roster và quản lý sự kiện. Hai app deploy độc lập nhưng dùng chung một database.
- **Công nghệ**: Next.js 14, TypeScript, Turborepo, pnpm, Prisma, PostgreSQL, Zalo Login, Google Cloud Storage, Vertex Gemini + Vision, Railway.
- **Điểm nhấn kỹ thuật**:
    - Monorepo Turborepo + pnpm với 2 app Next.js 14 (student/admin) dùng chung Postgres/Prisma và các package nội bộ — deploy độc lập mà không lặp code.
    - Đăng nhập học viên bằng Zalo Login v4, chuẩn hoá số điện thoại VN, tự ghi danh ngày 1, chống mạo danh.
    - AI (Vertex Gemini + Vision OCR) xác thực ảnh minh chứng (Strava/Zoom) theo từng loại task — chấm bài tự động, giảm gian lận.
    - Console admin phân quyền theo hành động (RBAC + audit log), import xlsx theo giai đoạn, logic "ai chưa nộp hôm nay" + streak/nộp bù.
    - Ảnh lưu trên Google Cloud Storage (bucket riêng tư, Signed URL v4), log JSON có trace context + che PII, CI/CD GitHub Actions → Railway auto-deploy.
- **Live**: [App học viên](https://oxstudent.oxmultimedia.vn/today)

### B. Hệ thống quản lý đơn hàng & công nợ — 2026, dự án chủ lực
- **Loại hình**: Kiến trúc Full-stack.
- **Mô tả**: Hệ thống quản lý đơn hàng, khách hàng và công nợ cho hộ kinh doanh: tách lớp rõ ràng (API — nghiệp vụ — dữ liệu) để số học tiền luôn chính xác và dễ mở rộng.
- **Công nghệ**: Node.js, Express, TypeScript, Prisma, PostgreSQL, React, MUI.
- **Điểm nhấn kỹ thuật**:
    - Kiến trúc phân lớp Node.js/Express/TypeScript + Prisma trên PostgreSQL — tách nghiệp vụ khỏi hạ tầng, kiểu dữ liệu chặt, giảm lỗi khi thay đổi.
    - Chiến lược sao lưu & khôi phục chủ động (backup định kỳ, phục hồi từ file) — bảo vệ dữ liệu tài chính, phục hồi nhanh khi sự cố.
    - Đóng gói chạy đa nền tảng, triển khai gọn nhẹ — vận hành trên hạ tầng sẵn có với chi phí thấp.

### C. Nền tảng bán hàng trên Zalo Mini App — 2026
- **Loại hình**: Zalo Mini App + BFF.
- **Mô tả**: Nền tảng bán hàng trên Zalo Mini App xây từ đầu, kết nối và tích hợp với hệ thống vận hành sẵn có của doanh nghiệp thay vì thay thế — để không làm gián đoạn quy trình quen thuộc.
- **Công nghệ**: Zalo Mini App, NestJS, BFF, POS/ERP API, SEPAY (VietQR), Redis, PostgreSQL.
- **Điểm nhấn kỹ thuật**:
    - Kiến trúc BFF (NestJS, Clean Architecture) — tách giao diện khỏi nghiệp vụ, gia cố bảo mật, dễ mở rộng sang web/mobile.
    - Lớp đồng bộ bền vững tới hệ thống bán hàng sẵn có (idempotent, đối soát tồn kho) — đơn không bị hụt khi dữ liệu nguồn sai.
    - Tích hợp cổng thanh toán SEPAY (webhook VietQR) — tự động xác nhận chuyển khoản ngân hàng và đối soát đơn hàng theo thời gian thực.
- **Live**: [Zalo Mini App](https://zalo.me/s/4316200907390639897/)

### D. Bot tự động hoá vận hành kho & bán hàng — 2026
- **Loại hình**: Tự động hoá + AI.
- **Mô tả**: Bot kết nối tới hệ thống vận hành, bán hàng sẵn có của doanh nghiệp để tổng hợp dữ liệu, phân tích bằng AI và tự động nhắc việc — số hoá các thao tác thủ công.
- **Công nghệ**: Next.js, React, Node.js, PostgreSQL, POS/ERP API, Zalo OA, AI (Gemini), node-cron.
- **Điểm nhấn kỹ thuật**:
    - Lớp tích hợp tới hệ thống sẵn có + đồng bộ theo lịch (node-cron) — tự động hoá báo cáo/nhắc nợ mà không đụng vào hệ thống lõi.
    - Phân tích bằng AI + dashboard báo cáo — biến dữ liệu thô thành thông tin ra quyết định nhanh.
    - Nhắc thanh toán tự động qua kênh Zalo OA kèm mã VietQR.

### E. Hệ thống đối soát công nợ cho vựa sỉ — 2025
- **Loại hình**: Full-stack.
- **Mô tả**: Hệ thống đơn hàng và công nợ với đối soát thanh toán FIFO, bảng kê nhà cung cấp, hoá đơn in/QR và nhập Excel. Số học tiền chính xác để số dư không bao giờ lệch.
- **Công nghệ**: Node.js, Express, Prisma, PostgreSQL, React, Docker.
- **Điểm nhấn kỹ thuật**: Đối soát FIFO tự động, số học Decimal chính xác. Bảng kê NCC + hoá đơn in/QR một chạm. Phân tích nghiệp vụ và phát triển cùng AI; chạy production cho vựa thật.

---

## 📈 4. Kinh nghiệm (Professional Journey)

### 1. OX Multimedia (06/2026 - nay)
- **Vai trò**: Lập trình viên Full-stack.
- **Chi tiết**: Xây các hệ thống cho doanh nghiệp: nền tảng vận hành kho & công nợ trên Next.js/Express/PostgreSQL (AI Gemini quét hoá đơn, nhắc thanh toán tự động qua Zalo OA, cron); nền tảng bán hàng Zalo Mini App với NestJS BFF (Clean Architecture) + Redis; và nền tảng học tập "Thử thách 90 ngày" (Turborepo monorepo, Zalo Login, AI xác thực ảnh, RBAC admin console). Tất cả tích hợp vào hệ thống vận hành sẵn có thay vì thay thế.

### 2. N.A.M Tech (2024 - nay)
- **Dự án**: Ticking App (AVB) – Mobile Developer.
- **Chi tiết**: Phát triển mobile, offline-first + background sync, native bridge iOS/Android, sở hữu release App Store / Google Play. Làm việc theo quy trình Scrum. Bàn giao tài liệu kỹ thuật cho khách.

### 3. Thiso Retail / Emart (2022 - 2024)
- **Dự án**: SmartOffice – ERP/WMS/CRM.
- **Chi tiết**: Xây app hỗ trợ vận hành dùng thật tại sàn Emart (tồn kho, hạn dùng, báo cáo, xếp lượt, màn hình TV báo lượt tài xế). Vận hành, cập nhật release và fix lỗi cho app Emart mall.

### 4. Intellin Tech (2021 - 2022)
- **Dự án**: Ứng dụng bảo hiểm & điện lực – Frontend Developer.
- **Chi tiết**: Phát triển tính năng UI trên Android/iOS theo quy trình Agile.

---

## ✨ 5. Ghi nhận chuyên môn & Liên hệ

- **Giải thưởng**: 2 giải thưởng tại Thiso Retail (Emart) — Hiệu suất xuất sắc, Nhân viên của năm.
- **Công nghệ chính**: Node.js, TypeScript, React, React Native, NestJS, Zalo Mini App, Prisma, PostgreSQL, Docker, CI/CD, tích hợp AI, Viettel IDC, Zalo (ZNS/OA), Google Cloud, Railway.
- **Thông điệp cuối**: "Có hệ thống cần xây hoặc cứu? Nhắn tôi." (Got a system to build or rescue? Let's talk.)
- **Liên hệ**:
    - **Email**: business.nc.hung@gmail.com
    - **Phone**: +84 981 815 237
    - **Social**: LinkedIn, GitHub.

---
*Tài liệu được cập nhật ngày: 21/09/2026*
