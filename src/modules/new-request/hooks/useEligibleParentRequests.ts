'use client';

import { useMemo } from 'react';

import { historicoEntries, pedidos } from '@/data/pedidos';
import { type Category } from '@/types/pedido';

export interface EligibleParent {
  id: string;
  protocolDate: string;
  status: string;
  procedure: string;
  source: 'queue' | 'history';
  decisao?: string;
  category: Category;
}

interface UseEligibleParentRequestsArgs {
  cardNumber: string;
  category: string;
}

function buildFromQueue(args: UseEligibleParentRequestsArgs): EligibleParent[] {
  return pedidos
    .filter(
      (p) =>
        !p.parentRequestId &&
        p.beneficiary.cardNumber === args.cardNumber &&
        p.category === args.category,
    )
    .map((p) => ({
      id: p.id,
      protocolDate: p.protocolDate,
      status: p.status,
      procedure: p.procedures[0]?.description ?? '—',
      source: 'queue' as const,
      category: p.category,
    }));
}

function buildFromHistory(args: UseEligibleParentRequestsArgs): EligibleParent[] {
  return historicoEntries
    .filter(
      (h) => !h.parentRequestId && h.cardNumber === args.cardNumber && h.category === args.category,
    )
    .map((h) => ({
      id: h.id,
      protocolDate: h.protocolDate,
      status: h.action,
      procedure: h.procedure,
      source: 'history' as const,
      decisao: h.action,
      category: h.category,
    }));
}

export default function useEligibleParentRequests({
  cardNumber,
  category,
}: UseEligibleParentRequestsArgs): EligibleParent[] {
  return useMemo(() => {
    if (!cardNumber || !category) return [];
    const args = { cardNumber, category };
    return [...buildFromQueue(args), ...buildFromHistory(args)];
  }, [cardNumber, category]);
}
