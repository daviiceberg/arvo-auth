'use client';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Alert from '@mui/material/Alert';
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
  type ManchesterClassification,
  type UrgencyProcedimento,
  type UrgencyTipo,
} from '@/modules/new-request/types';

interface StepUrgencyProps {
  form: FormData;
  handleAddUrgencyProcedimento: () => void;
  handleRemoveUrgencyProcedimento: (id: string) => void;
  handleUpdateUrgencyProcedimento: (
    id: string,
    field: keyof Omit<UrgencyProcedimento, 'id'>,
    value: string,
  ) => void;
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

export function StepUrgency({
  form,
  handleAddUrgencyProcedimento,
  handleRemoveUrgencyProcedimento,
  handleUpdateUrgencyProcedimento,
}: StepUrgencyProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, fontSize: 15 }}>
        Atendimento de Urgência/Emergência
      </Typography>

      <Alert severity="warning" sx={{ mb: 2.5, fontSize: 13 }}>
        Fluxo de fast-track. RN 566/2022 art. 3º — atendimento imediato ≤2h. Apenas campos
        essenciais obrigatórios.
      </Alert>

      {form.urgencyProcedimentos.map((proc, index) => (
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
              Atendimento {index + 1}
            </Typography>
            {form.urgencyProcedimentos.length > 1 && (
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  handleRemoveUrgencyProcedimento(proc.id);
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <FieldLabel>Classificação de Risco (Manchester) *</FieldLabel>
              <FormControl fullWidth size="small">
                <Select
                  value={proc.classificacaoRisco}
                  onChange={(e) => {
                    handleUpdateUrgencyProcedimento(
                      proc.id,
                      'classificacaoRisco',
                      e.target.value as ManchesterClassification,
                    );
                  }}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    <em>Selecione</em>
                  </MenuItem>
                  <MenuItem value="vermelho">Vermelho — Emergência</MenuItem>
                  <MenuItem value="laranja">Laranja — Muito Urgente</MenuItem>
                  <MenuItem value="amarelo">Amarelo — Urgente</MenuItem>
                  <MenuItem value="verde">Verde — Pouco Urgente</MenuItem>
                  <MenuItem value="azul">Azul — Não Urgente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FieldLabel>Tipo de Atendimento *</FieldLabel>
              <FormControl fullWidth size="small">
                <Select
                  value={proc.tipo}
                  onChange={(e) => {
                    handleUpdateUrgencyProcedimento(proc.id, 'tipo', e.target.value as UrgencyTipo);
                  }}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    <em>Selecione</em>
                  </MenuItem>
                  <MenuItem value="urgencia">Urgência</MenuItem>
                  <MenuItem value="emergencia">Emergência</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 9 }}>
              <FieldLabel>Código TUSS / Pacote *</FieldLabel>
              <TussCodeSearchField
                code={proc.codigoTUSS}
                description={proc.descricaoTUSS}
                onChange={(c, d) => {
                  handleUpdateUrgencyProcedimento(proc.id, 'codigoTUSS', c);
                  handleUpdateUrgencyProcedimento(proc.id, 'descricaoTUSS', d);
                }}
                label=""
                placeholder="Buscar código TUSS ou pacote"
              />
            </Grid>
            <Grid size={{ xs: 3 }}>
              <FieldLabel>Quantidade</FieldLabel>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={proc.quantidade}
                onChange={(e) => {
                  handleUpdateUrgencyProcedimento(proc.id, 'quantidade', e.target.value);
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FieldLabel>
                Justificativa clínica * (mín. 20 caracteres — descrever quadro)
              </FieldLabel>
              <TextField
                fullWidth
                size="small"
                multiline
                minRows={2}
                placeholder="Ex: Dor torácica intensa, dispneia, suspeita de SCA. Solicito atendimento imediato."
                value={proc.justificativaClinica}
                onChange={(e) => {
                  handleUpdateUrgencyProcedimento(proc.id, 'justificativaClinica', e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button
        variant="text"
        onClick={handleAddUrgencyProcedimento}
        disabled={form.urgencyProcedimentos.length >= 3}
        sx={{
          color: 'primary.main',
          fontWeight: 600,
          fontSize: 13,
          p: '4px 5px',
          justifyContent: 'flex-start',
          '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
        }}
      >
        + Adicionar Atendimento
      </Button>
    </Box>
  );
}
