/**
 * Tipos de notificação do MVP.
 *
 * REGRAS DA REUNIÃO BE/Dados/FE (22/Abr/2026):
 * - Público-alvo: ~90% autorizador (gestor apenas consulta).
 * - Granularidade primária: fila/categoria (não usuário individual).
 * - Tenant é a camada acima.
 *
 * RF-004 / NEW-881:
 * - Para TEA, não há decisão automática final.
 * - O fluxo sempre notifica preparação/entrada em fila e atualização de análise.
 *
 * M1 — adicionados eventos de devolutiva e junta médica.
 */
export type NotificationType =
  | 'processamento_ok'
  | 'processamento_erro'
  | 'sla_risco'
  | 'sla_violado'
  | 'novo_pedido_fila'
  | 'documento_processado'
  | 'devolutiva_recebida'
  | 'junta_parecer_recebido'
  | 'junta_agendada'
  | 'pendencia_prazo_vencido';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  href: string;
}
