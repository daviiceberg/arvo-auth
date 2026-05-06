'use client';

import React from 'react';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { COUNCIL_TYPES } from '@/shared/constants';
import {
  CID_DATABASE,
  CID_GROUP_LABELS,
  CID_GROUPS_BY_CATEGORY,
  type CidEntry,
} from '@/shared/constants/cid-codes';

import { type FormData } from '../types';

function formatCidOption(entry: CidEntry): string {
  return `${entry.code} — ${entry.description}`;
}

function createCidFilter(category: string) {
  return (options: CidEntry[], { inputValue }: { inputValue: string }): CidEntry[] => {
    const q = inputValue.toLowerCase().trim();
    const allowedGroups = CID_GROUPS_BY_CATEGORY[category] ?? ['tea', 'comorbidade', 'outro'];
    const filtered = options.filter((c) => allowedGroups.includes(c.group));

    if (q.length < 2) {
      return filtered;
    }
    return filtered.filter(
      (c) => c.code.toLowerCase().startsWith(q) || c.description.toLowerCase().includes(q),
    );
  };
}

// ── Field helpers ─────────────────────────────────────────────────────
function FieldLabel({
  children,
  validated,
  warning,
}: {
  children: React.ReactNode;
  validated?: boolean;
  warning?: boolean;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
      <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600, color: '#333' }}>
        {children}
      </Typography>
      {validated ? <CheckCircleOutlineIcon sx={{ fontSize: 14, color: 'success.main' }} /> : null}
      {warning ? <WarningAmberIcon sx={{ fontSize: 14, color: 'warning.light' }} /> : null}
    </Box>
  );
}

const inputSx = (validated?: boolean, warning?: boolean) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: validated ? '#f0fdf4' : warning ? '#fffbeb' : '#fff',
    '& fieldset': {
      borderColor: validated ? 'success.main' : warning ? 'warning.light' : undefined,
    },
  },
});

interface StepClinicalProps {
  form: FormData;
  set: (
    field: keyof FormData,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setSelect: (field: keyof FormData) => (value: string) => void;
  cidSecundarioInput: string;
  setCidSecundarioInput: (v: string) => void;
  addCidSecundario: (cid: string) => void;
  removeCidSecundario: (index: number) => void;
  isManualEntry: boolean;
  category: string;
}

export function StepClinical({
  form,
  set,
  setSelect,
  cidSecundarioInput,
  setCidSecundarioInput,
  addCidSecundario,
  removeCidSecundario,
  isManualEntry,
  category,
}: StepClinicalProps) {
  const hasAiData = !isManualEntry && form.cidPrincipal && form.cidPrincipal !== '';
  const filterCids = createCidFilter(category);

  return (
    <Box>
      {hasAiData ? (
        <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 3, fontSize: 12 }}>
          Preenchido por IA — Revise os dados abaixo
        </Alert>
      ) : null}

      {/* ── Bloco 1: Dados Clínicos ── */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Dados Clínicos
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FieldLabel validated={!!form.cidPrincipal} warning={!form.cidPrincipal}>
            CID Principal <span style={{ color: '#C62828' }}>*</span>
          </FieldLabel>
          <Autocomplete
            freeSolo
            openOnFocus
            options={CID_DATABASE}
            groupBy={(option) => CID_GROUP_LABELS[option.group] ?? ''}
            getOptionLabel={(opt) => (typeof opt === 'string' ? opt : formatCidOption(opt))}
            filterOptions={filterCids}
            inputValue={form.cidPrincipal}
            onInputChange={(_e, value) => {
              setSelect('cidPrincipal')(value);
            }}
            onChange={(_e, value) => {
              if (value && typeof value !== 'string') {
                setSelect('cidPrincipal')(formatCidOption(value));
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Clique para ver sugestões ou digite para buscar..."
                sx={inputSx(!!form.cidPrincipal, !form.cidPrincipal)}
              />
            )}
            renderOption={(props, option) => {
              const highlightThisGroup =
                category === 'Terapias Especiais' && option.group === 'tea';
              return (
                <li {...props} key={option.code}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline', width: '100%' }}>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 500,
                        fontFamily: 'monospace',
                        color: highlightThisGroup ? '#166534' : 'text.secondary',
                        flexShrink: 0,
                        minWidth: 56,
                      }}
                    >
                      {option.code}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: 'text.primary' }}>
                      {option.description}
                    </Typography>
                  </Box>
                </li>
              );
            }}
            renderGroup={(params) => {
              const isTEAGroup = params.group.includes('TEA');
              const highlightThisGroup = category === 'Terapias Especiais' && isTEAGroup;
              return (
                <li key={params.key}>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      backgroundColor: highlightThisGroup
                        ? 'rgba(22,163,74,0.06)'
                        : 'rgba(0,0,0,0.03)',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 0.4,
                        color: highlightThisGroup ? '#166534' : 'text.secondary',
                      }}
                    >
                      {params.group}
                    </Typography>
                  </Box>
                  <ul style={{ padding: 0 }}>{params.children}</ul>
                </li>
              );
            }}
            noOptionsText="Nenhum CID encontrado"
            size="small"
          />
          {/* Inline feedback (Terapias Especiais only) */}
          {category === 'Terapias Especiais' && form.cidPrincipal.startsWith('F84') ? (
            <Typography
              sx={{
                fontSize: 12,
                color: '#166534',
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              ✓ RN 539/2022 — sessões ilimitadas aplicáveis
            </Typography>
          ) : null}
          {category === 'Terapias Especiais' &&
          form.cidPrincipal &&
          !form.cidPrincipal.startsWith('F84') ? (
            <Typography sx={{ fontSize: 12, color: '#b45309', mt: 0.5 }}>
              CID fora do espectro F84 — RN 539 (sessões ilimitadas) não se aplica automaticamente
            </Typography>
          ) : null}
          {!form.cidPrincipal ? (
            <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.5 }}>
              O CID determina regras de cobertura. Clique no campo para ver sugestões.
            </Typography>
          ) : null}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FieldLabel>
            CIDs Secundários{' '}
            <Typography
              component="span"
              variant="caption"
              sx={{ color: '#64748b', fontWeight: 400 }}
            >
              (opcional)
            </Typography>
          </FieldLabel>
          {form.cidsSecundarios.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
              {form.cidsSecundarios.map((cid, idx) => (
                <Chip
                  key={idx}
                  label={cid}
                  size="small"
                  onDelete={() => {
                    removeCidSecundario(idx);
                  }}
                  sx={{
                    backgroundColor: 'rgba(37,99,235,0.08)',
                    color: 'info.main',
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                />
              ))}
            </Box>
          )}
          <Autocomplete
            freeSolo
            openOnFocus
            options={CID_DATABASE.filter(
              (c) =>
                !form.cidPrincipal.startsWith(c.code + ' ') &&
                !form.cidsSecundarios.some((s) => s.startsWith(c.code + ' ')),
            )}
            groupBy={(option) => CID_GROUP_LABELS[option.group] ?? ''}
            getOptionLabel={(opt) => (typeof opt === 'string' ? opt : formatCidOption(opt))}
            filterOptions={filterCids}
            inputValue={cidSecundarioInput}
            onInputChange={(_e, value) => {
              setCidSecundarioInput(value);
            }}
            onChange={(_e, value) => {
              if (value && typeof value !== 'string') {
                addCidSecundario(formatCidOption(value));
              } else if (typeof value === 'string' && value.trim()) {
                addCidSecundario(value);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                placeholder="Clique para ver sugestões ou digite para buscar..."
                sx={{ width: '100%' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && cidSecundarioInput.trim()) {
                    e.preventDefault();
                    addCidSecundario(cidSecundarioInput);
                  }
                }}
              />
            )}
            renderOption={(props, option) => {
              const highlightThisGroup =
                category === 'Terapias Especiais' && option.group === 'tea';
              return (
                <li {...props} key={option.code}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline', width: '100%' }}>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 500,
                        fontFamily: 'monospace',
                        color: highlightThisGroup ? '#166534' : 'text.secondary',
                        flexShrink: 0,
                        minWidth: 56,
                      }}
                    >
                      {option.code}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: 'text.primary' }}>
                      {option.description}
                    </Typography>
                  </Box>
                </li>
              );
            }}
            renderGroup={(params) => {
              const isTEAGroup = params.group.includes('TEA');
              const highlightThisGroup = category === 'Terapias Especiais' && isTEAGroup;
              return (
                <li key={params.key}>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      backgroundColor: highlightThisGroup
                        ? 'rgba(22,163,74,0.06)'
                        : 'rgba(0,0,0,0.03)',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: 0.4,
                        color: highlightThisGroup ? '#166534' : 'text.secondary',
                      }}
                    >
                      {params.group}
                    </Typography>
                  </Box>
                  <ul style={{ padding: 0 }}>{params.children}</ul>
                </li>
              );
            }}
            noOptionsText="Nenhum CID encontrado"
            value={null}
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FieldLabel validated={!!form.indicacaoClinica}>
            Indicação Clínica / Hipótese Diagnóstica <span style={{ color: '#C62828' }}>*</span>
          </FieldLabel>
          <TextField
            fullWidth
            multiline
            rows={4}
            size="small"
            value={form.indicacaoClinica}
            onChange={set('indicacaoClinica')}
            sx={inputSx(!!form.indicacaoClinica)}
          />
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', fontSize: 11, mt: 0.5, display: 'block' }}
          >
            Texto do médico justificando o pedido. Este campo é a base da análise — quanto mais
            detalhado, melhor.
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mt: 3,
              p: 1.5,
              borderRadius: 1.5,
              backgroundColor:
                form.procedimentoJaRealizado === 'sim' ? 'rgba(212,24,61,0.06)' : 'transparent',
              border:
                form.procedimentoJaRealizado === 'sim'
                  ? '1px solid rgba(212,24,61,0.2)'
                  : '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <input
              type="checkbox"
              checked={form.procedimentoJaRealizado === 'sim'}
              onChange={(e) => {
                setSelect('procedimentoJaRealizado')(e.target.checked ? 'sim' : '');
              }}
              style={{ width: 16, height: 16, accentColor: '#d4183d' }}
            />
            <Typography
              variant="body2"
              sx={{
                fontSize: 13,
                fontWeight: form.procedimentoJaRealizado === 'sim' ? 700 : 500,
                color: form.procedimentoJaRealizado === 'sim' ? 'error.main' : 'text.primary',
              }}
            >
              Procedimento já realizado antes da autorização
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* ── Bloco 2: Profissional Solicitante ── */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Profissional Solicitante
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated>Nome do Profissional</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={form.profissionalSolicitante}
            onChange={set('profissionalSolicitante')}
            sx={inputSx(true)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <FieldLabel validated>Conselho</FieldLabel>
          <FormControl fullWidth size="small">
            <Select
              value={form.conselhoTipo}
              onChange={(e) => {
                setSelect('conselhoTipo')(e.target.value);
              }}
              sx={inputSx(true)}
            >
              {COUNCIL_TYPES.map((c) => (
                <MenuItem key={c.code} value={c.label}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <FieldLabel validated>Nº no Conselho</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={form.conselhoNumero}
            onChange={set('conselhoNumero')}
            sx={inputSx(true)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <FieldLabel>UF</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={form.conselhoUF}
            onChange={set('conselhoUF')}
            placeholder="SP"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FieldLabel>Nome do Contratado Solicitante (Clínica)</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={form.nomeContratadoSolicitante}
            onChange={set('nomeContratadoSolicitante')}
            placeholder="Ex: Clínica Neuropediátrica Esperança"
          />
        </Grid>
      </Grid>

      {/* ── Bloco 3: Contratado Executante ── */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Contratado Executante
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 9 }}>
          <FieldLabel>Nome do Contratado Executante</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={form.nomeContratadoExecutante}
            onChange={set('nomeContratadoExecutante')}
            placeholder="Ex: Clínica Integrar TEA"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FieldLabel>Código CNES</FieldLabel>
          <TextField
            fullWidth
            size="small"
            placeholder="0000000"
            value={form.cnesExecutante}
            onChange={set('cnesExecutante')}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
