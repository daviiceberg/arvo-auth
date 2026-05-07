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

import { type FormData, type ExamsProcedimento } from '@/modules/new-request/types';

interface StepExamsProps {
  form: FormData;
  setSelect: (field: keyof FormData) => (value: string) => void;
  handleAddExamsProcedimento: () => void;
  handleRemoveExamsProcedimento: (id: string) => void;
  handleUpdateExamsProcedimento: (
    id: string,
    field: keyof Omit<ExamsProcedimento, 'id'>,
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

export function StepExams({
  form,
  setSelect,
  handleAddExamsProcedimento,
  handleRemoveExamsProcedimento,
  handleUpdateExamsProcedimento,
}: StepExamsProps) {
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

      {form.examsProcedimentos.map((proc, index) => (
        <Box
          key={proc.id}
          sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', p: 2, mb: 2 }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="body2" fontWeight={600}>
              Procedimento {index + 1}
            </Typography>
            {form.examsProcedimentos.length > 1 && (
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  handleRemoveExamsProcedimento(proc.id);
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <FieldLabel>Código TUSS / Pacote *</FieldLabel>
              <TussCodeSearchField
                code={proc.codigoTUSS}
                description={proc.descricaoTUSS}
                onChange={(c, d) => {
                  handleUpdateExamsProcedimento(proc.id, 'codigoTUSS', c);
                  handleUpdateExamsProcedimento(proc.id, 'descricaoTUSS', d);
                }}
                label=""
                placeholder="Buscar código TUSS ou pacote"
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FieldLabel>Região anatômica *</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="Ex: crânio, tórax, abdome total"
                value={proc.regiaoAnatomica}
                onChange={(e) => {
                  handleUpdateExamsProcedimento(proc.id, 'regiaoAnatomica', e.target.value);
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
                value={proc.hipoteseDiagnostica}
                onChange={(e) => {
                  handleUpdateExamsProcedimento(proc.id, 'hipoteseDiagnostica', e.target.value);
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
                value={proc.historicoExamesAnteriores}
                onChange={(e) => {
                  handleUpdateExamsProcedimento(
                    proc.id,
                    'historicoExamesAnteriores',
                    e.target.value,
                  );
                }}
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button
        variant="text"
        onClick={handleAddExamsProcedimento}
        disabled={form.examsProcedimentos.length >= 5}
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
