import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import StatusBadge from '../components/StatusBadge';
import ScoreRing from '../components/ScoreRing';

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/my')
      .then(res => setApps(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-3">
        {[1, 2].map(i => <div key={i} className="h-28 skeleton" />)}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Applications</h1>
        <Link to="/candidate" className="text-sm text-primary hover:underline">
          ← Browse more jobs
        </Link>
      </div>

      {apps.length === 0 ? (
        <p className="text-center text-muted py-12">You haven't applied to any jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {apps.map(app => (
            <div key={app._id} className="bg-card border border-border rounded p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{app.job?.title}</h2>
                  <p className="text-sm text-muted">{app.job?.company} · {app.job?.location}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <StatusBadge status={app.status} />
                    <span className="text-xs text-muted">
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <ScoreRing score={app.atsScore} />
                  <div className="text-xs text-muted max-w-[180px]">
                    {app.aiSummary?.substring(0, 80)}...
                  </div>
                </div>
              </div>
              {(app.matchedSkills?.length > 0 || app.missingSkills?.length > 0) && (
                <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-4 text-xs">
                  {app.matchedSkills?.length > 0 && (
                    <div>
                      <span className="text-status-shortlisted font-medium">Matched: </span>
                      {app.matchedSkills.join(', ')}
                    </div>
                  )}
                  {app.missingSkills?.length > 0 && (
                    <div>
                      <span className="text-status-rejected font-medium">Missing: </span>
                      {app.missingSkills.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
