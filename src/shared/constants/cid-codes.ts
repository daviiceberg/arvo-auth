export interface CidEntry {
  code: string;
  description: string;
  group: 'tea' | 'comorbidade' | 'outro' | 'urgencia' | 'oncologia';
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
  // Urgência/Emergência (M3) — quadros agudos frequentes em PS
  { code: 'I20.9', description: 'Angina pectoris não especificada', group: 'urgencia' },
  { code: 'I21.9', description: 'Infarto agudo do miocárdio NE', group: 'urgencia' },
  { code: 'I63.9', description: 'AVC isquêmico não especificado', group: 'urgencia' },
  { code: 'I64', description: 'Acidente vascular cerebral NE', group: 'urgencia' },
  { code: 'J45.1', description: 'Asma persistente moderada', group: 'urgencia' },
  { code: 'J45.9', description: 'Asma não especificada', group: 'urgencia' },
  { code: 'J18.9', description: 'Pneumonia não especificada', group: 'urgencia' },
  { code: 'J96.0', description: 'Insuficiência respiratória aguda', group: 'urgencia' },
  { code: 'K35.8', description: 'Apendicite aguda NE', group: 'urgencia' },
  { code: 'K92.2', description: 'Hemorragia gastrointestinal NE', group: 'urgencia' },
  { code: 'N39.0', description: 'Infecção do trato urinário NE', group: 'urgencia' },
  { code: 'O60', description: 'Trabalho de parto pré-termo', group: 'urgencia' },
  { code: 'R10.4', description: 'Dor abdominal aguda NE', group: 'urgencia' },
  { code: 'R55', description: 'Síncope e colapso', group: 'urgencia' },
  { code: 'R57.0', description: 'Choque cardiogênico', group: 'urgencia' },
  { code: 'S06.0', description: 'Concussão cerebral', group: 'urgencia' },
  { code: 'S06.5', description: 'Hemorragia subdural traumática', group: 'urgencia' },
  { code: 'S72.3', description: 'Fratura de diáfise do fêmur', group: 'urgencia' },
  { code: 'S36.0', description: 'Trauma de baço', group: 'urgencia' },
  {
    code: 'T07',
    description: 'Lesões múltiplas não especificadas (politrauma)',
    group: 'urgencia',
  },
  { code: 'T78.2', description: 'Choque anafilático NE', group: 'urgencia' },

  // Oncologia (M3) — neoplasias frequentes (C00-D49)
  { code: 'C18', description: 'Neoplasia maligna do cólon', group: 'oncologia' },
  { code: 'C18.9', description: 'Neoplasia maligna do cólon NE', group: 'oncologia' },
  { code: 'C20', description: 'Neoplasia maligna do reto', group: 'oncologia' },
  { code: 'C25', description: 'Neoplasia maligna do pâncreas', group: 'oncologia' },
  { code: 'C34.9', description: 'Neoplasia maligna do pulmão NE', group: 'oncologia' },
  { code: 'C50.9', description: 'Neoplasia maligna da mama NE', group: 'oncologia' },
  { code: 'C53.9', description: 'Neoplasia maligna do colo do útero NE', group: 'oncologia' },
  { code: 'C56', description: 'Neoplasia maligna do ovário', group: 'oncologia' },
  { code: 'C61', description: 'Neoplasia maligna da próstata', group: 'oncologia' },
  { code: 'C64', description: 'Neoplasia maligna do rim', group: 'oncologia' },
  { code: 'C71.9', description: 'Neoplasia maligna do encéfalo NE', group: 'oncologia' },
  { code: 'C73', description: 'Neoplasia maligna da glândula tireóide', group: 'oncologia' },
  { code: 'C81', description: 'Linfoma de Hodgkin', group: 'oncologia' },
  { code: 'C83', description: 'Linfoma não-Hodgkin', group: 'oncologia' },
  { code: 'C90', description: 'Mieloma múltiplo', group: 'oncologia' },
  { code: 'C91', description: 'Leucemia linfóide', group: 'oncologia' },
  { code: 'C92', description: 'Leucemia mielóide', group: 'oncologia' },
  // Comorbidades oncológicas frequentes
  { code: 'D63.0', description: 'Anemia em doença neoplásica', group: 'oncologia' },
  { code: 'D70', description: 'Neutropenia (frequente em QT)', group: 'oncologia' },
  {
    code: 'E03.9',
    description: 'Hipotireoidismo NE (toxicidade imunoterapia)',
    group: 'oncologia',
  },
  { code: 'R50.9', description: 'Febre não especificada (neutropenia febril)', group: 'oncologia' },
];

export const CID_GROUP_LABELS: Record<string, string> = {
  tea: 'TEA — Espectro Autista · sessões ilimitadas RN 539',
  comorbidade: 'Comorbidades frequentes',
  outro: 'Outros diagnósticos',
  urgencia: 'Urgência/Emergência — quadros agudos',
  oncologia: 'Oncologia — neoplasias e comorbidades',
};

export const CID_GROUPS_BY_CATEGORY: Record<string, CidEntry['group'][]> = {
  'Terapias Especiais': ['tea', 'comorbidade'],
  SADT: ['tea', 'comorbidade', 'outro'],
  'Exames Alta Complexidade': ['tea', 'comorbidade', 'outro'],
  'Home Care': ['tea', 'comorbidade', 'outro'],
  'Urgência/Emergência': ['urgencia', 'outro'],
  Oncologia: ['oncologia', 'outro'],
};

export function searchCids(query: string): CidEntry[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  return CID_DATABASE.filter(
    (c) => c.code.toLowerCase().startsWith(q) || c.description.toLowerCase().includes(q),
  );
}
