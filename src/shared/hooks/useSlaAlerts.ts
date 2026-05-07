'use client';

import { useEffect, useRef } from 'react';

import { pushDynamicNotification } from '@/shared/notifications/notification-store';
import { bucketCriticalSla } from '@/shared/utils/sla';
import { type Request } from '@/types/pedido';

/**
 * Watches an array of requests and dispatches escalonated SLA notifications
 * for critical pedidos (`slaCritical === true`) when their remaining hours
 * cross the 1h / 30min / violated thresholds.
 *
 * Idempotent: each (requestId, bucket) combo fires only once per session via
 * an in-memory dedup ref. Page refresh resets state — by design (M3 mocks
 * static; in production this would be event-sourced from backend).
 */
export function useSlaAlerts(pedidos: readonly Request[]): void {
  const firedRef = useRef(new Set<string>());

  useEffect(() => {
    pedidos
      .filter((p) => p.slaCritical === true)
      .forEach((p) => {
        const bucket = bucketCriticalSla(p.slaDeadlineHours);
        if (bucket === 'safe') return;
        const key = `${p.id}:${bucket}`;
        if (firedRef.current.has(key)) return;
        firedRef.current.add(key);

        if (bucket === 'violated') {
          pushDynamicNotification({
            id: `sla-violado-${p.id}`,
            type: 'sla_violado',
            title: 'SLA crítico violado',
            message: `Pedido ${p.id} ultrapassou o prazo regulatório (${p.beneficiary.name}).`,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            read: false,
            href: `/analise?id=${p.id}`,
          });
          return;
        }

        if (bucket === 'within_30min') {
          pushDynamicNotification({
            id: `sla-30min-${p.id}`,
            type: 'sla_critico_30min',
            title: 'SLA crítico — menos de 30 min',
            message: `Pedido ${p.id} próximo do limite (${p.beneficiary.name}).`,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            read: false,
            href: `/analise?id=${p.id}`,
          });
          return;
        }

        // within_1h
        pushDynamicNotification({
          id: `sla-1h-${p.id}`,
          type: 'sla_critico_1h',
          title: 'SLA crítico — menos de 1h',
          message: `Pedido ${p.id} entra em janela crítica (${p.beneficiary.name}).`,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          read: false,
          href: `/analise?id=${p.id}`,
        });
      });
  }, [pedidos]);
}
