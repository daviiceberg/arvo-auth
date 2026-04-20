export const COUNCIL_TYPES = [
  { code: '04', label: 'CRFa', description: 'Conselho Regional de Fonoaudiologia' },
  { code: '06', label: 'CRM', description: 'Conselho Regional de Medicina' },
  { code: '09', label: 'CRP', description: 'Conselho Regional de Psicologia' },
  { code: '10', label: 'CREFITO', description: 'Conselho Regional de Fisioterapia e TO' },
] as const;

export type CouncilType = (typeof COUNCIL_TYPES)[number]['label'];
