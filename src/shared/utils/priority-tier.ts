import { type Request } from '@/types/pedido';

/**
 * Hierarquia de prioridade da fila operacional. Tier menor = maior urgência.
 *
 *   1. Liminares Judiciais
 *   2. NIPs Abertas
 *   3. Urgência/Emergência
 *   4. SLA Violado
 *   5. SLA em Risco
 *   6. Devolutivas (pendência + junta médica)
 *   7. Demais pedidos
 */
export function priorityTier(r: Request): number {
  if (r.injunction !== undefined) return 1;
  if (r.nip?.status === 'aberta') return 2;
  if (r.category === 'Urgência/Emergência') return 3;
  if (r.slaStatus === 'violated') return 4;
  if (r.slaStatus === 'warning') return 5;
  if (
    r.subStatus === 'PENDENTE_AGUARDANDO' ||
    r.subStatus === 'PENDENTE_RETORNO_RECEBIDO' ||
    r.subStatus === 'JUNTA_AGUARDANDO' ||
    r.subStatus === 'JUNTA_PARECER_RECEBIDO'
  )
    return 6;
  return 7;
}

/**
 * Comparador para Array.sort. Tier menor sobe ao topo. Tiebreaker: SLA mais
 * próximo de expirar (slaDeadlineHours ascendente) dentro do mesmo tier.
 */
export function sortByPriority(a: Request, b: Request): number {
  const aTier = priorityTier(a);
  const bTier = priorityTier(b);
  if (aTier !== bTier) return aTier - bTier;
  return a.slaDeadlineHours - b.slaDeadlineHours;
}
