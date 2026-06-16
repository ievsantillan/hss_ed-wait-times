import { LIFE_THREATENING } from '../../content/ahs-content';

interface EmergencyCalloutProps {
  className?: string;
}

export function EmergencyCallout({ className = '' }: EmergencyCalloutProps) {
  return (
    <section
      aria-labelledby="emergency-callout-heading"
      className={`rounded-xl border border-red-200 bg-red-50 p-5 text-slate-900 shadow-sm ${className}`}
    >
      <h2 id="emergency-callout-heading" className="text-lg font-semibold text-hss-navy">
        Life-threatening emergencies
      </h2>
      <p className="mt-2 text-base leading-7">
        {LIFE_THREATENING.textBeforePhone}
        <a
          className="font-bold text-hss-navy underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hss-green"
          href={LIFE_THREATENING.phoneUrl}
        >
          {LIFE_THREATENING.phoneLabel}
        </a>
        {LIFE_THREATENING.textAfterPhone}
        <a
          className="font-semibold text-hss-navy underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hss-green"
          href={LIFE_THREATENING.link.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {LIFE_THREATENING.link.label}
        </a>
        {LIFE_THREATENING.textAfterLink}
      </p>
    </section>
  );
}
