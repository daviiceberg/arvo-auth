/**
 * Cores para alertas regulatórios/operacionais usados em chips, KPIs e tabs.
 * Centralizadas para evitar divergência entre Dashboard, Queue e outras superfícies.
 *
 * Decisão: bg alpha 0.12 como padrão. Devolutivas padroniza como purple (cor de Queue),
 * onde o autorizador passa mais tempo e a cor é distinta de "SLA em Risco" (amber).
 */
export interface RegulatoryAlertColors {
  bg: string;
  color: string;
}

export const regulatoryAlertColorMap = {
  liminares: {
    bg: 'rgba(91,33,182,0.12)',
    color: '#5b21b6',
  },
  nips: {
    bg: 'rgba(194,65,12,0.12)',
    color: '#c2410c',
  },
  devolutivas: {
    bg: 'rgba(124,58,237,0.12)',
    color: '#6d28d9',
  },
  opme: {
    bg: 'rgba(217,119,6,0.12)',
    color: '#b45309',
  },
} as const satisfies Record<string, RegulatoryAlertColors>;

export type RegulatoryAlertKind = keyof typeof regulatoryAlertColorMap;
