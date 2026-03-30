import type { Pedido } from '@/data/pedidos'

export type NivelUrgencia = 'critico' | 'atencao' | 'em_andamento' | 'aguardando'

const ALERTAS_CRITICOS = ['Liminar Judicial', 'NIP Ativa']

/**
 * Classifica um pedido ativo por nível de urgência operacional.
 * Ordem de precedência: crítico > aguardando > atenção > em_andamento
 */
export function classificarUrgencia(p: Pedido): NivelUrgencia {
  const hasCriticalAlert = p.alertas.some(a => ALERTAS_CRITICOS.includes(a))

  if (p.slaStatus === 'violated' || hasCriticalAlert) return 'critico'

  if (
    p.subStatus === 'PENDENTE_AGUARDANDO' ||
    p.subStatus === 'JUNTA_AGUARDANDO' ||
    p.subStatus === 'PENDENTE_RETORNO_RECEBIDO' ||
    p.subStatus === 'JUNTA_PARECER_RECEBIDO'
  ) return 'aguardando'

  if (p.slaStatus === 'warning') return 'atencao'

  return 'em_andamento'
}
