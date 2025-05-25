import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import BottomTab from './components/BottomTab';
import PunchCardPage from './pages/PunchCardPage';
import TodoCalendarPage from './pages/TodoCalendarPage';
import TodoPage from './pages/TodoPage';
import AnalysisPage from './pages/AnalysisPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import LogoShowcase from './components/LogoShowcase';
import { getCurrentUser } from './utils/authAdapter';
import SettingsButton from './components/SettingsButton';
import NetworkStatus from './components/NetworkStatus';
import { ThemeProvider } from './contexts/ThemeContext';
import { NetworkProvider } from './contexts/NetworkContext';
import { initializeMobileApp } from './utils/capacitor';
import { authAdapter } from './utils/authAdapter';

function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AppContent() {
  const location = useLocation();
  const showBottomTab = !location.pathname.startsWith('/login') && !location.pathname.startsWith('/logo') && !location.pathname.startsWith('/settings');
  const showSettingsButton = !location.pathname.startsWith('/login') && !location.pathname.startsWith('/logo') && !location.pathname.startsWith('/settings');
  const currentUser = getCurrentUser();

  return (
    <>
      <NetworkStatus />
      {showSettingsButton && <SettingsButton />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logo" element={<LogoShowcase />} />
        <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
        <Route path="/" element={<RequireAuth><PunchCardPage /></RequireAuth>} />
        <Route path="/calendar" element={<RequireAuth><TodoCalendarPage /></RequireAuth>} />
        <Route path="/todo/:date" element={<RequireAuth><TodoPage /></RequireAuth>} />
        <Route 
          path="/analysis" 
          element={
            <RequireAuth>
              <AnalysisPage username={currentUser || ''} />
            </RequireAuth>
          } 
        />
      </Routes>
      {showBottomTab && <BottomTab />}
    </>
  );
}

export default function App() {
  useEffect(() => {
    // 初始化移动端功能和嵌入式后端
    const initializeApp = async () => {
      await initializeMobileApp();
      await authAdapter.initialize();
    };
    
    initializeApp();
  }, []);

  return (
    <ThemeProvider>
      <NetworkProvider>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Router>
            <AppContent />
          </Router>
        </LocalizationProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
} 