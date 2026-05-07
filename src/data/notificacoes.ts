import { type Notification } from '@/types/notificacao';

export const NOTIFICACOES: Notification[] = [
  // ── M3: Urgência/Emergência — politrauma SLA violado ────────────────
  {
    id: 'notif-ue-002-sla-violado',
    type: 'sla_critico_30min',
    title: 'SLA crítico violado — politrauma',
    message:
      'REQ-2026-UE-002 · Rafael Cardoso Almeida · Internação UTI · Manchester vermelho · prazo excedido',
    time: '2min atrás',
    read: false,
    href: '/analise?id=REQ-2026-UE-002',
  },
  // ── M3: Urgência/Emergência — emergência cardíaca ───────────────────
  {
    id: 'notif-ue-001-novo',
    type: 'novo_pedido_fila',
    title: 'Emergência recebida — suspeita de SCA',
    message:
      'REQ-2026-UE-001 · Júlia Ferreira Mota · Manchester laranja · atendimento imediato (RN 566/2022 art. 3º)',
    time: '8min atrás',
    read: false,
    href: '/analise?id=REQ-2026-UE-001',
  },
  // ── M3: Liminar Judicial registrada ────────────────────────────────
  {
    id: 'notif-onc-003-liminar',
    type: 'liminar_recebida',
    title: 'Liminar Judicial registrada',
    message:
      'REQ-2026-ONC-003 · Geraldo Bittencourt Ferraz · Processo 4567890-12.2026.8.26.0100 · 3ª Vara Fazenda Pública SP — IMRT obrigatório',
    time: '30min atrás',
    read: false,
    href: '/analise?id=REQ-2026-ONC-003',
  },
  // ── M3: NIP aberta ANS ──────────────────────────────────────────────
  {
    id: 'notif-sadt-004-nip',
    type: 'nip_aberta',
    title: 'NIP aberta — RN 483/2022',
    message:
      'REQ-2026-SADT-004 · Marcos Pereira Couto · NIP-2026-784521 · prazo de resposta ANS: 12/05/2026',
    time: '45min atrás',
    read: false,
    href: '/analise?id=REQ-2026-SADT-004',
  },
  // ── M3: Oncologia — protocolo AC-T continuidade ─────────────────────
  {
    id: 'notif-onc-001-novo',
    type: 'novo_pedido_fila',
    title: 'Oncologia — continuidade de protocolo',
    message:
      'REQ-2026-ONC-001 · Antônio Souza Lopes · AC-T ciclo 4/8 · Quimioterapia EV (RN 566/2022 — 10 dias úteis)',
    time: '1h atrás',
    read: false,
    href: '/analise?id=REQ-2026-ONC-001',
  },
  {
    id: 'REQ-2026-04895',
    type: 'liminar_recebida',
    title: 'Liminar Judicial registrada — pacote TEA',
    message:
      'REQ-2026-04895 · Arthur Lima Ferraz · Processo 1023456-78.2025.8.26.0100 · cobertura integral protocolo multidisciplinar',
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
