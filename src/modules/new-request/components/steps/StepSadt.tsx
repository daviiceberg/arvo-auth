'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type FormData, type SadtData, type SadtTipo } from '@/modules/new-request/types';

interface StepSadtProps {
  form: FormData;
  setSelect: (field: keyof FormData) => (value: string) => void;
  setSadtField: <K extends keyof SadtData>(field: K, value: SadtData[K]) => void;
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

export function StepSadt({ form, setSelect, setSadtField }: StepSadtProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Procedimento SADT
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Etapa da Autorização *</FieldLabel>
          <FormControl fullWidth size="small">
            <Select
              value={form.etapaAutorizacao}
              onChange={(e) => {
                setSelect('etapaAutorizacao')(e.target.value);
              }}
              displayEmpty
            >
              <MenuItem value="" disabled>
                <em>Selecione</em>
              </MenuItem>
              <MenuItem value="primeira_solicitacao">Primeira Solicitação</MenuItem>
              <MenuItem value="continuidade">Continuidade / Renovação</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {form.etapaAutorizacao === 'continuidade' ? (
          <Grid size={{ xs: 12 }}>
            <Alert severity="info" sx={{ fontSize: 13 }}>
              Renovação exige Relatório de Evolução do atendimento anterior. Verifique o anexo na
              etapa Documentos.
            </Alert>
          </Grid>
        ) : null}
      </Grid>

      <Box
        sx={{
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '16px',
          p: 2,
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <FieldLabel>Código TUSS *</FieldLabel>
            <TextField
              fullWidth
              size="small"
              placeholder="Ex: 40101010"
              value={form.sadt.codigoTUSS}
              onChange={(e) => {
                setSadtField('codigoTUSS', e.target.value);
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FieldLabel>Tipo *</FieldLabel>
            <FormControl fullWidth size="small">
              <Select
                value={form.sadt.tipo}
                onChange={(e) => {
                  setSadtField('tipo', e.target.value as SadtTipo);
                }}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <em>Selecione</em>
                </MenuItem>
                <MenuItem value="coleta">Coleta laboratorial</MenuItem>
                <MenuItem value="infusao">Infusão</MenuItem>
                <MenuItem value="reabilitacao">Reabilitação</MenuItem>
                <MenuItem value="outro">Outro procedimento auxiliar</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FieldLabel>Quantidade *</FieldLabel>
            <TextField
              fullWidth
              size="small"
              type="number"
              value={form.sadt.quantidade}
              onChange={(e) => {
                setSadtField('quantidade', e.target.value);
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FieldLabel>Frequência prevista</FieldLabel>
            <TextField
              fullWidth
              size="small"
              placeholder="Ex: dose única, 1x por semana"
              value={form.sadt.frequencia}
              onChange={(e) => {
                setSadtField('frequencia', e.target.value);
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
