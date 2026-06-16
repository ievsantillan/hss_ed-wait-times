import { WAIT_TIMES_INTRO } from '../../content/ahs-content';

interface WaitTimesIntroProps {
  className?: string;
}

export function WaitTimesIntro({ className = '' }: WaitTimesIntroProps) {
  return (
    <section
      aria-labelledby="wait-times-intro-heading"
      className={`rounded-xl border border-slate-200 bg-white p-5 text-hss-gray shadow-sm ${className}`}
    >
      <h2 id="wait-times-intro-heading" className="sr-only">
        About estimated wait times
      </h2>
      <p className="text-base leading-7">
        {WAIT_TIMES_INTRO.textBeforeLink}
        <a
          className="font-semibold text-hss-navy underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hss-green"
          href={WAIT_TIMES_INTRO.link.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {WAIT_TIMES_INTRO.link.label}
        </a>
        {WAIT_TIMES_INTRO.textAfterLink}
      </p>
    </section>
  );
}
