import { type NivelUrgencia } from '@/shared/utils/urgencia';

export interface UrgencySegment {
  label: string;
  key: NivelUrgencia;
  color: string;
  count: number;
  url: string;
}

export interface BarDataItem {
  label: string;
  total: number;
  color: string;
  categoria: string;
}

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

export interface CategoryData {
  categoria: string;
  total: number;
  pendentes: number;
  color: string;
}
