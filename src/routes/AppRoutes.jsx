
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
      <Route path="/auth" element={<Auth />} />

      {/* Shared Authenticated Pages */}
      <Route path="/dashboard" element={<DashboardRedirect />} />
      <Route path="/issues" element={<IssueFeed />} />
      <Route path="/issues/:id" element={<IssueDetails />} />
      <Route path="/map" element={<InteractiveMap />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/profile" element={<Profile />} />

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
