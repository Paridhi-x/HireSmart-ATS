import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    salary: '',
    skills: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean)
      };
      await api.post('/jobs', payload);
      toast.success('Job posted successfully');
      navigate('/recruiter');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Post a New Job</h1>
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job Title *</label>
            <input name="title" required value={form.title} onChange={handleChange}
              className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company *</label>
            <input name="company" required value={form.company} onChange={handleChange}
              className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location *</label>
            <input name="location" required value={form.location} onChange={handleChange}
              className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select name="type" value={form.type} onChange={handleChange}
              className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Salary (optional)</label>
          <input name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. 8-12 LPA"
            className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
          <input name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB"
            className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Job Description *</label>
          <textarea name="description" required rows={5} value={form.description} onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Requirements</label>
          <textarea name="requirements" rows={3} value={form.requirements} onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="bg-primary text-white px-5 py-2.5 rounded font-medium hover:bg-primary-hover disabled:opacity-60">
            {loading ? 'Posting...' : 'Post Job'}
          </button>
          <button type="button" onClick={() => navigate('/recruiter')}
            className="border border-border px-5 py-2.5 rounded text-sm hover:bg-bg">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
