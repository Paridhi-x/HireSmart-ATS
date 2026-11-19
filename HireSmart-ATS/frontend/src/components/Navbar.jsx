import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Briefcase, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary text-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <Briefcase size={22} />
          HireSmart
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <span className="hidden sm:inline text-white/80">
                {user.name} · {user.role}
              </span>
              {user.role === 'recruiter' ? (
                <Link to="/recruiter" className="hover:text-accent transition">
                  Dashboard
                </Link>
              ) : (
                <Link to="/candidate" className="hover:text-accent transition">
                  My Space
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 hover:text-accent transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-accent transition">Login</Link>
              <Link
                to="/signup"
                className="bg-accent text-white px-3 py-1.5 rounded hover:opacity-90 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
