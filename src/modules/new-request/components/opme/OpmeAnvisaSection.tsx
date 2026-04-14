'use client';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { type AnvisaStatus, anvisaStatusColorMap } from '@/shared/constants';

import { type OpmeItemData } from '@/modules/new-request/types/opme';

interface OpmeAnvisaSectionProps {
  item: OpmeItemData;
  onUpdate: (item: OpmeItemData) => void;
  onConsult: () => void;
}

export default function OpmeAnvisaSection({ item, onUpdate, onConsult }: OpmeAnvisaSectionProps) {
  const statusConfig = anvisaStatusColorMap[item.anvisaStatus];

  const handleStatusChange = (_: React.MouseEvent, value: AnvisaStatus | null) => {
    if (!value) return;
    onUpdate({ ...item, anvisaStatus: value });
  };

  return (
    <Box>
      <Divider sx={{ my: 2 }}>
        <Typography
          variant="caption"
          sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary' }}
        >
          Dados ANVISA
        </Typography>
      </Divider>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 12, fontWeight: 600, color: '#333', mb: 0.75 }}
          >
            Registro ANVISA *
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Nº do registro"
              value={item.anvisaRegistration}
              onChange={(e) => {
                onUpdate({ ...item, anvisaRegistration: e.target.value });
              }}
              sx={{ flex: 1, minWidth: 0 }}
            />
            <Tooltip title="Abre o portal da ANVISA para consultar registro de dispositivo médico">
              <Button
                variant="outlined"
                startIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                onClick={onConsult}
                sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                Consultar ANVISA
              </Button>
            </Tooltip>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 12, fontWeight: 600, color: '#333', mb: 0.75 }}
          >
            Situação
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <ToggleButtonGroup
              value={item.anvisaStatus === 'not_checked' ? null : item.anvisaStatus}
              exclusive
              onChange={handleStatusChange}
              size="small"
            >
              <ToggleButton value="valid" sx={{ fontSize: 12, px: 1.5 }}>
                ✅ Válido
              </ToggleButton>
              <ToggleButton value="invalid" sx={{ fontSize: 12, px: 1.5 }}>
                ❌ Inválido
              </ToggleButton>
              <ToggleButton value="not_found" sx={{ fontSize: 12, px: 1.5 }}>
                ❓ Não encontrado
              </ToggleButton>
            </ToggleButtonGroup>
            <Chip
              label={
                item.anvisaStatus === 'valid' && item.anvisaValidUntil
                  ? `${statusConfig.label} até ${item.anvisaValidUntil}`
                  : statusConfig.label
              }
              size="small"
              sx={{
                backgroundColor: statusConfig.bg,
                color: statusConfig.text,
                fontWeight: 600,
                fontSize: 11,
                height: 20,
              }}
            />
          </Box>
        </Grid>
        {item.anvisaStatus === 'valid' && (
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="caption"
              sx={{ fontSize: 12, fontWeight: 600, color: '#333', mb: 0.75 }}
            >
              Válido até
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="date"
              value={item.anvisaValidUntil}
              onChange={(e) => {
                onUpdate({ ...item, anvisaValidUntil: e.target.value });
              }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
        )}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 12, fontWeight: 600, color: '#333', mb: 0.75 }}
          >
            Fabricante *
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={item.manufacturer}
            onChange={(e) => {
              onUpdate({ ...item, manufacturer: e.target.value });
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: 12, fontWeight: 600, color: '#333', mb: 0.75 }}
          >
            Justificativa Técnica para Marca *
          </Typography>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={2}
            value={item.brandJustification}
            onChange={(e) => {
              onUpdate({ ...item, brandJustification: e.target.value });
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
