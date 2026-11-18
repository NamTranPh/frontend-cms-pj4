import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Shield, X, ChevronDown } from 'lucide-react';
import { SIDEBAR_NAV_GROUPS } from './sidebarNav';
import { Tooltip } from '../ui/Tooltip';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const location = useLocation();

  // State mở / đóng cho từng nhóm Accordion (Mặc định mở nhóm nếu đang ở route con bên trong)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {
      'movies-group': true,
      'finance-group': true,
    };
    SIDEBAR_NAV_GROUPS.forEach((group) => {
      if (group.children?.some((child) => location.pathname.startsWith(child.path))) {
        initial[group.id] = true;
      }
    });
    return initial;
  });

  // Tự động mở nhóm khi route thay đổi
  useEffect(() => {
    SIDEBAR_NAV_GROUPS.forEach((group) => {
      if (group.children?.some((child) => location.pathname.startsWith(child.path))) {
        setOpenGroups((prev) => ({ ...prev, [group.id]: true }));
      }
    });
  }, [location.pathname]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 bg-white dark:bg-[#0c121e] border-r border-slate-200 dark:border-[#1e293b] flex flex-col transition-all duration-300 ease-in-out z-50 lg:z-30 w-72 sm:w-80 ${
        isCollapsed ? 'lg:w-20' : 'lg:w-64'
      } ${
        isMobileOpen
          ? 'translate-x-0 shadow-2xl shadow-black/40'
          : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Logo Header */}
      <div className="h-18 sm:h-20 flex items-center px-5 sm:px-6 border-b border-slate-200 dark:border-[#1e293b] gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#002b80] to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
          <Shield className="w-5 h-5 text-white" strokeWidth={2.2} />
        </div>

        <div
          className={`flex flex-col overflow-hidden transition-opacity duration-200 ${
            isCollapsed ? 'lg:hidden' : ''
          }`}
        >
          <span className="text-base font-extrabold text-[#002b80] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-400 tracking-tight">
            HỆ THỐNG ADMIN
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wider uppercase">
            Admin Portal
          </span>
        </div>

        {/* Nút đóng Sidebar trên Mobile / Tablet (< lg) */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden ml-auto p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Đóng sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Danh sách Menu Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-visible">
        {SIDEBAR_NAV_GROUPS.map((group) => {
          const IconComponent = group.icon;

          // 1. Trường hợp Menu Đơn (Dashboard, Thể loại, Diễn viên, Gói VIP, Người dùng)
          if (!group.children && group.path) {
            return (
              <Tooltip
                key={group.id}
                content={group.title}
                position="right"
                disabled={!isCollapsed}
              >
                <NavLink
                  to={group.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group w-full ${
                      isActive
                        ? 'bg-cyan-50 dark:bg-cyan-500/15 text-[#002b80] dark:text-cyan-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    } ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <IconComponent
                        size={19}
                        className={`shrink-0 transition-transform group-hover:scale-110 ${
                          isActive
                            ? 'text-[#002b80] dark:text-cyan-400'
                            : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                        }`}
                      />
                      <span className={`truncate ${isCollapsed ? 'lg:hidden' : ''}`}>
                        {group.title}
                      </span>
                    </>
                  )}
                </NavLink>
              </Tooltip>
            );
          }

          // 2. Trường hợp Nhóm Menu Dropdown (Quản lý Phim, Giao dịch)
          const isOpen = Boolean(openGroups[group.id]);
          const hasActiveChild = Boolean(
            group.children?.some(
              (child) =>
                location.pathname === child.path ||
                location.pathname.startsWith(child.path)
            )
          );

          return (
            <div key={group.id} className="relative group/flyout space-y-1">
              <button
                type="button"
                onClick={() => {
                  if (!isCollapsed) {
                    toggleGroup(group.id);
                  }
                }}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                  hasActiveChild
                    ? 'text-[#002b80] dark:text-cyan-400 bg-cyan-50/60 dark:bg-cyan-500/10 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                } ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
              >
                <div className="flex items-center gap-3 truncate">
                  <IconComponent
                    size={19}
                    className={`shrink-0 transition-transform group-hover/flyout:scale-110 ${
                      hasActiveChild
                        ? 'text-[#002b80] dark:text-cyan-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                  <span
                    className={`truncate font-semibold text-xs uppercase tracking-wider ${
                      isCollapsed ? 'lg:hidden' : ''
                    }`}
                  >
                    {group.title}
                  </span>
                </div>

                {!isCollapsed && (
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-cyan-500' : ''
                    }`}
                  />
                )}
              </button>

              {/* Danh sách Menu Con (Dạng Expand khi Sidebar mở) */}
              {isOpen && !isCollapsed && group.children && (
                <div className="pl-6 pr-1 py-0.5 space-y-1 ml-3 border-l border-slate-200/80 dark:border-slate-800/80 animate-in fade-in duration-150">
                  {group.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-cyan-50 dark:bg-cyan-500/15 text-[#002b80] dark:text-cyan-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <span className="truncate">{child.title}</span>
                    </NavLink>
                  ))}
                </div>
              )}

              {/* Flyout Popover Menu khi Sidebar đang thu gọn (isCollapsed = true) */}
              {isCollapsed && group.children && (
                <div className="hidden lg:block absolute left-full top-0 pl-2 z-50 opacity-0 invisible group-hover/flyout:opacity-100 group-hover/flyout:visible transition-all duration-150 pointer-events-none group-hover/flyout:pointer-events-auto">
                  <div className="w-48 rounded-xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-[#1e293b] shadow-xl p-2 relative before:absolute before:-left-3 before:top-0 before:bottom-0 before:w-4 before:content-['']">
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {group.title}
                    </div>
                    <div className="pt-1.5 space-y-0.5">
                      {group.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          onClick={onCloseMobile}
                          className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              isActive
                                ? 'bg-cyan-50 dark:bg-cyan-500/15 text-[#002b80] dark:text-cyan-400 font-semibold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`
                          }
                        >
                          <span className="truncate">{child.title}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
