'use client';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { type PreOpFormItem, type PreOpItemStatusChoice, type PreOpItemTypeChoice } from '../types';

interface PreOpSectionProps {
  preOpItens: PreOpFormItem[];
  handleAddPreOpItem: () => void;
  handleRemovePreOpItem: (id: string) => void;
  handleUpdatePreOpItem: (
    id: string,
    field: keyof Omit<PreOpFormItem, 'id' | 'templateId'>,
    value: string | boolean,
  ) => void;
}

const STATUS_LABEL: Record<PreOpItemStatusChoice, string> = {
  realizado: 'Realizado',
  agendado: 'Agendado',
  pendente: 'Pendente',
};

const STATUS_COLOR: Record<PreOpItemStatusChoice, { bg: string; color: string }> = {
  realizado: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
  agendado: { bg: 'rgba(8,145,178,0.1)', color: '#0891b2' },
  pendente: { bg: 'rgba(245,158,11,0.1)', color: '#b45309' },
};

const TYPE_LABEL: Record<PreOpItemTypeChoice, string> = {
  exame: 'Exame',
  consulta: 'Consulta',
  avaliacao: 'Avaliação',
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="caption"
      sx={{ fontSize: 11, fontWeight: 600, color: '#64748b', mb: 0.5, display: 'block' }}
    >
      {children}
    </Typography>
  );
}

function StatusIcon({ status }: { status: PreOpItemStatusChoice }) {
  const sx = { fontSize: 14, color: STATUS_COLOR[status].color };
  if (status === 'realizado') return <CheckCircleOutlineIcon sx={sx} />;
  if (status === 'agendado') return <EventOutlinedIcon sx={sx} />;
  return <HourglassEmptyIcon sx={sx} />;
}

export function PreOpSection({
  preOpItens,
  handleAddPreOpItem,
  handleRemovePreOpItem,
  handleUpdatePreOpItem,
}: PreOpSectionProps) {
  const totalRequired = preOpItens.filter((i) => i.required).length;
  const completedRequired = preOpItens.filter((i) => i.required && i.status === 'realizado').length;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="body2" fontWeight={600}>
          Pré-Operatório
        </Typography>
        {totalRequired > 0 ? (
          <Chip
            label={`${String(completedRequired)}/${String(totalRequired)} obrigatórios`}
            size="small"
            sx={{
              fontSize: 11,
              height: 20,
              fontWeight: 600,
              backgroundColor:
                completedRequired === totalRequired
                  ? 'rgba(22,163,74,0.12)'
                  : 'rgba(245,158,11,0.12)',
              color: completedRequired === totalRequired ? '#16a34a' : '#b45309',
            }}
          />
        ) : null}
      </Box>
      {preOpItens.length === 0 ? (
        <Alert severity="info" sx={{ fontSize: 12, mb: 1 }}>
          Selecione um Tipo de Cirurgia para carregar o checklist pré-operatório padrão.
        </Alert>
      ) : (
        preOpItens.map((item) => (
          <Box
            key={item.id}
            sx={{
              border: '1px solid rgba(0,0,0,0.04)',
              borderRadius: '12px',
              p: 1.5,
              mb: 1.5,
              backgroundColor:
                item.status === 'realizado'
                  ? 'rgba(22,163,74,0.04)'
                  : item.status === 'agendado'
                    ? 'rgba(8,145,178,0.04)'
                    : 'rgba(245,158,11,0.04)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <StatusIcon status={item.status} />
              <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600, flex: 1 }}>
                {item.description || '(sem descrição)'}
              </Typography>
              <Chip
                label={TYPE_LABEL[item.type]}
                size="small"
                sx={{
                  fontSize: 10,
                  height: 18,
                  fontWeight: 600,
                  backgroundColor: 'rgba(0,0,0,0.06)',
                }}
              />
              {item.required ? (
                <Chip
                  label="Obrigatório"
                  size="small"
                  sx={{
                    fontSize: 10,
                    height: 18,
                    fontWeight: 600,
                    backgroundColor: 'rgba(220,38,38,0.08)',
                    color: '#dc2626',
                  }}
                />
              ) : null}
              {!item.templateId ? (
                <IconButton
                  size="small"
                  onClick={() => {
                    handleRemovePreOpItem(item.id);
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              ) : null}
            </Box>
            <Grid container spacing={1.5}>
              {!item.templateId ? (
                <Grid size={{ xs: 5 }}>
                  <FieldLabel>Descrição</FieldLabel>
                  <TextField
                    fullWidth
                    size="small"
                    value={item.description}
                    onChange={(e) => {
                      handleUpdatePreOpItem(item.id, 'description', e.target.value);
                    }}
                  />
                </Grid>
              ) : null}
              {!item.templateId ? (
                <Grid size={{ xs: 3 }}>
                  <FieldLabel>Tipo</FieldLabel>
                  <FormControl fullWidth size="small">
                    <Select
                      value={item.type}
                      onChange={(e) => {
                        handleUpdatePreOpItem(item.id, 'type', e.target.value);
                      }}
                    >
                      <MenuItem value="exame">Exame</MenuItem>
                      <MenuItem value="consulta">Consulta</MenuItem>
                      <MenuItem value="avaliacao">Avaliação</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              ) : null}
              <Grid size={{ xs: item.templateId ? 4 : 2 }}>
                <FieldLabel>Status</FieldLabel>
                <FormControl fullWidth size="small">
                  <Select
                    value={item.status}
                    onChange={(e) => {
                      handleUpdatePreOpItem(item.id, 'status', e.target.value);
                    }}
                  >
                    <MenuItem value="pendente">Pendente</MenuItem>
                    <MenuItem value="agendado">Agendado</MenuItem>
                    <MenuItem value="realizado">Realizado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: item.templateId ? 8 : 2 }}>
                <FieldLabel>Data</FieldLabel>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  value={item.date}
                  onChange={(e) => {
                    handleUpdatePreOpItem(item.id, 'date', e.target.value);
                  }}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>
          </Box>
        ))
      )}
      <Button
        variant="text"
        onClick={handleAddPreOpItem}
        disabled={preOpItens.length >= 15}
        startIcon={<AddOutlinedIcon fontSize="small" />}
        sx={{
          color: 'primary.main',
          fontWeight: 600,
          fontSize: 13,
          p: '4px 5px',
          justifyContent: 'flex-start',
          '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
        }}
      >
        Adicionar item ao pré-op
      </Button>
    </Box>
  );
}

export { STATUS_LABEL as PRE_OP_STATUS_LABEL };
