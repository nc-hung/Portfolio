# Lemon.io / Arc.dev application + LinkedIn outbound

> (a) Hồ sơ + chuẩn bị test cho Lemon.io & Arc.dev. (b) Mẫu outbound LinkedIn nhắn founder EU/UK/AU.
> Quy trình tra từ trang chính thức 6/2026 (nguồn cuối file). Giọng: trung thực, không "làm lố".

---

# PHẦN A — LEMON.IO & ARC.DEV

## A0. Thực tế (đọc trước, đừng ảo tưởng)

| | Lemon.io | Arc.dev |
|---|---|---|
| Tỉ lệ nhận | ~**1.2%** (vòng kỹ thuật chỉ ~3% qua) | top ~**2.3%** |
| Vòng | 1) Soát hồ sơ/GitHub → 2) Phỏng vấn giao tiếp (~10% qua) → 3) **Phỏng vấn kỹ thuật ~90' (system design + live coding + debug)** → 4) Match | 1) Soát hồ sơ/GitHub → 2) Giao tiếp (video intro) → 3) **Kỹ thuật ~60' (chọn live coding HOẶC technical interview)** → 4) Duyệt cuối |
| Họ soi nhất | Kinh nghiệm thương mại **thật**, GitHub khớp CV, **tiếng Anh**, **độ tin cậy/phản hồi**, **product thinking + AI fluency** | CV khớp GitHub (claim 7 năm Python mà GitHub trống = loại), giao tiếp, **live coding thực hành** |

> **Điểm mấu chốt & trung thực với bạn:** vòng kỹ thuật **bạn phải tự code/giải system design KHÔNG có AI**. Phần BE bạn làm "cùng AI" → trong phỏng vấn cần thể hiện **hiểu bản chất**, không phải nhớ pattern. ⇒ Chiến lược: **dẫn bằng thế mạnh THẬT của bạn** (Mobile/React/Frontend — bạn là Senior Mobile Developer thật), giải thích **sâu kiến trúc & quyết định của chính dự án mình** (bạn dẫn phân tích → bạn biết "tại sao"), và **luyện live coding tay không** ở ngôn ngữ mạnh nhất.

---

## A1. Checklist TRƯỚC khi nộp (bắt buộc — họ verify GitHub)
- [ ] **GitHub `github.com/nc-hung` phải "đỡ" được CV.** Họ đối chiếu claim ↔ GitHub. Nếu repo thật private/trống → rủi ro bị loại vòng 1.
  - Pin 4–6 repo tốt nhất, mỗi repo có **README rõ ràng** (ảnh, mô tả, stack, vai trò).
  - Repo private nhạy cảm (Check Toa, ivy-*) → tạo bản **demo/sanitized public** hoặc ít nhất README mô tả + link portfolio.
- [ ] Link **portfolio** (`nguyenconghung.up.railway.app`) + **CV** (`/cv/`) trong hồ sơ.
- [ ] LinkedIn cập nhật khớp CV (title, kinh nghiệm, link site).
- [ ] Webcam + mic + mạng ổn cho phỏng vấn video (English).

## A2. Hồ sơ nộp (dùng chung cho cả 2 — paste-ready EN)

**Title:** `Senior Full-Stack Developer (Web & Mobile) - React, React Native, Node, NestJS`

**Bio:**
```
Senior full-stack developer with 5+ years building web and mobile products
for retail, e-commerce, warehouse operations and digital transformation.
Strongest in React, React Native and Next.js on the front end, Node.js and
NestJS (Clean Architecture) on the back end, with PostgreSQL/Prisma, Docker,
and AI integration (Claude, Gemini, GPT).

I own delivery end to end: requirements, architecture, build, App Store /
Google Play releases, and technical documentation handover. I care about the
parts that break in production - money-accurate logic, audit trails, offline
sync, and clean releases.

Recent work: a Zalo Mini App commerce platform (NestJS BFF + resilient POS
sync), an order & debt reconciliation system with FIFO payment allocation,
AI sales/ops bots, and ERP/WMS apps used on a supermarket floor.

Remote, English-speaking; my afternoon (ICT) overlaps European mornings.
```

**Primary skills:** React, React Native, Next.js, TypeScript, Node.js, NestJS, PostgreSQL, Prisma, Docker, REST API, AI integration.
**Years:** 5+. **Seniority:** Senior. **English:** Professional working proficiency.
**Rate to set:** these are *vetted* networks (cao hơn Upwork) — đặt **$40–55/h** khởi điểm (leo $60–80 sau khi có đánh giá). Day-rate tương đương €300–400.

## A3. Chuẩn bị từng vòng

### Vòng 1 — Soát hồ sơ/CV/GitHub
- Họ tìm **kinh nghiệm thương mại thật** + GitHub khớp. → Làm A1 trước. CV của bạn (mục Thiso/Emart, N.A.M, các dự án) đã đủ "thật"; vấn đề chỉ là GitHub có "đỡ" được không.

### Vòng 2 — Phỏng vấn giao tiếp / tiếng Anh (Lemon ~10% qua)
- Nói **rõ ràng, có cấu trúc**: "Vấn đề → cách tôi tiếp cận → kết quả".
- Kể được **1–2 dự án** mạch lạc bằng tiếng Anh (luyện trước: Check Toa FIFO, Zalo Mini App POS sync).
- Nhấn **remote-ready**: chủ động, async, overlap múi giờ EU.
- Lemon còn có **vài câu trắc nghiệm kỹ thuật cơ bản** ở vòng này — ôn nền tảng JS/TS/React/HTTP.

### Vòng 3 — KỸ THUẬT (vòng quyết định, khó nhất)
Đây là vòng bạn cần luyện nhất. **Thật, không AI.**
- **System design (có ràng buộc nghiệp vụ):** luyện giải thích kiến trúc **chính dự án của bạn** — Zalo Mini App: tại sao BFF? đồng bộ tồn kho chống hụt đơn thế nào? idempotency? retry? Check Toa: vì sao Decimal không Float? FIFO allocation ra sao? Bạn **dẫn phân tích** nên bạn giải thích được — đây là lợi thế.
- **Live coding:** luyện **tay không** ở ngôn ngữ mạnh nhất (React/TS). Bài kiểu: build 1 component có state/đệ quy/đồng bộ, hoặc giải 1 bài logic vừa. Mỗi ngày 1 bài (Codewars/LeetCode easy-medium) trong 1–2 tuần.
- **Debug:** họ đưa code lỗi → tìm và sửa, nói to suy nghĩ.
- **Khi bí: hợp tác, không thủ thế.** Họ chấm điểm cách bạn xử lý lúc bí cao hơn cả việc giải đúng. Hỏi lại, đề xuất hướng, suy nghĩ ra tiếng.
- **AI fluency (xu hướng 2026 — lợi thế của bạn):** nói thật rằng bạn dùng AI như công cụ tăng tốc nhưng **hiểu hệ thống**; cho ví dụ bạn dùng AI để phân tích/dựng nhanh nhưng tự quyết kiến trúc và kiểm thử. Lemon **đánh giá cao** product thinking + AI fluency.

### Vòng 4 — Match/duyệt cuối
- **Phản hồi nhanh, giữ đúng hẹn.** Lemon **loại thẳng** người chậm/không phản hồi trong 2 tuần screening. Đây là thứ bạn kiểm soát 100% — đừng mất điểm oan.

> Lemon **cho cơ hội 2** nếu feedback kỹ thuật chưa rõ ràng, và **hỗ trợ luyện phỏng vấn cho người giỏi-nhưng-ngại**. Rớt lần 1 không phải hết cửa.

## A4. Thứ tự nộp
1. Làm **A1 (GitHub + link)** trước — quan trọng nhất.
2. Nộp **Arc.dev** trước (cho chọn coding challenge **hoặc** interview — linh hoạt hơn, đỡ áp lực live).
3. Nộp **Lemon.io** sau khi đã luyện ~1–2 tuần live coding + kể dự án.

---

# PHẦN B — OUTBOUND LINKEDIN (1-1, không "kết bạn" tràn)

## B0. Cách làm đúng
- **Nhắm:** founder/CTO/Head of Eng của **startup nhỏ EU/UK/AU** (5–50 người), hoặc **agency** cần dev gánh việc tràn. Tìm qua: từ khoá "hiring developer", "looking for freelance dev", "building [product]"; nhóm/hashtag #hiring #freelancedeveloper; bài đăng tuyển gần đây.
- **Quy tắc:** cá nhân hoá 1 dòng đầu (nhắc đúng họ/sản phẩm họ), **value-first**, ngắn, không spam. 10–15 tin nhắn chất/ngày > 100 tin copy.
- **Không** pitch ngay ở lời mời kết nối. Kết nối → nhắn giá trị → mới đề xuất.

## B1. Lời mời kết nối (note ≤ 300 ký tự)
```
Hi [Name], I build web & mobile apps for [their space, e.g. retail/SaaS]
teams - order/invoice systems, dashboards, AI automation. Saw [specific:
your post on X / what [Company] is building] and wanted to connect.
```

## B2. Tin nhắn đầu sau khi kết nối (value-first, KHÔNG bán liền)
```
Thanks for connecting, [Name]. No pitch - I just like what [Company] is
doing with [specific thing].

Quick context in case it's ever useful: I'm a freelance full-stack dev
(React / React Native / Node / NestJS) who ships money-accurate business
apps - billing, dashboards, AI automation - remote, in English, overlapping
European mornings.

If you ever need an extra pair of hands on web or mobile, happy to help.
Either way, rooting for [Company].
```

## B3. Outreach trực tiếp khi họ ĐANG tuyển/xây (có hook)
```
Hi [Name], saw [Company] is [hiring a dev / building feature X]. I do exactly
this kind of work freelance: [1 line matching their need, e.g. "a React
Native app with offline sync and clean App Store releases"].

Recent: I built [closest case study, e.g. a Zalo Mini App commerce platform
with a resilient POS sync so orders never drop on supplier errors].

If you want an extra hand (remote, English, EU-morning overlap), I can share
a 2-min walkthrough or a fixed quote for a first slice. No pressure.
```

## B4. Follow-up (sau 4–6 ngày, 1 lần duy nhất)
```
Hi [Name], following up once in case this slipped by. Still happy to help on
[their need] if useful - here's my portfolio: nguyenconghung.up.railway.app.
If now's not the time, no worries at all.
```

## B5. Quy luật outbound (kỳ vọng đúng)
- Đây là **trò chơi con số + cá nhân hoá**: ~50–100 tin đúng đối tượng → vài cuộc nói chuyện → 1 cơ hội. Đừng nản tuần đầu.
- Trả lời nhanh, lịch sự khi bị từ chối — họ có thể nhớ bạn sau.
- Mỗi tin **phải có 1 chi tiết riêng về họ** ở câu đầu, nếu không = spam.

> Có JD/bài đăng thật của 1 founder? Dán vào chat, tôi viết tin nhắn đo ni đóng giày.

---

### Nguồn (quy trình tuyển 6/2026)
- Lemon.io vetting (4 vòng, ~1.2%): [our-vetting-process](https://lemon.io/our-vetting-process/) · [inside the process](https://lemon.io/blog/inside-lemonios-unapologetically-thorough-vetting-process/)
- Arc.dev vetting (top ~2.3%, live coding): [Arc vetting process](https://arc.dev/employer-blog/vetting-process/) · [How Arc works](https://arc.dev/how-arc-works)
