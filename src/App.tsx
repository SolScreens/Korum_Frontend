import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import type { ReactNode } from 'react';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import GroupPage from './pages/GroupPage';
import PreferencePage from './pages/PreferencePage';
import SwipePage from './pages/SwipePage';
import RoomPage from './pages/RoomPage';
import ResultsPage from './pages/ResultsPage';

// ─── Route guards ─────────────────────────────────────────────────────────────

function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F5] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* Protected */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/groups/:groupId"
        element={
          <PrivateRoute>
            <GroupPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rooms/:roomId/preferences"
        element={
          <PrivateRoute>
            <PreferencePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rooms/:roomId/swipe"
        element={
          <PrivateRoute>
            <SwipePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rooms/:roomId/lobby"
        element={
          <PrivateRoute>
            <RoomPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rooms/:roomId/results"
        element={
          <PrivateRoute>
            <ResultsPage />
          </PrivateRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}