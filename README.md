# BEN TRE SAFE TRAVEL

> Tài liệu này mô tả tổng quan, cấu trúc, chức năng, hướng dẫn cài đặt và đề xuất cải tiến cho dự án **BEN TRE SAFE TRAVEL**.

---

## 1. Tổng quan dự án

**BEN TRE SAFE TRAVEL** là một nền tảng hỗ trợ du lịch tại tỉnh Bến Tre (Việt Nam). Mục tiêu chính: giúp du khách khám phá địa điểm, lên lịch tham quan, đặt dịch vụ, nhận cảnh báo an toàn, và tiếp cận thông tin văn hóa — tất cả thông qua giao diện web/mobile kết hợp bản đồ tương tác và các tính năng thông minh (gợi ý, chatbot hỗ trợ, thông báo).

---

## 2. Giả định về nội dung trong file ZIP

(Dựa trên tên dự án và yêu cầu phân tích, tài liệu này giả định rằng file `BEN TRE SAFE TRAVEL.zip` chứa những phần sau — nếu thực tế khác, tài liệu có thể được chỉnh sửa tương ứng.)

* `frontend/` — mã nguồn giao diện (React, Next.js hoặc plain HTML/CSS/JS)
* `backend/` — API server (Node.js/Express, hoặc Python/Flask)
* `data/` — tệp dữ liệu địa điểm (JSON, GeoJSON, CSV)
* `assets/` — hình ảnh, video, icon, logo
* `docs/` — tài liệu hướng dẫn, sơ đồ, proposal
* `config/` — file cấu hình (env.example, config.json)
* `scripts/` — script hỗ trợ (migrate, seed, build)

---

## 3. Tính năng chính (kỳ vọng)

1. **Bản đồ tương tác**: hiển thị địa điểm tham quan, homestay, nhà hàng, tuyến đường tham quan (GeoJSON).
2. **Tìm & Lọc địa điểm**: theo loại (tham quan, ẩm thực, lưu trú), theo khoảng cách, theo đánh giá.
3. **Gợi ý hành trình**: tự động tạo lịch tham quan 1-3 ngày dựa trên sở thích và vị trí.
4. **Đặt dịch vụ / liên hệ**: đặt tour, liên hệ chủ dịch vụ hoặc chuyển hướng tới hệ thống đặt vé.
5. **Chatbot hỗ trợ**: trả lời thắc mắc du lịch (giờ mở cửa, giá vé, gợi ý).
6. **Hệ thống cảnh báo & an toàn**: thông báo thời tiết xấu, đường ngập, hay thay đổi lịch.
7. **Quản trị nội dung**: admin panel để thêm/sửa địa điểm, upload ảnh, phê duyệt review.

---

## 4. Kiến trúc hệ thống (proposal)

**Frontend** (client)

* Thư mục: `frontend/`
* Công nghệ: React hoặc Next.js (REST/GraphQL client), Mapbox/Leaflet/Google Maps SDK, TailwindCSS hoặc Bootstrap.
* Chức năng: bản đồ, tìm kiếm, profile user, quản lý lịch trình, UI/UX responsive.

**Backend** (API)

* Thư mục: `backend/`
* Công nghệ: Node.js + Express (hoặc NestJS) hoặc Python + Flask/FastAPI.
* Tính năng: Authentication (JWT), REST API endpoints cho địa điểm, booking, reviews, push notifications, admin endpoints.
* CSDL: PostgreSQL (hỗ trợ PostGIS nếu cần thao tác không gian), hoặc SQLite/MySQL cho biến thể nhẹ.

**Data & Storage**

* GeoJSON/CSV cho dữ liệu địa điểm trong `data/`.
* Hình ảnh lưu trên S3-compatible storage (MinIO / AWS S3) hoặc folder `assets/uploads` trong dev.

**AI & Chatbot**

* Module tích hợp OpenAI/Gemini/Claude (wrapper service trong `backend/services/aiService.js`) hoặc luồng webhooks cho chatbot.
* Lưu trữ logs/queries chatbot để cải thiện nội dung.

**Notification**

* Push notifications (Firebase Cloud Messaging) cho mobile/web.
* Email alerts (SendGrid, SMTP) cho booking/alert.

---

## 5. API endpoints (ví dụ)

> Lưu ý: các endpoint dưới đây mang tính minh họa — điều chỉnh theo mã nguồn thực tế.

* `GET /api/places` — lấy danh sách địa điểm (hỗ trợ query params: type, bbox, radius, q)
* `GET /api/places/:id` — lấy chi tiết địa điểm
* `POST /api/bookings` — tạo booking/tour
* `GET /api/user/:id/itinerary` — lấy lịch trình user
* `POST /api/auth/login` — đăng nhập (trả JWT)
* `POST /api/admin/places` — tạo địa điểm (admin)
* `POST /api/chat` — gửi câu hỏi cho chatbot (có thể proxy đến OpenAI)

---

## 6. Hướng dẫn cài đặt nhanh (dev)

> Giả định mã chia thành `frontend` và `backend`.

### Yêu cầu môi trường

* Node.js 18+ (frontend + backend)
* npm hoặc yarn
* PostgreSQL (nếu dùng) hoặc SQLite
* Map API keys (Mapbox/Google Maps) lưu trong `.env`

### Backend

```bash
cd backend
cp .env.example .env    # điền DB_URL, MAP_KEY, AI_API_KEY, JWT_SECRET
npm install
npm run migrate         # nếu có
npm run seed            # nếu có dữ liệu mẫu
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env    # điền REACT_APP_API_URL, MAP_KEY
npm install
npm run dev
```

---

## 7. File cấu trúc mẫu (minh họa)

```
BEN TRE SAFE TRAVEL/
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  └─ services/
│  └─ package.json
├─ backend/
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ models/
│  │  ├─ routes/
│  │  └─ services/
│  └─ package.json
├─ data/
│  ├─ places.geojson
│  └─ places.csv
├─ assets/
└─ docs/
   └─ architecture.md
```
