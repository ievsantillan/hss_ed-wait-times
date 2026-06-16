interface SparklineProps {
  /** Oldest-to-newest values; nulls are treated as gaps. */
  values: (number | null)[];
  width?: number;
  height?: number;
  className?: string;
}

/** Minimal dependency-free SVG sparkline for wait-time trends. */
export function Sparkline({ values, width = 240, height = 48, className }: SparklineProps) {
  const points = values.filter((v): v is number => v != null);
  if (points.length < 2) {
    return <p className="text-sm text-hss-gray">Not enough history yet to show a trend.</p>;
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = width / (values.length - 1);

  const coords = values.map((v, i) => {
    if (v == null) return null;
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const path = coords.filter(Boolean).join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={`Wait-time trend from ${min} to ${max} minutes`}
    >
      <polyline
        points={path}
        fill="none"
        stroke="var(--color-hss-green)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
