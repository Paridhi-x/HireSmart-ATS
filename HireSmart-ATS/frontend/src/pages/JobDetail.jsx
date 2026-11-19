import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { MapPin, Briefcase, ArrowLeft } from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(res => setJob(res.data))
      .catch(() => toast.error('Job not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a PDF resume');
      return;
    }
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('resume', file);

      await api.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Application submitted! AI is scoring your resume.');
      navigate('/my-applications');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-muted">Loading...</div>;
  if (!job) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-muted hover:text-ink mb-4"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-card border border-border rounded p-6">
        <h1 className="text-2xl font-semibold">{job.title}</h1>
        <p className="text-muted mt-1">{job.company}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted">
          <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
          <span className="flex items-center gap-1"><Briefcase size={14} /> {job.type}</span>
          {job.salary && <span>{job.salary}</span>}
        </div>

        <div className="mt-6">
          <h2 className="font-semibold mb-2">Job Description</h2>
          <p className="text-sm text-ink whitespace-pre-line leading-relaxed">{job.description}</p>
        </div>

        {job.requirements && (
          <div className="mt-5">
            <h2 className="font-semibold mb-2">Requirements</h2>
            <p className="text-sm text-ink whitespace-pre-line">{job.requirements}</p>
          </div>
        )}

        {job.skills?.length > 0 && (
          <div className="mt-5">
            <h2 className="font-semibold mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map(s => (
                <span key={s} className="bg-bg border border-border px-2.5 py-0.5 rounded text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {user?.role === 'candidate' && (
          <form onSubmit={handleApply} className="mt-8 pt-6 border-t border-border">
            <h2 className="font-semibold mb-3">Apply for this role</h2>
            <div className="mb-4">
              <label className="block text-sm mb-1">Upload Resume (PDF only)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-hover"
              />
            </div>
            <button
              type="submit"
              disabled={applying}
              className="bg-primary text-white px-5 py-2.5 rounded font-medium hover:bg-primary-hover disabled:opacity-60"
            >
              {applying ? 'Submitting & Analyzing...' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
