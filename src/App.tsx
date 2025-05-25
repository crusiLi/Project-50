import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline, ThemeProvider } from '@mui/material';
import BottomTab from './components/BottomTab';
import PunchCardPage from './pages/PunchCardPage';
import TodoCalendarPage from './pages/TodoCalendarPage';
import TodoPage from './pages/TodoPage';
import AnalysisPage from './pages/AnalysisPage';
import LoginPage from './pages/LoginPage';
import LogoShowcase from './components/LogoShowcase';
import { getCurrentUser } from './utils/auth';
import LogoutButton from './components/LogoutButton';
import theme from './theme';

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
  const showBottomTab = !location.pathname.startsWith('/login') && !location.pathname.startsWith('/logo');
  const currentUser = getCurrentUser();

  return (
    <>
      {showBottomTab && <LogoutButton />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logo" element={<LogoShowcase />} />
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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <AppContent />
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
} 