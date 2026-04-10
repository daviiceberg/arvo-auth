import { type BudgetExtractedData } from '@/types/pedido';

// ---- Types ----
export type IAFieldStatus = 'ok' | 'warning' | 'error';

export interface IAExtractionField {
  label: string;
  valor: string;
  status: IAFieldStatus;
}

interface DocumentTypeRule {
  patterns: string[];
  getFields: (extractedData?: BudgetExtractedData) => IAExtractionField[];
}

const DOCUMENT_TYPE_RULES: DocumentTypeRule[] = [
  {
    patterns: ['orçamento', 'cotação'],
    getFields: (extractedData) => {
      if (!extractedData) return [];
      return [
        { label: 'Fabricante', valor: extractedData.fabricante, status: 'ok' },
        { label: 'Modelo do implante', valor: extractedData.modelo, status: 'ok' },
        {
          label: 'Valor unitário',
          valor: `R$ ${extractedData.valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          status: 'ok',
        },
        { label: 'Registro ANVISA', valor: extractedData.registroANVISA, status: 'ok' },
        {
          label: 'Cotações apresentadas',
          valor: `${String(extractedData.numeroCotacoes)} de 3 exigidas`,
          status: extractedData.numeroCotacoes < 3 ? 'error' : 'ok',
        },
        { label: 'Observação', valor: extractedData.observacao, status: 'warning' },
      ];
    },
  },
  {
    patterns: ['pedido', 'médico', 'solicitação'],
    getFields: () => [
      { label: 'Médico solicitante', valor: 'Identificado com CRM legível', status: 'ok' },
      { label: 'CID principal', valor: 'Presente e compatível', status: 'ok' },
      { label: 'Procedimento', valor: 'Código TUSS identificado', status: 'ok' },
      { label: 'Data da solicitação', valor: 'Presente', status: 'ok' },
      { label: 'Assinatura', valor: 'Presente', status: 'ok' },
      { label: 'Carimbo médico', valor: 'Não identificado', status: 'warning' },
    ],
  },
  {
    patterns: ['laudo', 'relatório'],
    getFields: () => [
      { label: 'Data do laudo', valor: 'Identificada', status: 'ok' },
      { label: 'Hipótese diagnóstica', valor: 'Presente', status: 'ok' },
      { label: 'Assinatura e CRM', valor: 'Legíveis', status: 'ok' },
      { label: 'Carimbo médico', valor: 'Ausente', status: 'error' },
      {
        label: 'Justificativa clínica',
        valor: 'Incompleta — faltam dados de evolução',
        status: 'warning',
      },
    ],
  },
  {
    patterns: ['judicial', 'liminar', 'jurídico'],
    getFields: () => [
      { label: 'Número do processo', valor: 'Identificado', status: 'ok' },
      { label: 'Vara/Tribunal', valor: 'Identificado', status: 'ok' },
      { label: 'Data de emissão', valor: 'Presente', status: 'ok' },
      { label: 'Assinatura digital', valor: 'Não verificável neste sistema', status: 'warning' },
    ],
  },
  {
    patterns: ['exame', 'imagem', 'ressonância', 'tomografia'],
    getFields: () => [
      { label: 'Tipo de exame', valor: 'Identificado', status: 'ok' },
      { label: 'Data de realização', valor: 'Presente', status: 'ok' },
      { label: 'Laudo médico', valor: 'Presente', status: 'ok' },
      { label: 'Conclusão diagnóstica', valor: 'Compatível com CID do pedido', status: 'ok' },
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
export function getIAExtractionFields(
  docName: string,
  docType: string,
  extractedData?: BudgetExtractedData,
): IAExtractionField[] {
  const combined = (docName + docType).toLowerCase();
  const match = DOCUMENT_TYPE_RULES.find((rule) => rule.patterns.some((p) => combined.includes(p)));
  if (!match) return DEFAULT_FIELDS;
  const fields = match.getFields(extractedData);
  return fields.length > 0 ? fields : DEFAULT_FIELDS;
}
