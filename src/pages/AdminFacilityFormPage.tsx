import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { REGIONS } from '@/content/regions';
import type { CatalogFacility } from '@/lib/merge';
import {
  createFacility,
  getFacility,
  updateFacility,
  type FacilityInput,
} from '@/services/facilities';

interface FormState {
  name: string;
  region: string;
  category: string;
  siteId: string;
  address: string;
  note: string;
  infoUrl: string;
  mapUrl: string;
  latitude: string;
  longitude: string;
  siteOpen: boolean;
  active: boolean;
}

const CATEGORY_OPTIONS = ['Emergency', 'Urgent Care'] as const;

const EMPTY_FORM: FormState = {
  name: '',
  region: '',
  category: 'Emergency',
  siteId: '',
  address: '',
  note: '',
  infoUrl: '',
  mapUrl: '',
  latitude: '',
  longitude: '',
  siteOpen: true,
  active: true,
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}

function optionalText(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function optionalNumber(value: string): number | undefined {
  if (value.trim() === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function formFromFacility(facility: CatalogFacility): FormState {
  return {
    name: facility.name,
    region: facility.region,
    category: facility.category,
    siteId: facility.siteId ?? '',
    address: facility.address ?? '',
    note: facility.note ?? '',
    infoUrl: facility.infoUrl ?? '',
    mapUrl: facility.mapUrl ?? '',
    latitude: facility.latitude == null ? '' : String(facility.latitude),
    longitude: facility.longitude == null ? '' : String(facility.longitude),
    siteOpen: facility.siteOpen ?? true,
    active: facility.active ?? true,
  };
}

function validateForm(form: FormState): string | null {
  if (!form.name.trim()) return 'Name is required.';
  if (!form.region.trim()) return 'Region is required.';
  if (!form.category.trim()) return 'Category is required.';
  if (form.latitude.trim() !== '' && !Number.isFinite(Number(form.latitude))) {
    return 'Latitude must be a valid number.';
  }
  if (form.longitude.trim() !== '' && !Number.isFinite(Number(form.longitude))) {
    return 'Longitude must be a valid number.';
  }
  return null;
}

function inputFromForm(form: FormState): FacilityInput {
  return {
    name: form.name.trim(),
    region: form.region,
    category: form.category.trim(),
    siteId: optionalText(form.siteId),
    address: optionalText(form.address),
    note: optionalText(form.note),
    infoUrl: optionalText(form.infoUrl),
    mapUrl: optionalText(form.mapUrl),
    latitude: optionalNumber(form.latitude),
    longitude: optionalNumber(form.longitude),
    siteOpen: form.siteOpen,
    active: form.active,
  };
}

export function AdminFacilityFormPage() {
  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const facilityId = params.id === 'new' ? undefined : params.id;
  const isEditing = Boolean(facilityId);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(isEditing);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!facilityId) {
      setForm(EMPTY_FORM);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const loadFacility = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const facility = await getFacility(facilityId);
        if (cancelled) return;
        if (!facility) {
          setLoadError('Facility not found.');
          return;
        }
        setForm(formFromFacility(facility));
      } catch (err) {
        if (!cancelled) setLoadError(errorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadFacility();
    return () => {
      cancelled = true;
    };
  }, [facilityId]);

  const updateField = (field: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    const validationError = validateForm(form);
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const input = inputFromForm(form);
      if (facilityId) {
        await updateFacility(facilityId, input);
      } else {
        await createFacility(input);
      }
      navigate('/admin');
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
        <h1 className="mt-3 text-2xl font-bold text-hss-navy">
          {isEditing ? 'Edit facility' : 'New facility'}
        </h1>
      </div>

      {loading && <p className="text-hss-gray">Loading facility.</p>}
      {loadError && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {loadError}
        </p>
      )}

      {!loading && !loadError && (
        <form onSubmit={(event) => void onSubmit(event)} className="space-y-6 rounded-lg bg-hss-surface p-4">
          {submitError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {submitError}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block text-sm font-medium text-hss-navy">
              Name
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                required
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
              />
            </label>

            <label className="block text-sm font-medium text-hss-navy">
              Region
              <select
                value={form.region}
                onChange={(event) => updateField('region', event.target.value)}
                required
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
              >
                <option value="">Select a region</option>
                {REGIONS.map((region) => (
                  <option key={region.code} value={region.code}>
                    {region.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-hss-navy">
              Category
              <select
                value={form.category}
                onChange={(event) => updateField('category', event.target.value)}
                required
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
              >
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-hss-navy">
              Site ID
              <input
                type="text"
                value={form.siteId}
                onChange={(event) => updateField('siteId', event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
              />
            </label>

            <label className="block text-sm font-medium text-hss-navy md:col-span-2">
              Address
              <input
                type="text"
                value={form.address}
                onChange={(event) => updateField('address', event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
              />
            </label>

            <label className="block text-sm font-medium text-hss-navy md:col-span-2">
              Note
              <textarea
                value={form.note}
                onChange={(event) => updateField('note', event.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
              />
            </label>

            <label className="block text-sm font-medium text-hss-navy">
              Info URL
              <input
                type="url"
                value={form.infoUrl}
                onChange={(event) => updateField('infoUrl', event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
              />
            </label>

            <label className="block text-sm font-medium text-hss-navy">
              Map URL
              <input
                type="url"
                value={form.mapUrl}
                onChange={(event) => updateField('mapUrl', event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
              />
            </label>

            <label className="block text-sm font-medium text-hss-navy">
              Latitude
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(event) => updateField('latitude', event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
              />
            </label>

            <label className="block text-sm font-medium text-hss-navy">
              Longitude
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(event) => updateField('longitude', event.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-hss-navy">
              <input
                type="checkbox"
                checked={form.siteOpen}
                onChange={(event) => updateField('siteOpen', event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-hss-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
              />
              Site open
            </label>

            <label className="inline-flex items-center gap-2 text-sm font-medium text-hss-navy">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => updateField('active', event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-hss-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
              />
              Active
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-hss-navy px-4 py-2 text-sm font-medium text-white hover:bg-hss-navy/90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
            >
              {submitting ? 'Saving' : 'Save facility'}
            </button>
            <Link
              to="/admin"
              className="rounded-md px-4 py-2 text-sm font-medium text-hss-navy ring-1 ring-hss-navy hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </main>
  );
}
