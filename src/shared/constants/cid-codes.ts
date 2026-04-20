export interface CidEntry {
  code: string;
  description: string;
  group: 'tea' | 'comorbidade' | 'outro';
}

export const CID_DATABASE: CidEntry[] = [
  // TEA — Espectro Autista
  { code: 'F84.0', description: 'Autismo infantil', group: 'tea' },
  { code: 'F84.1', description: 'Autismo atípico', group: 'tea' },
  { code: 'F84.2', description: 'Síndrome de Rett', group: 'tea' },
  {
    code: 'F84.3',
    description: 'Outro transtorno desintegrativo da infância',
    group: 'tea',
  },
  {
    code: 'F84.4',
    description:
      'Transtorno com hipercinesia associada a retardo mental e movimentos estereotipados',
    group: 'tea',
  },
  { code: 'F84.5', description: 'Síndrome de Asperger', group: 'tea' },
  {
    code: 'F84.8',
    description: 'Outros transtornos globais do desenvolvimento',
    group: 'tea',
  },
  { code: 'F84.9', description: 'TGD não especificado', group: 'tea' },
  { code: 'F84', description: 'Transtornos globais do desenvolvimento', group: 'tea' },
  // Comorbidades frequentes
  {
    code: 'F80.0',
    description: 'Transtorno específico da articulação da fala',
    group: 'comorbidade',
  },
  { code: 'F80.1', description: 'Transtorno expressivo de linguagem', group: 'comorbidade' },
  { code: 'F80.2', description: 'Transtorno receptivo de linguagem', group: 'comorbidade' },
  {
    code: 'F80.9',
    description: 'Transtorno do desenvolvimento da fala e linguagem NE',
    group: 'comorbidade',
  },
  {
    code: 'F82',
    description: 'Transtorno específico do desenvolvimento motor',
    group: 'comorbidade',
  },
  {
    code: 'F83',
    description: 'Transtornos específicos mistos do desenvolvimento',
    group: 'comorbidade',
  },
  { code: 'F90.0', description: 'TDAH', group: 'comorbidade' },
  { code: 'R62.0', description: 'Retardo do desenvolvimento', group: 'comorbidade' },
  {
    code: 'F80',
    description: 'Transtornos específicos da fala e linguagem',
    group: 'comorbidade',
  },
  // Outros diagnósticos
  { code: 'F70', description: 'Retardo mental leve', group: 'outro' },
  { code: 'F71', description: 'Retardo mental moderado', group: 'outro' },
  { code: 'F72', description: 'Retardo mental grave', group: 'outro' },
  { code: 'G80', description: 'Paralisia cerebral', group: 'outro' },
  { code: 'Q90', description: 'Síndrome de Down', group: 'outro' },
  { code: 'F90', description: 'Transtornos hipercinéticos', group: 'outro' },
  {
    code: 'R62',
    description: 'Atraso no desenvolvimento fisiológico normal esperado',
    group: 'outro',
  },
];

export const CID_GROUP_LABELS: Record<string, string> = {
  tea: 'TEA — Espectro Autista · sessões ilimitadas RN 539',
  comorbidade: 'Comorbidades frequentes',
  outro: 'Outros diagnósticos',
};

export function searchCids(query: string): CidEntry[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  return CID_DATABASE.filter(
    (c) => c.code.toLowerCase().startsWith(q) || c.description.toLowerCase().includes(q),
  );
}
