import { useEffect, useState } from 'react';
import { useAuthStore } from './stores/auth.store';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import Login from './pages/Login';
import PasswordSetup from './pages/PasswordSetup';
import PageLayout from './layouts/PageLayout';
import Dashboard from './pages/Dashboard';

const App = () => {
  const { isAuthenticated, school } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    setIsCheckingAuth(false);
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-linear-to-br from-[#F0F9FF] via-[#E0F2FE] to-[#DDD6FE]">
        <div className="text-xl font-semibold text-[#0EA5E9] animate-pulse">Loading Portal...</div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#0A1628',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            style: { background: '#10b981' },
          },
          error: {
            style: { background: '#ef4444' },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login />
              ) : school?.isFirstLogin ? (
                <Navigate to="/setup-password" replace />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Protected Route */}
          <Route
            path="/setup-password"
            element={
              isAuthenticated ? (
                school?.isFirstLogin ? (
                  <PasswordSetup />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            element={
              isAuthenticated && !school?.isFirstLogin ? (
                <PageLayout />
              ) : (
                <Navigate to={isAuthenticated ? '/setup-password' : '/login'} replace />
              )
            }
          >
            <Route path="/" element={<Dashboard />} />
          </Route>

          <Route
            path="*"
            element={
              isAuthenticated ? (
                school?.isFirstLogin ? (
                  <Navigate to="/setup-password" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
