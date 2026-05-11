'use client';

import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { auditLevelColorMap, auditLevelLabel } from '@/shared/constants';
import { type HistoryEntry } from '@/types/pedido';

interface HospitalSummaryCardProps {
  entry: HistoryEntry;
}

const HOSPITALIZATION_TYPE_LABEL: Record<string, string> = {
  clinica_eletiva: 'Clínica Eletiva',
  semi_eletiva: 'Semi-Eletiva',
  domiciliar_alta_complexidade: 'Domiciliar Alta Complexidade',
};

const SURGERY_TYPE_LABEL: Record<string, string> = {
  geral_eletiva: 'Geral Eletiva',
  ortopedica_programada: 'Ortopédica Programada',
  oftalmologica: 'Oftalmológica',
  plastica_reparadora: 'Plástica Reparadora',
  oncologica_eletiva: 'Oncológica Eletiva',
};

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: 'block',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
        {value}
      </Typography>
    </Box>
  );
}

function buildBlocks(entry: HistoryEntry): { label: string; value: string }[] {
  const blocks: { label: string; value: string }[] = [];
  if (entry.hospitalizationType) {
    blocks.push({
      label: 'Tipo de Internação',
      value: HOSPITALIZATION_TYPE_LABEL[entry.hospitalizationType] ?? entry.hospitalizationType,
    });
  }
  if (entry.surgeryType) {
    blocks.push({
      label: 'Tipo de Cirurgia',
      value: SURGERY_TYPE_LABEL[entry.surgeryType] ?? entry.surgeryType,
    });
  }
  if (entry.hospitalizationDays !== undefined) {
    blocks.push({
      label: 'Diárias hospitalares',
      value: `${String(entry.hospitalizationDays)} diária(s)`,
    });
  }
  if (entry.hadPreOp) blocks.push({ label: 'Pré-operatório', value: 'Realizado' });
  if (entry.hadInjunction) {
    blocks.push({ label: 'Liminar Judicial', value: entry.injunctionProcessNumber ?? 'Sim' });
  }
  if (entry.hadNip) blocks.push({ label: 'NIP', value: entry.nipNumber ?? 'Sim' });
  return blocks;
}

function shouldRender(entry: HistoryEntry): boolean {
  return (
    entry.hospitalizationDays !== undefined ||
    entry.hospitalizationType !== undefined ||
    entry.expandedAuditLevel !== undefined ||
    entry.surgeryType !== undefined
  );
}

export default function HospitalSummaryCard({ entry }: HospitalSummaryCardProps) {
  if (!shouldRender(entry)) return null;
  const auditColors = entry.expandedAuditLevel
    ? auditLevelColorMap[entry.expandedAuditLevel]
    : null;
  const blocks = buildBlocks(entry);

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <LocalHospitalOutlinedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              fontSize: 15,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: 'text.secondary',
            }}
          >
            Contexto Hospitalar
          </Typography>
          <Box sx={{ flex: 1 }} />
          {entry.expandedAuditLevel && auditColors ? (
            <Chip
              label={`Nível: ${auditLevelLabel[entry.expandedAuditLevel]}`}
              size="small"
              sx={{
                fontSize: 11,
                fontWeight: 700,
                height: 22,
                backgroundColor: auditColors.bg,
                color: auditColors.color,
                border: `1px solid ${auditColors.color}33`,
              }}
            />
          ) : null}
        </Box>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {blocks.map((b) => (
            <InfoBlock key={b.label} label={b.label} value={b.value} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
