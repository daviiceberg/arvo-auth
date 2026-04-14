'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { type GuiaProcedure } from '@/types/procedure-codes';

import { type FormData, type TerapiaProcedimento } from '../types';

import { StepExams } from './steps/StepExams';
import { StepHomeCare } from './steps/StepHomeCare';
import { StepHospitalization } from './steps/StepHospitalization';
import { StepOncology } from './steps/StepOncology';
import { StepOpme } from './steps/StepOpme';
import { StepSurgeries } from './steps/StepSurgeries';
import { StepTherapies } from './steps/StepTherapies';
import { StepUrgency } from './steps/StepUrgency';

interface StepDynamicProps {
  form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  set: (
    field: keyof FormData,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  setForm,
  set,
  setSelect,
  terapiaProcedimentos,
  handleAddTerapiaProc,
  handleRemoveTerapiaProc,
  handleUpdateTerapiaProc,
  guiaProcedures,
  onGuiaProceduresChange,
}: StepDynamicProps) {
  switch (form.tipoSolicitacao) {
    case 'cirurgias':
      return (
        <StepSurgeries
          form={form}
          setForm={setForm}
          guiaProcedures={guiaProcedures}
          onGuiaProceduresChange={onGuiaProceduresChange}
        />
      );
    case 'internacao':
      return (
        <StepHospitalization
          form={form}
          set={set}
          setSelect={setSelect}
          guiaProcedures={guiaProcedures}
          onGuiaProceduresChange={onGuiaProceduresChange}
        />
      );
    case 'urgencia':
      return (
        <StepUrgency
          form={form}
          set={set}
          setSelect={setSelect}
          guiaProcedures={guiaProcedures}
          onGuiaProceduresChange={onGuiaProceduresChange}
        />
      );
    case 'oncologia':
      return (
        <StepOncology
          form={form}
          set={set}
          setSelect={setSelect}
          guiaProcedures={guiaProcedures}
          onGuiaProceduresChange={onGuiaProceduresChange}
        />
      );
    case 'terapias':
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
    case 'opme':
      return (
        <StepOpme guiaProcedures={guiaProcedures} onGuiaProceduresChange={onGuiaProceduresChange} />
      );
    case 'exames':
      return (
        <StepExams
          form={form}
          setForm={setForm}
          guiaProcedures={guiaProcedures}
          onGuiaProceduresChange={onGuiaProceduresChange}
        />
      );
    case 'homecare':
      return (
        <StepHomeCare
          form={form}
          set={set}
          setSelect={setSelect}
          guiaProcedures={guiaProcedures}
          onGuiaProceduresChange={onGuiaProceduresChange}
        />
      );
    default:
      return (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <Typography>Selecione um tipo de solicitação na Etapa 1 para continuar.</Typography>
        </Box>
      );
  }
}
