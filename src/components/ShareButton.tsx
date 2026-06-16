import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { facilitySharePayload, shareOrCopy } from '@/lib/share';

interface ShareButtonProps {
  facility: { key: string; name: string };
  className?: string;
}

const BASE_CLASS = [
  'inline-flex min-h-11 items-center justify-center rounded-md px-3 py-2 text-sm font-medium',
  'text-hss-navy hover:bg-hss-green/10 hover:underline',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green focus-visible:ring-offset-2',
].join(' ');

export function ShareButton({ facility, className = '' }: ShareButtonProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!message) return undefined;

    const timeout = window.setTimeout(() => setMessage(''), 2500);
    return () => window.clearTimeout(timeout);
  }, [message]);

  async function handleShare() {
    try {
      const result = await shareOrCopy(facilitySharePayload(facility));
      setMessage(result === 'copied' ? t('facility.linkCopied') : t('facility.shareSheetOpened'));
    } catch (error) {
      if (typeof DOMException !== 'undefined' && error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      setMessage(t('facility.unableToCopy'));
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleShare}
        aria-label={t('facility.shareFacility', { name: facility.name })}
        className={`${BASE_CLASS} ${className}`.trim()}
      >
        {t('facility.share')}
      </button>
      <span className="min-h-4 text-xs font-medium text-hss-gray" aria-live="polite">
        {message}
      </span>
    </span>
  );
}
