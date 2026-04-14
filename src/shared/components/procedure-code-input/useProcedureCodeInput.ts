'use client';

import { useMemo, useState } from 'react';

import { type CodeType, type GuiaProcedure, type TussCode } from '@/types/procedure-codes';

import { OPERATOR_PACKAGES, TUSS_CODES } from '@/mocks/procedure-codes';

export interface CodeOption {
  codeType: CodeType;
  code: string;
  description: string;
  group: string;
  packageId?: string;
  tussCodesIncluded?: TussCode[];
}

const MIN_CHARS = 2;

function buildOptions(): CodeOption[] {
  const tussOptions: CodeOption[] = TUSS_CODES.map((t) => ({
    codeType: 'TUSS' as const,
    code: t.code,
    description: t.description,
    group: 'Códigos TUSS',
  }));

  const packageOptions: CodeOption[] = OPERATOR_PACKAGES.filter((p) => p.isActive).map((p) => ({
    codeType: 'PACKAGE' as const,
    code: p.packageCode,
    description: p.packageName,
    group: 'Pacotes da operadora',
    packageId: p.id,
    tussCodesIncluded: p.tussCodesIncluded,
  }));

  return [...tussOptions, ...packageOptions];
}

export function useProcedureCodeInput() {
  const [inputValue, setInputValue] = useState('');
  const allOptions = useMemo(() => buildOptions(), []);

  const filteredOptions = useMemo(() => {
    if (inputValue.length < MIN_CHARS) return [];
    const query = inputValue.toLowerCase();
    return allOptions.filter(
      (o) => o.code.toLowerCase().includes(query) || o.description.toLowerCase().includes(query),
    );
  }, [inputValue, allOptions]);

  const buildProcedure = (option: CodeOption): GuiaProcedure => ({
    id: crypto.randomUUID(),
    codeType: option.codeType,
    code: option.code,
    description: option.description,
    packageId: option.packageId,
    tussCodesIncluded: option.tussCodesIncluded,
    quantity: 1,
  });

  return {
    inputValue,
    setInputValue,
    filteredOptions,
    buildProcedure,
  };
}
