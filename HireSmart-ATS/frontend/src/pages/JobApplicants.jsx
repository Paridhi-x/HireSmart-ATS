import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import StatusBadge from '../components/StatusBadge';
import ScoreRing from '../components/ScoreRing';
import { ArrowLeft } from 'lucide-react';

const STATUS_OPTIONS = ['Applied', 'Shortlisted', 'Interview', 'Hired', 'Rejected'];

export default function JobApplicants() {
  const { id } = useParams();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/applications/job/${id}`)
      .then(res => setApps(res.data))
      .catch(() => toast.error('Failed to load applicants'))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (appId, status) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, { status });
      setApps(prev => prev.map(a => a._id === appId ? res.data : a));
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-8 space-y-3">
      {[1,2,3].map(i => <div key={i} className="h-32 skeleton" />)}
    </div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/recruiter" className="flex items-center gap-1 text-sm text-muted hover:text-ink mb-4">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <h1 className="text-2xl font-semibold mb-1">Applicants</h1>
      <p className="text-sm text-muted mb-6">
        Sorted by ATS score (highest first) · {apps.length} total
      </p>

      {apps.length === 0 ? (
        <p className="text-center text-muted py-12">No applications yet for this job.</p>
      ) : (
        <div className="space-y-4">
          {apps.map(app => (
            <div key={app._id} className="bg-card border border-border rounded p-5">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="font-semibold text-lg">{app.candidate?.name}</h2>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-sm text-muted">{app.candidate?.email}</p>
                  <p className="text-xs text-muted mt-1">
                    Applied {new Date(app.appliedAt).toLocaleDateString()} · {app.resumeFileName}
                  </p>

                  {app.aiSummary && (
                    <p className="text-sm mt-3 text-ink leading-relaxed">{app.aiSummary}</p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-4 text-xs">
                    {app.matchedSkills?.length > 0 && (
                      <div>
                        <span className="font-medium text-status-shortlisted">Matched: </span>
                        {app.matchedSkills.join(', ')}
                      </div>
                    )}
                    {app.missingSkills?.length > 0 && (
                      <div>
                        <span className="font-medium text-status-rejected">Missing: </span>
                        {app.missingSkills.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <ScoreRing score={app.atsScore} size={72} />
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app._id, e.target.value)}
                    className="border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
