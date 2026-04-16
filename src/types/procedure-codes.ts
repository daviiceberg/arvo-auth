export type CodeType = 'TUSS' | 'PACKAGE';

export interface TussCode {
  code: string;
  description: string;
  tableNumber: number;
  chapter?: string;
}

export interface OperatorPackage {
  id: string;
  packageCode: string;
  packageName: string;
  packageValue?: number;
  tussCodesIncluded: TussCode[];
  isActive: boolean;
}

export interface GuiaProcedure {
  id: string;
  codeType: CodeType;
  code: string;
  description: string;
  packageId?: string;
  tussCodesIncluded?: TussCode[];
  quantity: number;
  authorizedQuantity?: number;
  provider?: string;
  requestDate?: string;
  passwordExpiryDate?: string;
  cid?: string;
  isCredentialed?: boolean;
}
