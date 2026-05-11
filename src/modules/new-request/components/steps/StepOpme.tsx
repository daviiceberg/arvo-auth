'use client';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type OpmeValueReasonCode } from '@/types/pedido';

import { SectionHeader } from '@/modules/new-request/components/SectionHeader';
import { type FormData } from '@/modules/new-request/types';
import {
  type AnvisaConsultResult,
  type OpmeFormMaterial,
  type OpmeFormQuotation,
} from '@/modules/new-request/types/opme';

import { OpmeFinancialSummary } from './opme/OpmeFinancialSummary';
import { OpmeMaterialCard } from './opme/OpmeMaterialCard';

const MAX_MATERIALS = 10;

interface StepOpmeProps {
  form: FormData;
  set: (
    field: keyof FormData,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAddOpmeMaterial: () => void;
  handleRemoveOpmeMaterial: (id: string) => void;
  handleUpdateOpmeMaterial: (
    id: string,
    field: keyof Omit<OpmeFormMaterial, 'id' | 'quotations'>,
    value: string,
  ) => void;
  handleAddOpmeQuotation: (materialId: string) => void;
  handleRemoveOpmeQuotation: (materialId: string, quotationId: string) => void;
  handleUpdateOpmeQuotation: (
    materialId: string,
    quotationId: string,
    field: keyof Omit<OpmeFormQuotation, 'id'>,
    value: string,
  ) => void;
  handleSelectOpmeQuotation: (materialId: string, quotationId: string) => void;
  handleSetOpmeChosenReason: (
    materialId: string,
    code: OpmeValueReasonCode | '',
    note: string,
  ) => void;
  handleConsultAnvisa: (materialId: string) => Promise<AnvisaConsultResult>;
  /** Quando renderizado dentro de outro step (ex: Cirurgias Eletivas), omite cabeçalhos. */
  embedded?: boolean;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="caption"
      sx={{ fontSize: 12, fontWeight: 600, color: '#333', mb: 0.75, display: 'block' }}
    >
      {children}
    </Typography>
  );
}

export function StepOpme({
  form,
  set,
  handleAddOpmeMaterial,
  handleRemoveOpmeMaterial,
  handleUpdateOpmeMaterial,
  handleAddOpmeQuotation,
  handleRemoveOpmeQuotation,
  handleUpdateOpmeQuotation,
  handleSelectOpmeQuotation,
  handleSetOpmeChosenReason,
  handleConsultAnvisa,
  embedded = false,
}: StepOpmeProps) {
  const materials = form.opmeMateriais;
  const canAdd = materials.length < MAX_MATERIALS;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {embedded ? null : (
        <>
          <SectionHeader
            title="Materiais OPME"
            subtitle="Cadastre material, valide registro ANVISA e anexe cotações de fornecedores."
          />
          <Alert
            severity="info"
            sx={{
              fontSize: 12,
              borderRadius: 2,
              border: '1px solid rgba(8,145,178,0.25)',
              '& .MuiAlert-message': { fontSize: 12 },
            }}
          >
            <strong>TISS 19 — Materiais.</strong> Registro ANVISA é consultado online. Materiais com
            vigência expirada geram alerta na análise (não bloqueiam o envio).
          </Alert>
          <Box
            sx={{
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '16px',
              p: 2,
              backgroundColor: '#fff',
            }}
          >
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, mb: 1.5 }}>
              Vínculo Clínico
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <FieldLabel>
                  Cirurgia ou procedimento associado (opcional para pedidos standalone)
                </FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  value={form.opmeRelatedSurgery}
                  onChange={set('opmeRelatedSurgery')}
                  placeholder="Ex: Artroplastia total de joelho direito — programada 12/05/2026"
                />
              </Grid>
            </Grid>
          </Box>
        </>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {materials.map((material, index) => (
          <OpmeMaterialCard
            key={material.id}
            index={index}
            total={materials.length}
            material={material}
            onUpdateField={(field, value) => {
              handleUpdateOpmeMaterial(material.id, field, value);
            }}
            onUpdateQuotation={(quotationId, field, value) => {
              handleUpdateOpmeQuotation(material.id, quotationId, field, value);
            }}
            onAddQuotation={() => {
              handleAddOpmeQuotation(material.id);
            }}
            onRemoveQuotation={(quotationId) => {
              handleRemoveOpmeQuotation(material.id, quotationId);
            }}
            onSelectQuotation={(quotationId) => {
              handleSelectOpmeQuotation(material.id, quotationId);
            }}
            onChangeReason={(code, note) => {
              handleSetOpmeChosenReason(material.id, code, note);
            }}
            onConsultAnvisa={() => handleConsultAnvisa(material.id)}
            onRemove={() => {
              handleRemoveOpmeMaterial(material.id);
            }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          variant="text"
          startIcon={<AddOutlinedIcon sx={{ fontSize: 18 }} />}
          onClick={handleAddOpmeMaterial}
          disabled={!canAdd}
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            justifyContent: 'flex-start',
            '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
          }}
        >
          Adicionar Material
        </Button>
      </Box>

      <OpmeFinancialSummary materials={materials} />
    </Box>
  );
}
