import { type SurgeryType } from '@/types/pedido';

import { type PreOpFormItem, type SurgeryTipoChoice } from '../types';

interface PreOpTemplate {
  id: string;
  type: PreOpFormItem['type'];
  description: string;
  required: boolean;
}

const COMMON_PRE_OP: PreOpTemplate[] = [
  { id: 'PRE_OP_HEMOGRAMA', type: 'exame', description: 'Hemograma completo', required: true },
  { id: 'PRE_OP_COAGULOGRAMA', type: 'exame', description: 'Coagulograma', required: true },
  { id: 'PRE_OP_BIOQUIMICA', type: 'exame', description: 'Bioquímica básica', required: true },
  {
    id: 'PRE_OP_AVALIACAO_PRE_ANESTESICA',
    type: 'avaliacao',
    description: 'Avaliação pré-anestésica',
    required: true,
  },
];

const ECG: PreOpTemplate = {
  id: 'PRE_OP_ECG',
  type: 'exame',
  description: 'Eletrocardiograma de repouso',
  required: true,
};

const RX_TORAX: PreOpTemplate = {
  id: 'PRE_OP_RX_TORAX',
  type: 'exame',
  description: 'Radiografia de tórax PA + perfil',
  required: true,
};

const CARDIO_CONSULTA: PreOpTemplate = {
  id: 'PRE_OP_CARDIO',
  type: 'consulta',
  description: 'Consulta com cardiologista',
  required: false,
};

const PRE_OP_TEMPLATES_BY_SURGERY: Record<SurgeryType, PreOpTemplate[]> = {
  geral_eletiva: [...COMMON_PRE_OP, ECG, RX_TORAX],
  ortopedica_programada: [
    ...COMMON_PRE_OP,
    ECG,
    RX_TORAX,
    {
      id: 'PRE_OP_RX_LOCAL',
      type: 'exame',
      description: 'Radiografia da articulação envolvida',
      required: true,
    },
  ],
  oftalmologica: [...COMMON_PRE_OP],
  plastica_reparadora: [
    ...COMMON_PRE_OP,
    ECG,
    {
      id: 'PRE_OP_FOTOS',
      type: 'avaliacao',
      description: 'Documentação fotográfica pré-operatória',
      required: true,
    },
  ],
  oncologica_eletiva: [
    ...COMMON_PRE_OP,
    ECG,
    RX_TORAX,
    CARDIO_CONSULTA,
    {
      id: 'PRE_OP_ESTADIAMENTO',
      type: 'avaliacao',
      description: 'Estadiamento oncológico atualizado',
      required: true,
    },
  ],
};

export function buildPreOpFromTemplate(
  surgeryType: SurgeryTipoChoice,
  factory: (template: PreOpTemplate) => PreOpFormItem,
): PreOpFormItem[] {
  if (!surgeryType) return [];
  const templates = PRE_OP_TEMPLATES_BY_SURGERY[surgeryType];
  return templates.map((tpl) => factory(tpl));
}
