export interface CidEntry {
  code: string;
  description: string;
}

export const CID_DATABASE: CidEntry[] = [
  { code: 'F84', description: 'Transtornos globais do desenvolvimento' },
  { code: 'F84.0', description: 'Autismo infantil' },
  { code: 'F84.1', description: 'Autismo atípico' },
  { code: 'F84.2', description: 'Síndrome de Rett' },
  {
    code: 'F84.3',
    description: 'Outro transtorno desintegrativo da infância',
  },
  {
    code: 'F84.4',
    description:
      'Transtorno com hipercinesia associada a retardo mental e movimentos estereotipados',
  },
  { code: 'F84.5', description: 'Síndrome de Asperger' },
  { code: 'F84.8', description: 'Outros transtornos globais do desenvolvimento' },
  {
    code: 'F84.9',
    description: 'Transtorno global do desenvolvimento não especificado',
  },
  {
    code: 'F80',
    description: 'Transtornos específicos do desenvolvimento da fala e linguagem',
  },
  { code: 'F80.0', description: 'Transtorno específico da articulação da fala' },
  { code: 'F80.1', description: 'Transtorno expressivo de linguagem' },
  { code: 'F80.2', description: 'Transtorno receptivo de linguagem' },
  {
    code: 'F80.9',
    description: 'Transtorno do desenvolvimento da fala e linguagem, não especificado',
  },
  { code: 'F82', description: 'Transtorno específico do desenvolvimento motor' },
  { code: 'F83', description: 'Transtornos específicos mistos do desenvolvimento' },
  { code: 'F90', description: 'Transtornos hipercinéticos' },
  { code: 'F90.0', description: 'Distúrbios da atividade e da atenção (TDAH)' },
  { code: 'G80', description: 'Paralisia cerebral' },
  { code: 'Q90', description: 'Síndrome de Down' },
  { code: 'F70', description: 'Retardo mental leve' },
  { code: 'F71', description: 'Retardo mental moderado' },
  { code: 'F72', description: 'Retardo mental grave' },
  { code: 'R62', description: 'Atraso no desenvolvimento fisiológico normal esperado' },
  { code: 'R62.0', description: 'Retardo do desenvolvimento' },
];

export function searchCids(query: string): CidEntry[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  return CID_DATABASE.filter(
    (c) => c.code.toLowerCase().startsWith(q) || c.description.toLowerCase().includes(q),
  );
}
