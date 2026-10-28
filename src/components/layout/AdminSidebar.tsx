import React from "react";
import { NavLink } from "react-router-dom";
import { Shield } from "lucide-react";
import { SIDEBAR_NAV_ITEMS } from "./sidebarNav";
import { Tooltip } from "../ui/Tooltip";

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed }) => {
  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-[#0c121e] border-r border-slate-200 dark:border-[#1e293b] flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-[#1e293b] gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#002b80] to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
          <Shield className="w-5 h-5 text-white" strokeWidth={2.2} />
        </div>

        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden transition-opacity duration-200">
            <span className="text-base font-extrabold text-[#002b80] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-400 tracking-tight">
              HỆ THỐNG ADMIN
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wider uppercase">
              Admin Portal
            </span>
          </div>
        )}
      </div>

      {/* Danh sách Menu Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {SIDEBAR_NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;

          return (
            <Tooltip
              key={item.path}
              content={item.title}
              position="right"
              disabled={!isCollapsed} // Chỉ bật tooltip khi sidebar đang đóng/thu gọn
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group w-full ${
                    isActive
                      ? "bg-cyan-50 dark:bg-cyan-500/15 text-[#002b80] dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 font-semibold shadow-sm dark:shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  } ${isCollapsed ? "justify-center px-0" : ""}`
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

                    {!isCollapsed && (
                      <span className="truncate">{item.title}</span>
                    )}
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
