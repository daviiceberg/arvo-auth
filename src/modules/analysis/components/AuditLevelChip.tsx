'use client';

import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { auditLevelColorMap, auditLevelLabel } from '@/shared/constants';
import { type AuditLevel } from '@/types/pedido';

interface AuditLevelChipProps {
  level: AuditLevel;
  size?: 'small' | 'medium';
}

const TOOLTIP_BY_LEVEL: Record<AuditLevel, string> = {
  AMBULATORIAL: 'Procedimento ambulatorial — auditoria padrão.',
  HOSPITALAR: 'Procedimento hospitalar — auditoria média, envolve diárias e taxas.',
  UTI: 'Internação UTI — auditoria máxima, exige justificativa clínica robusta (mínimo 50 caracteres).',
};

export default function AuditLevelChip({ level, size = 'medium' }: AuditLevelChipProps) {
  const colors = auditLevelColorMap[level];
  const label = auditLevelLabel[level];
  const tooltip = TOOLTIP_BY_LEVEL[level];
  const px = size === 'small' ? 1 : 1.25;
  const py = size === 'small' ? 0.25 : 0.5;
  const fontSize = size === 'small' ? 11 : 12;
  const iconSize = size === 'small' ? 13 : 15;
  return (
    <Tooltip title={tooltip} arrow>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          px,
          py,
          borderRadius: 1,
          backgroundColor: colors.bg,
          color: colors.color,
          border: `1px solid ${colors.color}33`,
          width: 'fit-content',
        }}
      >
        <LocalHospitalOutlinedIcon sx={{ fontSize: iconSize }} />
        <Typography
          variant="caption"
          sx={{ fontSize, fontWeight: 700, letterSpacing: 0.3, lineHeight: 1 }}
        >
          {`Nível: ${label}`}
        </Typography>
      </Box>
    </Tooltip>
  );
}
