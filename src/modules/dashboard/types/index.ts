import { type NivelUrgencia } from '@/shared/utils/urgencia';

export interface UrgencySegment {
  label: string;
  key: NivelUrgencia;
  color: string;
  count: number;
  url: string;
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
