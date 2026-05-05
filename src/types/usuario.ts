export type UserRole = 'gestor' | 'autorizador' | 'auditor';

export type UserStatus = 'ativo' | 'inativo';

/**
 * Perfil operacional do usuário. Modelo unificado em 3 valores:
 * - 'gestor' — acesso total (gestão de usuários, configuração, decisões)
 * - 'autorizador' — operação de análise e decisão (aprovar/negar/pendenciar/junta)
 * - 'auditor' — visualização e revisão; sem ações decisórias
 *
 * Estado atual do MVP: sistema opera sempre como Gestor (acesso total).
 * Diferenciação real por perfil fica para iteração futura.
 */
export type UserProfile = UserRole;

export interface UserPermissions {
  canApprove: boolean;
  canDeny: boolean;
  canViewReports: boolean;
  canCreateUsers: boolean;
  canViewHistory: boolean;
  canConfigureSystem: boolean;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastAccess?: string;
  createdAt: string;
  permissions: UserPermissions;
}
