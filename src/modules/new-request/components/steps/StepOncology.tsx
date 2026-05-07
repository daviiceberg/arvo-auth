'use client';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { TussCodeSearchField } from '@/shared/components/code-autocomplete';

import {
  type FormData,
  type OncologyProcedimento,
  type OncologyTipoTratamento,
} from '@/modules/new-request/types';

interface StepOncologyProps {
  form: FormData;
  set: (
    field: keyof FormData,
  ) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setSelect: (field: keyof FormData) => (value: string) => void;
  handleAddOncologyProcedimento: () => void;
  handleRemoveOncologyProcedimento: (id: string) => void;
  handleUpdateOncologyProcedimento: (
    id: string,
    field: keyof Omit<OncologyProcedimento, 'id'>,
    value: string,
  ) => void;
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
      {validated ? <CheckCircleOutlineIcon sx={{ fontSize: 14, color: 'success.main' }} /> : null}
    </Box>
  );
}

const inputSx = (validated?: boolean) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: validated ? '#f0fdf4' : '#fff',
    '& fieldset': {
      borderColor: validated ? '#16a34a' : undefined,
    },
  },
});

export function StepOncology({
  form,
  set,
  setSelect,
  handleAddOncologyProcedimento,
  handleRemoveOncologyProcedimento,
  handleUpdateOncologyProcedimento,
}: StepOncologyProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Dados Oncológicos
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated={!!form.estadiamentoTNM}>Estadiamento (TNM)</FieldLabel>
          <TextField
            fullWidth
            size="small"
            placeholder="ex: T2 N0 M0"
            value={form.estadiamentoTNM}
            onChange={set('estadiamentoTNM')}
            sx={inputSx(!!form.estadiamentoTNM)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated={!!form.numeroCiclo}>Nº do Ciclo</FieldLabel>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={form.numeroCiclo}
            onChange={set('numeroCiclo')}
            sx={inputSx(!!form.numeroCiclo)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel validated={!!form.protocoloQuimio}>Protocolo Quimioterápico</FieldLabel>
          <TextField
            fullWidth
            size="small"
            placeholder="ex: FOLFOX, CHOP..."
            value={form.protocoloQuimio}
            onChange={set('protocoloQuimio')}
            sx={inputSx(!!form.protocoloQuimio)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Tipo de Tratamento</FieldLabel>
          <FormControl fullWidth size="small">
            <Select
              value={form.tipoTratamento}
              onChange={(e) => {
                setSelect('tipoTratamento')(e.target.value as OncologyTipoTratamento);
              }}
              displayEmpty
            >
              <MenuItem value="" disabled>
                <em>Selecione</em>
              </MenuItem>
              <MenuItem value="Quimioterapia">Quimioterapia</MenuItem>
              <MenuItem value="Radioterapia">Radioterapia</MenuItem>
              <MenuItem value="Hormonioterapia">Hormonioterapia</MenuItem>
              <MenuItem value="Imunoterapia">Imunoterapia</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FieldLabel>Número de Ciclos Totais</FieldLabel>
          <TextField
            fullWidth
            size="small"
            type="number"
            value={form.totalCiclos}
            onChange={set('totalCiclos')}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight={700} sx={{ mt: 4, mb: 0.5, fontSize: 15 }}>
        Procedimentos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 12 }}>
        Inclua os códigos TUSS ou pacotes aplicáveis a esta solicitação.
      </Typography>

      {form.oncologyProcedimentos.map((proc, index) => (
        <Box
          key={proc.id}
          sx={{
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '16px',
            p: 2,
            mb: 2,
          }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="body2" fontWeight={600}>
              Procedimento {index + 1}
            </Typography>
            {form.oncologyProcedimentos.length > 1 && (
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  handleRemoveOncologyProcedimento(proc.id);
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 9 }}>
              <FieldLabel>Código TUSS / Pacote *</FieldLabel>
              <TussCodeSearchField
                code={proc.codigoTUSS}
                description={proc.descricaoTUSS}
                onChange={(c, d) => {
                  handleUpdateOncologyProcedimento(proc.id, 'codigoTUSS', c);
                  handleUpdateOncologyProcedimento(proc.id, 'descricaoTUSS', d);
                }}
                label=""
                placeholder="Buscar código TUSS ou pacote"
              />
            </Grid>
            <Grid size={{ xs: 3 }}>
              <FieldLabel>Quantidade / Sessões</FieldLabel>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={proc.quantidade}
                onChange={(e) => {
                  handleUpdateOncologyProcedimento(proc.id, 'quantidade', e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button
        variant="text"
        onClick={handleAddOncologyProcedimento}
        disabled={form.oncologyProcedimentos.length >= 5}
        sx={{
          color: 'primary.main',
          fontWeight: 600,
          fontSize: 13,
          p: '4px 5px',
          justifyContent: 'flex-start',
          '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
        }}
      >
        + Adicionar Procedimento
      </Button>
    </Box>
  );
}
