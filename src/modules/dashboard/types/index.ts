export interface MonthlyTrendItem {
  mes: string;
  aprovados: number;
  negados: number;
}

export interface DenialReason {
  motivo: string;
  count: number;
  color: string;
}

export interface AlertItem {
  tipo: string;
  count: number;
  color: string;
}
