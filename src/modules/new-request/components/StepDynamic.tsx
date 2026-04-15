'use client';

import React from 'react';

import { type GuiaProcedure } from '@/types/procedure-codes';

import { type FormData, type TerapiaProcedimento } from '../types';

import { StepTherapies } from './steps/StepTherapies';

interface StepDynamicProps {
  form: FormData;
  setSelect: (field: keyof FormData) => (value: string) => void;
  terapiaProcedimentos: TerapiaProcedimento[];
  handleAddTerapiaProc: () => void;
  handleRemoveTerapiaProc: (id: string) => void;
  handleUpdateTerapiaProc: (
    id: string,
    field: keyof Omit<TerapiaProcedimento, 'id'>,
    value: string,
  ) => void;
  guiaProcedures: GuiaProcedure[];
  onGuiaProceduresChange: (procs: GuiaProcedure[]) => void;
}

export function StepDynamic({
  form,
  setSelect,
  terapiaProcedimentos,
  handleAddTerapiaProc,
  handleRemoveTerapiaProc,
  handleUpdateTerapiaProc,
  guiaProcedures,
  onGuiaProceduresChange,
}: StepDynamicProps) {
  return (
    <StepTherapies
      form={form}
      setSelect={setSelect}
      terapiaProcedimentos={terapiaProcedimentos}
      handleAddTerapiaProc={handleAddTerapiaProc}
      handleRemoveTerapiaProc={handleRemoveTerapiaProc}
      handleUpdateTerapiaProc={handleUpdateTerapiaProc}
      guiaProcedures={guiaProcedures}
      onGuiaProceduresChange={onGuiaProceduresChange}
    />
  );
}
