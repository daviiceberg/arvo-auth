'use client';

import React, { useState } from 'react';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import useEligibleParentRequests, { type EligibleParent } from '../hooks/useEligibleParentRequests';
import { type FormData } from '../types';
import { buildPrefilledFromParent } from '../utils/parent-prefill';

import ParentRequestSelectorDialog from './ParentRequestSelectorDialog';

function inputSx(validated = false) {
  return validated
    ? {
        backgroundColor: 'rgba(22,163,74,0.04)',
        borderColor: 'rgba(22,163,74,0.3)',
        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(22,163,74,0.5)',
        },
      }
    : undefined;
}

function FieldLabel({ children, validated }: { children: React.ReactNode; validated?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
      <Typography
        variant="caption"
        sx={{ fontSize: 12, fontWeight: 600, color: '#333', display: 'block' }}
      >
        {children}
      </Typography>
      {validated ? <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#166534' }} /> : null}
    </Box>
  );
}

interface BeneficiaryFieldsProps {
  form: FormData;
  set: (
    field: keyof FormData,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isManualEntry: boolean;
  bannerSlot?: React.ReactNode;
}

// eslint-disable-next-line complexity
function BeneficiaryFields({ form, set, isManualEntry, bannerSlot }: BeneficiaryFieldsProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldLabel validated={!isManualEntry && !!form.nomeBeneficiario}>
          Nome Completo *
        </FieldLabel>
        <TextField
          fullWidth
          size="small"
          value={form.nomeBeneficiario}
          onChange={set('nomeBeneficiario')}
          sx={!isManualEntry && form.nomeBeneficiario ? inputSx(true) : undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldLabel validated={!isManualEntry && !!form.carteirinha}>Carteirinha *</FieldLabel>
        <TextField
          fullWidth
          size="small"
          value={form.carteirinha}
          onChange={set('carteirinha')}
          sx={!isManualEntry && form.carteirinha ? inputSx(true) : undefined}
        />
      </Grid>
      {bannerSlot !== undefined && bannerSlot !== null ? (
        <Grid size={{ xs: 12 }} sx={{ pt: '4px !important' }}>
          {bannerSlot}
        </Grid>
      ) : null}
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldLabel validated={!isManualEntry && !!form.dataNascimento}>
          Data de Nascimento *
        </FieldLabel>
        <TextField
          fullWidth
          size="small"
          type="date"
          value={form.dataNascimento}
          onChange={set('dataNascimento')}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={!isManualEntry && form.dataNascimento ? inputSx(true) : undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldLabel validated={!isManualEntry && !!form.cpf}>CPF</FieldLabel>
        <TextField
          fullWidth
          size="small"
          placeholder="000.000.000-00"
          value={form.cpf}
          onChange={set('cpf')}
          sx={!isManualEntry && form.cpf ? inputSx(true) : undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldLabel validated={!isManualEntry && !!form.operadora}>Operadora / Plano *</FieldLabel>
        <TextField
          fullWidth
          size="small"
          value={form.operadora}
          onChange={set('operadora')}
          sx={!isManualEntry && form.operadora ? inputSx(true) : undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldLabel validated={!isManualEntry && !!form.validadeCarteirinha}>
          Validade da Carteirinha
        </FieldLabel>
        <TextField
          fullWidth
          size="small"
          type="date"
          value={form.validadeCarteirinha}
          onChange={set('validadeCarteirinha')}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={!isManualEntry && form.validadeCarteirinha ? inputSx(true) : undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldLabel validated={!isManualEntry && !!form.telefoneContato}>
          Telefone de Contato
        </FieldLabel>
        <TextField
          fullWidth
          size="small"
          placeholder="(11) 99999-9999"
          value={form.telefoneContato}
          onChange={set('telefoneContato')}
          sx={!isManualEntry && form.telefoneContato ? inputSx(true) : undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FieldLabel validated={!isManualEntry && !!form.dataInclusaoPlano}>
          Data de Inclusão no Plano
        </FieldLabel>
        <TextField
          fullWidth
          size="small"
          type="date"
          value={form.dataInclusaoPlano}
          onChange={set('dataInclusaoPlano')}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={!isManualEntry && form.dataInclusaoPlano ? inputSx(true) : undefined}
        />
      </Grid>
    </Grid>
  );
}

interface ParentLinkBannerProps {
  parentRequestId: string | null;
  eligibleCount: number;
  category: string;
  onOpenSelector: () => void;
  onDismiss: () => void;
  onUnlink: () => void;
}

function ParentLinkBanner({
  parentRequestId,
  eligibleCount,
  category,
  onOpenSelector,
  onDismiss,
  onUnlink,
}: ParentLinkBannerProps) {
  if (parentRequestId) {
    return (
      <Box
        sx={{
          p: 1.75,
          borderRadius: 1.5,
          backgroundColor: 'rgba(13,148,136,0.06)',
          border: '1px solid rgba(13,148,136,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <LinkIcon sx={{ fontSize: 18, color: '#0d9488' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600, color: '#0d9488' }}>
            Vinculado a {parentRequestId}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            Este pedido será cadastrado como complementar. Campos comuns foram pré-preenchidos.
          </Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          startIcon={<LinkOffIcon sx={{ fontSize: 14 }} />}
          onClick={onUnlink}
          sx={{ fontSize: 11 }}
        >
          Desvincular
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 1.75,
        borderRadius: 1.5,
        backgroundColor: 'rgba(37,99,235,0.04)',
        border: '1px solid rgba(37,99,235,0.18)',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <LinkIcon sx={{ fontSize: 18, color: '#2563eb' }} />
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
          Encontramos {eligibleCount} pedido(s) anterior(es) deste beneficiário em {category}.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
          Este é um pedido complementar (prorrogação ou continuidade)?
        </Typography>
      </Box>
      <Button size="small" variant="text" onClick={onDismiss} sx={{ fontSize: 11 }}>
        Não, é independente
      </Button>
      <Button size="small" variant="contained" onClick={onOpenSelector} sx={{ fontSize: 11 }}>
        Sim, vincular a pedido anterior
      </Button>
    </Box>
  );
}

interface StepBeneficiaryProps {
  form: FormData;
  set: (
    field: keyof FormData,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isManualEntry: boolean;
  onSetParentRequest: (parentId: string, prefilled: Partial<FormData>) => void;
  onClearParentRequest: () => void;
  onParentLinked?: (parentId: string) => void;
}

export function StepBeneficiary({
  form,
  set,
  isManualEntry,
  onSetParentRequest,
  onClearParentRequest,
  onParentLinked,
}: StepBeneficiaryProps) {
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const eligible = useEligibleParentRequests({
    cardNumber: form.carteirinha,
    category: form.category,
  });

  const hasAiData = !isManualEntry && form.nomeBeneficiario && form.nomeBeneficiario !== '';
  const showBanner = form.parentRequestId !== null || (eligible.length > 0 && !bannerDismissed);

  const handleSelect = (parent: EligibleParent) => {
    const prefilled = buildPrefilledFromParent(parent.id);
    onSetParentRequest(parent.id, prefilled);
    setDialogOpen(false);
    onParentLinked?.(parent.id);
  };

  return (
    <Box>
      {hasAiData ? (
        <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 3, fontSize: 12 }}>
          Preenchido por IA — Revise os dados abaixo
        </Alert>
      ) : null}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Dados do Beneficiário
      </Typography>
      <BeneficiaryFields
        form={form}
        set={set}
        isManualEntry={isManualEntry}
        bannerSlot={
          showBanner ? (
            <ParentLinkBanner
              parentRequestId={form.parentRequestId}
              eligibleCount={eligible.length}
              category={form.category}
              onOpenSelector={() => {
                setDialogOpen(true);
              }}
              onDismiss={() => {
                setBannerDismissed(true);
              }}
              onUnlink={onClearParentRequest}
            />
          ) : null
        }
      />
      <ParentRequestSelectorDialog
        open={dialogOpen}
        eligible={eligible}
        onClose={() => {
          setDialogOpen(false);
        }}
        onSelect={handleSelect}
      />
    </Box>
  );
}
