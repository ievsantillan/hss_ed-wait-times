import { ATTRIBUTION, DISCLAIMER } from '../../content/ahs-content';

interface DisclaimerProps {
  className?: string;
}

export function Disclaimer({ className = '' }: DisclaimerProps) {
  return (
    <footer
      aria-label="Wait times disclaimer"
      className={`border-t border-slate-200 bg-slate-50 px-4 py-6 text-sm text-hss-gray ${className}`}
    >
      <div className="mx-auto max-w-6xl space-y-3">
        <p>{ATTRIBUTION}</p>
        <p className="leading-6">
          {DISCLAIMER.textBeforeFeedbackLink}
          <a
            className="font-semibold text-hss-navy underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hss-green"
            href={DISCLAIMER.feedbackLink.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {DISCLAIMER.feedbackLink.label}
          </a>
          {DISCLAIMER.textBeforeEmail}
          <a
            className="font-semibold text-hss-navy underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hss-green"
            href={DISCLAIMER.emailUrl}
          >
            {DISCLAIMER.emailLabel}
          </a>
          {DISCLAIMER.textAfterEmail}
        </p>
      </div>
    </footer>
  );
}
