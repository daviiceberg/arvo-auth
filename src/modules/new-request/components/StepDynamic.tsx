'use client';

import { type ReactNode } from 'react';

import Alert from '@mui/material/Alert';

import { type Category } from '@/types/pedido';

import {
  type FormData,
  type TerapiaProcedimento,
  type SadtProcedimento,
  type ExamsProcedimento,
  type HomeCareItem,
} from '../types';

import { StepExams } from './steps/StepExams';
import { StepHomeCare } from './steps/StepHomeCare';
import { StepSadt } from './steps/StepSadt';
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
  handleAddSadtProcedimento: () => void;
  handleRemoveSadtProcedimento: (id: string) => void;
  handleUpdateSadtProcedimento: (
    id: string,
    field: keyof Omit<SadtProcedimento, 'id'>,
    value: string,
  ) => void;
  handleAddExamsProcedimento: () => void;
  handleRemoveExamsProcedimento: (id: string) => void;
  handleUpdateExamsProcedimento: (
    id: string,
    field: keyof Omit<ExamsProcedimento, 'id'>,
    value: string,
  ) => void;
  handleAddHomeCareProcedimento: () => void;
  handleRemoveHomeCareProcedimento: (id: string) => void;
  handleUpdateHomeCareProcedimento: (
    id: string,
    field: keyof Omit<HomeCareItem, 'id'>,
    value: string,
  ) => void;
}

// Mitigação obrigatória de R-M2-02: roteamento por categoria via Record<Category, ReactNode>.
// TypeScript força exhaustividade — adicionar valor novo a `Category` quebra esta build até
// que o step correspondente seja registrado aqui.
function buildStepByCategory(props: StepDynamicProps): Record<Category, ReactNode> {
  return {
    'Terapias Especiais': (
      <StepTherapies
        form={props.form}
        setSelect={props.setSelect}
        terapiaProcedimentos={props.terapiaProcedimentos}
        handleAddTerapiaProc={props.handleAddTerapiaProc}
        handleRemoveTerapiaProc={props.handleRemoveTerapiaProc}
        handleUpdateTerapiaProc={props.handleUpdateTerapiaProc}
      />
    ),
    SADT: (
      <StepSadt
        form={props.form}
        setSelect={props.setSelect}
        handleAddSadtProcedimento={props.handleAddSadtProcedimento}
        handleRemoveSadtProcedimento={props.handleRemoveSadtProcedimento}
        handleUpdateSadtProcedimento={props.handleUpdateSadtProcedimento}
      />
    ),
    'Exames Alta Complexidade': (
      <StepExams
        form={props.form}
        setSelect={props.setSelect}
        handleAddExamsProcedimento={props.handleAddExamsProcedimento}
        handleRemoveExamsProcedimento={props.handleRemoveExamsProcedimento}
        handleUpdateExamsProcedimento={props.handleUpdateExamsProcedimento}
      />
    ),
    'Home Care': (
      <StepHomeCare
        form={props.form}
        setSelect={props.setSelect}
        handleAddHomeCareProcedimento={props.handleAddHomeCareProcedimento}
        handleRemoveHomeCareProcedimento={props.handleRemoveHomeCareProcedimento}
        handleUpdateHomeCareProcedimento={props.handleUpdateHomeCareProcedimento}
      />
    ),
  };
}

export function StepDynamic(props: StepDynamicProps) {
  if (props.form.category === '') {
    return (
      <Alert severity="warning" sx={{ fontSize: 13 }}>
        Selecione uma categoria na primeira etapa do wizard.
      </Alert>
    );
  }
  const stepByCategory = buildStepByCategory(props);
  return <>{stepByCategory[props.form.category]}</>;
}
