import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Plus, Users, Briefcase, CheckCircle } from 'lucide-react';

export default function RecruiterDashboard() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/applications/dashboard'),
      api.get('/jobs/recruiter/my-jobs')
    ])
      .then(([statsRes, jobsRes]) => {
        setStats(statsRes.data);
        setJobs(jobsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-8"><div className="h-40 skeleton" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Recruiter Dashboard</h1>
          <p className="text-sm text-muted">Manage jobs and review candidates</p>
        </div>
        <Link
          to="/recruiter/post-job"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary-hover"
        >
          <Plus size={16} /> Post New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Jobs', value: stats?.totalJobs || 0, icon: Briefcase },
          { label: 'Active Jobs', value: stats?.activeJobs || 0, icon: Briefcase },
          { label: 'Applicants', value: stats?.totalApplicants || 0, icon: Users },
          { label: 'Hired', value: stats?.hired || 0, icon: CheckCircle },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded p-4">
            <s.icon size={18} className="text-muted mb-2" />
            <p className="text-2xl font-semibold">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Jobs list */}
      <h2 className="font-semibold mb-3">Your Job Postings</h2>
      {jobs.length === 0 ? (
        <p className="text-muted text-sm py-8 text-center">No jobs posted yet. Create your first job.</p>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job._id} className="bg-card border border-border rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-medium">{job.title}</h3>
                <p className="text-sm text-muted">{job.company} · {job.location}</p>
                <p className="text-xs text-muted mt-1">
                  {job.applicationCount || 0} applications · {job.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <Link
                to={`/recruiter/jobs/${job._id}/applicants`}
                className="text-sm text-primary font-medium hover:underline whitespace-nowrap"
              >
                View Applicants →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
