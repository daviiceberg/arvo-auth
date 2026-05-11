import { type OperatorPackage, type TussCode } from '@/types/procedure-codes';

// ── TUSS codes (Table 22 — Procedimentos e Exames) ─────────────────
export const TUSS_CODES: TussCode[] = [
  {
    code: '50000470',
    description: 'Sessão de Análise Comportamental Aplicada (ABA)',
    tableNumber: 22,
    chapter: 'Cap. 5',
  },
  { code: '50000370', description: 'Sessão de Fonoaudiologia', tableNumber: 22, chapter: 'Cap. 5' },
  {
    code: '50000489',
    description: 'Sessão de Terapia Ocupacional',
    tableNumber: 22,
    chapter: 'Cap. 5',
  },
  {
    code: '50000438',
    description: 'Sessão de Psicoterapia Individual',
    tableNumber: 22,
    chapter: 'Cap. 5',
  },
  { code: '50000497', description: 'Sessão de Fisioterapia', tableNumber: 22, chapter: 'Cap. 5' },
  { code: '50000500', description: 'Sessão de Psicopedagogia', tableNumber: 22, chapter: 'Cap. 5' },
  {
    code: '20104219',
    description: 'Sessão de Psicoterapia Individual (tabela 20)',
    tableNumber: 20,
    chapter: 'Cap. 2',
  },
  {
    code: '10101039',
    description: 'Atendimento eletivo ambulatorial',
    tableNumber: 22,
    chapter: 'Cap. 1',
  },
  // ── Urgência/Emergência (M3) ──────────────────────────────────────
  {
    code: '10101047',
    description: 'Atendimento de urgência/emergência',
    tableNumber: 22,
    chapter: 'Cap. 1',
  },
  {
    code: '30202010',
    description: 'Internação de urgência',
    tableNumber: 22,
    chapter: 'Cap. 3',
  },
  {
    code: '30202028',
    description: 'Internação emergencial em UTI',
    tableNumber: 22,
    chapter: 'Cap. 3',
  },
  {
    code: '30911044',
    description: 'Cateterismo cardíaco E/D',
    tableNumber: 22,
    chapter: 'Cap. 3',
  },
  {
    code: '30911052',
    description: 'Angioplastia coronariana',
    tableNumber: 22,
    chapter: 'Cap. 3',
  },
  {
    code: '30911060',
    description: 'Implante de stent coronariano',
    tableNumber: 22,
    chapter: 'Cap. 3',
  },
  {
    code: '31003036',
    description: 'Colecistectomia videolaparoscópica',
    tableNumber: 22,
    chapter: 'Cap. 3',
  },
  // ── Oncologia (M3) ────────────────────────────────────────────────
  {
    code: '41101010',
    description: 'Quimioterapia antineoplásica EV',
    tableNumber: 22,
    chapter: 'Cap. 4',
  },
  {
    code: '41101028',
    description: 'Quimioterapia oral protocolar',
    tableNumber: 22,
    chapter: 'Cap. 4',
  },
  {
    code: '41101036',
    description: 'Hormonioterapia antineoplásica',
    tableNumber: 22,
    chapter: 'Cap. 4',
  },
  {
    code: '41101044',
    description: 'Imunoterapia antineoplásica (Pembrolizumabe, Nivolumabe)',
    tableNumber: 22,
    chapter: 'Cap. 4',
  },
  {
    code: '41201019',
    description: 'Radioterapia conformacional 3D',
    tableNumber: 22,
    chapter: 'Cap. 4',
  },
  {
    code: '41201027',
    description: 'IMRT (Radioterapia Modulada)',
    tableNumber: 22,
    chapter: 'Cap. 4',
  },
  {
    code: '41201035',
    description: 'Radioterapia estereotáxica',
    tableNumber: 22,
    chapter: 'Cap. 4',
  },
  {
    code: '40808125',
    description: 'PET-CT Oncológico',
    tableNumber: 22,
    chapter: 'Cap. 4',
  },
];

// ── Operator packages ───────────────────────────────────────────────
export const OPERATOR_PACKAGES: OperatorPackage[] = [
  // ── Pacote 1: Protocolo ABA intensivo (mensal) ─────────────────────
  {
    id: 'pkg-tea-001',
    packageCode: '98170141',
    packageName: 'PCT-TEA — ABA Intensivo (20 sessões/mês)',
    packageValue: 4800.0,
    tussCodesIncluded: [
      {
        code: '50000470',
        description: 'Sessão de Análise Comportamental Aplicada (ABA)',
        tableNumber: 22,
      },
    ],
    isActive: true,
  },
  // ── Pacote 2: Protocolo multidisciplinar básico ─────────────────────
  {
    id: 'pkg-tea-002',
    packageCode: '98170242',
    packageName: 'PCT-TEA — Multidisciplinar Básico (ABA + Fono)',
    packageValue: 3200.0,
    tussCodesIncluded: [
      {
        code: '50000470',
        description: 'Sessão de Análise Comportamental Aplicada (ABA)',
        tableNumber: 22,
      },
      { code: '50000370', description: 'Sessão de Fonoaudiologia', tableNumber: 22 },
    ],
    isActive: true,
  },
  // ── Pacote 3: Protocolo multidisciplinar completo ───────────────────
  {
    id: 'pkg-tea-003',
    packageCode: '98170343',
    packageName: 'PCT-TEA — Multidisciplinar Completo (ABA + Fono + TO + Psico)',
    packageValue: 5600.0,
    tussCodesIncluded: [
      {
        code: '50000470',
        description: 'Sessão de Análise Comportamental Aplicada (ABA)',
        tableNumber: 22,
      },
      { code: '50000370', description: 'Sessão de Fonoaudiologia', tableNumber: 22 },
      { code: '50000489', description: 'Sessão de Terapia Ocupacional', tableNumber: 22 },
      { code: '50000438', description: 'Sessão de Psicoterapia Individual', tableNumber: 22 },
    ],
    isActive: true,
  },
  // ── Pacote 4: Psicologia ABA individual (código proprietário operadora) ─
  {
    id: 'pkg-tea-004',
    packageCode: '98170444',
    packageName: 'PCT-TEA — Psicologia ABA Individual (código operadora)',
    packageValue: 2400.0,
    tussCodesIncluded: [
      { code: '50000438', description: 'Sessão de Psicoterapia Individual', tableNumber: 22 },
      {
        code: '50000470',
        description: 'Sessão de Análise Comportamental Aplicada (ABA)',
        tableNumber: 22,
      },
    ],
    isActive: true,
  },
  // ── Pacote 5: Reabilitação de linguagem (Fono + TO) ─────────────────
  {
    id: 'pkg-tea-005',
    packageCode: '98170545',
    packageName: 'PCT-TEA — Reabilitação de Linguagem (Fono + TO)',
    packageValue: 2800.0,
    tussCodesIncluded: [
      { code: '50000370', description: 'Sessão de Fonoaudiologia', tableNumber: 22 },
      { code: '50000489', description: 'Sessão de Terapia Ocupacional', tableNumber: 22 },
    ],
    isActive: true,
  },
  // ── Pacote U/E: Cateterismo cardíaco ─────────────────────────────────
  {
    id: 'pkg-ue-001',
    packageCode: '98911044',
    packageName: 'PCT - Cateterismo coronariano',
    packageValue: 8500.0,
    tussCodesIncluded: [
      { code: '30911044', description: 'Cateterismo cardíaco E/D', tableNumber: 22 },
    ],
    isActive: true,
  },
  // ── Pacote U/E: Reabilitação multidisciplinar ────────────────────────
  {
    id: 'pkg-ue-002',
    packageCode: '98500047',
    packageName: 'PCT - Reabilitação multidisciplinar (10 sessões)',
    packageValue: 3500.0,
    tussCodesIncluded: [
      { code: '50000497', description: 'Sessão de Fisioterapia', tableNumber: 22 },
      { code: '50000370', description: 'Sessão de Fonoaudiologia', tableNumber: 22 },
    ],
    isActive: true,
  },
  // ── Pacote Oncologia: AC-T mama ──────────────────────────────────────
  {
    id: 'pkg-onc-001',
    packageCode: '98410010',
    packageName: 'PCT - Quimioterapia AC-T (mama, 8 ciclos)',
    packageValue: 12500.0,
    tussCodesIncluded: [
      { code: '41101010', description: 'Quimioterapia antineoplásica EV', tableNumber: 22 },
    ],
    isActive: true,
  },
  // ── Pacote Oncologia: Radioterapia conformacional ────────────────────
  {
    id: 'pkg-onc-002',
    packageCode: '98412019',
    packageName: 'PCT - Radioterapia conformacional 3D (39 frações)',
    packageValue: 18000.0,
    tussCodesIncluded: [
      { code: '41201019', description: 'Radioterapia conformacional 3D', tableNumber: 22 },
    ],
    isActive: true,
  },
];
