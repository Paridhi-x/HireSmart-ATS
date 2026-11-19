import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Search, BarChart3, Shield } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Smarter Hiring with AI-Powered ATS
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            HireSmart helps recruiters screen resumes in seconds and candidates find the right opportunities faster.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {user ? (
              <Link
                to={user.role === 'recruiter' ? '/recruiter' : '/candidate'}
                className="bg-accent text-white px-6 py-2.5 rounded font-medium hover:opacity-90 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-accent text-white px-6 py-2.5 rounded font-medium hover:opacity-90 transition"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="border border-white/40 text-white px-6 py-2.5 rounded font-medium hover:bg-white/10 transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-semibold text-center mb-10">How it works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Briefcase, title: 'Post Jobs', desc: 'Recruiters create clear job listings with required skills.' },
            { icon: Search, title: 'Apply Easily', desc: 'Candidates upload resume and apply in one click.' },
            { icon: BarChart3, title: 'AI Screening', desc: 'Gemini analyzes resume vs JD and gives match score.' },
            { icon: Shield, title: 'Rank & Decide', desc: 'See ranked candidates and move them through pipeline.' },
          ].map((f) => (
            <div key={f.title} className="bg-card border border-border rounded p-5 hover:shadow-sm transition">
              <f.icon className="text-primary mb-3" size={28} />
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-6 text-center text-sm text-muted">
        HireSmart ATS · Industrial Training Project
      </footer>
    </div>
  );
}
