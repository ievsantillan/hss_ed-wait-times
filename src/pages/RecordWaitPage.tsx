import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { formatWaitMinutes } from '@/lib/ahsTransform';
import type { CatalogFacility } from '@/lib/merge';
import {
  getFacility,
  listReadings,
  recordWait,
  type ReadingRow,
} from '@/services/facilities';

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}

function readingLabel(reading: ReadingRow): string {
  if (reading.unavailable) return 'Unavailable';
  return formatWaitMinutes(reading.waitMinutes ?? null);
}

function formatReportedAt(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

export function RecordWaitPage() {
  const { id } = useParams<{ id: string }>();
  const [facility, setFacility] = useState<CatalogFacility | null>(null);
  const [readings, setReadings] = useState<ReadingRow[]>([]);
  const [minutes, setMinutes] = useState('');
  const [unavailable, setUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadPage = async (facilityId: string) => {
    setLoading(true);
    setError(null);
    try {
      const [loadedFacility, loadedReadings] = await Promise.all([
        getFacility(facilityId),
        listReadings(facilityId),
      ]);
      if (!loadedFacility) {
        setFacility(null);
        setReadings([]);
        setError('Facility not found.');
        return;
      }
      setFacility(loadedFacility);
      setReadings(loadedReadings);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setError('Facility ID is required.');
      setLoading(false);
      return;
    }
    void loadPage(id);
  }, [id]);

  const refreshReadings = async (facilityId: string) => {
    setReadings(await listReadings(facilityId));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!id) {
      setSubmitError('Facility ID is required.');
      return;
    }

    const parsedMinutes = Number(minutes);
    if (!unavailable && (minutes.trim() === '' || !Number.isFinite(parsedMinutes))) {
      setSubmitError('Minutes must be a valid number.');
      return;
    }

    setSubmitting(true);
    try {
      await recordWait(id, unavailable ? null : parsedMinutes, 'admin');
      setMinutes('');
      setUnavailable(false);
      await refreshReadings(id);
    } catch (err) {
      setSubmitError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="space-y-6">
      <div>
        <Link
          to="/admin"
          className="text-sm font-medium text-hss-navy underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
        >
          Back to admin
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-hss-navy">Record wait</h1>
        {facility && <p className="mt-1 text-sm text-hss-gray">{facility.name}</p>}
      </div>

      {loading && <p className="text-hss-gray">Loading wait history.</p>}
      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {!loading && facility && (
        <>
          <form onSubmit={(event) => void onSubmit(event)} className="space-y-4 rounded-lg bg-hss-surface p-4">
            {submitError && (
              <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {submitError}
              </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-hss-navy">
                Minutes
                <input
                  type="number"
                  min="0"
                  value={minutes}
                  onChange={(event) => setMinutes(event.target.value)}
                  disabled={unavailable}
                  aria-label="Wait minutes"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
                />
              </label>

              <label className="inline-flex items-center gap-2 self-end text-sm font-medium text-hss-navy">
                <input
                  type="checkbox"
                  checked={unavailable}
                  onChange={(event) => setUnavailable(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-hss-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
                />
                Unavailable
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-hss-navy px-4 py-2 text-sm font-medium text-white hover:bg-hss-navy/90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
            >
              {submitting ? 'Recording' : 'Record wait'}
            </button>
          </form>

          <section className="space-y-3" aria-labelledby="recent-history-heading">
            <h2 id="recent-history-heading" className="text-xl font-semibold text-hss-navy">
              Recent history
            </h2>
            {readings.length === 0 ? (
              <p className="rounded-md bg-hss-surface px-4 py-6 text-sm text-hss-gray">
                No wait readings found.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                  <caption className="sr-only">Recent wait readings</caption>
                  <thead className="bg-hss-surface text-xs uppercase tracking-wide text-hss-gray">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Wait</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Reported at</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {readings.map((reading) => (
                      <tr key={reading.id}>
                        <td className="px-4 py-3 text-hss-gray">{readingLabel(reading)}</td>
                        <td className="px-4 py-3 text-hss-gray">{formatReportedAt(reading.reportedAt)}</td>
                        <td className="px-4 py-3 text-hss-gray">{reading.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
