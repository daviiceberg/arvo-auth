/**
 * Motivos de encaminhamento para Junta Médica.
 *
 * Baseado em RN 424/2017 e em práticas TEA mapeadas no Obsidian Vault
 * (junta = última instância para divergência técnico-assistencial).
 */
export interface JuntaReason {
  id: string;
  label: string;
}

export const JUNTA_REASONS: JuntaReason[] = [
  {
    id: 'DIVERGENCIA_TECNICA',
    label: 'Divergência técnico-assistencial entre auditor e médico solicitante',
  },
  {
    id: 'COMPLEXIDADE_CLINICA',
    label: 'Complexidade clínica — requer parecer especializado',
  },
  {
    id: 'ALTA_UTILIZACAO',
    label: 'Alta utilização — quantidade fora do protocolo padrão',
  },
  {
    id: 'METODO_QUESTIONAVEL',
    label: 'Método terapêutico questionável (sem cobertura obrigatória ANS)',
  },
  {
    id: 'CONTESTACAO_NEGATIVA',
    label: 'Contestação de negativa anterior',
  },
  {
    id: 'OUTRO',
    label: 'Outro (descrever na justificativa)',
  },
];
