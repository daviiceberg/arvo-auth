'use client';

import { useState, useEffect } from 'react';

import { dashboardMetrics, pedidos, pedidosEmProcessamento } from '@/data/pedidos';

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

  return {
    loading,
    metrics: dashboardMetrics,
    pedidos,
    pedidosEmProcessamento,
  } as const;
}
