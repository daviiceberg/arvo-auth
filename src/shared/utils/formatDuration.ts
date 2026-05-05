/**
 * Format a duration given in hours into a human-readable PT-BR string.
 *
 * Rules:
 * - hours < 24 → `Xh` (ex: `12h`, `3h`)
 * - hours >= 24 with remaining hours > 0 → `Xd Yh` (ex: `2d 3h`, `6d 6h`)
 * - hours >= 24 with remaining hours = 0 → `Xd` (ex: `5d`, `10d`)
 * - non-finite or negative → `0h`
 *
 * Storage convention: durations are always integers in hours. Display layer
 * formats via this helper. Never store pre-formatted strings.
 */
export function formatDurationFromHours(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) return '0h';
  const totalHours = Math.floor(hours);
  if (totalHours < 24) return `${String(totalHours)}h`;
  const days = Math.floor(totalHours / 24);
  const rem = totalHours - days * 24;
  if (rem === 0) return `${String(days)}d`;
  return `${String(days)}d ${String(rem)}h`;
}
