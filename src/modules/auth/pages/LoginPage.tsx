import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, User, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { ROUTES } from "../../../config/routes.config";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../../../components/feedback";
import { Button } from "../../../components/ui/Button";
import { ThemeToggle } from "../../../components/ui/ThemeToggle";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, password });

      // Kích hoạt thông báo thành công
      toast.success("Đăng nhập thành công! Đang chuyển hướng...", "Success:");

      // Chuyển hướng sang trang Dashboard
      setTimeout(() => {
        navigate(ROUTES.ADMIN.DASHBOARD);
      }, 1000);
    } catch (err: any) {
      const msg =
        err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.";
      setErrorMsg(msg);
      toast.error(msg, "Error:");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] transition-colors duration-300 flex flex-col items-center justify-center p-4 relative">
      {/* Nút chuyển đổi Theme góc trên bên phải */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Tiêu đề & Logo Shield phía trên form */}
      <div className="flex flex-col items-center mb-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#002b80] dark:bg-gradient-to-tr dark:from-[#002b80] dark:to-cyan-500 flex items-center justify-center shadow-md dark:shadow-cyan-500/20 mb-4 transition-all">
          <Shield className="w-8 h-8 text-white" strokeWidth={2} />
        </div>

        <h1 className="text-2xl font-extrabold text-[#002b80] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-400 tracking-tight transition-colors">
          HỆ THỐNG ADMIN
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors">
          Hệ thống quản trị và điều hành nội dung
        </p>
      </div>

      {/* Form Card chính giữa màn hình (Tương thích cả Dark / Light) */}
      <div className="w-full max-w-[440px] bg-white dark:bg-[#131c2e] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_0_30px_rgba(0,0,0,0.4)] p-8 transition-all">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Ô nhập Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">
              Tên đăng nhập Email
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 dark:text-slate-500">
                <User size={18} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm outline-none focus:border-[#002b80] dark:focus:border-cyan-400 focus:ring-1 focus:ring-[#002b80] dark:focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>

          {/* Ô nhập Mật khẩu */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 transition-colors">
              Mật khẩu
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 dark:text-slate-500">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm outline-none focus:border-[#002b80] dark:focus:border-cyan-400 focus:ring-1 focus:ring-[#002b80] dark:focus:ring-cyan-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Thông báo lỗi nếu có */}
          {errorMsg && (
            <div className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 p-2.5 rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          {/* Nút bấm Đăng nhập */}
          <Button
            type="submit"
            variant="admin-blue"
            size="lg"
            isLoading={isLoading}
            className="w-full rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2"
          >
            Đăng nhập <ArrowRight size={18} />
          </Button>
        </form>

        {/* Chân form: Thông tin hỗ trợ */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1 transition-colors">
          <p>Liên hệ Admin để được cấp tài khoản hoặc biết thêm chi tiết.</p>
          <p>
            Số điện thoại:{" "}
            <span className="text-[#002b80] dark:text-cyan-400 font-semibold">
              0961507110
            </span>
          </p>
        </div>
      </div>

      {/* Footer bản quyền */}
      <footer className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500 font-medium transition-colors">
        Bản quyền © 2026 Hệ Thống Admin. Bảo lưu mọi quyền.
      </footer>
    </div>
  );
};
