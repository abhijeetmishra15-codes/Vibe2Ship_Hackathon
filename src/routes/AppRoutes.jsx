
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

// Page Imports
import LandingPage from '@/pages/LandingPage';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import ReportIssue from '@/pages/ReportIssue';
import IssueFeed from '@/pages/IssueFeed';
import IssueDetails from '@/pages/IssueDetails';
import InteractiveMap from '@/pages/InteractiveMap';
import CommunityVerification from '@/pages/CommunityVerification';
import Analytics from '@/pages/Analytics';
import Leaderboard from '@/pages/Leaderboard';
import Profile from '@/pages/Profile';
import AdminDashboard from '@/pages/AdminDashboard';

// Guard to redirect unauthenticated users to the auth page
const ProtectedRoute = ({ children }) => {
  const { user, loading, loadingProfile } = useAuthStore();

  if (loading || loadingProfile) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center space-y-3 bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <span className="text-xs text-muted-foreground animate-pulse">Checking credentials...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

// Guard to redirect authenticated users to the dashboard page
const PublicRoute = ({ children }) => {
  const { user, loading, loadingProfile } = useAuthStore();

  if (loading || loadingProfile) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center space-y-3 bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <span className="text-xs text-muted-foreground animate-pulse">Restoring session...</span>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Route Guard for Admin Only access
const AdminRoute = ({ children }) => {
  const { user, role, loading, loadingProfile } = useAuthStore();

  if (loading || loadingProfile) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center space-y-3 bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <span className="text-xs text-muted-foreground animate-pulse">Verifying role permissions...</span>
      </div>
    );
  }

  // 1. Auth Check: If not logged in -> redirect to /auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 2. Authorization Check: If logged in but not admin -> redirect to /dashboard
  const normalizedRole = (role || '').trim().toLowerCase();
  if (normalizedRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Route Guard for Verifier + Admin access
const VerifierRoute = ({ children }) => {
  const { user, role, loading, loadingProfile } = useAuthStore();

  if (loading || loadingProfile) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center space-y-3 bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <span className="text-xs text-muted-foreground animate-pulse">Verifying role permissions...</span>
      </div>
    );
  }

  // 1. Auth Check: If not logged in -> redirect to /auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 2. Authorization Check: If logged in but not verifier and not admin -> redirect to /dashboard
  const normalizedRole = (role || '').trim().toLowerCase();
  if (normalizedRole !== 'verifier' && normalizedRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Route Guard for Citizen + Verifier + Admin access
const CitizenRoute = ({ children }) => {
  const { user, role, loading, loadingProfile } = useAuthStore();

  if (loading || loadingProfile) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center space-y-3 bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <span className="text-xs text-muted-foreground animate-pulse">Verifying role permissions...</span>
      </div>
    );
  }

  // 1. Auth Check: If not logged in -> redirect to /auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 2. Authorization Check: Citizen route allows citizen, verifier, and admin.
  const normalizedRole = (role || '').trim().toLowerCase();
  if (normalizedRole !== 'citizen' && normalizedRole !== 'verifier' && normalizedRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// General Auth Dashboard redirect controller
const DashboardRedirect = () => {
  const { user, role, loading, loadingProfile } = useAuthStore();

  if (loading || loadingProfile) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center space-y-3 bg-background">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <span className="text-xs text-muted-foreground animate-pulse">Loading dashboard...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const normalizedRole = (role || '').trim().toLowerCase();
  if (normalizedRole === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  return <Dashboard />;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/auth" 
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        } 
      />

      {/* Shared Authenticated Pages */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
      <Route path="/issues" element={<ProtectedRoute><IssueFeed /></ProtectedRoute>} />
      <Route path="/issues/:id" element={<ProtectedRoute><IssueDetails /></ProtectedRoute>} />
      <Route path="/map" element={<ProtectedRoute><InteractiveMap /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Role-Protected Pages */}
      <Route 
        path="/report" 
        element={
          <CitizenRoute>
            <ReportIssue />
          </CitizenRoute>
        } 
      />
      <Route 
        path="/verify" 
        element={
          <VerifierRoute>
            <CommunityVerification />
          </VerifierRoute>
        } 
      />
      <Route 
        path="/verifier" 
        element={
          <VerifierRoute>
            <CommunityVerification />
          </VerifierRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <AdminRoute>
            <Analytics />
          </AdminRoute>
        } 
      />

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
