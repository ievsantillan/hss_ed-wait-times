import { NavLink, Outlet } from 'react-router-dom';

import logo from '@/assets/hss-logo.jpg';
import { Disclaimer } from '@/components/info';

const NAV = [
  { to: '/', label: 'Wait Times', end: true },
  { to: '/news', label: 'In the News' },
  { to: '/admin', label: 'Admin' },
  { to: '/privacy', label: 'Privacy' },
];

function navClass({ isActive }: { isActive: boolean }): string {
  return [
    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green',
    isActive ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white',
  ].join(' ');
}

/** App shell: HSS-branded header with primary nav, page outlet, and footer disclaimer. */
export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-hss-surface text-hss-gray">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-hss-navy focus:px-3 focus:py-2 focus:rounded-md"
      >
        Skip to main content
      </a>
      <header className="bg-hss-navy">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-3" aria-label="HSS home">
            <img src={logo} alt="Health Shared Services" className="h-10 w-auto rounded bg-white p-1" />
            <span className="hidden sm:block text-white font-semibold leading-tight">
              Emergency Department
              <br />
              Wait Times
            </span>
          </NavLink>
          <nav aria-label="Primary" className="flex flex-wrap items-center gap-1">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main id="main" className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-white border-t mt-8">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-hss-gray/80">
          <Disclaimer />
        </div>
      </footer>
    </div>
  );
}
