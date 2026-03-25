// ── Types ──────────────────────────────────────────────────────────────
export type UserRole = 'gestor' | 'autorizador' | 'auditor'
export type UserStatus = 'ativo' | 'inativo'

export interface UserPermissions {
  podeAprovar: boolean
  podeNegar: boolean
  podeVisualizarRelatorios: boolean
  podeCriarUsuarios: boolean
  podeVisualizarHistorico: boolean
  podeConfigurarSistema: boolean
}

export interface SystemUser {
  id: string
  nome: string
  email: string
  role: UserRole
  status: UserStatus
  ultimoAcesso?: string
  criadoEm: string
  permissions: UserPermissions
}

// ── Helpers ────────────────────────────────────────────────────────────
export const roleLabels: Record<UserRole, string> = {
  gestor: 'Gestor',
  autorizador: 'Autorizador',
  auditor: 'Auditor',
}

export const defaultPermissions: Record<UserRole, UserPermissions> = {
  gestor: {
    podeAprovar: true,
    podeNegar: true,
    podeVisualizarRelatorios: true,
    podeCriarUsuarios: true,
    podeVisualizarHistorico: true,
    podeConfigurarSistema: true,
  },
  autorizador: {
    podeAprovar: true,
    podeNegar: true,
    podeVisualizarRelatorios: false,
    podeCriarUsuarios: false,
    podeVisualizarHistorico: true,
    podeConfigurarSistema: false,
  },
  auditor: {
    podeAprovar: false,
    podeNegar: false,
    podeVisualizarRelatorios: true,
    podeCriarUsuarios: false,
    podeVisualizarHistorico: true,
    podeConfigurarSistema: false,
  },
}

// ── Mock data ──────────────────────────────────────────────────────────
export const mockUsers: SystemUser[] = [
  {
    id: 'u-001',
    nome: 'Ana Paula Santos',
    email: 'ana.santos@athena.com.br',
    role: 'gestor',
    status: 'ativo',
    ultimoAcesso: '24/03/2026 14:32',
    criadoEm: '01/01/2025',
    permissions: { ...defaultPermissions.gestor },
  },
  {
    id: 'u-002',
    nome: 'Carlos Eduardo Ramos',
    email: 'carlos.ramos@athena.com.br',
    role: 'autorizador',
    status: 'ativo',
    ultimoAcesso: '24/03/2026 12:10',
    criadoEm: '10/03/2025',
    permissions: { ...defaultPermissions.autorizador },
  },
  {
    id: 'u-003',
    nome: 'Juliana Costa',
    email: 'juliana.costa@athena.com.br',
    role: 'autorizador',
    status: 'ativo',
    ultimoAcesso: '23/03/2026 16:45',
    criadoEm: '15/03/2025',
    permissions: { ...defaultPermissions.autorizador },
  },
  {
    id: 'u-004',
    nome: 'Roberto Almeida',
    email: 'roberto.almeida@athena.com.br',
    role: 'auditor',
    status: 'ativo',
    ultimoAcesso: '22/03/2026 09:00',
    criadoEm: '01/06/2025',
    permissions: { ...defaultPermissions.auditor },
  },
  {
    id: 'u-005',
    nome: 'Fernanda Lima',
    email: 'fernanda.lima@athena.com.br',
    role: 'autorizador',
    status: 'ativo',
    ultimoAcesso: '21/03/2026 11:20',
    criadoEm: '20/07/2025',
    permissions: { ...defaultPermissions.autorizador, podeVisualizarRelatorios: true },
  },
  {
    id: 'u-006',
    nome: 'Marcos Vinicius Souza',
    email: 'marcos.souza@athena.com.br',
    role: 'auditor',
    status: 'inativo',
    ultimoAcesso: '10/01/2026 08:30',
    criadoEm: '01/09/2025',
    permissions: { ...defaultPermissions.auditor },
  },
  {
    id: 'u-007',
    nome: 'Patricia Nogueira',
    email: 'patricia.nogueira@athena.com.br',
    role: 'gestor',
    status: 'ativo',
    ultimoAcesso: '24/03/2026 08:55',
    criadoEm: '01/01/2025',
    permissions: { ...defaultPermissions.gestor },
  },
  {
    id: 'u-008',
    nome: 'Diego Ferreira',
    email: 'diego.ferreira@athena.com.br',
    role: 'autorizador',
    status: 'inativo',
    criadoEm: '15/11/2025',
    permissions: { ...defaultPermissions.autorizador },
  },
]
