/**
 * Tipos de notificação do MVP.
 *
 * REGRAS DA REUNIÃO BE/Dados/FE (22/Abr/2026):
 * - Público-alvo: ~90% autorizador (gestor apenas consulta).
 * - Granularidade primária: fila/categoria (não usuário individual).
 * - Tenant é a camada acima.
 * - Fora do MVP: devolutivas, pendências com retorno, "urgência" (usar SLA).
 *
 * Sobre decisão automática pela IA:
 * - A IA PODE aprovar ou negar autonomamente quando todas as validações
 *   administrativas passam 100% (aprovação automática) ou quando há bloqueio
 *   administrativo claro (negativa automática).
 * - Nesses casos o autorizador precisa ser notificado para ter visibilidade
 *   do que está acontecendo na fila sem precisar intervir manualmente.
 * - Aprovação e negativa automáticas têm tipos distintos porque o tom visual
 *   e a urgência de auditoria são diferentes.
 */
export type NotificationType =
  | 'processamento_ok'
  | 'processamento_auto_aprovado'
  | 'processamento_auto_negado'
  | 'processamento_erro'
  | 'sla_risco'
  | 'sla_violado'
  | 'novo_pedido_fila';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  href: string;
}
