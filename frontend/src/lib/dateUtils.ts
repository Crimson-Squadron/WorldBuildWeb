/**
 * Format ISO date string (YYYY-MM-DD) into "dd MMMM yyyy" format.
 * Example: "1452-06-18" -> "18 June 1452"
 */
export function formatEventDate(dateStr?: string): string {
  if (!dateStr) return 'UNKNOWN DATE';

  const parts = dateStr.trim().split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (!isNaN(day) && monthIndex >= 0 && monthIndex < 12 && !isNaN(year)) {
      const paddedDay = day < 10 ? `0${day}` : `${day}`;
      return `${paddedDay} ${monthNames[monthIndex]} ${year}`;
    }
  }

  // Fallback for Date objects or other ISO strings
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    const day = parsed.getDate();
    const paddedDay = day < 10 ? `0${day}` : `${day}`;
    const month = parsed.toLocaleString('en-US', { month: 'long' });
    const year = parsed.getFullYear();
    return `${paddedDay} ${month} ${year}`;
  }

  return dateStr;
}
