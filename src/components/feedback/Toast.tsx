import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../../context/useTheme';

/**
 * ToastProvider sử dụng thư viện react-toastify
 * Tự động đồng bộ Dark / Light theme theo toàn hệ thống
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
        toastClassName="!rounded-2xl !font-sans !shadow-2xl"
      />
    </>
  );
};
