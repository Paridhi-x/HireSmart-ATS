const styles = {
  Applied: 'bg-slate-100 text-status-applied',
  Shortlisted: 'bg-green-50 text-status-shortlisted',
  Interview: 'bg-amber-50 text-status-interview',
  Hired: 'bg-emerald-50 text-status-hired',
  Rejected: 'bg-red-50 text-status-rejected',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${styles[status] || styles.Applied}`}>
      {status}
    </span>
  );
}
