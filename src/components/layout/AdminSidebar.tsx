import React from "react";
import { NavLink } from "react-router-dom";
import { Shield, X } from "lucide-react";
import { SIDEBAR_NAV_ITEMS } from "./sidebarNav";
import { Tooltip } from "../ui/Tooltip";

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
  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 bg-white dark:bg-[#0c121e] border-r border-slate-200 dark:border-[#1e293b] flex flex-col transition-all duration-300 ease-in-out z-50 lg:z-30 w-72 sm:w-80 ${
        isCollapsed ? "lg:w-20" : "lg:w-64"
      } ${
        isMobileOpen
          ? "translate-x-0 shadow-2xl shadow-black/40"
          : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Logo Header */}
      <div className="h-18 sm:h-20 flex items-center px-5 sm:px-6 border-b border-slate-200 dark:border-[#1e293b] gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#002b80] to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
          <Shield className="w-5 h-5 text-white" strokeWidth={2.2} />
        </div>

        <div
          className={`flex flex-col overflow-hidden transition-opacity duration-200 ${
            isCollapsed ? "lg:hidden" : ""
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
      <nav className="flex-1 py-4 sm:py-5 px-3.5 sm:px-4 space-y-2 overflow-y-auto">
        {SIDEBAR_NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;

          return (
            <Tooltip
              key={item.path}
              content={item.title}
              position="right"
              disabled={!isCollapsed} // Chỉ bật tooltip khi sidebar đang thu gọn trên desktop
            >
              <NavLink
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 sm:gap-4 px-3.5 sm:px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group w-full ${
                    isActive
                      ? "bg-cyan-50 dark:bg-cyan-500/15 text-[#002b80] dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 font-semibold shadow-sm dark:shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  } ${isCollapsed ? "lg:justify-center lg:px-0" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <IconComponent
                      size={20}
                      className={`shrink-0 transition-transform group-hover:scale-110 ${
                        isActive
                          ? "text-[#002b80] dark:text-cyan-400"
                          : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"
                      }`}
                    />

                    <span
                      className={`truncate ${
                        isCollapsed ? "lg:hidden" : ""
                      }`}
                    >
                      {item.title}
                    </span>
                  </>
                )}
              </NavLink>
            </Tooltip>
          );
        })}
      </nav>
    </aside>
  );
};
