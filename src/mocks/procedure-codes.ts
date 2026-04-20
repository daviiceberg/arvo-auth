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
  // ── Pacote 4: Psicologia ABA individual (código proprietário Athena) ─
  {
    id: 'pkg-tea-004',
    packageCode: '98170444',
    packageName: 'PCT-TEA — Psicologia ABA Individual (código Athena)',
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
];
