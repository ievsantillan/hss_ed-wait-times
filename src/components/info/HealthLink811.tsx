import { HEALTH_LINK_811 } from '../../content/ahs-content';

interface HealthLink811Props {
  className?: string;
}

export function HealthLink811({ className = '' }: HealthLink811Props) {
  return (
    <section
      aria-labelledby="health-link-811-heading"
      className={`rounded-xl border border-slate-200 bg-white p-5 text-hss-gray shadow-sm ${className}`}
    >
      <h2 id="health-link-811-heading" className="text-lg font-semibold text-hss-navy">
        811 Health Link
      </h2>
      <p className="mt-2 text-base leading-7">
        {HEALTH_LINK_811.textBeforePhone}
        <a
          className="font-bold text-hss-navy underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hss-green"
          href={HEALTH_LINK_811.phoneUrl}
        >
          {HEALTH_LINK_811.phoneLabel}
        </a>
        {HEALTH_LINK_811.textAfterPhone}
        <a
          className="font-semibold text-hss-navy underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-hss-green"
          href={HEALTH_LINK_811.link.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {HEALTH_LINK_811.link.label}
        </a>
      </p>
    </section>
  );
}
