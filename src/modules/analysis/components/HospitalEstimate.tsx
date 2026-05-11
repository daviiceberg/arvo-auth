'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { type AuditLevel, type HospitalizationContext } from '@/types/pedido';

import AuditLevelChip from './AuditLevelChip';

interface HospitalEstimateProps {
  hospitalization: HospitalizationContext;
  auditLevel?: AuditLevel;
}

const HOSPITALIZATION_TYPE_LABEL: Record<HospitalizationContext['type'], string> = {
  clinica_eletiva: 'Clínica Eletiva',
  semi_eletiva: 'Semi-Eletiva',
  domiciliar_alta_complexidade: 'Domiciliar Alta Complexidade',
};

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

function sumTaxes(taxes: HospitalizationContext['taxes']): number {
  return taxes.reduce((acc, t) => acc + t.estimatedValue * t.quantity, 0);
}

function EstimateRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', py: 0.5 }}>
      <Typography variant="body2" sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: bold ? 15 : 13, fontWeight: bold ? 700 : 600 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default function HospitalEstimate({ hospitalization, auditLevel }: HospitalEstimateProps) {
  const dailyRate = hospitalization.dailyRate ?? 0;
  const expectedDays = hospitalization.expectedDays;
  const daysSubtotal = expectedDays * dailyRate;
  const taxesSubtotal = sumTaxes(hospitalization.taxes);
  const total = daysSubtotal + taxesSubtotal;

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            gap: 1,
          }}
        >
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
            Estimativa Hospitalar
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {auditLevel ? <AuditLevelChip level={auditLevel} size="small" /> : null}
            <Chip
              label="Valores ilustrativos"
              size="small"
              sx={{
                fontSize: 11,
                height: 22,
                backgroundColor: 'rgba(0,0,0,0.06)',
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>
        <EstimateRow label="Tipo" value={HOSPITALIZATION_TYPE_LABEL[hospitalization.type]} />
        <EstimateRow label="Data prevista" value={hospitalization.plannedDate} />
        <EstimateRow label="Diárias previstas" value={`${String(expectedDays)} diária(s)`} />
        <Divider sx={{ my: 1.25 }} />
        <EstimateRow
          label={`Diárias × valor (${formatBRL(dailyRate)})`}
          value={formatBRL(daysSubtotal)}
        />
        <EstimateRow
          label={`Taxas hospitalares (${String(hospitalization.taxes.length)})`}
          value={formatBRL(taxesSubtotal)}
        />
        <Divider sx={{ my: 1.25 }} />
        <EstimateRow label="Total estimado" value={formatBRL(total)} bold />
        {hospitalization.taxes.length > 0 ? (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: 'text.secondary',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                display: 'block',
                mb: 1,
              }}
            >
              Detalhamento de taxas
            </Typography>
            <Box>
              {hospitalization.taxes.map((t) => (
                <Box
                  key={t.code}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    py: 0.4,
                    borderBottom: '1px dashed rgba(0,0,0,0.06)',
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: 12 }}>
                    {`${t.description} × ${String(t.quantity)}`}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                    {formatBRL(t.estimatedValue * t.quantity)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ) : null}
        {hospitalization.utiJustification ? (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: 'text.secondary',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                display: 'block',
                mb: 0.75,
              }}
            >
              Justificativa UTI
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 13, color: 'text.primary' }}>
              {hospitalization.utiJustification}
            </Typography>
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
}
