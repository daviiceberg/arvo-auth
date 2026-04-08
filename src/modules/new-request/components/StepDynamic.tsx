'use client'

import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { type FormData, type TerapiaProcedimento } from '../types'
import { StepHospitalization } from './steps/StepHospitalization'
import { StepUrgency } from './steps/StepUrgency'
import { StepOncology } from './steps/StepOncology'
import { StepTherapies } from './steps/StepTherapies'
import { StepOpme } from './steps/StepOpme'
import { StepExams } from './steps/StepExams'
import { StepSurgeries } from './steps/StepSurgeries'
import { StepHomeCare } from './steps/StepHomeCare'

interface StepDynamicProps {
  form: FormData
  setForm: React.Dispatch<React.SetStateAction<FormData>>
  set: (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  setSelect: (field: keyof FormData) => (value: string) => void
  terapiaProcedimentos: TerapiaProcedimento[]
  handleAddTerapiaProc: () => void
  handleRemoveTerapiaProc: (id: string) => void
  handleUpdateTerapiaProc: (id: string, field: keyof Omit<TerapiaProcedimento, 'id'>, value: string) => void
}

export function StepDynamic({
  form, setForm, set, setSelect,
  terapiaProcedimentos, handleAddTerapiaProc, handleRemoveTerapiaProc, handleUpdateTerapiaProc,
}: StepDynamicProps) {
  switch (form.tipoSolicitacao) {
    case 'cirurgias':
      return <StepSurgeries form={form} setForm={setForm} />
    case 'internacao':
      return <StepHospitalization form={form} set={set} setSelect={setSelect} />
    case 'urgencia':
      return <StepUrgency form={form} set={set} setSelect={setSelect} />
    case 'oncologia':
      return <StepOncology form={form} set={set} setSelect={setSelect} />
    case 'terapias':
      return (
        <StepTherapies
          form={form}
          setSelect={setSelect}
          terapiaProcedimentos={terapiaProcedimentos}
          handleAddTerapiaProc={handleAddTerapiaProc}
          handleRemoveTerapiaProc={handleRemoveTerapiaProc}
          handleUpdateTerapiaProc={handleUpdateTerapiaProc}
        />
      )
    case 'opme':
      return <StepOpme form={form} setForm={setForm} set={set} />
    case 'exames':
      return <StepExams form={form} setForm={setForm} />
    case 'homecare':
      return <StepHomeCare form={form} set={set} setSelect={setSelect} />
    default:
      return (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <Typography>Selecione um tipo de solicitação na Etapa 1 para continuar.</Typography>
        </Box>
      )
  }
}
