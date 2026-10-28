import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export const AdminLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-800 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar cố định bên trái */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Khu vực nội dung chính bên phải */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Top Header */}
        <AdminHeader
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />

        {/* Nội dung trang thay đổi theo Router */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
