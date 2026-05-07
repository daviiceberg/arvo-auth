/**
 * SLA helpers for critical-deadline rendering (M3 — Hospitalares Críticos).
 *
 * Categorias críticas (Urgência/Emergência, Oncologia) operam com janelas de
 * SLA muito menores que ambulatoriais. A granularidade muda de "dias úteis"
 * para "horas" e "minutos" e dispara alertas escalonados.
 *
 * Storage convention: o tipo `Request` armazena `slaDeadlineHours: number`.
 * Esta utility só formata e classifica. Nunca persistir strings derivadas.
 */

import { type SLAStatus } from '@/types/pedido';

const HOUR_IN_MIN = 60;
const ONE_HOUR_THRESHOLD_HOURS = 1;
const HALF_HOUR_THRESHOLD_HOURS = 0.5;

/**
 * Formata uma janela em horas como `Xh Ymin` quando crítica (≤ 24h).
 * Exemplos: 0.25 → "15min"; 0.75 → "45min"; 1.5 → "1h 30min"; 4 → "4h".
 * Para janelas ≥ 24h, devolve `Xh` (consumo deve usar `formatDurationFromHours`).
 */
export function formatCriticalSla(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) return 'Violado';
  if (hours < 1) {
    const mins = Math.max(1, Math.round(hours * HOUR_IN_MIN));
    return `${String(mins)}min`;
  }
  const fullHours = Math.floor(hours);
  const remainingMins = Math.round((hours - fullHours) * HOUR_IN_MIN);
  if (remainingMins === 0) return `${String(fullHours)}h`;
  return `${String(fullHours)}h ${String(remainingMins)}min`;
}

/** Define o status visual a partir das horas restantes (categorias críticas). */
export function classifyCriticalSlaStatus(hours: number): SLAStatus {
  if (hours <= 0) return 'violated';
  if (hours <= HALF_HOUR_THRESHOLD_HOURS) return 'violated';
  if (hours <= ONE_HOUR_THRESHOLD_HOURS) return 'warning';
  return 'ok';
}

/** Bucket de alerta escalonado para notificações (sino). */
export type SlaAlertBucket = 'within_1h' | 'within_30min' | 'violated' | 'safe';

export function bucketCriticalSla(hours: number): SlaAlertBucket {
  if (hours <= 0) return 'violated';
  if (hours <= HALF_HOUR_THRESHOLD_HOURS) return 'within_30min';
  if (hours <= ONE_HOUR_THRESHOLD_HOURS) return 'within_1h';
  return 'safe';
}
