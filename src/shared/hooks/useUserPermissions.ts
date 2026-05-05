'use client';

import { useMemo } from 'react';

import { type UserProfile } from '@/types/usuario';

export interface UserPermissionsM1 {
  canApprove: boolean;
  canDeny: boolean;
  canAdjustValue: boolean;
  canPendency: boolean;
  canForwardToJunta: boolean;
  canViewHistory: boolean;
  canForceUnlock: boolean;
  canComment: boolean;
}

const FULL_ACCESS: UserPermissionsM1 = {
  canApprove: true,
  canDeny: true,
  canAdjustValue: true,
  canPendency: true,
  canForwardToJunta: true,
  canViewHistory: true,
  canForceUnlock: true,
  canComment: true,
};

/**
 * Permission matrix por UserProfile.
 *
 * Estado atual: sistema opera todo como Gestor (acesso total). Diferenciação
 * real por perfil (Autorizador limitado, Auditor read-only) fica para iteração
 * futura — quando ativada, basta restaurar o map condicional aqui usando
 * `'gestor' | 'autorizador' | 'auditor'`.
 *
 * Em produção, perfil virá do backend via sessão/JWT.
 */
export function useUserPermissions(): UserPermissionsM1 & { profile: UserProfile } {
  return useMemo(() => ({ ...FULL_ACCESS, profile: 'gestor' as const }), []);
}
