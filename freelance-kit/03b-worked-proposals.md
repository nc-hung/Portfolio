# Proposal hoàn chỉnh — ví dụ đã viết sẵn (worked examples)

> 3 ví dụ: mỗi cái có **JD mẫu sát thực tế Upwork** + **proposal hoàn chỉnh** đã đo theo JD đó.
> Dùng để: (1) gửi luôn nếu gặp job tương tự, (2) học cách "đo" proposal theo JD.
> ⚠️ Các JD dưới là **mẫu mô phỏng** job thật — thay bằng JD thật rồi chỉnh 2 câu đầu cho khớp.
> Khung chuẩn & template gốc: xem `03-proposals.md`.

---

## VÍ DỤ 1 — Ngách A: Invoicing / Debt tracking

### JD (mẫu)
> *"Looking for a developer to build a simple web app for our distribution business. We need to
> create invoices for customers, track who owes us money, record partial payments, and print a
> monthly statement per customer. Currently everything is in Excel and it's a mess. Must be
> accurate with the numbers. Node or similar. Ongoing work likely."*

### Proposal
```
Hi [Name],

"Accurate with the numbers" is the whole game here — when customers pay in
parts, balances drift fast if payments aren't allocated correctly. That's
exactly the kind of system I specialize in, so the Excel mess becomes a single
source of truth you can trust.

I recently built almost this exact app for a wholesale distributor: customer
invoices, partial-payment recording with automatic FIFO allocation (oldest
invoice first), exact decimal math so balances never drift, and one-click
monthly statements (print + PDF). It replaced hours of manual Excel
reconciliation.

For yours, one question that shapes the build: when a customer pays part of
what they owe, should it auto-apply to their oldest unpaid invoice, or do they
specify which invoice each payment covers?

I can start with the invoice + payment + statement core, demo it within the
first week, then layer on the rest. Happy to do a quick call to scope it.

— Hung
```
**Vì sao mạnh:** bắt đúng pain "accurate", dẫn case study *trùng khít*, hỏi 1 câu kỹ thuật (FIFO vs chỉ định) chứng tỏ hiểu nghề, đề xuất giao sớm tuần 1 (giảm rủi ro cho khách).

---

## VÍ DỤ 2 — Ngách B: AI automation / tích hợp

### JD (mẫu)
> *"We sell on Facebook/Zalo and take orders by chat. We want to connect this to our POS so orders
> are recorded automatically, send customers a payment QR, and remind them if they haven't paid in
> 2 days. Bonus if we can see a simple sales dashboard. Need someone who has done integrations
> before."*

### Proposal
```
Hi [Name],

The win here is killing the manual steps — orders typed twice, payments chased
by hand. I build exactly this: a bot that turns chat orders into POS records,
issues a payment QR automatically, and follows up on unpaid orders on a
schedule, with a live sales view on top.

I recently shipped this for a retail/distribution seller: messaging-app orders
synced to their POS, VietQR payment codes generated per order, automated
reminders, and a dashboard with AI-generated sales charts — deployed and
running on Railway.

One scoping question: for the payment reminders, do you want them sent fully
automatically, or queued for a quick human approval before they go to the
customer? Both are easy; it just changes the flow.

If you share which POS you use, I'll confirm the integration path and give you
a fixed quote for phase 1 (orders + QR + reminders), with the dashboard as a
fast follow-up.

— Hung
```
**Vì sao mạnh:** "done integrations before" → dẫn case ivy-bot có POS + VietQR + nhắc nợ + dashboard AI (đúng từng gạch đầu dòng JD), hỏi câu tự-động-vs-duyệt-tay (rất "nghề"), chia phase + báo giá cố định (khách dễ "yes").

---

## VÍ DỤ 3 — Ngách "cứu hệ thống" (dễ chốt, ít cạnh tranh)

### JD (mẫu)
> *"We have an existing inventory + orders app built in Node and React by a previous developer who
> left. There are bugs — sometimes the payment totals are wrong and stock counts don't match. We
> need someone to take it over, fix the issues, and keep improving it. Repo is private, we'll share
> access."*

### Proposal
```
Hi [Name],

Inheriting a Node/React app where the money totals and stock counts are wrong
is stressful — but very fixable, and usually without a rewrite. Reading an
unfamiliar codebase fast and stabilizing the data-integrity parts is my
strong suit.

My background is full-stack TypeScript (Node/Express + React) with a lot of
time spent specifically on the bug class you're describing: payment totals and
stock counts going wrong almost always trace back to non-atomic updates or
float-based money math. I've fixed exactly these.

To give you a real answer rather than a guess: once you share repo access,
I'll spend a short paid diagnostic (1–2 hours) to pinpoint the payment-total
bug, then tell you honestly whether it's a quick fix or something deeper — with
a clear quote either way before I touch anything.

What's the single most painful symptom right now — the wrong totals, or the
stock mismatch? I'll start there.

— Hung
```
**Vì sao mạnh:** trấn an "fixable without rewrite", chẩn đoán đúng nguyên nhân thường gặp (non-atomic / float) → tạo niềm tin chuyên gia, đề xuất **paid diagnostic nhỏ** (giảm rủi ro 2 chiều), hỏi triệu chứng đau nhất.

---

## Khi bạn có JD thật
Dán JD vào chat, tôi viết proposal đo-ni-đóng-giày trong 1 phút theo công thức:
1. **2 câu đầu** = nhắc đúng pain trong JD (bằng từ của họ).
2. **1 case study** gần nhất (CS1–CS5 trong `02-case-studies.md`) + 1 con số nếu có.
3. **1 câu hỏi kỹ thuật** ép họ reply.
4. **Đề xuất bước nhỏ, ít rủi ro** (giao tuần 1 / phase cố định / paid diagnostic).
5. Ngắn 120–180 từ, ký "— Hung".
