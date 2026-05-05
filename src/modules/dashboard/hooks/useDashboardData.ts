'use client';

import { useState, useEffect, useMemo } from 'react';

import { dashboardMetrics, pedidos, pedidosEmProcessamento } from '@/data/pedidos';
import { type Category } from '@/types/pedido';

export interface CategoryBreakdownEntry {
  category: Category;
  count: number;
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

  // Slot reservado p/ commit 4 — derivação plena por categoria virá quando os mocks
  // tiverem distribuição multi-categoria. Por ora, agrega apenas as categorias presentes.
  const categoryBreakdown = useMemo<CategoryBreakdownEntry[]>(() => {
    const counts = new Map<Category, number>();
    for (const p of pedidos) {
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([category, count]) => ({ category, count }));
  }, []);

  return {
    loading,
    metrics: dashboardMetrics,
    pedidos,
    pedidosEmProcessamento,
    categoryBreakdown,
  } as const;
}
