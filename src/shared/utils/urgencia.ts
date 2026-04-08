import { type Pedido } from '@/types/pedido';

export type NivelUrgencia = 'critico' | 'atencao' | 'em_andamento' | 'aguardando';

const CRITICAL_ALERTS = ['Liminar Judicial', 'NIP Ativa'];

/**
 * Classifies an active request by operational urgency level.
 * Precedence order: critico > aguardando > atencao > em_andamento
 */
export function classificarUrgencia(p: Pedido): NivelUrgencia {
  const hasCriticalAlert = p.alertas.some((a) => CRITICAL_ALERTS.includes(a));

  if (p.slaStatus === 'violated' || hasCriticalAlert) return 'critico';

  if (
    p.subStatus === 'PENDENTE_AGUARDANDO' ||
    p.subStatus === 'JUNTA_AGUARDANDO' ||
    p.subStatus === 'PENDENTE_RETORNO_RECEBIDO' ||
    p.subStatus === 'JUNTA_PARECER_RECEBIDO'
  )
    return 'aguardando';

  if (p.slaStatus === 'warning') return 'atencao';

  return 'em_andamento';
}
