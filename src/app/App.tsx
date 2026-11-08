import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '../components/feedback';
import { ThemeProvider } from '../context';
import { AuthProvider } from '../modules/auth/context/AuthContext';
import { ProfileProvider } from '../modules/profile/context/ProfileContext';
import { AppRoutes } from './routes';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ProfileProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </ProfileProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
