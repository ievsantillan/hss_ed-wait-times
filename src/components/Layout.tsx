import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router-dom';

import logo from '@/assets/hss-logo.jpg';
import { Disclaimer } from '@/components/info';
import { LANGUAGE_STORAGE_KEY, normalizeLanguage, SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/i18n';

const NAV = [
  { to: '/', labelKey: 'common.nav.waitTimes', end: true },
  { to: '/news', labelKey: 'common.nav.news' },
  { to: '/admin', labelKey: 'common.nav.admin' },
  { to: '/privacy', labelKey: 'common.nav.privacy' },
];

function navClass({ isActive }: { isActive: boolean }): string {
  return [
    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green focus-visible:ring-offset-2 focus-visible:ring-offset-hss-navy',
    isActive ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white',
  ].join(' ');
}

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const currentLanguage = normalizeLanguage(i18n.resolvedLanguage || i18n.language);

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const changeLanguage = (language: SupportedLanguage) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
    document.documentElement.lang = language;
    void i18n.changeLanguage(language);
  };

  return (
    <div
      className="inline-flex items-center gap-1 rounded-md border border-white/40 p-1 text-xs font-semibold text-white"
      aria-label={t('common.language.switcherLabel')}
      role="group"
    >
      <span className="sr-only">{t('common.language.label')}</span>
      {SUPPORTED_LANGUAGES.map((language) => {
        const active = currentLanguage === language;
        const label = language === 'en' ? t('common.language.english') : t('common.language.french');
        const ariaLabel = language === 'en' ? t('common.language.switchToEnglish') : t('common.language.switchToFrench');
        return (
          <button
            key={language}
            type="button"
            aria-label={ariaLabel}
            aria-pressed={active}
            onClick={() => changeLanguage(language)}
            className={`rounded px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green ${
              active ? 'bg-white text-hss-navy' : 'text-white/85 hover:bg-white/10 hover:text-white'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function Layout() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-hss-surface text-hss-gray">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-hss-navy focus:outline-none focus:ring-2 focus:ring-hss-green focus:ring-offset-2"
      >
        {t('common.skipToMainContent')}
      </a>
      <header className="bg-hss-navy" role="banner">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green focus-visible:ring-offset-2 focus-visible:ring-offset-hss-navy"
            aria-label={t('common.hssHome')}
          >
            <img src={logo} alt={t('common.logoAlt')} className="h-10 w-auto rounded bg-white p-1" />
            <span className="hidden sm:block text-white font-semibold leading-tight">
              {t('common.appName')}
            </span>
          </NavLink>
          <div className="flex flex-wrap items-center gap-2">
            <nav aria-label={t('common.primaryNavigation')} className="flex flex-wrap items-center gap-1">
              {NAV.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                  {t(item.labelKey)}
                </NavLink>
              ))}
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main id="main" role="main" className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-white border-t mt-8" role="contentinfo">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-hss-gray/80">
          <Disclaimer />
        </div>
      </footer>
    </div>
  );
}
