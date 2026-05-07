export type DutSourceType = 'ANS' | 'OPERADORA';

export interface DutEntry {
  number: number;
  title: string;
  criteria: string;
  source: string;
  sourceType?: DutSourceType;
}
