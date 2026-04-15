'use client';

import { useState, useEffect } from 'react';

import { dashboardMetrics, pedidos, pedidosEmProcessamento } from '@/data/pedidos';
import { classifyUrgency } from '@/shared/utils/urgencia';

import { type UrgencySegment } from '../types';

// -- Pre-computed urgency segments ----------------------------------------------
const urgencyCounts = pedidos.reduce<Record<string, number>>((acc, p) => {
  const level = classifyUrgency(p);
  acc[level] = (acc[level] ?? 0) + 1;
  return acc;
}, {});

const urgencySegments: UrgencySegment[] = [
  {
    label: 'Críticos',
    key: 'critico',
    color: '#E24B4A',
    count: urgencyCounts.critico ?? 0,
    url: '/fila?sla=Violado',
  },
  {
    label: 'Atenção',
    key: 'atencao',
    color: '#EF9F27',
    count: urgencyCounts.atencao ?? 0,
    url: '/fila?sla=Aten%C3%A7%C3%A3o',
  },
  {
    label: 'Em andamento',
    key: 'em_andamento',
    color: '#639922',
    count: urgencyCounts.em_andamento ?? 0,
    url: '/fila?sla=No%20prazo',
  },
  {
    label: 'Aguardando',
    key: 'aguardando',
    color: '#378ADD',
    count: urgencyCounts.aguardando ?? 0,
    url: '/fila?status=aguardando',
  },
];

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
    urgencySegments,
  } as const;
}
