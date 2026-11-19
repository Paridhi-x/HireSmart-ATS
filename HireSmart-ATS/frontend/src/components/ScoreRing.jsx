export default function ScoreRing({ score = 0, size = 64 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = '#64748B';
  if (score >= 80) color = '#1E5E43';
  else if (score >= 60) color = '#2F7D5B';
  else if (score >= 40) color = '#C98A1B';
  else color = '#B84A4A';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E4E1DA"
          strokeWidth="6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="score-ring"
        />
      </svg>
      <span className="absolute text-sm font-semibold" style={{ color }}>
        {Math.round(score)}
      </span>
    </div>
  );
}
