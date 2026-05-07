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

import { type FormData, type SadtProcedimento, type SadtTipo } from '@/modules/new-request/types';

interface StepSadtProps {
  form: FormData;
  setSelect: (field: keyof FormData) => (value: string) => void;
  handleAddSadtProcedimento: () => void;
  handleRemoveSadtProcedimento: (id: string) => void;
  handleUpdateSadtProcedimento: (
    id: string,
    field: keyof Omit<SadtProcedimento, 'id'>,
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

export function StepSadt({
  form,
  setSelect,
  handleAddSadtProcedimento,
  handleRemoveSadtProcedimento,
  handleUpdateSadtProcedimento,
}: StepSadtProps) {
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

      {form.sadtProcedimentos.map((proc, index) => (
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
            {form.sadtProcedimentos.length > 1 && (
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  handleRemoveSadtProcedimento(proc.id);
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
                  handleUpdateSadtProcedimento(proc.id, 'codigoTUSS', c);
                  handleUpdateSadtProcedimento(proc.id, 'descricaoTUSS', d);
                }}
                label=""
                placeholder="Buscar código TUSS ou pacote"
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FieldLabel>Tipo *</FieldLabel>
              <FormControl fullWidth size="small">
                <Select
                  value={proc.tipo}
                  onChange={(e) => {
                    handleUpdateSadtProcedimento(proc.id, 'tipo', e.target.value as SadtTipo);
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
                value={proc.quantidade}
                onChange={(e) => {
                  handleUpdateSadtProcedimento(proc.id, 'quantidade', e.target.value);
                }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FieldLabel>Frequência prevista</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="Ex: dose única, 1x por semana"
                value={proc.frequencia}
                onChange={(e) => {
                  handleUpdateSadtProcedimento(proc.id, 'frequencia', e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button
        variant="text"
        onClick={handleAddSadtProcedimento}
        disabled={form.sadtProcedimentos.length >= 5}
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
