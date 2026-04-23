import { type Notification } from '@/types/notificacao';

export const NOTIFICACOES: Notification[] = [
  {
    id: 'REQ-2026-04801',
    type: 'processamento_ok',
    title: 'REQ-2026-04801 pronto para análise',
    message: 'Pedro Henrique Souza · Terapias Especiais · Sugestão da IA: Aprovar',
    time: '2min atrás',
    read: false,
    href: '/analise?id=REQ-2026-04801',
  },
  {
    id: 'HIS-2026-5001',
    type: 'processamento_auto_aprovado',
    title: 'HIS-2026-5001 aprovado automaticamente pela IA',
    message:
      'Lucas Henrique Oliveira · Terapias Especiais · todas as validações administrativas aprovadas',
    time: '5min atrás',
    read: false,
    href: '/historico/HIS-2026-5001',
  },
  {
    id: 'REQ-2026-04870',
    type: 'novo_pedido_fila',
    title: 'Nova solicitação na fila de Terapias Especiais',
    message: 'REQ-2026-04870 · Valentina Costa Nunes · entrou na fila operacional',
    time: '8min atrás',
    read: false,
    href: '/analise?id=REQ-2026-04870',
  },
  {
    id: 'REQ-2026-05004',
    type: 'processamento_erro',
    title: 'REQ-2026-05004 — Erro no processamento',
    message: 'Não foi possível extrair dados do laudo anexado. Requer reanálise manual.',
    time: '10min atrás',
    read: false,
    href: '/dashboard',
  },
  {
    id: 'REQ-2026-04797',
    type: 'sla_violado',
    title: 'SLA violado — REQ-2026-04797',
    message: 'Ana Paula Ferreira · Terapias Especiais · prazo vencido há 24h',
    time: '32min atrás',
    read: false,
    href: '/analise?id=REQ-2026-04797',
  },
  {
    id: 'REQ-2026-04825',
    type: 'sla_risco',
    title: 'SLA em risco — REQ-2026-04825',
    message: 'Isabela Cristina Rocha · Terapias Especiais · vence em menos de 2h',
    time: '45min atrás',
    read: false,
    href: '/analise?id=REQ-2026-04825',
  },
  {
    id: 'HIS-2026-5005',
    type: 'processamento_auto_negado',
    title: 'HIS-2026-5005 negado automaticamente pela IA',
    message:
      'Caio Rodrigues Barros · Terapias Especiais · CRM do solicitante inválido no CFM (negativa administrativa)',
    time: '1h atrás',
    read: true,
    href: '/historico/HIS-2026-5005',
  },
];
