import { type CodeType } from '@/types/procedure-codes';

export interface CodeTypeColor {
  bg: string;
  text: string;
  border: string;
}

export const codeTypeColorMap: Record<CodeType, CodeTypeColor> = {
  TUSS: {
    bg: '#E1F5EE',
    text: '#0F6E56',
    border: '#5DCAA5',
  },
  PACKAGE: {
    bg: '#EEEDFE',
    text: '#534AB7',
    border: '#AFA9EC',
  },
};
