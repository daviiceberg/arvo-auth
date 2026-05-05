'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type FormData, type ExamsData } from '@/modules/new-request/types';

interface StepExamsProps {
  form: FormData;
  setSelect: (field: keyof FormData) => (value: string) => void;
  setExamsField: <K extends keyof ExamsData>(field: K, value: ExamsData[K]) => void;
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

export function StepExams({ form, setSelect, setExamsField }: StepExamsProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Exame de Alta Complexidade
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
              <MenuItem value="continuidade">Reexame</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Alert severity="info" sx={{ fontSize: 13 }}>
            Exames de alta complexidade exigem justificativa técnica explícita. Critérios DUT entram
            em milestone futuro — neste piloto a análise usa o checklist da IA.
          </Alert>
        </Grid>
      </Grid>

      <Box sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', p: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <FieldLabel>Código TUSS *</FieldLabel>
            <TextField
              fullWidth
              size="small"
              placeholder="Ex: 40901076"
              value={form.exams.codigoTUSS}
              onChange={(e) => {
                setExamsField('codigoTUSS', e.target.value);
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FieldLabel>Região anatômica *</FieldLabel>
            <TextField
              fullWidth
              size="small"
              placeholder="Ex: crânio, tórax, abdome total"
              value={form.exams.regiaoAnatomica}
              onChange={(e) => {
                setExamsField('regiaoAnatomica', e.target.value);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FieldLabel>Hipótese diagnóstica *</FieldLabel>
            <TextField
              fullWidth
              size="small"
              multiline
              minRows={2}
              placeholder="Hipótese clínica que justifica o exame"
              value={form.exams.hipoteseDiagnostica}
              onChange={(e) => {
                setExamsField('hipoteseDiagnostica', e.target.value);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FieldLabel>Exames anteriores</FieldLabel>
            <TextField
              fullWidth
              size="small"
              multiline
              minRows={2}
              placeholder="Exames já realizados e evolução do quadro"
              value={form.exams.historicoExamesAnteriores}
              onChange={(e) => {
                setExamsField('historicoExamesAnteriores', e.target.value);
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
