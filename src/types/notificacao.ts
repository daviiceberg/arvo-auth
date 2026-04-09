export type NotificationType =
  | 'processamento_ok'
  | 'processamento_auto'
  | 'processamento_erro'
  | 'devolutiva'
  | 'sla_risco'
  | 'urgencia';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  href: string;
}
