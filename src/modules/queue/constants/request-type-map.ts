/**
 * Mock map associating request IDs to their solicitation type.
 * Used to display continuity vs first-request chips in the queue table.
 */
export const REQUEST_TYPE_MAP: Record<string, 'continuidade' | 'primeira'> = {
  'REQ-2026-04797': 'continuidade',
  'REQ-2026-04801': 'continuidade',
  'REQ-2026-04812': 'continuidade',
  'REQ-2026-04820': 'primeira',
  'REQ-2026-04831': 'continuidade',
  'REQ-2026-04843': 'continuidade',
  'REQ-2026-04855': 'primeira',
  'REQ-2026-04790': 'continuidade',
  'REQ-2026-04795': 'primeira',
  'REQ-2026-04870': 'continuidade',
  'REQ-2026-04882': 'continuidade',
  'REQ-2026-04891': 'primeira',
  'REQ-2026-04905': 'continuidade',
  'REQ-2026-04868': 'primeira',
};
