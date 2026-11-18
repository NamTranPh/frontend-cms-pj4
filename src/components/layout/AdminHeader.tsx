import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut, User, Bell, ChevronDown, KeyRound } from "lucide-react";
import { ROUTES } from "../../config/routes.config";
import { useAuth } from "../../modules/auth/hooks/useAuth";
import { useProfile } from "../../modules/profile/hooks/useProfile";
import { useToast } from "../feedback";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Avatar } from "../ui/Avatar";
import { NotificationDropdown } from "../../modules/notifications/components/NotificationDropdown";
import { notificationService } from "../../modules/notifications/services/notificationService";

interface AdminHeaderProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { logout } = useAuth();
  const { profile: user } = useProfile();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = React.useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.info("Đã đăng xuất khỏi hệ thống", "Thông báo");
    } catch {
      toast.error("Đăng xuất xảy ra lỗi, vui lòng thử lại", "Lỗi");
    } finally {
      navigate(ROUTES.PUBLIC.LOGIN);
    }
  };

  return (
    <header className="h-16 sm:h-18 bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#1e293b] px-4 sm:px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
      {/* Nút Toggle mở/đóng Sidebar + Tiêu đề vị trí */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 sm:p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
          title="Đóng / Mở Sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Hệ thống</span>
          <span>/</span>
          <span className="text-[#002b80] dark:text-cyan-400 font-semibold">
            CMS Management
          </span>
        </div>
      </div>

      {/* Cụm thông tin Admin góc phải */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Nút chuyển đổi Theme Sáng / Tối */}
        <ThemeToggle />

        {/* Nút thông báo kèm Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsNotificationOpen((prev) => !prev);
              setIsDropdownOpen(false);
            }}
            className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Thông báo hệ thống"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shadow-md shadow-cyan-500/30 animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <NotificationDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
            unreadCount={unreadCount}
            onUnreadCountChange={fetchUnreadCount}
          />
        </div>

        {/* Khung thông tin cá nhân & User Dropdown */}
        <div
          ref={dropdownRef}
          className="relative pl-3 border-l border-slate-200 dark:border-slate-800"
        >
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 transition-all cursor-pointer group"
            aria-expanded={isDropdownOpen}
          >
            <Avatar
              src={user?.profileUrl}
              name={user?.name || "Administrator"}
              size="md"
              shape="rounded"
              className="shadow-md shadow-cyan-500/10"
            />

            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {user?.name || "Administrator"}
              </span>
              <span className="text-[10px] text-[#002b80] dark:text-cyan-400 font-semibold uppercase tracking-wider">
                {user?.role || "ADMIN"}
              </span>
            </div>

            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-200 ${
                isDropdownOpen
                  ? "rotate-180 text-[#002b80] dark:text-cyan-400"
                  : "group-hover:text-slate-600 dark:group-hover:text-slate-300"
              }`}
            />
          </button>

          {/* Dropdown Menu thả xuống */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-xl shadow-black/10 dark:shadow-black/50 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Header profile info */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {user?.name || "Administrator"}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {user?.email || "admin@gmail.com"}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                    {user?.role || "ADMIN"}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    {user?.accountStatus || "ACTIVE"}
                  </span>
                </div>
              </div>

              {/* Danh mục menu */}
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate(ROUTES.ADMIN.PROFILE);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 hover:text-[#002b80] dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
                >
                  <User size={15} className="text-slate-400" />
                  <span>Hồ sơ cá nhân</span>
                </button>

                {/* Mục mở rộng: Đổi mật khẩu */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate(`${ROUTES.ADMIN.PROFILE}?tab=password`);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 hover:text-[#002b80] dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer"
                >
                  <KeyRound size={15} className="text-slate-400" />
                  <span>Đổi mật khẩu</span>
                </button>
              </div>

              {/* Đường phân cách */}
              <div className="my-1 border-t border-slate-100 dark:border-slate-800/80" />

              {/* Nút Đăng xuất */}
              <div className="px-2 py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Đăng xuất hệ thống</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
