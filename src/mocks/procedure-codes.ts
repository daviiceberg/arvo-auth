import { type OperatorPackage, type TussCode } from '@/types/procedure-codes';

// ── TUSS codes (Table 22 — Procedimentos e Exames) ─────────────────
export const TUSS_CODES: TussCode[] = [
  { code: '10101039', description: 'Atendimento de urgência/emergência', tableNumber: 22 },
  { code: '30911044', description: 'Cateterismo cardíaco E/D', tableNumber: 22, chapter: 'Cap. 3' },
  { code: '30911052', description: 'Angioplastia coronariana', tableNumber: 22, chapter: 'Cap. 3' },
  {
    code: '30911060',
    description: 'Implante de stent coronariano',
    tableNumber: 22,
    chapter: 'Cap. 3',
  },
  {
    code: '30719138',
    description: 'Artroplastia total do joelho',
    tableNumber: 22,
    chapter: 'Cap. 3',
  },
  { code: '50000470', description: 'Sessão de fisioterapia', tableNumber: 22, chapter: 'Cap. 5' },
  { code: '50000489', description: 'Sessão de fonoaudiologia', tableNumber: 22, chapter: 'Cap. 5' },
  {
    code: '50000497',
    description: 'Sessão de terapia ocupacional',
    tableNumber: 22,
    chapter: 'Cap. 5',
  },
  { code: '50000500', description: 'Sessão de psicoterapia', tableNumber: 22, chapter: 'Cap. 5' },
  {
    code: '40301150',
    description: 'Ressonância magnética de coluna lombar',
    tableNumber: 22,
    chapter: 'Cap. 4',
  },
  {
    code: '40301184',
    description: 'Ressonância magnética de crânio',
    tableNumber: 22,
    chapter: 'Cap. 4',
  },
  {
    code: '40302040',
    description: 'Tomografia computadorizada de abdome',
    tableNumber: 22,
    chapter: 'Cap. 4',
  },
  {
    code: '31003036',
    description: 'Colecistectomia videolaparoscópica',
    tableNumber: 22,
    chapter: 'Cap. 3',
  },
  {
    code: '30724058',
    description: 'Artroscopia diagnóstica de joelho',
    tableNumber: 22,
    chapter: 'Cap. 3',
  },
  {
    code: '20104219',
    description: 'Sessão de quimioterapia paliativa',
    tableNumber: 22,
    chapter: 'Cap. 2',
  },
];

// ── Operator packages ───────────────────────────────────────────────
export const OPERATOR_PACKAGES: OperatorPackage[] = [
  {
    id: 'pkg-001',
    packageCode: '98911044',
    packageName: 'PCT - Cateterismo coronariano',
    packageValue: 6002.95,
    tussCodesIncluded: [
      { code: '30911044', description: 'Cateterismo cardíaco E/D', tableNumber: 22 },
      { code: '30911052', description: 'Angioplastia coronariana', tableNumber: 22 },
      { code: '30911060', description: 'Implante de stent coronariano', tableNumber: 22 },
    ],
    isActive: true,
  },
  {
    id: 'pkg-002',
    packageCode: '98719138',
    packageName: 'PCT - Artroplastia total joelho',
    packageValue: 18450.0,
    tussCodesIncluded: [
      { code: '30719138', description: 'Artroplastia total do joelho', tableNumber: 22 },
      { code: '30724058', description: 'Artroscopia diagnóstica de joelho', tableNumber: 22 },
    ],
    isActive: true,
  },
  {
    id: 'pkg-003',
    packageCode: '98003036',
    packageName: 'PCT - Colecistectomia vídeo',
    packageValue: 4800.0,
    tussCodesIncluded: [
      { code: '31003036', description: 'Colecistectomia videolaparoscópica', tableNumber: 22 },
    ],
    isActive: true,
  },
  {
    id: 'pkg-004',
    packageCode: '98500047',
    packageName: 'PCT - Reabilitação multidisciplinar (10 sessões)',
    packageValue: 2200.0,
    tussCodesIncluded: [
      { code: '50000470', description: 'Sessão de fisioterapia', tableNumber: 22 },
      { code: '50000489', description: 'Sessão de fonoaudiologia', tableNumber: 22 },
      { code: '50000497', description: 'Sessão de terapia ocupacional', tableNumber: 22 },
    ],
    isActive: true,
  },
];
