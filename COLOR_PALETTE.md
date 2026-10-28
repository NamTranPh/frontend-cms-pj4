# BẢNG MÀU DỰ ÁN CMS (COLOR PALETTE & DESIGN SYSTEM)

### Hệ thống Quản trị Streaming & Video CMS (Hỗ trợ Đa Giao diện Sáng & Tối)

Tài liệu này tổng hợp toàn bộ bảng màu chuẩn hóa cho cả **Chế độ Tối (Dark Mode - Neo-Slate Cyberpunk)** và **Chế độ Sáng (Light Mode - Clean Tech Admin)**, bao gồm các biến CSS Design Tokens (Tailwind CSS v4), bảng so sánh màu sắc, quy chuẩn Typography, Nút bấm và Thư viện Thông báo Alert / Toast (`react-toastify`).

---

## 1. Triết Lý Thiết Kế (Design Philosophy)

- **Chế độ Tối (Dark Mode - Mặc định toàn hệ thống)**:
  - Sử dụng tông màu **Neo-Slate Cyberpunk** (xám than pha ánh xanh đêm `#090d16` / `#131c2e`).
  - **Không dùng màu đen tuyệt đối (`#000000`)**: Giúp giữ độ sâu khối giao diện, chống mỏi mắt cho quản trị viên khi điều hành hệ thống nhiều giờ liền.
  - Điểm nhấn phát sáng nhẹ (Cyan `#06b6d4`, Blue `#1d4ed8`, Purple `#a855f7`).
- **Chế độ Sáng (Light Mode - Clean Tech Admin)**:
  - Sử dụng nền sáng trắng ngà dịu mắt (`#f8fafc`), bề mặt thẻ trắng tinh (`#ffffff`), viền chia ô xám nhạt (`#e2e8f0`).
  - **Không dùng nền trắng toát lóa mắt**: Đảm bảo độ tương phản chữ rõ nét đạt chuẩn WCAG AA/AAA.
  - Tông điểm nhấn xanh đậm công nghệ (`#002b80` / `#1d4ed8`).
- **Cơ chế chuyển đổi (Theme Switcher)**:
  - Đồng bộ tự động qua class `.dark` trên thẻ gốc `<html>`.
  - Lưu trữ trạng thái vào `localStorage.getItem('theme')`.

---

## 2. Bảng So Sánh Đối Chiếu Hệ Màu (Dark vs Light Comparison Matrix)

| Thành phần UI                      | Chế độ Tối (Dark Mode - Mặc định) | Chế độ Sáng (Light Mode)                 | Class Tailwind tương ứng                            |
| :--------------------------------- | :-------------------------------- | :--------------------------------------- | :-------------------------------------------------- |
| **Nền chính (Workspace Bg)**       | `#090d16` (Deep Charcoal Slate)   | `#f8fafc` (Soft White Slate)             | `bg-[#f8fafc] dark:bg-[#090d16]`                    |
| **Bề mặt Thẻ / Bảng (Card/Panel)** | `#131c2e` (Slate-900 pha xanh)    | `#ffffff` (Pure White)                   | `bg-white dark:bg-[#131c2e]`                        |
| **Sidebar Navigation**             | `#0c121e` (Dark Slate)            | `#ffffff` (Pure White)                   | `bg-white dark:bg-[#0c121e]`                        |
| **Header Topbar**                  | `#0c121e/95` (Kính mờ tối)        | `#ffffff/95` (Kính mờ sáng)              | `bg-white/95 dark:bg-[#0c121e]/95`                  |
| **Đường viền (Borders)**           | `#1e293b` (Slate-800)             | `#e2e8f0` (Slate-200)                    | `border-slate-200 dark:border-[#1e293b]`            |
| **Viền Glow / Focus**              | `rgba(6, 182, 212, 0.4)` (Cyan)   | `#002b80` / `#2563eb` (Deep Blue)        | `focus:border-[#002b80] dark:focus:border-cyan-400` |
| **Tiêu đề (Headings)**             | `#f8fafc` (`text-slate-100`)      | `#0f172a` (`text-slate-900`) / `#002b80` | `text-slate-900 dark:text-slate-100`                |
| **Nội dung chính (Body Text)**     | `#cbd5e1` (`text-slate-300`)      | `#334155` (`text-slate-700`)             | `text-slate-700 dark:text-slate-300`                |
| **Nhãn Form (Labels)**             | `#94a3b8` (`text-slate-400`)      | `#475569` (`text-slate-600`)             | `text-slate-600 dark:text-slate-400`                |
| **Muted / Chú thích / ID**         | `#64748b` (`text-slate-500`)      | `#94a3b8` (`text-slate-400`)             | `text-slate-400 dark:text-slate-500`                |
| **Ô nhập (Input Background)**      | `#0f172a` (`bg-slate-900/90`)     | `#ffffff` (Trắng viền slate-300)         | `bg-white dark:bg-slate-900/90`                     |
| **Màu chữ ô nhập**                 | `#f1f5f9` (`text-slate-100`)      | `#1e293b` (`text-slate-800`)             | `text-slate-800 dark:text-slate-100`                |

---

## 3. Màu Sắc Điểm Nhấn & Trạng Thái (Accents & Status Colors)

Các màu trạng thái được chuẩn hóa để hiển thị hài hòa trên cả 2 nền giao diện:

| Trạng thái / Ý nghĩa             | Mã Hex    | Giao diện Tối (Dark)                                       | Giao diện Sáng (Light)                              | Ứng dụng                                 |
| :------------------------------- | :-------- | :--------------------------------------------------------- | :-------------------------------------------------- | :--------------------------------------- |
| **Thành công (Success)**         | `#10b981` | `bg-emerald-500/15 text-emerald-400 border-emerald-500/30` | `bg-emerald-50 text-emerald-700 border-emerald-200` | Active, Đã xuất bản, Thanh toán xong     |
| **Nguy hiểm / Lỗi (Danger)**     | `#f43f5e` | `bg-rose-500/15 text-rose-400 border-rose-500/30`          | `bg-rose-50 text-rose-700 border-rose-200`          | Khóa User (Ban), Xóa phim, Lỗi nhập      |
| **Cảnh báo (Warning)**           | `#f59e0b` | `bg-amber-500/15 text-amber-400 border-amber-500/30`       | `bg-amber-50 text-amber-700 border-amber-200`       | Chờ duyệt, Bản nháp (Draft), Đơn pending |
| **Thông tin / Công nghệ (Info)** | `#06b6d4` | `bg-cyan-500/15 text-cyan-400 border-cyan-500/30`          | `bg-cyan-50 text-cyan-700 border-cyan-200`          | Tiến trình upload, Thông số HLS          |
| **Gói VIP / Doanh thu**          | `#a855f7` | `bg-purple-500/15 text-purple-400 border-purple-500/30`    | `bg-purple-50 text-purple-700 border-purple-200`    | Quyền lợi VIP, Biểu đồ doanh thu PayOS   |

---

## 4. Quy Chuẩn Nút Bấm (Button System)

### 4.1. Nút Đăng Nhập / Hành Động Quản Trị (`variant="admin-blue"`)

- **Chế độ Sáng**: Nền xanh đậm công nghệ `#002b80`, chữ trắng, hover `#00246b`, đổ bóng vừa phải.
- **Chế độ Tối**: Nền xanh công nghệ sâu kết hợp viền mờ ánh sáng neon, hover phát sáng nhẹ.
- **Mã Tailwind**:
  ```tsx
  className =
    "bg-[#002b80] hover:bg-[#00246b] text-white font-semibold shadow-md hover:shadow-lg active:scale-[0.98] transition-all";
  ```

### 4.2. Nút Hành Động Nổi Bật (`variant="primary"`)

- **Chế độ Tối**: Gradient Cyan $\rightarrow$ Blue phát sáng rực rỡ (`shadow-[0_0_15px_rgba(6,182,212,0.3)]`).
- **Chế độ Sáng**: Gradient Blue $\rightarrow$ Indigo sắc sảo, chữ trắng tương phản mạnh.
- **Mã Tailwind**:
  ```tsx
  className =
    "bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-[0.98] transition-all";
  ```

### 4.3. Nút Thứ Cấp / Hủy Bỏ (`variant="secondary"`)

- **Chế độ Tối**: `bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/80`
- **Chế độ Sáng**: `bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300`

### 4.4. Nút Nguy Hiểm (`variant="danger"`)

- **Chế độ Tối**: `bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border-rose-500/40`
- **Chế độ Sáng**: `bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200`

---

## 5. Quy Chuẩn Thư Viện Thông Báo Alert / Toast (`react-toastify`)

Hệ thống thông báo sử dụng thư viện **`react-toastify`** chính thức và tự động đổi màu theo theme hệ thống:

- **Ở Chế độ Tối (`theme="dark"`)**:
  - Hộp thông báo màu xám đen sang trọng (`#1e293b`), viền mờ, chữ trắng sáng.
  - Biểu tượng xanh lục có vòng tròn nổi bật.
  - Thanh Progress bar ở đáy màu xanh ngọc chạy đếm ngược 3 giây.
- **Ở Chế độ Sáng (`theme="light"`)**:
  - Hộp thông báo nền trắng sạch sẽ (`#ffffff`), viền xám nhẹ (`#e2e8f0`), chữ đen xám đậm.
  - Giữ nguyên biểu tượng và thanh Progress bar xanh lá đặc trưng như Ảnh 2.

```tsx
// Cấu hình ToastContainer trong src/components/feedback/Toast.tsx
<ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  pauseOnHover
  theme={theme === "dark" ? "dark" : "light"}
  toastClassName="!rounded-2xl !font-sans !shadow-2xl"
/>
```

---

## 6. Cấu Hình Design Tokens Tailwind CSS v4 (`src/index.css`)

```css
@import "tailwindcss";

/* Kích hoạt cơ chế Class-based Dark Mode cho Tailwind v4 */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Tông màu Nền */
  --color-admin-bg: #090d16;
  --color-admin-card: #131c2e;
  --color-admin-card-hover: #1b263e;
  --color-admin-sidebar: #0c121e;
  --color-admin-border: #1e293b;
  --color-admin-border-glow: rgba(6, 182, 212, 0.35);

  /* Tông màu Điểm nhấn */
  --color-admin-primary: #06b6d4;
  --color-admin-primary-hover: #22d3ee;
  --color-admin-blue: #1d4ed8;
  --color-admin-blue-hover: #2563eb;
  --color-admin-purple: #a855f7;

  /* Tông màu Trạng thái */
  --color-admin-success: #10b981;
  --color-admin-warning: #f59e0b;
  --color-admin-danger: #f43f5e;
  --color-admin-info: #06b6d4;
}
```
