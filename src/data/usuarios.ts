import { type SystemUser, type UserPermissions, type UserRole } from '@/types/usuario';

// ── Helpers ────────────────────────────────────────────────────────────
export const roleLabels: Record<UserRole, string> = {
  gestor: 'Gestor',
  autorizador: 'Autorizador',
  auditor: 'Auditor',
};

export const defaultPermissions: Record<UserRole, UserPermissions> = {
  gestor: {
    canApprove: true,
    canDeny: true,
    canViewReports: true,
    canCreateUsers: true,
    canViewHistory: true,
    canConfigureSystem: true,
  },
  autorizador: {
    canApprove: true,
    canDeny: true,
    canViewReports: false,
    canCreateUsers: false,
    canViewHistory: true,
    canConfigureSystem: false,
  },
  auditor: {
    canApprove: false,
    canDeny: false,
    canViewReports: true,
    canCreateUsers: false,
    canViewHistory: true,
    canConfigureSystem: false,
  },
};

// ── Mock data ──────────────────────────────────────────────────────────
export const mockUsers: SystemUser[] = [
  {
    id: 'u-001',
    name: 'Ana Paula Santos',
    email: 'ana.santos@athena.com.br',
    role: 'gestor',
    status: 'ativo',
    lastAccess: '24/03/2026 14:32',
    createdAt: '01/01/2025',
    permissions: { ...defaultPermissions.gestor },
  },
  {
    id: 'u-002',
    name: 'Carlos Eduardo Ramos',
    email: 'carlos.ramos@athena.com.br',
    role: 'autorizador',
    status: 'ativo',
    lastAccess: '24/03/2026 12:10',
    createdAt: '10/03/2025',
    permissions: { ...defaultPermissions.autorizador },
  },
  {
    id: 'u-003',
    name: 'Juliana Costa',
    email: 'juliana.costa@athena.com.br',
    role: 'autorizador',
    status: 'ativo',
    lastAccess: '23/03/2026 16:45',
    createdAt: '15/03/2025',
    permissions: { ...defaultPermissions.autorizador },
  },
  {
    id: 'u-004',
    name: 'Roberto Almeida',
    email: 'roberto.almeida@athena.com.br',
    role: 'auditor',
    status: 'ativo',
    lastAccess: '22/03/2026 09:00',
    createdAt: '01/06/2025',
    permissions: { ...defaultPermissions.auditor },
  },
  {
    id: 'u-005',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@athena.com.br',
    role: 'autorizador',
    status: 'ativo',
    lastAccess: '21/03/2026 11:20',
    createdAt: '20/07/2025',
    permissions: { ...defaultPermissions.autorizador, canViewReports: true },
  },
  {
    id: 'u-006',
    name: 'Marcos Vinicius Souza',
    email: 'marcos.souza@athena.com.br',
    role: 'auditor',
    status: 'inativo',
    lastAccess: '10/01/2026 08:30',
    createdAt: '01/09/2025',
    permissions: { ...defaultPermissions.auditor },
  },
  {
    id: 'u-007',
    name: 'Patricia Nogueira',
    email: 'patricia.nogueira@athena.com.br',
    role: 'gestor',
    status: 'ativo',
    lastAccess: '24/03/2026 08:55',
    createdAt: '01/01/2025',
    permissions: { ...defaultPermissions.gestor },
  },
  {
    id: 'u-008',
    name: 'Diego Ferreira',
    email: 'diego.ferreira@athena.com.br',
    role: 'autorizador',
    status: 'inativo',
    createdAt: '15/11/2025',
    permissions: { ...defaultPermissions.autorizador },
  },
];
