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
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { COUNCIL_TYPES } from '@/shared/constants';
import { CID_DATABASE, type CidEntry } from '@/shared/constants/cid-codes';

import { type FormData } from '../types';

function formatCidOption(entry: CidEntry): string {
  return `${entry.code} — ${entry.description}`;
}

function filterCids(options: CidEntry[], { inputValue }: { inputValue: string }): CidEntry[] {
  const q = inputValue.toLowerCase().trim();
  if (q.length < 2) return [];
  return options.filter(
    (c) => c.code.toLowerCase().startsWith(q) || c.description.toLowerCase().includes(q),
  );
}

const CID_SUGGESTIONS_PRINCIPAL: CidEntry[] = [
  { code: 'F84.0', description: 'Autismo infantil' },
  { code: 'F84.1', description: 'Autismo atípico' },
  { code: 'F84.3', description: 'Outro transtorno desintegrativo da infância' },
  { code: 'F84.5', description: 'Síndrome de Asperger' },
  { code: 'F84.8', description: 'Outros transtornos globais do desenvolvimento' },
  { code: 'F84.9', description: 'TGD não especificado' },
];

const CID_SUGGESTIONS_SECONDARY: CidEntry[] = [
  { code: 'F80.1', description: 'Transtorno expressivo de linguagem' },
  { code: 'F80.2', description: 'Transtorno receptivo de linguagem' },
  { code: 'F82', description: 'Transtorno específico do desenvolvimento motor' },
  { code: 'F90.0', description: 'Distúrbios da atividade e da atenção (TDAH)' },
  { code: 'R62.0', description: 'Retardo do desenvolvimento' },
];

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
}

export function StepClinical({
  form,
  set,
  setSelect,
  cidSecundarioInput,
  setCidSecundarioInput,
  addCidSecundario,
  removeCidSecundario,
}: StepClinicalProps) {
  return (
    <Box>
      <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 3, fontSize: 12 }}>
        Preenchido por IA — Revise os dados abaixo
      </Alert>

      {/* ── Bloco 1: Dados Clínicos ── */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Dados Clínicos
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FieldLabel validated>
            CID Principal{' '}
            <Typography
              component="span"
              variant="caption"
              sx={{ color: '#64748b', fontWeight: 400 }}
            >
              (opcional)
            </Typography>
          </FieldLabel>
          <Autocomplete
            freeSolo
            options={CID_DATABASE}
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
                placeholder="Buscar por código ou descrição (ex: F84, autismo...)"
                sx={inputSx(!!form.cidPrincipal)}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.code}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>
                    {option.code}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                    {option.description}
                  </Typography>
                </Box>
              </li>
            )}
            noOptionsText="Digite pelo menos 2 caracteres para buscar"
            size="small"
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontSize: 11, color: 'text.secondary', mr: 0.5 }}>
              Sugestões:
            </Typography>
            {CID_SUGGESTIONS_PRINCIPAL.map((cid) => (
              <Tooltip key={cid.code} title={cid.description} placement="top">
                <Chip
                  label={cid.code}
                  size="small"
                  onClick={() => {
                    setSelect('cidPrincipal')(formatCidOption(cid));
                  }}
                  sx={{
                    fontSize: 11,
                    height: 20,
                    cursor: 'pointer',
                    backgroundColor: 'rgba(144,43,41,0.06)',
                    '&:hover': { backgroundColor: 'rgba(144,43,41,0.12)' },
                  }}
                />
              </Tooltip>
            ))}
          </Box>
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
            options={CID_DATABASE}
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
                placeholder="Buscar CID secundário (ex: F80, TDAH...)"
                sx={{ width: '100%' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && cidSecundarioInput.trim()) {
                    e.preventDefault();
                    addCidSecundario(cidSecundarioInput);
                  }
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.code}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>
                    {option.code}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                    {option.description}
                  </Typography>
                </Box>
              </li>
            )}
            noOptionsText="Digite pelo menos 2 caracteres para buscar"
            value={null}
            size="small"
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontSize: 11, color: 'text.secondary', mr: 0.5 }}>
              Sugestões:
            </Typography>
            {CID_SUGGESTIONS_SECONDARY.map((cid) => (
              <Tooltip key={cid.code} title={cid.description} placement="top">
                <Chip
                  label={cid.code}
                  size="small"
                  onClick={() => {
                    addCidSecundario(formatCidOption(cid));
                  }}
                  sx={{
                    fontSize: 11,
                    height: 20,
                    cursor: 'pointer',
                    backgroundColor: 'rgba(37,99,235,0.06)',
                    '&:hover': { backgroundColor: 'rgba(37,99,235,0.12)' },
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FieldLabel warning>Caráter do Atendimento</FieldLabel>
          <FormControl fullWidth size="small">
            <Select
              value={form.caraterAtendimento}
              onChange={(e) => {
                setSelect('caraterAtendimento')(e.target.value);
              }}
              sx={{ backgroundColor: '#fffbeb', '& fieldset': { borderColor: 'warning.light' } }}
            >
              <MenuItem value="Eletivo">Eletivo</MenuItem>
              <MenuItem value="Urgência">Urgência</MenuItem>
              <MenuItem value="Emergência">Emergência</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FieldLabel validated>Indicação Clínica</FieldLabel>
          <TextField
            fullWidth
            multiline
            rows={4}
            size="small"
            value={form.indicacaoClinica}
            onChange={set('indicacaoClinica')}
            sx={inputSx(true)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Indicação de Acidente</FieldLabel>
          <FormControl fullWidth size="small">
            <Select
              value={form.indicacaoAcidente}
              onChange={(e) => {
                setSelect('indicacaoAcidente')(e.target.value);
              }}
            >
              <MenuItem value="NAO_ACIDENTE">Não Acidente</MenuItem>
              <MenuItem value="TRABALHO">Trabalho</MenuItem>
              <MenuItem value="TRANSITO">Trânsito</MenuItem>
              <MenuItem value="OUTROS">Outros</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
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
        <Grid size={{ xs: 12, md: 8 }}>
          <FieldLabel>Nome do Contratado Solicitante (Clínica)</FieldLabel>
          <TextField
            fullWidth
            size="small"
            value={form.nomeContratadoSolicitante}
            onChange={set('nomeContratadoSolicitante')}
            placeholder="Ex: Clínica Neuropediátrica Esperança"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FieldLabel>CNPJ do Solicitante</FieldLabel>
          <TextField
            fullWidth
            size="small"
            placeholder="00.000.000/0001-00"
            value={form.cnpjSolicitante}
            onChange={set('cnpjSolicitante')}
          />
        </Grid>
      </Grid>

      {/* ── Bloco 3: Contratado Executante ── */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Contratado Executante
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
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
          <FieldLabel>CNPJ / Código na Operadora</FieldLabel>
          <TextField
            fullWidth
            size="small"
            placeholder="00.000.000/0001-00"
            value={form.cnpjExecutante}
            onChange={set('cnpjExecutante')}
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
