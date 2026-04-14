import { type AnvisaStatus } from '@/shared/constants';

export interface OpmeQuotation {
  supplier: string;
  value: string;
}

export interface OpmeItemData {
  id: string;
  materialCode: string;
  materialDescription: string;
  quantity: string;
  unitValue: string;
  anvisaRegistration: string;
  anvisaStatus: AnvisaStatus;
  anvisaValidUntil: string;
  anvisaProductName: string;
  manufacturer: string;
  brandJustification: string;
  quotations: [OpmeQuotation, OpmeQuotation, OpmeQuotation];
}

export function createEmptyOpmeItem(): OpmeItemData {
  return {
    id: crypto.randomUUID(),
    materialCode: '',
    materialDescription: '',
    quantity: '1',
    unitValue: '',
    anvisaRegistration: '',
    anvisaStatus: 'not_checked',
    anvisaValidUntil: '',
    anvisaProductName: '',
    manufacturer: '',
    brandJustification: '',
    quotations: [
      { supplier: '', value: '' },
      { supplier: '', value: '' },
      { supplier: '', value: '' },
    ],
  };
}
