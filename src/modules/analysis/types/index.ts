export type ProcDecision = 'aprovado' | 'negado' | 'pendente'

export interface SnackbarState {
  open: boolean
  msg: string
  severity: 'success' | 'error' | 'info' | 'warning'
}

/** Mock user profile — in a real app, from auth context */
export type UserProfile = 'Autorizador' | 'Gestor' | 'Auditor'

export const USER_PROFILE: UserProfile = 'Gestor'
