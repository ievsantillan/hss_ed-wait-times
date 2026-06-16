import { RESOURCES } from '../../content/ahs-content';

interface ResourcesListProps {
  className?: string;
}

export function ResourcesList({ className = '' }: ResourcesListProps) {
  return (
    <nav
      aria-labelledby="resources-heading"
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      <h2 id="resources-heading" className="text-lg font-semibold text-hss-navy">
        Resources
      </h2>
      <ul className="mt-3 space-y-3" role="list">
        {RESOURCES.map((resource) => (
          <li key={resource.url}>
            <a
              className="inline-flex font-semibold text-hss-navy underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hss-green"
              href={resource.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              {resource.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
