import { type Notification } from '@/types/notificacao';

export const NOTIFICACOES: Notification[] = [
  {
    id: 'REQ-2026-04895',
    type: 'novo_pedido_fila',
    title: 'REQ-2026-04895 entrou na fila operacional',
    message: 'Arthur Lima Ferraz · Terapias Especiais · aguardando decisão do analista',
    time: '5min atrás',
    read: false,
    href: '/analise?id=REQ-2026-04895',
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
    id: 'notif-m1-parecer',
    type: 'junta_parecer_recebido',
    title: 'Parecer da Junta Médica disponível',
    message:
      'REQ-2026-M1-JUNTA-002 · Isabela Castro Vidigal · Parecer técnico recebido — aguardando sua decisão',
    time: '1h atrás',
    read: false,
    href: '/analise?id=REQ-2026-M1-JUNTA-002',
  },
  {
    id: 'notif-m1-junta-agendada',
    type: 'junta_agendada',
    title: 'Junta Médica agendada',
    message:
      'REQ-2026-M1-JUNTA-001 · Reunião marcada para 28/04 às 10:00 · Desempatador: Dr. Roberto Mendes',
    time: '3h atrás',
    read: true,
    href: '/analise?id=REQ-2026-M1-JUNTA-001',
  },
  {
    id: 'notif-sadt-006-devolutiva',
    type: 'devolutiva_recebida',
    title: 'Devolutiva recebida — prestador respondeu',
    message:
      'REQ-2026-SADT-006 · Eduardo Castilho Brito · Documentação complementar enviada pelo prestador — pronto para reanálise',
    time: '4h atrás',
    read: true,
    href: '/analise?id=REQ-2026-SADT-006',
  },
  {
    id: 'notif-exam-004-sla-violado',
    type: 'sla_violado',
    title: 'SLA violado — ação imediata necessária',
    message:
      'REQ-2026-EXAM-004 · João Vitor Belo · Cintilografia miocárdica · Prazo ANS excedido — decisão obrigatória',
    time: '5h atrás',
    read: false,
    href: '/analise?id=REQ-2026-EXAM-004',
  },
  {
    id: 'notif-hc-008-sla-risco',
    type: 'sla_risco',
    title: 'SLA em risco — Junta Médica pendente',
    message:
      'REQ-2026-HC-008 · Gertrudes Vasques Andrade · Home Care 24h · Prazo vence em 12h — parecer da junta aguardado',
    time: 'Ontem',
    read: true,
    href: '/analise?id=REQ-2026-HC-008',
  },
  {
    id: 'notif-exam-005-pendencia-vencida',
    type: 'pendencia_prazo_vencido',
    title: 'Pendência não respondida — prazo vencido',
    message:
      'REQ-2026-EXAM-005 · Letícia Andrade Manso · RM coluna cervical · Prestador não respondeu no prazo — guia pode ser negada administrativamente',
    time: 'Ontem',
    read: true,
    href: '/analise?id=REQ-2026-EXAM-005',
  },
];
