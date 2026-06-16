import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { regionName } from '@/content/regions';
import { formatWaitMinutes } from '@/lib/ahsTransform';
import type { CatalogFacility } from '@/lib/merge';
import { deleteFacility, listFacilities } from '@/services/facilities';

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}

function currentWaitLabel(facility: CatalogFacility): string {
  if (facility.currentWaitUnavailable) return 'Unavailable';
  return formatWaitMinutes(facility.currentWaitMinutes ?? null);
}

export function AdminPage() {
  const [facilities, setFacilities] = useState<CatalogFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadFacilities = async () => {
    setLoading(true);
    setError(null);
    try {
      setFacilities(await listFacilities());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFacilities();
  }, []);

  const onDelete = async (facility: CatalogFacility) => {
    if (!window.confirm(`Delete ${facility.name}?`)) return;

    setDeletingId(facility.id);
    setError(null);
    try {
      await deleteFacility(facility.id);
      await loadFacilities();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-hss-navy">Facility admin</h1>
          <p className="mt-1 max-w-3xl text-sm text-hss-gray">
            These records layer admin overrides and non-AHS facilities on top of the live AHS feed.
          </p>
        </div>
        <Link
          to="/admin/facility/new"
          className="inline-flex rounded-md bg-hss-navy px-4 py-2 text-sm font-medium text-white hover:bg-hss-navy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
        >
          New facility
        </Link>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {loading && <p className="text-hss-gray">Loading facilities.</p>}

      {!loading && facilities.length === 0 && !error && (
        <p className="rounded-md bg-hss-surface px-4 py-6 text-sm text-hss-gray">
          No catalog facilities found.
        </p>
      )}

      {!loading && facilities.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <caption className="sr-only">Catalog facilities</caption>
            <thead className="bg-hss-surface text-xs uppercase tracking-wide text-hss-gray">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Name</th>
                <th scope="col" className="px-4 py-3 font-semibold">Region</th>
                <th scope="col" className="px-4 py-3 font-semibold">Category</th>
                <th scope="col" className="px-4 py-3 font-semibold">Current wait</th>
                <th scope="col" className="px-4 py-3 font-semibold">Active</th>
                <th scope="col" className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {facilities.map((facility) => (
                <tr key={facility.id}>
                  <th scope="row" className="px-4 py-3 font-medium text-hss-navy">
                    {facility.name}
                  </th>
                  <td className="px-4 py-3 text-hss-gray">{regionName(facility.region)}</td>
                  <td className="px-4 py-3 text-hss-gray">{facility.category}</td>
                  <td className="px-4 py-3 text-hss-gray">{currentWaitLabel(facility)}</td>
                  <td className="px-4 py-3 text-hss-gray">{facility.active === false ? 'No' : 'Yes'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/admin/facility/${facility.id}`}
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-hss-navy ring-1 ring-hss-navy hover:bg-hss-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/admin/facility/${facility.id}/wait`}
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-hss-navy ring-1 ring-hss-navy hover:bg-hss-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
                      >
                        Record wait
                      </Link>
                      <button
                        type="button"
                        onClick={() => void onDelete(facility)}
                        disabled={deletingId === facility.id}
                        aria-label={`Delete ${facility.name}`}
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-red-700 ring-1 ring-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
                      >
                        {deletingId === facility.id ? 'Deleting' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
