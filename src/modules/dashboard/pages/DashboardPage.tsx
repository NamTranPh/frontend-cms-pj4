import {
  Film,
  TrendingUp,
  Calendar,
  DollarSign,
  Heart,
  ArrowDownToLine,
  Clock,
} from "lucide-react";

import { useAuth } from "../../auth/hooks/useAuth";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const accountName = user?.name || user?.email || "Admin Manager";

  // Dữ liệu mẫu cho biểu đồ cột đôi (Double Bar Chart - tương tự Ảnh 2)
  const chartData = [
    { label: "01", cyan: 55, blue: 70 },
    { label: "02", cyan: 60, blue: 80 },
    { label: "03", cyan: 75, blue: 90 },
    { label: "04", cyan: 95, blue: 100 },
    { label: "05", cyan: 65, blue: 75 },
    { label: "06", cyan: 85, blue: 70 },
    { label: "07", cyan: 100, blue: 90 },
    { label: "08", cyan: 80, blue: 95 },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Chào Mừng Thanh Lịch (Thay thế banner tối cồng kềnh trước đó) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 transition-colors">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Chào mừng{" "}
            <span className="text-[#002b80] dark:text-cyan-400 font-black">
              {accountName}
            </span>{" "}
            đến với hệ thống quản trị
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 leading-relaxed max-w-3xl">
            Hệ thống quản lý trung tâm toàn diện: Phim, Tập phim HLS Streaming,
            Tài khoản người dùng, Gói VIP và Giao dịch thanh toán tự động PayOS.
          </p>
        </div>

        {/* Badge ngày tháng hệ thống */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm shrink-0 self-start md:self-auto">
          <Calendar size={15} className="text-[#002b80] dark:text-cyan-400" />
          <span>Hôm nay, 27/10/2026</span>
        </div>
      </div>

      {/* 2. Thẻ Tính Toán Nhanh (Calculation Cards - Chuẩn phong cách góc phải Ảnh 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Doanh thu VIP */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Doanh thu VIP (Earnings)
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/15 text-[#002b80] dark:text-cyan-400 flex items-center justify-center">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            $ 3,124
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp size={12} /> +18.2% so với tháng trước
          </div>
        </div>

        {/* Lượt xem / Tải phim */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(37,99,235,0.15)] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Lượt phát Streaming (Views)
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ArrowDownToLine size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            1,340,230
          </div>
          <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">
            Băng thông HLS ổn định
          </div>
        </div>

        {/* Yêu thích */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Phim Yêu Thích (Favorites)
            </span>
            <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Heart size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            135,020
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 font-medium">
            Tương tác tăng 12%
          </div>
        </div>

        {/* Kho nội dung Phim */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Tổng Số Phim & Tập
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Film size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            1,578
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            128 bộ phim đã xuất bản
          </div>
        </div>
      </div>

      {/* 3. Khu vực Biểu Đồ & Phân Tích Kỹ Thuật (Bố cục 2 cột giống Ảnh 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Cột Trái (7/12): Average Charts - Biểu đồ cột đôi */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Average Charts
              </h2>
              {/* Legend chú thích */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-cyan-400" />
                  <span className="text-slate-500 dark:text-slate-400">
                    Streaming Views
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-blue-600" />
                  <span className="text-slate-500 dark:text-slate-400">
                    Transcode Traffic
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Biểu đồ lưu lượng truy cập và xử lý video HLS hàng tuần
            </p>

            {/* Khung Biểu đồ cột đôi (Double Bar Chart CSS) */}
            <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800 px-2">
              {chartData.map((bar, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                >
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Cột Cyan */}
                    <div
                      className="w-1/2 max-w-[14px] bg-cyan-400 rounded-t-md transition-all duration-300 group-hover:bg-cyan-300"
                      style={{ height: `${bar.cyan}%` }}
                      title={`Views: ${bar.cyan}%`}
                    />
                    {/* Cột Blue */}
                    <div
                      className="w-1/2 max-w-[14px] bg-blue-600 rounded-t-md transition-all duration-300 group-hover:bg-blue-500"
                      style={{ height: `${bar.blue}%` }}
                      title={`Traffic: ${bar.blue}%`}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 text-xs text-slate-500 dark:text-slate-400">
            <span>Dữ liệu thống kê tự động đồng bộ theo tuần</span>
            <span className="text-cyan-500 font-semibold cursor-pointer hover:underline">
              Xem báo cáo chi tiết →
            </span>
          </div>
        </div>

        {/* Cột Phải (5/12): Analytics & Vòng Tròn Phần Trăm (Giống cụm tròn Ảnh 2) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card: Thanh tiến độ phân tích (Analytical Bars) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
              Analytical Status
            </h3>

            <div className="space-y-3.5">
              {/* Thanh 1 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 dark:text-slate-400">
                    Tài khoản Active
                  </span>
                  <span className="text-slate-900 dark:text-slate-100">
                    98%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: "98%" }}
                  />
                </div>
              </div>

              {/* Thanh 2 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 dark:text-slate-400">
                    Transcode 1080p sẵn sàng
                  </span>
                  <span className="text-slate-900 dark:text-slate-100">
                    75%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: "75%" }}
                  />
                </div>
              </div>

              {/* Thanh 3 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 dark:text-slate-400">
                    Đơn PayOS tự động khớp
                  </span>
                  <span className="text-slate-900 dark:text-slate-100">
                    85%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: "85%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card: Bộ 3 Vòng Tròn Phần Trăm (Circular Rings - 75%, 50%, 96%) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <div className="grid grid-cols-3 gap-3 text-center">
              {/* Vòng 1 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-4 border-cyan-400 border-t-transparent flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                    75%
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  MinIO S3
                </span>
                <span className="text-[10px] text-slate-400">Dung lượng</span>
              </div>

              {/* Vòng 2 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(37,99,235,0.2)]">
                  <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                    50%
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Server CPU
                </span>
                <span className="text-[10px] text-slate-400">Hiệu năng</span>
              </div>

              {/* Vòng 3 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                  <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                    96%
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  API Health
                </span>
                <span className="text-[10px] text-slate-400">Tốc độ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Hộp Cập Nhật Gần Đây (Recent Update Box) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#002b80] dark:text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Recent Update (Hoạt động hệ thống gần nhất)
            </h3>
          </div>
          <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
            Cập nhật lúc 01/12/2026 - Tự động đối soát
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Hệ thống vừa hoàn tất transcode 3 tập phim mới sang chuẩn HLS Adaptive
          Streaming và ghi nhận 2 giao dịch gói VIP PayOS được tự động cộng hạn
          dùng cho thành viên. Mọi dịch vụ chạy ổn định.
        </p>
      </div>
    </div>
  );
};
