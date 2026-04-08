export type UserRole = 'gestor' | 'autorizador' | 'auditor';

export type UserStatus = 'ativo' | 'inativo';

export interface UserPermissions {
  podeAprovar: boolean;
  podeNegar: boolean;
  podeVisualizarRelatorios: boolean;
  podeCriarUsuarios: boolean;
  podeVisualizarHistorico: boolean;
  podeConfigurarSistema: boolean;
}

export interface SystemUser {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  ultimoAcesso?: string;
  criadoEm: string;
  permissions: UserPermissions;
}
