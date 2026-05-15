import { type Notification } from '@/types/notificacao';

/**
 * Mock de notificações cobrindo todos os tipos definidos em
 * `src/types/notificacao.ts`. Ordem aproximada: mais recente/urgente primeiro.
 */
export const NOTIFICACOES: Notification[] = [
  // ── M6: Falha persistente de processamento — REQ-2026-05011 ─────────
  {
    id: 'notif-proc-falhou-005011',
    type: 'processamento_falhou_definitivamente',
    title: 'Falha persistente no processamento',
    message:
      'Pedido REQ-2026-05011 falhou ao processar após várias tentativas — revisar manualmente.',
    time: '3min atrás',
    read: false,
    href: '/dashboard',
  },
  // ── Urgência/Emergência — SLA crítico 30min ─────────────────────────
  {
    id: 'notif-ue-002-sla-30min',
    type: 'sla_critico_30min',
    title: 'SLA crítico violado — politrauma',
    message:
      'REQ-2026-UE-002 · Rafael Cardoso Almeida · Internação UTI · Manchester vermelho · prazo excedido',
    time: '2min atrás',
    read: false,
    href: '/analise?id=REQ-2026-UE-002',
  },
  // ── M5: OPME alto valor — encaminhado para Junta Médica ─────────────
  {
    id: 'notif-opme-004-junta',
    type: 'novo_pedido_fila',
    title: 'OPME de alto valor — análise por Junta Médica',
    message:
      'REQ-2026-OPME-004 · Walter Bittencourt Neto · Endoprótese aórtica R$ 78.500 · divergência > 30% entre cotações',
    time: '5min atrás',
    read: false,
    href: '/analise?id=REQ-2026-OPME-004',
  },
  // ── Urgência — emergência cardíaca (SCA) ────────────────────────────
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
  // ── M5: OPME ANVISA expirado — alerta ────────────────────────────────
  {
    id: 'notif-opme-002-anvisa-expirado',
    type: 'sla_risco',
    title: 'OPME com ANVISA expirado — revisão necessária',
    message:
      'REQ-2026-OPME-002 · Eduardo Marques Tavares · Stent coronariano (registro vencido em 2023-12-31) · alerta para análise',
    time: '12min atrás',
    read: false,
    href: '/analise?id=REQ-2026-OPME-002',
  },
  // ── Documento extraído pela IA ──────────────────────────────────────
  {
    id: 'notif-cir-001-doc-processado',
    type: 'documento_processado',
    title: 'IA extraiu dados do laudo',
    message:
      'REQ-2026-CIR-001 · Beatriz Pinheiro Almeida · Laudo de RM lombar processado — campos pré-preenchidos disponíveis',
    time: '20min atrás',
    read: false,
    href: '/analise?id=REQ-2026-CIR-001',
  },
  // ── Liminar Judicial — Oncologia ────────────────────────────────────
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
  // ── NIP aberta ANS ──────────────────────────────────────────────────
  {
    id: 'notif-sadt-004-nip-aberta',
    type: 'nip_aberta',
    title: 'NIP aberta — RN 483/2022',
    message:
      'REQ-2026-SADT-004 · Marcos Pereira Couto · NIP-2026-784521 · prazo de resposta ANS: 12/05/2026',
    time: '45min atrás',
    read: false,
    href: '/analise?id=REQ-2026-SADT-004',
  },
  // ── M5: Pacote OPME (TISS 19) — processamento concluído ─────────────
  {
    id: 'notif-opme-006-processamento-ok',
    type: 'processamento_ok',
    title: 'Pacote OPME processado e na fila',
    message:
      'REQ-2026-OPME-006 · Antônia Lopes Vasconcelos · Kit Artroplastia Joelho · 3 materiais validados na ANVISA — pronto para análise',
    time: '55min atrás',
    read: false,
    href: '/analise?id=REQ-2026-OPME-006',
  },
  // ── Oncologia — continuidade protocolo AC-T ─────────────────────────
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
  // ── Junta Médica — parecer recebido ─────────────────────────────────
  {
    id: 'notif-m1-junta-002-parecer',
    type: 'junta_parecer_recebido',
    title: 'Parecer da Junta Médica disponível',
    message:
      'REQ-2026-M1-JUNTA-002 · Isabela Castro Vidigal · Parecer técnico recebido — aguardando sua decisão',
    time: '1h atrás',
    read: false,
    href: '/analise?id=REQ-2026-M1-JUNTA-002',
  },
  // ── SLA crítico — 1h restante (cirurgia eletiva próxima do prazo) ───
  {
    id: 'notif-cir-002-sla-1h',
    type: 'sla_critico_1h',
    title: 'SLA crítico — menos de 1h restante',
    message:
      'REQ-2026-CIR-002 · Marcelo Augusto Pereira · Colecistectomia · prazo regulatório expira em 58min',
    time: '1h atrás',
    read: false,
    href: '/analise?id=REQ-2026-CIR-002',
  },
  // ── Liminar — pacote TEA ────────────────────────────────────────────
  {
    id: 'notif-tea-04895-liminar',
    type: 'liminar_recebida',
    title: 'Liminar Judicial registrada — pacote TEA',
    message:
      'REQ-2026-04895 · Arthur Lima Ferraz · Processo 1023456-78.2025.8.26.0100 · cobertura integral protocolo multidisciplinar',
    time: '2h atrás',
    read: false,
    href: '/analise?id=REQ-2026-04895',
  },
  // ── M5: OPME devolutiva ao prestador ────────────────────────────────
  {
    id: 'notif-opme-005-devolutiva',
    type: 'devolutiva_recebida',
    title: 'Devolutiva OPME — prestador respondeu',
    message:
      'REQ-2026-OPME-005 · Sandra Aparecida Costa · Tela cirúrgica · registro ANVISA atualizado pelo prestador — pronto para reanálise',
    time: '2h atrás',
    read: false,
    href: '/analise?id=REQ-2026-OPME-005',
  },
  // ── Junta Médica agendada ───────────────────────────────────────────
  {
    id: 'notif-m1-junta-001-agendada',
    type: 'junta_agendada',
    title: 'Junta Médica agendada',
    message:
      'REQ-2026-M1-JUNTA-001 · Reunião marcada para 28/04 às 10:00 · Desempatador: Dr. Roberto Mendes',
    time: '3h atrás',
    read: true,
    href: '/analise?id=REQ-2026-M1-JUNTA-001',
  },
  // ── Devolutiva SADT recebida ────────────────────────────────────────
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
  // ── SLA violado — exame alta complexidade ───────────────────────────
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
  // ── NIP — prazo de resposta próximo do vencimento ───────────────────
  {
    id: 'notif-sadt-004-nip-prazo',
    type: 'nip_prazo_proximo',
    title: 'NIP — prazo de resposta próximo',
    message:
      'REQ-2026-SADT-004 · Marcos Pereira Couto · NIP-2026-784521 · 2 dias úteis para resposta ANS',
    time: '6h atrás',
    read: true,
    href: '/analise?id=REQ-2026-SADT-004',
  },
  // ── Erro no processamento ───────────────────────────────────────────
  {
    id: 'notif-05004-erro-processamento',
    type: 'processamento_erro',
    title: 'REQ-2026-05004 — Erro no processamento',
    message: 'Não foi possível extrair dados do laudo anexado. Requer reanálise manual.',
    time: '8h atrás',
    read: true,
    href: '/dashboard',
  },
  // ── SLA em risco — Home Care ────────────────────────────────────────
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
  // ── Pendência prazo vencido ─────────────────────────────────────────
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
