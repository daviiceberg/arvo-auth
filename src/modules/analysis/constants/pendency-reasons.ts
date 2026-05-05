/**
 * Motivos estruturados de pendência aplicáveis a Terapias Especiais (TEA).
 *
 * Cada motivo tem id estável (usado em audit log + template de notificação ao
 * prestador) e label visível para o analista.
 *
 * Adaptado da lista da versão full removendo motivos OPME/internação que não
 * fazem sentido em TEA, conforme regra do M1 (roadmap Nathan).
 */
export interface PendencyReason {
  id: string;
  label: string;
  description: string;
}

export const PENDENCY_REASONS: PendencyReason[] = [
  {
    id: 'LAUDO_NEURO_VENCIDO',
    label: 'Laudo neuropsicológico vencido (>12 meses)',
    description: 'Solicitar laudo neuropsicológico atualizado emitido há menos de 12 meses.',
  },
  {
    id: 'LAUDO_INCOMPLETO',
    label: 'Laudo incompleto (assinatura, carimbo ou data ausente)',
    description: 'Solicitar laudo completo com assinatura, carimbo do médico e data de emissão.',
  },
  {
    id: 'CID_NAO_CONFIRMADO',
    label: 'CID F84 não confirmado no laudo',
    description: 'Solicitar laudo que confirme explicitamente o diagnóstico de CID F84.x.',
  },
  {
    id: 'RELATORIO_EVOLUCAO_AUSENTE',
    label: 'Relatório de Evolução Terapêutica ausente (continuidade)',
    description:
      'Solicitar relatório de evolução terapêutica do executante referente ao período anterior.',
  },
  {
    id: 'PEDIDO_MEDICO_AUSENTE',
    label: 'Pedido médico ausente ou sem assinatura',
    description: 'Solicitar pedido médico com assinatura do solicitante e data.',
  },
  {
    id: 'CRM_INVALIDO',
    label: 'CRM do solicitante inválido ou não localizado',
    description: 'Confirmar CRM do médico solicitante e UF de registro.',
  },
  {
    id: 'PRESTADOR_DIVERGENTE',
    label: 'Prestador executante divergente do credenciado',
    description: 'Confirmar prestador executante credenciado para a modalidade solicitada.',
  },
  {
    id: 'QUANTIDADE_DIVERGENTE',
    label: 'Quantidade de sessões divergente do plano terapêutico',
    description:
      'Solicitar plano terapêutico atualizado justificando a quantidade de sessões pedida.',
  },
  {
    id: 'AUTORIZACAO_ANTERIOR_NAO_LOCALIZADA',
    label: 'Autorização anterior não localizada',
    description: 'Solicitar comprovante da autorização anterior referente ao mesmo plano.',
  },
  {
    id: 'OUTRO',
    label: 'Outro (descrever na justificativa)',
    description: 'Descrever na justificativa o que precisa ser complementado.',
  },
];

export type PendencyDeadlineDays = 3 | 7 | 15;

export const PENDENCY_DEADLINE_OPTIONS: { value: PendencyDeadlineDays; label: string }[] = [
  { value: 3, label: '3 dias úteis' },
  { value: 7, label: '7 dias úteis (padrão)' },
  { value: 15, label: '15 dias úteis' },
];
