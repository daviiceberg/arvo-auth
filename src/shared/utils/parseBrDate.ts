/**
 * Parse a PT-BR date string of the form `dd/mm/yyyy [hh:mm]` into a Date.
 * If no time is provided, defaults to 09:00 (start of business day).
 *
 * Returns null when the input cannot be parsed.
 */
export function parseBrDate(input: string | undefined | null): Date | null {
  if (!input) return null;
  const trimmed = input.trim();
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/.exec(trimmed);
  if (!match) return null;
  const [, dd, mm, yyyy, hh, min] = match;
  if (!dd || !mm || !yyyy) return null;
  const day = Number(dd);
  const month = Number(mm) - 1;
  const year = Number(yyyy);
  const hour = hh ? Number(hh) : 9;
  const minute = min ? Number(min) : 0;
  const date = new Date(year, month, day, hour, minute, 0, 0);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

/**
 * Hours between two PT-BR formatted dates. Returns 0 when inputs invalid or
 * decision is before protocol.
 */
export function hoursBetweenBrDates(
  protocolDate: string | undefined | null,
  decisionDate: string | undefined | null,
): number {
  const a = parseBrDate(protocolDate);
  const b = parseBrDate(decisionDate);
  if (!a || !b) return 0;
  const diffMs = b.getTime() - a.getTime();
  if (diffMs <= 0) return 0;
  return Math.floor(diffMs / (1000 * 60 * 60));
}
