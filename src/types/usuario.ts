export type UserRole = 'gestor' | 'autorizador' | 'auditor';

export type UserStatus = 'ativo' | 'inativo';

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
