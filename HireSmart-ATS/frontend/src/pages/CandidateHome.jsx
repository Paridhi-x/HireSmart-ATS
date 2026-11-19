import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, MapPin, Briefcase } from 'lucide-react';

export default function CandidateHome() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (q = '') => {
    setLoading(true);
    try {
      const res = await api.get('/jobs', { params: { search: q || undefined } });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(search);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Browse Jobs</h1>
          <p className="text-sm text-muted">Find roles that match your skills</p>
        </div>
        <Link
          to="/my-applications"
          className="text-sm text-primary font-medium hover:underline"
        >
          My Applications →
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, company..."
            className="w-full border border-border rounded pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary-hover"
        >
          Search
        </button>
      </form>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 skeleton" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-center text-muted py-12">No jobs found.</p>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <Link
              key={job._id}
              to={`/jobs/${job._id}`}
              className="block bg-card border border-border rounded p-4 hover:border-primary/40 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h2 className="font-semibold text-ink">{job.title}</h2>
                  <p className="text-sm text-muted mt-0.5">{job.company}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase size={12} /> {job.type}
                    </span>
                    {job.salary && job.salary !== 'Not disclosed' && (
                      <span>{job.salary}</span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted whitespace-nowrap">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
