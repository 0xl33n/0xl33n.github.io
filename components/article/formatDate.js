/** Formats `YYYY-MM` or `YYYY-MM-DD` as "July 2024" / "3 July 2024" (UTC, so build timezone doesn't matter). */
export function formatPublishedDate(isoDate) {
  if (!isoDate) return null;
  const hasDay = isoDate.length > 7;
  const date = new Date(hasDay ? `${isoDate}T00:00:00Z` : `${isoDate}-01T00:00:00Z`);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    ...(hasDay && { day: 'numeric' }),
  }).format(date);
}
