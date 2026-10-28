# AGENTS.md - Web CMS Admin & Management Rulebook (React 19 & Tailwind CSS v4)

## Mục lục

1. [Phạm vi & Ngăn xếp Công nghệ CMS (Tech Stack)](#1-phạm-vi--ngăn-xếp-công-nghệ-cms-tech-stack)
2. [Kiến trúc thư mục Module-based](#2-kiến-trúc-thư-mục-module-based)
3. [Quy chuẩn React 19](#3-quy-chuẩn-react-19)
4. [Quy chuẩn Tailwind CSS v4](#4-quy-chuẩn-tailwind-css-v4)
5. [Thiết kế UI/UX & Hệ màu Dashboard Quản trị](#5-thiết-kế-uiux--hệ-màu-dashboard-quản-trị)
6. [Cơ chế Xem trước Video (Video Preview Player - BẮT BUỘC)](#6-cơ-chế-xem-trước-video-video-preview-player---bắt-buộc)
7. [Tích hợp Trình phát Video Admin (Vidstack & HLS Preview Modal)](#7-tích-hợp-trình-phát-video-admin-vidstack--hls-preview-modal)
8. [Quy trình Upload Video Chunked Multipart dung lượng lớn (Direct MinIO S3)](#8-quy-trình-upload-video-chunked-multipart-dung-lượng-lớn-direct-minio-s3)
9. [Quản trị Phim & Tập phim (Movie & Episode Management)](#9-quản-trị-phim--tập-phim-movie--episode-management)
10. [Quản trị Người dùng & Phân quyền (User Ban & Role Management)](#10-quản-trị-người-dùng--phân-quyền-user-ban--role-management)
11. [Quản trị Gói VIP & Giao dịch PayOS (Membership & Transactions)](#11-quản-trị-gói-vip--giao-dịch-payos-membership--transactions)
12. [Quy tắc Kiểm tra và Tái sử dụng Component (DRY trong CMS)](#12-quy-tắc-kiểm-tra-và-tái-sử-dụng-component-dry-trong-cms)
13. [Tiêu chuẩn các UI Primitives dùng chung trong CMS](#13-tiêu-chuẩn-các-ui-primitives-dùng-chung-trong-cms)
14. [Quản lý Form Nhập liệu Phức tạp & Kéo thả (Drag-and-Drop)](#14-quản-lý-form-nhập-liệu-phức-tạp--kéo-thả-drag-and-drop)
15. [Quản lý Table, Lọc Dữ liệu & Phân trang trong CMS](#15-quản-lý-table-lọc-dữ-liệu--phân-trang-trong-cms)
16. [Quản lý State trong CMS (Local, URL & Redux Toolkit)](#16-quản-lý-state-trong-cms-local-url--redux-toolkit)
17. [Điều hướng & Phân quyền Admin (Protected Admin Route)](#17-điều-hướng--phân-quyền-admin-protected-admin-route)
18. [HTTP Client & Kết nối Mạng (Native Fetch - CẤM AXIOS)](#18-http-client--kết-nối-mạng-native-fetch---cấm-axios)
19. [Khớp nối Contract API Backend Spring Boot (ApiResponseDto)](#19-khớp-nối-contract-api-backend-spring-boot-apiresponsedto)
20. [Quản lý Biến môi trường & Cấu hình (Environment Config)](#20-quản-lý-biến-môi-trường--cấu-hình-environment-config)
21. [Quy chuẩn TypeScript & Strictness trong CMS](#21-quy-chuẩn-typescript--strictness-trong-cms)
22. [Tối ưu Hiệu năng CMS & Xử lý Dữ liệu lớn](#22-tối-ưu-hiệu-năng-cms--xử-lý-dữ-liệu-lớn)
23. [Xử lý Lỗi, Confirm Dialog & Thông báo Hệ thống](#23-xử-lý-lỗi-confirm-dialog--thông-báo-hệ-thống)
24. [Quy tắc Đặt tên (Naming Conventions)](#24-quy-tắc-đặt-tên-naming-conventions)
25. [CẤM TUYỆT ĐỐI TRONG CMS ADMIN](#25-cấm-tuyệt-đối-trong-cms-admin)
26. [Checklist Tự kiểm tra trước khi hoàn thành](#26-checklist-tự-kiểm-tra-trước-khi-hoàn-thành)

---

## 1. Phạm vi & Ngăn xếp Công nghệ CMS (Tech Stack)

Tài liệu này là quy chuẩn kỹ thuật bắt buộc áp dụng cho cổng **Hệ thống Quản Trị Nội Dung (CMS Admin Portal - frontend-cms-pj4)**.

- **React:** `^19.2.x` (Functional Components + Hooks chuẩn React 19).
- **Styling:** `Tailwind CSS ^4.3.x` (Cấu hình qua `@tailwindcss/vite`, CSS-first, không dùng file `tailwind.config.js`).
- **Build Tool:** `Vite ^8.x`.
- **TypeScript:** `~6.x` (Strict mode toàn diện, cấm dùng `any`).
- **Routing:** `react-router-dom ^7.x` (Quản lý URL Admin, Breadcrumb động, Phân trang và Bảo vệ quyền ADMIN).
- **Global State:** `@reduxjs/toolkit ^2.x` & `react-redux ^9.x` (Lưu trữ Admin Session, Tiến trình Upload hàng đợi).
- **Trình phát Video Xem trước (Preview):** **Vidstack Player (`@vidstack/react`)** hoặc lõi `hls.js` tích hợp trong Admin Modal để xem trước luồng HLS/MP4 ngay sau khi upload hoặc video đã có trên hệ thống.
- **Bộ Icon:** `lucide-react` (Đồng nhất nét vẽ 1.5 - 2px, kích thước chuẩn 16/18/20px).
- **HTTP Client:** Native `fetch` wrapper tập trung (`fetchClient.ts`). **CẤM TUYỆT ĐỐI AXIOS**.

---

## 2. Kiến trúc thư mục Module-based

Toàn bộ mã nguồn chia theo tính năng (Module-based). Mỗi module quản lý trọn vẹn UI quản trị, bảng biểu, modal và API service tương ứng.

```text
src/
├── app/                              # Khởi tạo toàn cục, Router Admin, Root Store
│   ├── App.tsx
│   ├── routes.tsx                    # Danh sách Route Admin
│   └── store.ts                      # Redux Toolkit store
│
├── modules/                          # Các Feature Module nghiệp vụ CMS
│   ├── dashboard/                    # Thống kê tổng quan: Số phim, User, Doanh thu VIP
│   │   ├── components/               # StatCard.tsx, RevenueChart.tsx
│   │   └── pages/                    # DashboardPage.tsx
│   │
│   ├── movies/                       # Quản trị Phim (CRUD, Xóa mềm, Khôi phục, Publish)
│   │   ├── components/               # MovieTable.tsx, MovieFormModal.tsx, MovieDetailDrawer.tsx
│   │   ├── pages/                    # AdminMoviePage.tsx
│   │   ├── services/                 # adminMovieService.ts
│   │   └── types/                    # movie.types.ts
│   │
│   ├── episodes/                     # Quản trị Tập phim (Dành cho Phim Bộ - Series)
│   │   ├── components/               # EpisodeTable.tsx, EpisodeFormModal.tsx
│   │   └── services/                 # adminEpisodeService.ts
│   │
│   ├── upload/                       # Upload Video Chunked Multipart dung lượng lớn
│   │   ├── components/               # ChunkUploadModal.tsx, UploadProgressBar.tsx, LiveLogConsole.tsx
│   │   ├── hooks/                    # useChunkedUpload.ts
│   │   └── services/                 # uploadService.ts
│   │
│   ├── preview/                      # Xem trước Video (Preview Player Modal)
│   │   ├── components/               # VideoPreviewModal.tsx, QualityInspector.tsx
│   │   └── hooks/                    # useVideoPreview.ts
│   │
│   ├── users/                        # Quản trị Người dùng (Xem danh sách, Khóa/Mở Ban, Đổi Role)
│   │   ├── components/               # UserTable.tsx, UserFilterBar.tsx, BanUserModal.tsx
│   │   ├── pages/                    # AdminUserPage.tsx
│   │   └── services/                 # adminUserService.ts
│   │
│   ├── membership/                   # Quản trị Gói VIP (CRUD Gói, Ẩn/Hiện gói)
│   │   ├── components/               # PlanTable.tsx, PlanFormModal.tsx
│   │   └── services/                 # adminPlanService.ts
│   │
│   └── payments/                     # Quản lý Giao dịch PayOS, Đối soát đơn PENDING
│       ├── components/               # TransactionTable.tsx, ReconcileButton.tsx
│       └── services/                 # adminPaymentService.ts
│
├── components/                       # Shared Components trong CMS
│   ├── ui/                           # UI Primitives: Button, Input, Modal, Table, Badge, Dropdown, Skeleton
│   ├── layout/                       # AdminLayout, AdminSidebar, AdminHeader, Breadcrumb
│   └── feedback/                     # ConfirmDialog, LoadingOverlay, ToastNotification, EmptyState
│
├── api/                              # Network Layer
│   └── fetchClient.ts                # Wrapper native fetch (Bearer token, refresh token)
│
├── config/                           # Biến môi trường & cấu hình hằng số
│   └── env.ts                        # Wrapper an toàn cho import.meta.env
│
├── types/                            # Kiểu dữ liệu dùng chung (API response, Pagination, Enums)
│   └── common.types.ts
│
├── utils/                            # Helper functions (format dung lượng file MB/GB, format tiền, ngày)
└── index.css                         # @import "tailwindcss"; + Custom theme tokens
```

---

## 3. Quy chuẩn React 19

1. **Truyền `ref` trực tiếp:** Trong React 19, `ref` là prop thông thường. **Không dùng `forwardRef`**.
   ```tsx
   // ✅ Đúng (React 19)
   interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
     label?: string;
     ref?: React.Ref<HTMLInputElement>;
   }
   export const Input = ({ label, ref, ...props }: InputProps) => (
     <div>
       {label && (
         <label className="block text-sm text-slate-300 mb-1">{label}</label>
       )}
       <input ref={ref} {...props} />
     </div>
   );
   ```
2. **Không lạm dụng `useMemo` / `useCallback`:** React 19 có compiler tự động tối ưu render. Chỉ dùng khi thực sự có tính toán lọc mảng lớn (> 1000 items) hoặc giữ tham chiếu object.
3. **Async Transition & Form Actions:** Dùng `useActionState` và `useTransition` cho các tác vụ lưu dữ liệu hoặc cập nhật trạng thái trong Admin để tự động kiểm soát cờ `isPending`.

---

## 4. Quy chuẩn Tailwind CSS v4

1. **Khai báo CSS-first:** Tailwind v4 dùng `@import "tailwindcss";` trong `src/index.css`.
2. **Cấu hình Design Tokens bằng `@theme`:** Không tạo file `tailwind.config.js`. Mọi định nghĩa màu hoặc font đều khai báo trong CSS:

   ```css
   @import "tailwindcss";

   @theme {
     --font-sans:
       "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
       sans-serif;
     --color-admin-primary: #06b6d4; /* Cyan-500: Nổi bật hành động quản trị */
     --color-admin-bg: #090d16; /* Slate-950 pha xám than: Dịu mắt */
     --color-admin-card: #131c2e; /* Slate-900 / Container */
     --color-admin-border: #1e293b; /* Slate-800: Viền chia ô bảng */
   }
   ```

3. **Không dùng CSS inline:** Trừ các trường hợp giá trị động bất khả kháng (như phần trăm thanh tiến trình upload `style={{ width: `${uploadProgress}%` }}`).

---

## 5. Thiết kế UI/UX & Hệ màu Dashboard Quản trị

Tuân thủ nguyên tắc: **Giao diện hài hòa, thân thiện, dễ nhìn, không quá tối và không quá sáng**.

### 5.1. Bảng màu chuẩn cho CMS (Đồng bộ theo COLOR_PALETTE.md)

- **Nền chính (Workspace Background):** `bg-[#090d16]` hoặc `bg-slate-950` (#020617) ở Dark Mode; `#f8fafc` ở Light Mode (`bg-[#f8fafc] dark:bg-[#090d16]`).
  - ❌ **Tránh:** Màu đen tuyệt đối `#000000` (làm mất độ phân cấp giữa Sidebar, Header và Bảng dữ liệu).
  - ❌ **Tránh:** Nền trắng toát `#ffffff` (gây chói lóa mắt khi quản trị viên làm việc liên tục nhiều giờ).
- **Khung chứa Bảng & Thẻ thống kê (Cards & Tables):** `bg-white dark:bg-[#131c2e]` kết hợp viền mờ `border-slate-200 dark:border-[#1e293b]`.
- **Màu chữ chuẩn hóa (Đa Giao diện Sáng / Tối theo COLOR_PALETTE.md):**
  - **Tiêu đề (Headings):** `text-slate-900 dark:text-slate-100` (Sáng: `#0f172a`, Tối: `#f8fafc`).
  - **Nội dung chính & Bảng biểu (Body / Table Data):** `text-slate-700 dark:text-slate-300` (Sáng: `#334155`, Tối: `#cbd5e1` - chuẩn dịu mắt, tránh tương phản gắt).
  - **Nhãn Form (Labels):** `text-slate-600 dark:text-slate-400` (Sáng: `#475569`, Tối: `#94a3b8`).
  - **Muted / Chú thích / Mã ID:** `text-slate-400 dark:text-slate-500` (Sáng: `#94a3b8`, Tối: `#64748b`).
  - **Chữ trong ô nhập (Input Text):** `text-slate-800 dark:text-slate-100`.
- **Màu điểm nhấn & Trạng thái (Admin Accents & Status):**
  - Nút thêm mới / Xuất bản: `bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold`.
  - Nút hành động chính (`admin-blue`): `bg-[#002b80] hover:bg-[#00246b] text-white font-semibold`.
  - Khóa tài khoản / Xóa (Danger): `bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25` (Dark) hoặc `bg-rose-50 text-rose-700 border-rose-200` (Light).
  - Trạng thái Đã duyệt / Active (Success): `bg-emerald-500/15 text-emerald-400 border border-emerald-500/30` (Dark) hoặc `bg-emerald-50 text-emerald-700 border-emerald-200` (Light).
  - Trạng thái Chờ xử lý / Draft (Warning): `bg-amber-500/15 text-amber-400 border border-amber-500/30` (Dark) hoặc `bg-amber-50 text-amber-700 border-amber-200` (Light).
  - Thông tin / HLS Inspector (Info): `bg-cyan-500/15 text-cyan-400 border border-cyan-500/30` (Dark) hoặc `bg-cyan-50 text-cyan-700 border-cyan-200` (Light).
  - Gói VIP / Doanh thu (Purple): `bg-purple-500/15 text-purple-400 border border-purple-500/30` (Dark) hoặc `bg-purple-50 text-purple-700 border-purple-200` (Light).

### 5.2. Hiệu ứng & Tương tác trong CMS

- Hàng trong bảng (Table Row): Luôn có hiệu ứng `hover:bg-slate-800/40 dark:hover:bg-slate-800/40 hover:bg-slate-100/70 transition-colors`.
- Cột thao tác (Actions): Các nút Xem trước, Sửa, Xóa phải có tooltip giải thích rõ chức năng.

### 5.3. Hỗ trợ Đa Giao diện Sáng / Tối (Dark / Light Mode)

- **Mặc định toàn hệ thống**: Sử dụng **Dark Mode (Neo-Slate Cyberpunk)** đồng bộ từ Trang Đăng nhập (`LoginPage`) đến toàn bộ các trang Quản trị (`Dashboard`, `Movies`, v.v.). Tuyệt đối không để trang đăng nhập bị sáng chói lệch tông so với bên trong hệ thống.
- **Cơ chế Chuyển đổi Giao diện (Theme Toggle)**:
  - Cung cấp nút chuyển đổi Theme (icon Mặt trời `Sun` / Mặt trăng `Moon`) tại thanh Header Admin và góc trên Trang Đăng nhập.
  - Lưu tùy chọn vào `localStorage.getItem('theme')` (mặc định khởi tạo là `'dark'`).
  - Gắn class `.dark` vào thẻ gốc `<html>` để kích hoạt các utility `dark:*` của Tailwind CSS v4.
  - **Chế độ Tối (Dark Mode - Mặc định)**: Nền than đêm `#090d16`, card container `#131c2e`, viền mờ `border-slate-800` kết hợp ánh neon xanh `border-cyan-500/30`, chữ sáng dịu mắt `text-slate-100`.
  - **Chế độ Sáng (Light Mode)**: Nền sạch `#f8fafc`, card trắng tinh gọn `bg-white`, viền `border-slate-200`, chữ `text-slate-900`.

### 5.4. Quy chuẩn Font chữ & Cỡ chữ (Typography Hierarchy cho CMS Admin)

- **Font Family chính thức**: **`Inter`** (Font sans-serif hình học hiện đại, hiển thị bảng biểu số liệu rõ nét, hỗ trợ tiếng Việt tối ưu chuyên biệt cho UI Dashboard quản trị).
  - Cấu hình CSS: `font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`
- **Bảng Thang Cỡ Chữ Chuẩn CMS (Typography Scale Matrix)**:

| Phân cấp UI                     | Class Tailwind                     | Kích thước / Line-height | Độ đậm (Weight) | Màu sắc (Sáng / Tối)                                   | Vị trí áp dụng                                                  |
| :------------------------------ | :--------------------------------- | :----------------------- | :-------------- | :----------------------------------------------------- | :-------------------------------------------------------------- |
| **Page Title (H1)**             | `text-2xl`                         | 24px / 32px              | `font-bold`     | `text-slate-900 dark:text-slate-100`                   | Tiêu đề chính trang (Movies, Episodes, Users, Dashboard...)     |
| **Section / Modal Title (H2)**  | `text-lg`                          | 18px / 28px              | `font-semibold` | `text-slate-900 dark:text-slate-100`                   | Tiêu đề Modal, Drawer chi tiết, Tiêu đề Thẻ thống kê lớn        |
| **Card / Subheading (H3)**      | `text-base`                        | 16px / 24px              | `font-semibold` | `text-slate-800 dark:text-slate-200`                   | Tiêu đề nhóm bộ lọc, Nhóm cấu hình nhập liệu trong Form         |
| **Body & Table Data**           | `text-sm`                          | 14px / 20px              | `font-normal`   | `text-slate-700 dark:text-slate-300`                   | **Chuẩn vàng CMS**: Dữ liệu hàng bảng, text nhập input, tóm tắt |
| **Table Header (`<th>`)**       | `text-xs uppercase tracking-wider` | 12px / 16px              | `font-semibold` | `text-slate-500 dark:text-slate-400`                   | Tiêu đề các cột dữ liệu trong Table                             |
| **Form Label**                  | `text-sm`                          | 14px / 20px              | `font-medium`   | `text-slate-600 dark:text-slate-300`                   | Nhãn form phía trên các ô input nhập liệu                       |
| **Caption / Help Text / Error** | `text-xs`                          | 12px / 16px              | `font-normal`   | `text-slate-400 dark:text-slate-500` / `text-rose-500` | Ghi chú hướng dẫn, dòng báo lỗi validate form, timestamp        |
| **Badge / Status Tag**          | `text-xs` hoặc `text-[11px]`       | 11-12px                  | `font-medium`   | Theo biến màu trạng thái                               | Nhãn trạng thái (Published, Draft, Active, Banned, VIP)         |

---

## 6. Cơ chế Xem trước Video (Video Preview Player - BẮT BUỘC)

Admin CMS bắt buộc phải có tính năng **Xem trước Video** trong 2 trường hợp cụ thể:

### 6.1. Xem trước Ngay Khi Upload Thành Công (Instant Post-Upload Preview)

- Ngay sau khi quá trình Upload Chunked hoàn tất (và Backend kích hoạt FFmpeg hoàn tất):
- Admin Console hiển thị ngay nút **"Xem trước Video vừa đăng (Preview Uploaded Video)"**.
- Bấm vào sẽ mở modal hiển thị video để Admin kiểm tra ngay lập tức:
  - Hình ảnh có bị vỡ nét hay giật khung hình không?
  - Âm thanh có khớp với hình ảnh (Audio Sync) không?
  - Thời lượng video (Duration) có chính xác với tệp gốc không?

### 6.2. Xem trước Video Đã Có Trên Hệ Thống / Đã Xuất Bản (System Video Preview)

- Tại bảng danh sách Phim (`AdminMoviePage`) và bảng danh sách Tập phim (`AdminEpisodePage`):
- Mỗi hàng đều có nút icon Play **"Xem trước (Preview)"**.
- Khi Admin bấm vào:
  - Mở `VideoPreviewModal.tsx`.
  - Nạp đường dẫn file luồng HLS `master.m3u8` (hoặc file MP4 gốc) kèm `playbackToken`.
  - Cho phép Admin chuyển đổi kiểm tra từng mức phân giải (`1080p`, `720p`, `480p`).
  - Cho phép Admin kiểm tra trước khi bấm nút **"Xuất bản phim (Publish Movie / Episode)"** ra ngoài Web Client.

---

## 7. Tích hợp Trình phát Video Admin (Vidstack & HLS Preview Modal)

1. **Sử dụng Vidstack Player (`@vidstack/react`) hoặc HLS Modal:**
   - Đóng gói nội bộ (Local Bundle qua npm), **CẤM** nạp script từ CDN jsdelivr để đảm bảo tính an toàn và khả năng hoạt động ổn định trên môi trường nội bộ.
2. **Cấu trúc Component `VideoPreviewModal.tsx` chuẩn:**
   - Header Modal: Tên phim, Tập số mấy, Mã video ID, Trạng thái transcode.
   - Body Modal: Khung phát video tỷ lệ chuẩn 16:9 với đầy đủ thanh điều khiển:
     - Nút Play/Pause, Âm lượng, Thanh tua timeline.
     - Menu đổi chất lượng (Quality Selector): Kiểm tra xem FFmpeg đã tạo đủ các mức phân giải chưa.
     - Nút tua nhanh 10 giây để lướt kiểm tra các đoạn khác nhau của phim.
   - Footer Modal: Nút "Đóng", nút "Mở toàn màn hình", và nút tắt/bật xuất bản nhanh (`Publish Toggle`).

---

## 8. Quy trình Upload Video Chunked Multipart dung lượng lớn (Direct MinIO S3)

1. **Không gửi file lớn qua Backend Spring Boot:** Upload trực tiếp từ Browser lên MinIO S3 để tránh nghẽn băng thông và tràn RAM server.
2. **Quy trình 4 bước chuẩn:**
   - **Bước 1: Khởi tạo (Initiate):** Gọi API Backend xin danh sách Presigned URLs cho từng chunk (mỗi chunk 16MB) dựa trên tổng kích thước file.
   - **Bước 2: Tải lên trực tiếp (Direct PUT):** Dùng native `fetch(url, { method: 'PUT', body: chunkBlob })` tải từng chunk trực tiếp lên MinIO.
   - **Bước 3: Hiển thị Tiến trình Thời gian thực:**
     - Thanh phần trăm: `(uploadedBytes / totalBytes) * 100%`.
     - Tốc độ tải (Upload Speed): `MB/s`.
     - Thời gian còn lại ước tính (ETA).
     - Khung nhật ký trực tiếp (Live Log Console): Ghi nhận chi tiết từng chunk đã xong.
   - **Bước 4: Hoàn tất (Complete):** Gọi Backend API hoàn tất multipart để Backend gộp file và kích hoạt FFmpeg transcode sang định dạng HLS `.m3u8`.
   - **Bước 5: Kích hoạt Xem trước:** Mở Modal cho Admin xem trước video ngay khi có tín hiệu transcode sẵn sàng.

---

## 9. Quản trị Phim & Tập phim (Movie & Episode Management)

1. **Quản trị Phim (Admin Movie):**
   - Tạo mới / Chỉnh sửa thông tin phim: Tên tiếng Việt, Tên gốc, Slug, Thể loại (Genre), Loại phim (`SINGLE` / `SERIES`), Quốc gia, Năm phát hành, Giới hạn tuổi.
   - Upload ảnh Poster (tỷ lệ 2:3) và Backdrop (tỷ lệ 16:9) trực tiếp lên S3 bucket.
   - Xóa mềm (Soft Delete) và Khôi phục (Restore) phim.
   - Bật / Tắt trạng thái xuất bản (`isPublished`).
2. **Quản trị Tập phim (Admin Episode):**
   - Danh sách tập phim theo Phim bộ, sắp xếp theo thứ tự số tập (`episodeNumber`).
   - Upload video cho từng tập kèm ảnh thumbnail tập phim.
   - Xem trước video của từng tập qua `VideoPreviewModal`.

---

## 10. Quản trị Người dùng & Phân quyền (User Ban & Role Management)

1. **Danh sách Người dùng:** Hiển thị Email, Họ tên, Vai trò (`USER` / `ADMIN`), Trạng thái (`ACTIVE` / `BANNED`), Ngày tạo.
2. **Khóa / Mở khóa Tài khoản (Toggle Ban):**
   - Khi bấm "Khóa tài khoản", bắt buộc mở `ConfirmDialog` yêu cầu nhập lý do khóa.
   - Khi tài khoản bị khóa, Backend sẽ tự động thu hồi toàn bộ Refresh Token của User đó.

---

## 11. Quản trị Gói VIP & Giao dịch PayOS (Membership & Transactions)

1. **Quản lý Gói VIP:** Thêm / Sửa gói, Đặt giá tiền (VNĐ), Số ngày sử dụng, Quyền xem 1080p/4K, Ẩn/Hiện gói trên Web Client.
2. **Theo dõi Giao dịch PayOS:** Xem danh sách đơn thanh toán, Mã đơn, Số tiền, Trạng thái (`PAID`, `PENDING`, `CANCELLED`).
3. **Nút Đối soát thủ công (Reconcile Button):** Cho phép Admin bấm kiểm tra lại trạng thái đơn hàng từ PayOS nếu webhook bị chậm trễ.

---

## 12. Quy tắc Kiểm tra và Tái sử dụng Component (DRY trong CMS)

1. **Nguyên tắc "Tìm trước khi tạo":** Khi cần bất kỳ thành phần nào, bắt buộc kiểm tra thư mục `src/components/ui/` trước.
2. **Ưu tiên mở rộng qua Props/Variants:**
   - Cần nút màu đỏ? Dùng `<Button variant="danger">`.
   - Cần nút nhỏ? Dùng `<Button size="sm">`.
   - **CẤM TUYỆT ĐỐI**: Tạo `DeleteMovieButton.tsx`, `DeleteUserButton.tsx`, `SaveEpisodeButton.tsx` (dùng chung `Button.tsx`).
3. **Phân định ranh giới:**
   - Component chung (`src/components/ui/`): Không chứa bất kỳ logic gọi API hay nghiệp vụ của một module cụ thể.
   - Component nghiệp vụ (`src/modules/<feature>/components/`): Nhận dữ liệu của module và lắp ghép từ các component UI chung.

---

## 13. Tiêu chuẩn các UI Primitives dùng chung trong CMS

Mọi dự án CMS phải có các UI Primitives chuẩn trong `src/components/ui/`:

- **Button:** Hỗ trợ variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), sizes (`sm`, `md`, `lg`), và prop `isLoading`.
- **Input / Textarea:** Hỗ trợ nhãn `label`, dòng báo lỗi `error`, icon đầu/cuối `leftIcon`/`rightIcon`.
- **Select / Dropdown:** Giao diện đồng bộ dark slate, hỗ trợ tìm kiếm option bên trong nếu danh sách dài.
- **Table:** Khung bảng dữ liệu chuẩn gồm TableHeader, TableBody, TableRow, TableCell với thanh phân trang ở footer.
- **Modal / Dialog / Drawer:** Có animation mở mượt mà, hỗ trợ cả dạng Modal chính giữa màn hình hoặc Drawer trượt từ cạnh phải (rất tiện cho xem chi tiết phim/user).
- **Badge:** Hiển thị trạng thái phân loại (`VIP`, `Free`, `Published`, `Draft`, `Banned`, `Active`).
- **Skeleton:** Dùng làm placeholder nhấp nháy (`animate-pulse bg-slate-850`) khi dữ liệu bảng đang tải.

---

## 14. Quản lý Form Nhập liệu Phức tạp & Kéo thả (Drag-and-Drop)

1. **Kéo thả File Upload (Drag-and-Drop Dropzone):**
   - Vùng kéo thả file video MP4 hoặc ảnh Poster có viền nét đứt `border-2 border-dashed border-slate-700 hover:border-cyan-500`.
   - Kiểm tra định dạng file (chỉ cho phép `.mp4` cho video, `.jpg`/`.png`/`.webp` cho ảnh) trước khi nhận file.
2. **Hiển thị lỗi rõ ràng:** Lỗi nhập liệu phải hiển thị ngay dưới ô Input màu `text-rose-400 text-xs mt-1`, viền input đổi sang `border-rose-500`.
3. **Khóa nút khi Submit:** Tự động vô hiệu hóa nút Submit khi đang gửi dữ liệu lên server.

---

## 15. Quản lý Table, Lọc Dữ liệu & Phân trang trong CMS

1. **Đồng bộ Filter lên URL (Query Params):**
   - Các tham số phân trang `page`, `limit`, tìm kiếm `search`, lọc `status`, `genre` phải được đồng bộ với URL qua `useSearchParams` để khi F5 không bị mất trạng thái lọc.
2. **Debounce Tìm kiếm:** Ô tìm kiếm tên phim hoặc email người dùng phải có debounce **300ms - 500ms** trước khi gọi API tìm kiếm.
3. **Empty Table State:** Khi mảng dữ liệu rỗng, Table bắt buộc render 1 dòng duy nhất chiếm toàn bộ `colSpan` hiển thị icon rỗng + thông báo _"Không tìm thấy dữ liệu phù hợp"_.

---

## 16. Quản lý State trong CMS (Local, URL & Redux Toolkit)

- **Local State (`useState`):** Bật/tắt modal, drawer chi tiết, form nhập liệu tạm thời.
- **URL State (`searchParams`):** Trang hiện tại, từ khóa tìm kiếm, bộ lọc trạng thái.
- **Redux Toolkit (`src/app/store.ts`):** Chỉ dùng cho dữ liệu chia sẻ toàn CMS:
  - Thông tin Admin đang đăng nhập (`authSlice`).
  - Hàng đợi Upload video nền (`uploadQueueSlice`): Cho phép upload video ở góc dưới màn hình trong khi Admin vẫn lướt xem các trang khác.
- **Cấm:** Không đưa toàn bộ danh sách dữ liệu từ API vào Redux Store nếu danh sách đó chỉ sử dụng trên 1 màn hình duy nhất.

---

## 17. Điều hướng & Phân quyền Admin (Protected Admin Route)

1. **Role Guard Bắt buộc:** Bọc toàn bộ các trang Admin bằng `ProtectedRoute` kiểm tra quyền `ADMIN`:
   ```tsx
   <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
     <Route path="/admin" element={<DashboardPage />} />
     <Route path="/admin/movies" element={<AdminMoviePage />} />
     <Route path="/admin/episodes" element={<AdminEpisodePage />} />
     <Route path="/admin/users" element={<AdminUserPage />} />
   </Route>
   ```
2. **Nếu chưa đăng nhập hoặc không phải ADMIN:** Tự động chuyển hướng về trang `/login` hoặc hiển thị trang `403 Forbidden`.

---

## 18. HTTP Client & Kết nối Mạng (Native Fetch - CẤM AXIOS)

1. **Cấm tuyệt đối thư viện Axios:** Không cài `axios` vào `package.json`.
2. **Tập trung tại `src/api/fetchClient.ts`:**
   - Tự động gắn header `Authorization: Bearer <accessToken>`.
   - Bắt buộc gắn `credentials: 'include'` để trao đổi HttpOnly Refresh Token Cookie.
   - Bắt mã lỗi `401 Unauthorized` $\rightarrow$ Tự động gọi endpoint `/auth/refresh-token` $\rightarrow$ Lưu `accessToken` mới và gửi lại request cũ.
   - Nếu refresh thất bại $\rightarrow$ Đăng xuất, xóa storage và chuyển hướng về trang đăng nhập.

---

## 19. Khớp nối Contract API Backend Spring Boot (ApiResponseDto)

Backend Spring Boot trả về cấu trúc phẳng (`ApiResponseDto`):

```typescript
export interface ApiResponse<T> {
  status: "success" | "error";
  code: string;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  } | null;
  errors?: Record<string, string[]> | null;
  timestamp: string;
}
```

- Mọi hàm trong `service` phải unwrap dữ liệu và trả về kiểu dữ liệu đích (`Promise<T>` hoặc `Promise<ApiResponse<T>>`).
- Xử lý mã lỗi chuẩn hóa theo `code` (ví dụ: `ADMIN_UNAUTHORIZED`, `MOVIE_NOT_FOUND`).

---

## 20. Quản lý Biến môi trường & Cấu hình (Environment Config)

1. **Tập trung tại `src/config/env.ts`:**
   ```typescript
   export const env = {
     apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3004/api/v1",
     appName: import.meta.env.VITE_APP_NAME || "Movie CMS Admin",
     storageBaseUrl: import.meta.env.VITE_STORAGE_BASE_URL || "",
   } as const;
   ```
2. **Nguyên tắc an toàn:**
   - Mọi biến frontend đều phải có tiền tố `VITE_`.
   - **CẤM TUYỆT ĐỐI** lưu trữ secret key, private key, payment secret trong code frontend.

---

## 21. Quy chuẩn TypeScript & Strictness trong CMS

1. **Cấm dùng `any`:** Nếu dữ liệu chưa xác định rõ, dùng `unknown` và viết type-guard để kiểm tra.
2. **Khai báo đầy đủ kiểu cho Form và Response DTO:**
   ```typescript
   export interface RequestCreateMovieDto {
     title: string;
     slug: string;
     description: string;
     type: "SINGLE" | "SERIES";
     genreIds: string[];
   }
   ```
3. **Không ép kiểu mù quáng (`as unknown as TargetType`).**

---

## 22. Tối ưu Hiệu năng CMS & Xử lý Dữ liệu lớn

1. **Lazy Loading Admin Pages:** Áp dụng `React.lazy` và `Suspense` cho các trang quản trị để trang Dashboard tải nhanh nhất có thể.
2. **Dọn dẹp Bộ nhớ khi Upload:** Hủy các luồng `AbortController` của fetch nếu Admin bấm nút "Hủy Upload".
3. **Giải phóng Player:** Hủy phiên phát video `previewPlayer.destroy()` khi Admin đóng Modal xem trước.

---

## 23. Xử lý Lỗi, Confirm Dialog & Thông báo Hệ thống

1. **Xác nhận Hành động Nguy hiểm:** Các thao tác Xóa phim, Khóa tài khoản, Hủy gói bắt buộc phải qua `ConfirmDialog` (nút xác nhận màu đỏ `variant="danger"`).
2. **Toast Thông báo Rõ Ràng:** Hiển thị Toast thông báo ở góc trên bên phải màn hình:
   - Thành công: Màu xanh ngọc `emerald-500`.
   - Thất bại: Màu đỏ hoa hồng `rose-500` kèm nội dung lỗi cụ thể từ Backend.

---

## 24. Quy tắc Đặt tên (Naming Conventions)

| Đối tượng               | Quy tắc                             | Ví dụ                                         |
| :---------------------- | :---------------------------------- | :-------------------------------------------- |
| **Component File**      | PascalCase                          | `MovieTable.tsx`, `VideoPreviewModal.tsx`     |
| **Custom Hook**         | camelCase (bắt đầu bằng `use`)      | `useChunkedUpload.ts`, `useVideoPreview.ts`   |
| **Service File**        | camelCase (kết thúc bằng `Service`) | `adminMovieService.ts`, `adminUserService.ts` |
| **Interface / Type**    | PascalCase                          | `MovieItemDto`, `ApiResponse<T>`              |
| **Hằng số / Enum**      | UPPER_SNAKE_CASE                    | `CHUNK_SIZE_MB`, `MOVIE_TYPES`                |
| **CSS Utility Classes** | kebab-case (chuẩn Tailwind)         | `bg-slate-900`, `text-cyan-400`               |

---

## 25. CẤM TUYỆT ĐỐI TRONG CMS ADMIN

- ❌ **CẤM cài đặt và sử dụng Axios** (bắt buộc dùng `fetchClient`).
- ❌ **CẤM bỏ qua bước Xem trước Video:** Khi upload xong hoặc quản lý tập phim, bắt buộc phải có nút và Modal xem trước video để kiểm tra chất lượng trước khi Publish.
- ❌ **CẤM chèn thẻ `<script src="...jsdelivr...">` động** để nạp player (bắt buộc đóng gói qua npm để tránh sập CDN).
- ❌ **CẤM sử dụng màu nền đen xì `#000000` hoặc màu trắng toát** gây chói và mỏi mắt quản trị viên.
- ❌ **CẤM hardcode URL API** trong components hoặc services.
- ❌ **CẤM dùng kiểu `any`** trong TypeScript.
- ❌ **CẤM sao chép component trùng lặp** chỉ để thay đổi 1-2 class màu sắc.
- ❌ **CẤM mutate state trực tiếp** (như `state.push(...)`).
- ❌ **CẤM tạo file cấu hình `tailwind.config.js`** (Tailwind v4 cấu hình trực tiếp qua CSS `@theme`).

---

## 26. Checklist Tự kiểm tra trước khi hoàn thành

Trước khi hoàn thành bất kỳ chức năng CMS nào, phải xác nhận:

- [ ] Đã kiểm tra component dùng chung trong `components/ui/` trước khi viết mới chưa?
- [ ] Giao diện CMS có đạt chuẩn màu Slate Dashboard trực quan, dịu mắt, phân cấp rõ ràng?
- [ ] Đã tích hợp tính năng **Xem trước Video (Video Preview)** cho video vừa upload và video có sẵn chưa?
- [ ] Có gọi API thông qua `fetchClient` (tuyệt đối không dùng `axios`) không?
- [ ] Các hành động xóa / khóa có hộp thoại xác nhận `ConfirmDialog` chưa?
- [ ] Đã kiểm tra hiển thị responsive bảng dữ liệu trên desktop và tablet chưa?
- [ ] Không có cảnh báo linter (`oxlint` hoặc `tsc -b`) và không còn kiểu `any`?
