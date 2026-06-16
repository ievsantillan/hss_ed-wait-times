import { FIND_CARE } from '../../content/ahs-content';

interface FindCareProps {
  className?: string;
}

export function FindCare({ className = '' }: FindCareProps) {
  return (
    <section
      aria-labelledby="find-care-heading"
      className={`rounded-xl border border-slate-200 bg-white p-5 text-hss-gray shadow-sm ${className}`}
    >
      <h2 id="find-care-heading" className="text-lg font-semibold text-hss-navy">
        Find the right care
      </h2>
      <p className="mt-2 text-base leading-7">
        {FIND_CARE.textBeforeLink}
        <a
          className="font-semibold text-hss-navy underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hss-green"
          href={FIND_CARE.link.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {FIND_CARE.link.label}
        </a>
        {FIND_CARE.textAfterLink}
      </p>
    </section>
  );
}
