import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../config/routes.config";
import { AvatarEditModal } from "../components/AvatarEditModal";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  CheckCircle2,
  Lock,
  Save,
  KeyRound,
  Laptop,
  Smartphone,
  Globe,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  Camera,
} from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { profileService } from "../services/profileService";
import type { AdminProfile, SessionResult, UpdateProfileRequest } from "../types/profile.types";
import { useToast } from "../../../components/feedback";

// ============================================================================
// TAB 1: FORM CẬP NHẬT THÔNG TIN CÁ NHÂN (Reset tự động bằng key={user.id})
// ============================================================================
interface GeneralProfileFormProps {
  user: AdminProfile | null;
  onUpdate: (data: UpdateProfileRequest) => Promise<void>;
}

const GeneralProfileForm: React.FC<GeneralProfileFormProps> = ({ user, onUpdate }) => {
  const toast = useToast();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [profileUrl, setProfileUrl] = useState(user?.profileUrl || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning("Họ và tên không được để trống", "Cảnh báo");
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate({
        name: name.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        profileUrl: profileUrl.trim() || undefined,
      });
      toast.success("Cập nhật thông tin quản trị viên thành công!", "Thành công");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Cập nhật hồ sơ thất bại";
      toast.error(msg, "Lỗi");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
        Chi Tiết Tài Khoản
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Họ và tên */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Họ và tên
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User size={16} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                placeholder="Nhập họ và tên..."
              />
            </div>
          </div>

          {/* Email (Readonly) */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Địa chỉ Email</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Lock size={10} /> Không thể đổi
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={user?.email || "admin@gmail.com"}
                disabled
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Số điện thoại
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone size={16} />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                placeholder="Nhập số điện thoại..."
              />
            </div>
          </div>

          {/* Vai trò */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Vai trò hệ thống</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Lock size={10} /> Cố định
              </span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Shield size={16} />
              </div>
              <input
                type="text"
                value="Quản trị viên cấp cao (ADMIN)"
                disabled
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Đường dẫn Avatar URL */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Đường dẫn ảnh đại diện (Profile URL)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <ImageIcon size={16} />
            </div>
            <input
              type="url"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </div>

        {/* Địa chỉ */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Địa chỉ liên hệ
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <MapPin size={16} />
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              placeholder="Nhập địa chỉ..."
            />
          </div>
        </div>

        {/* Nút hành động */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 bg-[#002b80] hover:bg-[#00246b] text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 transition-all shadow-md shadow-cyan-500/10 cursor-pointer disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// TAB 2: FORM ĐỔI MẬT KHẨU
// ============================================================================
const ChangePasswordForm: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword) {
      toast.warning("Vui lòng nhập mật khẩu hiện tại", "Cảnh báo");
      return;
    }
    if (newPassword.length < 6) {
      toast.warning("Mật khẩu mới phải có ít nhất 6 ký tự", "Cảnh báo");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.warning("Xác nhận mật khẩu mới không khớp", "Cảnh báo");
      return;
    }

    setIsChanging(true);
    try {
      await profileService.changePassword({ oldPassword, newPassword });
      setIsSuccess(true);
      toast.success(
        "Đổi mật khẩu thành công! Hệ thống sẽ chuyển hướng về trang đăng nhập sau 1.5 giây...",
        "Thành công"
      );
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Backend đã thu hồi toàn bộ refresh token và tăng tokenVersion
      setTimeout(async () => {
        try {
          await logout();
        } finally {
          navigate(ROUTES.PUBLIC.LOGIN);
        }
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đổi mật khẩu thất bại";
      toast.error(msg, "Lỗi");
      setIsChanging(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 pb-4 mb-2 border-b border-slate-200 dark:border-slate-800">
        Đổi Mật Khẩu Đăng Nhập
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        {/* Mật khẩu cũ */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock size={16} />
            </div>
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              disabled={isChanging || isSuccess}
              className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50"
              placeholder="Nhập mật khẩu hiện tại..."
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              disabled={isChanging || isSuccess}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer disabled:opacity-50"
            >
              {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Mật khẩu mới */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Mật khẩu mới
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <KeyRound size={16} />
            </div>
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              disabled={isChanging || isSuccess}
              className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50"
              placeholder="Tối thiểu 6 ký tự..."
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              disabled={isChanging || isSuccess}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer disabled:opacity-50"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <AlertCircle size={12} /> Tối thiểu 6 ký tự, tối đa 72 ký tự
          </p>
        </div>

        {/* Xác nhận mật khẩu mới */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <KeyRound size={16} />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isChanging || isSuccess}
              className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50"
              placeholder="Nhập lại mật khẩu mới..."
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isChanging || isSuccess}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer disabled:opacity-50"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="pt-4 flex items-center gap-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            disabled={isChanging || isSuccess}
            className="px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 bg-[#002b80] hover:bg-[#00246b] text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 transition-all shadow-md shadow-cyan-500/10 cursor-pointer disabled:opacity-50"
          >
            <KeyRound size={16} />
            {isSuccess ? "Đang chuyển hướng..." : isChanging ? "Đang xử lý..." : "Cập Nhật Mật Khẩu"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// TAB 3: PHIÊN THIẾT BỊ ĐĂNG NHẬP
// ============================================================================
const SessionsTab: React.FC = () => {
  const toast = useToast();
  const [sessions, setSessions] = useState<SessionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevokingOther, setIsRevokingOther] = useState(false);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await profileService.getSessions();
      setSessions(Array.isArray(res) ? res : []);
    } catch {
      toast.error("Không thể tải danh sách phiên đăng nhập", "Lỗi");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    let isMounted = true;
    profileService
      .getSessions()
      .then((res) => {
        if (isMounted) setSessions(Array.isArray(res) ? res : []);
      })
      .catch(() => {
        if (isMounted) toast.error("Không thể tải danh sách phiên đăng nhập", "Lỗi");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [toast]);



  const handleRevokeSession = async (sessionId: string) => {
    try {
      await profileService.revokeSession(sessionId);
      toast.success("Đã đăng xuất phiên thiết bị này", "Thành công");
      setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi thu hồi phiên";
      toast.error(msg, "Lỗi");
    }
  };

  const handleRevokeOtherSessions = async () => {
    setIsRevokingOther(true);
    try {
      await profileService.revokeOtherSessions();
      toast.success("Đã đăng xuất khỏi tất cả các thiết bị khác!", "Thành công");
      await fetchSessions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể đăng xuất các thiết bị khác";
      toast.error(msg, "Lỗi");
    } finally {
      setIsRevokingOther(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Thiết Bị Đang Đăng Nhập
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Danh sách các trình duyệt và thiết bị đang đăng nhập vào tài khoản của bạn.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchSessions}
            disabled={isLoading}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
          </button>

          <button
            type="button"
            onClick={handleRevokeOtherSessions}
            disabled={isRevokingOther || sessions.length <= 1}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <Trash2 size={14} />
            <span>{isRevokingOther ? "Đang xử lý..." : "Đăng xuất thiết bị khác"}</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
          <RefreshCw size={24} className="animate-spin text-cyan-500 mb-2" />
          <p className="text-xs">Đang tải danh sách thiết bị...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          Không tìm thấy phiên đăng nhập nào khác.
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((sess) => {
            const isMobile =
              sess.userAgent.toLowerCase().includes("mobile") ||
              sess.userAgent.toLowerCase().includes("android") ||
              sess.userAgent.toLowerCase().includes("iphone");

            return (
              <div
                key={sess.sessionId}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                  sess.current
                    ? "bg-cyan-500/5 border-cyan-500/30 dark:bg-cyan-500/10"
                    : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl ${
                      sess.current
                        ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {isMobile ? <Smartphone size={20} /> : <Laptop size={20} />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {sess.userAgent.slice(0, 50)}...
                      </span>
                      {sess.current && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          Thiết bị này
                        </span>
                      )}
                      {sess.admin && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                          Admin Portal
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Globe size={12} />
                        IP: {sess.ipAddress}
                      </span>
                      <span>•</span>
                      <span>
                        Hoạt động gần nhất:{" "}
                        {new Date(sess.lastUsedAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>

                {!sess.current && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(sess.sessionId)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/30 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 size={13} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN PAGE: ADMIN PROFILE
// ============================================================================
export const AdminProfilePage: React.FC = () => {
  const { profile: user, refreshProfile, updateProfile } = useProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const toast = useToast();

  // Tab hiện tại: 'general' | 'password' | 'sessions'
  const activeTab = searchParams.get("tab") || "general";

  const setTab = (tab: string) => {
    setSearchParams(tab === "general" ? {} : { tab });
  };

  const handleUpdate = async (data: UpdateProfileRequest) => {
    await updateProfile(data);
  };

  const handleSaveAvatar = async (file: File) => {
    await profileService.uploadAvatar(file);
    await refreshProfile();
    toast.success("Cập nhật ảnh đại diện thành công!", "Thành công");
  };

  const handleDeleteAvatar = async () => {
    await profileService.deleteAvatar();
    await refreshProfile();
    toast.success("Đã gỡ ảnh đại diện thành công!", "Thành công");
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Chưa cập nhật";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Trang */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <User className="text-[#002b80] dark:text-cyan-400" />
            Hồ Sơ Quản Trị Viên
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quản lý thông tin cá nhân, phân quyền, bảo mật mật khẩu và danh sách thiết bị đăng nhập.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột Trái: Thẻ Tóm Tắt Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
            {/* Avatar lớn kèm nút icon máy ảnh tinh gọn ở góc */}
            <div className="relative mb-3 group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-3xl shadow-lg shadow-cyan-500/20 overflow-hidden">
                {user?.profileUrl ? (
                  <img
                    src={user.profileUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={44} />
                )}
              </div>
              {/* Chấm trạng thái hoạt động ở góc trên */}
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#131c2e]"
                title="Đang hoạt động"
              />

              {/* Nút icon Máy ảnh ở góc dưới bên phải avatar */}
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-cyan-400 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-slate-700 shadow-md shadow-black/10 transition-all cursor-pointer hover:scale-110"
                title="Chỉnh sửa ảnh đại diện"
              >
                <Camera size={15} />
              </button>
            </div>

            {/* Tên Quản trị viên và Email ngay bên dưới avatar */}
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {user?.name || "Administrator"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {user?.email || "admin@gmail.com"}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                {user?.role || "ADMIN"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 size={12} />
                {user?.accountStatus || "ACTIVE"}
              </span>
            </div>

            {/* Thông tin phụ */}
            <div className="w-full mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-left space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" />
                  Ngày tham gia
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {formattedDate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Shield size={14} className="text-slate-400" />
                  Quyền hạn
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  Toàn quyền hệ thống
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cột Phải: Tabs Quản trị */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thanh chuyển Tab */}
          <div className="flex items-center p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 gap-1.5">
            <button
              type="button"
              onClick={() => setTab("general")}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "general"
                  ? "bg-white dark:bg-[#131c2e] text-[#002b80] dark:text-cyan-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <User size={15} />
              <span>Thông tin cá nhân</span>
            </button>

            <button
              type="button"
              onClick={() => setTab("password")}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "password"
                  ? "bg-white dark:bg-[#131c2e] text-[#002b80] dark:text-cyan-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <KeyRound size={15} />
              <span>Đổi mật khẩu</span>
            </button>

            <button
              type="button"
              onClick={() => setTab("sessions")}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "sessions"
                  ? "bg-white dark:bg-[#131c2e] text-[#002b80] dark:text-cyan-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Laptop size={15} />
              <span>Thiết bị đăng nhập</span>
            </button>
          </div>

          {/* Hiển thị Tab tương ứng */}
          {activeTab === "general" && (
            <GeneralProfileForm
              key={user?.id || "admin-profile-form"}
              user={user}
              onUpdate={handleUpdate}
            />
          )}

          {activeTab === "password" && <ChangePasswordForm />}

          {activeTab === "sessions" && <SessionsTab />}
        </div>
      </div>

      {/* Modal Chỉnh sửa & Căn chỉnh Avatar */}
      <AvatarEditModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatarUrl={user?.profileUrl}
        onSaveAvatar={handleSaveAvatar}
        onDeleteAvatar={handleDeleteAvatar}
      />
    </div>
  );
};
