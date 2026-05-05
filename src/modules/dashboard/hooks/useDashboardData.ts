'use client';

import { useState, useEffect, useMemo } from 'react';

import { dashboardMetrics, pedidos, pedidosEmProcessamento } from '@/data/pedidos';
import { categoryColorMap } from '@/shared/constants';
import { type Category } from '@/types/pedido';

const CATEGORIES_ORDER: Category[] = [
  'Terapias Especiais',
  'SADT',
  'Exames Alta Complexidade',
  'Home Care',
];

export interface CategoryBreakdownEntry {
  category: Category;
  color: string;
  total: number;
  emAnalise: number;
  slaWarning: number;
  slaViolated: number;
  iaSugestaoNegar: number;
  iaSugestaoAprovar: number;
}

export default function useDashboardData() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => {
      clearTimeout(t);
    };
  }, []);

  const categoryBreakdown = useMemo<CategoryBreakdownEntry[]>(() => {
    return CATEGORIES_ORDER.map((category) => {
      const slice = pedidos.filter((p) => p.category === category);
      return {
        category,
        color: categoryColorMap[category].color,
        total: slice.length,
        emAnalise: slice.filter((p) => p.status === 'Em Análise').length,
        slaWarning: slice.filter((p) => p.slaStatus === 'warning').length,
        slaViolated: slice.filter((p) => p.slaStatus === 'violated').length,
        iaSugestaoNegar: slice.filter((p) => p.iaSuggestion === 'Negar').length,
        iaSugestaoAprovar: slice.filter((p) => p.iaSuggestion === 'Aprovar').length,
      };
    });
  }, []);

  return {
    loading,
    metrics: dashboardMetrics,
    pedidos,
    pedidosEmProcessamento,
    categoryBreakdown,
  } as const;
}
