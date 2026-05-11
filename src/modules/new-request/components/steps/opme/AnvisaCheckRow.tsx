'use client';

import { useState } from 'react';

import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { anvisaStatusColorMap } from '@/shared/constants';

import { type AnvisaConsultResult, type OpmeFormMaterial } from '@/modules/new-request/types/opme';

interface AnvisaCheckRowProps {
  material: OpmeFormMaterial;
  onChangeRegistration: (value: string) => void;
  onConsult: () => Promise<AnvisaConsultResult>;
}

type ToastState = { kind: 'success' | 'warning' | 'error'; message: string } | null;
const TOAST_DURATION_MS = 3000;

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

function buildToast(result: AnvisaConsultResult): ToastState {
  if (result.status === 'valid') {
    return {
      kind: 'success',
      message: result.productName
        ? `Registro válido — ${result.productName}`
        : 'Registro válido na base ANVISA',
    };
  }
  if (result.status === 'invalid') {
    return { kind: 'warning', message: 'Registro encontrado, porém com vigência expirada' };
  }
  if (result.status === 'not_found') {
    return { kind: 'error', message: 'Registro não localizado na base ANVISA' };
  }
  if (result.status === 'error') {
    return { kind: 'error', message: 'Falha ao consultar ANVISA — tente novamente' };
  }
  return null;
}

export function AnvisaCheckRow({ material, onChangeRegistration, onConsult }: AnvisaCheckRowProps) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const statusConfig = anvisaStatusColorMap[material.anvisaStatus];

  const handleConsult = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await onConsult();
      const next = buildToast(result);
      setToast(next);
      if (next) {
        setTimeout(() => {
          setToast(null);
        }, TOAST_DURATION_MS);
      }
    } finally {
      setLoading(false);
    }
  };

  const showProduct = material.anvisaStatus === 'valid' && material.anvisaProductName !== '';

  return (
    <Box
      sx={{
        border: '1px dashed rgba(180,83,9,0.4)',
        borderRadius: '12px',
        p: 2,
        backgroundColor: 'rgba(217,119,6,0.04)',
      }}
    >
      <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, mb: 1.5 }}>
        Validação ANVISA
      </Typography>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid size={{ xs: 4 }}>
          <FieldLabel>Registro ANVISA</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={material.anvisaRegistration}
            onChange={(e) => {
              onChangeRegistration(e.target.value);
            }}
            placeholder="Ex: 10380700123"
          />
        </Grid>
        <Grid size={{ xs: 3 }}>
          <Tooltip
            title={
              material.anvisaRegistration.trim() === ''
                ? 'Digite o registro ANVISA para consultar.'
                : ''
            }
            arrow
            disableHoverListener={material.anvisaRegistration.trim() !== ''}
            disableFocusListener={material.anvisaRegistration.trim() !== ''}
            disableTouchListener={material.anvisaRegistration.trim() !== ''}
          >
            <Box>
              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                startIcon={
                  loading ? (
                    <CircularProgress size={14} />
                  ) : (
                    <FactCheckOutlinedIcon sx={{ fontSize: 16 }} />
                  )
                }
                onClick={() => {
                  void handleConsult();
                }}
                disabled={loading || material.anvisaRegistration.trim() === ''}
                sx={{ fontWeight: 600, height: 40 }}
              >
                {loading ? 'Consultando…' : 'Consultar'}
              </Button>
            </Box>
          </Tooltip>
        </Grid>
        <Grid size={{ xs: 5 }}>
          <FieldLabel>Status</FieldLabel>
          <Chip
            label={statusConfig.label}
            size="small"
            sx={{
              fontSize: 12,
              fontWeight: 700,
              height: 24,
              backgroundColor: statusConfig.bg,
              color: statusConfig.text,
            }}
          />
        </Grid>
        {showProduct ? (
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
              <strong>Produto:</strong> {material.anvisaProductName}
              {material.anvisaValidUntil ? (
                <>
                  {' '}
                  · <strong>Vigência:</strong> {material.anvisaValidUntil}
                </>
              ) : null}
            </Typography>
          </Grid>
        ) : null}
        {material.anvisaStatus === 'invalid' ? (
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" sx={{ fontSize: 12, color: '#b45309' }}>
              Registro com vigência expirada — alerta para a análise (não bloqueia o envio).
            </Typography>
          </Grid>
        ) : null}
        {material.anvisaStatus === 'not_found' ? (
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" sx={{ fontSize: 12, color: '#d4183d' }}>
              Registro não localizado na base ANVISA — corrija o número para prosseguir.
            </Typography>
          </Grid>
        ) : null}
        {toast ? (
          <Grid size={{ xs: 12 }}>
            <Alert
              severity={toast.kind === 'success' ? 'success' : toast.kind}
              variant="outlined"
              onClose={() => {
                setToast(null);
              }}
              sx={{
                fontSize: 12,
                py: 0.5,
                '& .MuiAlert-message': { fontSize: 12, py: 0.5 },
              }}
            >
              {toast.message}
            </Alert>
          </Grid>
        ) : null}
      </Grid>
    </Box>
  );
}
