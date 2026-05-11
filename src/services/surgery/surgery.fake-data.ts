/**
 * @prototype
 * @status FAKE — awaiting real backend endpoint
 * @planned-endpoint GET /api/v1/surgery/pre-op-requirements
 *                   POST /api/v1/surgery/pre-op/validate
 *                   POST /api/v1/surgery/analyze
 *
 * Templates ilustrativos de pré-operatório por tipo de cirurgia.
 * Whitelabel via operatorConfig (ADR-007) — operadoras podem ajustar
 * obrigatoriedade e itens por tipo de cirurgia.
 */

import { type SurgeryType } from '@/types/pedido';

import { type PreOpRequirementTemplate } from './surgery.types';

const COMMON_PRE_OP: PreOpRequirementTemplate[] = [
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

const ECG: PreOpRequirementTemplate = {
  id: 'PRE_OP_ECG',
  type: 'exame',
  description: 'Eletrocardiograma de repouso',
  required: true,
};

const RX_TORAX: PreOpRequirementTemplate = {
  id: 'PRE_OP_RX_TORAX',
  type: 'exame',
  description: 'Radiografia de tórax PA + perfil',
  required: true,
};

const CARDIO_CONSULTA: PreOpRequirementTemplate = {
  id: 'PRE_OP_CARDIO',
  type: 'consulta',
  description: 'Consulta com cardiologista',
  required: false,
};

export const PRE_OP_BY_SURGERY_TYPE: Record<SurgeryType, PreOpRequirementTemplate[]> = {
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
