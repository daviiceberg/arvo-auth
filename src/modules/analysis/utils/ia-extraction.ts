// ---- Types ----
export type IAFieldStatus = 'ok' | 'warning' | 'error';

export interface IAExtractionField {
  label: string;
  valor: string;
  status: IAFieldStatus;
}

interface DocumentTypeRule {
  patterns: string[];
  getFields: () => IAExtractionField[];
}

const DOCUMENT_TYPE_RULES: DocumentTypeRule[] = [
  {
    patterns: ['pedido', 'médico', 'solicitação'],
    getFields: () => [
      {
        label: 'Profissional solicitante',
        valor: 'Identificado com conselho legível',
        status: 'ok',
      },
      { label: 'CID principal', valor: 'Presente e compatível', status: 'ok' },
      { label: 'Procedimento', valor: 'Código TUSS identificado', status: 'ok' },
      { label: 'Data da solicitação', valor: 'Presente', status: 'ok' },
      { label: 'Assinatura', valor: 'Presente', status: 'ok' },
      { label: 'Carimbo profissional', valor: 'Não identificado', status: 'warning' },
    ],
  },
  {
    patterns: ['laudo', 'relatório', 'neuropsicol', 'evolução', 'evolucao'],
    getFields: () => [
      { label: 'Data do laudo', valor: 'Identificada', status: 'ok' },
      { label: 'Hipótese diagnóstica', valor: 'Presente', status: 'ok' },
      { label: 'Assinatura e registro profissional', valor: 'Legíveis', status: 'ok' },
      { label: 'Carimbo profissional', valor: 'Ausente', status: 'error' },
      {
        label: 'Justificativa clínica',
        valor: 'Incompleta — faltam dados de evolução',
        status: 'warning',
      },
    ],
  },
  {
    patterns: ['plano terapêutico', 'plano terapeutico'],
    getFields: () => [
      { label: 'Tipo de terapia', valor: 'Identificado', status: 'ok' },
      { label: 'Frequência semanal', valor: 'Presente', status: 'ok' },
      { label: 'Duração prevista', valor: 'Presente', status: 'ok' },
      { label: 'Assinatura do profissional executante', valor: 'Presente', status: 'ok' },
    ],
  },
];

const DEFAULT_FIELDS: IAExtractionField[] = [
  { label: 'Tipo de documento', valor: 'Identificado', status: 'ok' },
  { label: 'Data do documento', valor: 'Presente', status: 'ok' },
  { label: 'Autenticidade', valor: 'Não verificável automaticamente', status: 'warning' },
];

/**
 * Returns the list of IA-extracted fields for a given document,
 * based on its name and type keywords.
 */
export function getIAExtractionFields(docName: string, docType: string): IAExtractionField[] {
  const combined = (docName + docType).toLowerCase();
  const match = DOCUMENT_TYPE_RULES.find((rule) => rule.patterns.some((p) => combined.includes(p)));
  if (!match) return DEFAULT_FIELDS;
  const fields = match.getFields();
  return fields.length > 0 ? fields : DEFAULT_FIELDS;
}
