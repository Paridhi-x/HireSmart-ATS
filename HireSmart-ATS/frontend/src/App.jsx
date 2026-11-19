import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CandidateHome from './pages/CandidateHome';
import JobDetail from './pages/JobDetail';
import MyApplications from './pages/MyApplications';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJob from './pages/PostJob';
import JobApplicants from './pages/JobApplicants';

function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center text-muted">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/candidate" element={
            <PrivateRoute role="candidate"><CandidateHome /></PrivateRoute>
          } />
          <Route path="/jobs/:id" element={
            <PrivateRoute><JobDetail /></PrivateRoute>
          } />
          <Route path="/my-applications" element={
            <PrivateRoute role="candidate"><MyApplications /></PrivateRoute>
          } />

          <Route path="/recruiter" element={
            <PrivateRoute role="recruiter"><RecruiterDashboard /></PrivateRoute>
          } />
          <Route path="/recruiter/post-job" element={
            <PrivateRoute role="recruiter"><PostJob /></PrivateRoute>
          } />
          <Route path="/recruiter/jobs/:id/applicants" element={
            <PrivateRoute role="recruiter"><JobApplicants /></PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
