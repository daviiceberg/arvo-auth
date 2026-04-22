/**
 * Centralized React Query key factory.
 *
 * Every consumer must derive keys from this object so we keep cache lookups
 * consistent and avoid string drift. Keys are asserted as `const` to preserve
 * literal types for precise invalidation.
 */
export const queryKeys = {
  extractions: {
    all: ['extractions'] as const,
    byId: (id: string) => ['extractions', id] as const,
  },
} as const;
