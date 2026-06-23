
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
  const { user, loading } = useAuthStore();

  if (loading) {
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
  const { user, loading } = useAuthStore();

  if (loading) {
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
  const { role } = useAuthStore();
  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Route Guard for Verifier + Admin access
const VerifierRoute = ({ children }) => {
  const { role } = useAuthStore();
  if (role !== 'verifier' && role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Route Guard for Citizen Only access
const CitizenRoute = ({ children }) => {
  const { role } = useAuthStore();
  if (role !== 'citizen') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// General Auth Dashboard redirect controller
const DashboardRedirect = () => {
  const { role } = useAuthStore();
  if (role === 'admin') {
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
          <ProtectedRoute>
            <CitizenRoute>
              <ReportIssue />
            </CitizenRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/verify" 
        element={
          <ProtectedRoute>
            <VerifierRoute>
              <CommunityVerification />
            </VerifierRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <AdminRoute>
              <Analytics />
            </AdminRoute>
          </ProtectedRoute>
        } 
      />

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
