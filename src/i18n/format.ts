export function formatUpdatedAtForLocale(date: Date, language: string | undefined): string {
  const locale = language?.toLowerCase().startsWith('fr') ? 'fr-CA' : 'en-CA';
  try {
    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date).replace(/\.$/, '');
  } catch {
    return new Intl.DateTimeFormat('en-CA', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date).replace(/\.$/, '');
  }
}
