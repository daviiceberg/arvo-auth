export type TipoNotificacao =
  | 'processamento_ok'
  | 'processamento_auto'
  | 'processamento_erro'
  | 'devolutiva'
  | 'sla_risco'
  | 'urgencia';

export interface Notificacao {
  id: string;
  type: TipoNotificacao;
  title: string;
  message: string;
  time: string;
  read: boolean;
  href: string;
}
