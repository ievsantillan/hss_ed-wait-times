import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'react-router-dom';

import { AuthProvider, useAuth } from '@/hooks/AuthContext';
import { tryCreateAuthService } from '@/services/bootstrap';

function AdminGuard() {
  const { t } = useTranslation();
  const { isAuthenticated, loading, error, signIn } = useAuth();

  if (loading) {
    return <p className="text-hss-gray">Checking your session...</p>;
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h1 className="text-xl font-bold text-hss-navy">{t('admin.staffSignIn')}</h1>
        <p className="mt-2 text-sm text-hss-gray">{t('admin.adminToolIntro')}</p>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <button
          type="button"
          onClick={() => void signIn()}
          className="mt-4 rounded-md bg-hss-navy px-4 py-2 text-sm font-medium text-white hover:bg-hss-navy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
        >
          {t('admin.signIn')}
        </button>
        <p className="mt-4 text-sm">
          <Link to="/" className="text-hss-navy hover:underline">
            ← {t('common.actions.backToPublicWaitTimes')}
          </Link>
        </p>
      </div>
    );
  }

  return <Outlet />;
}

export function AdminLayout() {
  const { t } = useTranslation();
  const { service, error } = useMemo(() => tryCreateAuthService(), []);

  if (!service) {
    return (
      <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h1 className="text-xl font-bold text-hss-navy">{t('admin.adminUnavailable')}</h1>
        <p className="mt-2 text-sm text-hss-gray">{error}</p>
        <p className="mt-4 text-sm">
          <Link to="/" className="text-hss-navy hover:underline">
            ← {t('common.actions.backToPublicWaitTimes')}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <AuthProvider authService={service}>
      <AdminGuard />
    </AuthProvider>
  );
}
