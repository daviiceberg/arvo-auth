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
  type UrgencyProcedimento,
  type OncologyProcedimento,
  type HospitalTaxItem,
  type HospitalizationProcedimento,
  type SurgeryAcessorio,
  type SurgeryTipoChoice,
  type PreOpFormItem,
} from '../types';

import { StepExams } from './steps/StepExams';
import { StepHomeCare } from './steps/StepHomeCare';
import { StepHospitalization } from './steps/StepHospitalization';
import { StepOncology } from './steps/StepOncology';
import { StepSadt } from './steps/StepSadt';
import { StepSurgeries } from './steps/StepSurgeries';
import { StepTherapies } from './steps/StepTherapies';
import { StepUrgency } from './steps/StepUrgency';

interface StepDynamicProps {
  form: FormData;
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
  handleAddUrgencyProcedimento: () => void;
  handleRemoveUrgencyProcedimento: (id: string) => void;
  handleUpdateUrgencyProcedimento: (
    id: string,
    field: keyof Omit<UrgencyProcedimento, 'id'>,
    value: string,
  ) => void;
  handleAddOncologyProcedimento: () => void;
  handleRemoveOncologyProcedimento: (id: string) => void;
  handleUpdateOncologyProcedimento: (
    id: string,
    field: keyof Omit<OncologyProcedimento, 'id'>,
    value: string,
  ) => void;
  handleAddHospitalizationProcedimento: () => void;
  handleRemoveHospitalizationProcedimento: (id: string) => void;
  handleUpdateHospitalizationProcedimento: (
    id: string,
    field: keyof Omit<HospitalizationProcedimento, 'id'>,
    value: string,
  ) => void;
  handleAddHospitalizationTaxa: () => void;
  handleRemoveHospitalizationTaxa: (id: string) => void;
  handleUpdateHospitalizationTaxa: (
    id: string,
    field: keyof Omit<HospitalTaxItem, 'id'>,
    value: string,
  ) => void;
  handleSetSurgeryTipo: (next: SurgeryTipoChoice) => void;
  handleSetSurgeryMainProcedure: (code: string, description: string) => void;
  handleAddSurgeryAcessorio: () => void;
  handleRemoveSurgeryAcessorio: (id: string) => void;
  handleUpdateSurgeryAcessorio: (
    id: string,
    field: keyof Omit<SurgeryAcessorio, 'id'>,
    value: string,
  ) => void;
  handleSetSurgeryHasOpme: (value: boolean) => void;
  handleSetSurgeryHasOncologyLink: (value: boolean) => void;
  handleAddPreOpItem: () => void;
  handleRemovePreOpItem: (id: string) => void;
  handleUpdatePreOpItem: (
    id: string,
    field: keyof Omit<PreOpFormItem, 'id' | 'templateId'>,
    value: string | boolean,
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
    'Urgência/Emergência': (
      <StepUrgency
        form={props.form}
        handleAddUrgencyProcedimento={props.handleAddUrgencyProcedimento}
        handleRemoveUrgencyProcedimento={props.handleRemoveUrgencyProcedimento}
        handleUpdateUrgencyProcedimento={props.handleUpdateUrgencyProcedimento}
      />
    ),
    Oncologia: (
      <StepOncology
        form={props.form}
        set={props.set}
        setSelect={props.setSelect}
        handleAddOncologyProcedimento={props.handleAddOncologyProcedimento}
        handleRemoveOncologyProcedimento={props.handleRemoveOncologyProcedimento}
        handleUpdateOncologyProcedimento={props.handleUpdateOncologyProcedimento}
      />
    ),
    Internação: (
      <StepHospitalization
        form={props.form}
        set={props.set}
        setSelect={props.setSelect}
        handleAddHospitalizationProcedimento={props.handleAddHospitalizationProcedimento}
        handleRemoveHospitalizationProcedimento={props.handleRemoveHospitalizationProcedimento}
        handleUpdateHospitalizationProcedimento={props.handleUpdateHospitalizationProcedimento}
        handleAddHospitalizationTaxa={props.handleAddHospitalizationTaxa}
        handleRemoveHospitalizationTaxa={props.handleRemoveHospitalizationTaxa}
        handleUpdateHospitalizationTaxa={props.handleUpdateHospitalizationTaxa}
      />
    ),
    'Cirurgias Eletivas': (
      <StepSurgeries
        form={props.form}
        set={props.set}
        setSelect={props.setSelect}
        handleAddHospitalizationProcedimento={props.handleAddHospitalizationProcedimento}
        handleRemoveHospitalizationProcedimento={props.handleRemoveHospitalizationProcedimento}
        handleUpdateHospitalizationProcedimento={props.handleUpdateHospitalizationProcedimento}
        handleAddHospitalizationTaxa={props.handleAddHospitalizationTaxa}
        handleRemoveHospitalizationTaxa={props.handleRemoveHospitalizationTaxa}
        handleUpdateHospitalizationTaxa={props.handleUpdateHospitalizationTaxa}
        handleSetSurgeryTipo={props.handleSetSurgeryTipo}
        handleSetSurgeryMainProcedure={props.handleSetSurgeryMainProcedure}
        handleAddSurgeryAcessorio={props.handleAddSurgeryAcessorio}
        handleRemoveSurgeryAcessorio={props.handleRemoveSurgeryAcessorio}
        handleUpdateSurgeryAcessorio={props.handleUpdateSurgeryAcessorio}
        handleSetSurgeryHasOpme={props.handleSetSurgeryHasOpme}
        handleSetSurgeryHasOncologyLink={props.handleSetSurgeryHasOncologyLink}
        handleAddPreOpItem={props.handleAddPreOpItem}
        handleRemovePreOpItem={props.handleRemovePreOpItem}
        handleUpdatePreOpItem={props.handleUpdatePreOpItem}
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
