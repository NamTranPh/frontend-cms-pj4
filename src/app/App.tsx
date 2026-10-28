import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../components/feedback';
import { ThemeProvider } from '../context';
import { AuthProvider } from '../modules/auth/context/AuthContext';
import { AppRoutes } from './routes';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
