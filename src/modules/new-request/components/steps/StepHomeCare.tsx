'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type FormData, type HomeCareData, type HomeCareTipo } from '@/modules/new-request/types';

interface StepHomeCareProps {
  form: FormData;
  setSelect: (field: keyof FormData) => (value: string) => void;
  setHomeCareField: <K extends keyof HomeCareData>(field: K, value: HomeCareData[K]) => void;
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

export function StepHomeCare({ form, setSelect, setHomeCareField }: StepHomeCareProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Plano de Home Care
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
              <MenuItem value="continuidade">Renovação periódica</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {form.etapaAutorizacao === 'continuidade' ? (
          <Grid size={{ xs: 12 }}>
            <Alert severity="info" sx={{ fontSize: 13 }}>
              Renovação exige relatório de evolução do ciclo anterior e plano de cuidados
              atualizado.
            </Alert>
          </Grid>
        ) : null}
      </Grid>

      <Box sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', p: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <FieldLabel>Tipo de Home Care *</FieldLabel>
            <FormControl fullWidth size="small">
              <Select
                value={form.homeCare.tipo}
                onChange={(e) => {
                  setHomeCareField('tipo', e.target.value as HomeCareTipo);
                }}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  <em>Selecione</em>
                </MenuItem>
                <MenuItem value="enfermagem">Enfermagem</MenuItem>
                <MenuItem value="fisioterapia">Fisioterapia</MenuItem>
                <MenuItem value="fonoaudiologia">Fonoaudiologia</MenuItem>
                <MenuItem value="paliativo">Cuidados paliativos</MenuItem>
                <MenuItem value="outro">Outro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FieldLabel>Frequência de atendimento *</FieldLabel>
            <TextField
              fullWidth
              size="small"
              placeholder="Ex: diária, 3x por semana"
              value={form.homeCare.frequencia}
              onChange={(e) => {
                setHomeCareField('frequencia', e.target.value);
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FieldLabel>Duração prevista (dias) *</FieldLabel>
            <TextField
              fullWidth
              size="small"
              type="number"
              placeholder="30, 60, 90..."
              value={form.homeCare.duracaoDias}
              onChange={(e) => {
                setHomeCareField('duracaoDias', e.target.value);
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FieldLabel>Escala de cuidadores</FieldLabel>
            <TextField
              fullWidth
              size="small"
              placeholder="Ex: técnico de enfermagem 12h"
              value={form.homeCare.escalaCuidadores}
              onChange={(e) => {
                setHomeCareField('escalaCuidadores', e.target.value);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FieldLabel>Equipamentos / materiais</FieldLabel>
            <TextField
              fullWidth
              size="small"
              multiline
              minRows={2}
              placeholder="Equipamentos de baixa complexidade necessários (não-OPME)"
              value={form.homeCare.equipamentos}
              onChange={(e) => {
                setHomeCareField('equipamentos', e.target.value);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FieldLabel>Endereço de atendimento *</FieldLabel>
            <TextField
              fullWidth
              size="small"
              value={form.homeCare.enderecoAtendimento}
              onChange={(e) => {
                setHomeCareField('enderecoAtendimento', e.target.value);
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
