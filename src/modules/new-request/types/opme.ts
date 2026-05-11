import { type AnvisaStatus, type OpmeValueReasonCode } from '@/types/pedido';

export interface AnvisaConsultResult {
  status: AnvisaStatus | 'error';
  productName?: string;
}

export interface OpmeFormQuotation {
  id: string;
  supplier: string;
  brand: string;
  unitValue: string;
}

export interface OpmeFormMaterial {
  id: string;
  materialCode: string;
  materialDescription: string;
  manufacturer: string;
  brand: string;
  unit: string;
  quantity: string;
  unitValue: string;
  anvisaRegistration: string;
  anvisaStatus: AnvisaStatus;
  anvisaProductName: string;
  anvisaValidUntil: string;
  anvisaConsultedAt: string;
  quotations: OpmeFormQuotation[];
  chosenQuotationId: string;
  chosenReasonCode: OpmeValueReasonCode | '';
  chosenReasonNote: string;
}

export function createEmptyOpmeQuotation(): OpmeFormQuotation {
  return {
    id: crypto.randomUUID(),
    supplier: '',
    brand: '',
    unitValue: '',
  };
}

export function createEmptyOpmeMaterial(): OpmeFormMaterial {
  return {
    id: crypto.randomUUID(),
    materialCode: '',
    materialDescription: '',
    manufacturer: '',
    brand: '',
    unit: 'unidade',
    quantity: '1',
    unitValue: '',
    anvisaRegistration: '',
    anvisaStatus: 'not_checked',
    anvisaProductName: '',
    anvisaValidUntil: '',
    anvisaConsultedAt: '',
    quotations: [
      createEmptyOpmeQuotation(),
      createEmptyOpmeQuotation(),
      createEmptyOpmeQuotation(),
    ],
    chosenQuotationId: '',
    chosenReasonCode: '',
    chosenReasonNote: '',
  };
}

export function parseNumeric(value: string): number {
  const cleaned = value.replace(/\./g, '').replace(',', '.');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function materialTotalValue(material: OpmeFormMaterial): number {
  return parseNumeric(material.quantity) * parseNumeric(material.unitValue);
}

export function cheapestQuotation(material: OpmeFormMaterial): OpmeFormQuotation | undefined {
  const valid = material.quotations.filter((q) => parseNumeric(q.unitValue) > 0);
  if (valid.length === 0) return undefined;
  return valid.reduce((min, q) =>
    parseNumeric(q.unitValue) < parseNumeric(min.unitValue) ? q : min,
  );
}
