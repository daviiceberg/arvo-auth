'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { CollapsibleCard } from '@/shared/components';
import { type OncologyProtocol, type Request } from '@/types/pedido';

interface OncologyDataSectionProps {
  request: Request;
}

const TREATMENT_TYPE_LABEL: Record<OncologyProtocol['type'], string> = {
  QT: 'Quimioterapia',
  RT: 'Radioterapia',
  hormonio: 'Hormonioterapia',
  imuno: 'Imunoterapia',
  outro: 'Outro',
};

const TREATMENT_LINE_LABEL: Record<OncologyProtocol['line'], string> = {
  '1a': '1ª linha',
  '2a': '2ª linha',
  paliativa: 'Paliativa',
};

interface DataRowProps {
  label: string;
  value: string;
}

function DataRow({ label, value }: DataRowProps) {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          fontSize: 11,
          fontWeight: 600,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: 0.4,
          display: 'block',
          mb: 0.25,
        }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

export default function OncologyDataSection({ request }: OncologyDataSectionProps) {
  const op = request.oncologyProtocol;
  if (!op) return null;

  const cycleDisplay = op.totalCycles ? `${op.cycle} (de ${op.totalCycles} totais)` : op.cycle;

  return (
    <CollapsibleCard title="Dados Oncológicos">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 2.5,
        }}
      >
        <DataRow label="Estadiamento (TNM)" value={op.staging ?? ''} />
        <DataRow label="Protocolo" value={op.protocol} />
        <DataRow label="Tipo de Tratamento" value={TREATMENT_TYPE_LABEL[op.type]} />
        <DataRow label="Linha de Tratamento" value={TREATMENT_LINE_LABEL[op.line]} />
        <DataRow label="Ciclo" value={cycleDisplay} />
      </Box>
    </CollapsibleCard>
  );
}
