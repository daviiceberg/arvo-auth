'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import CodeTypeChip from '@/shared/components/chips/CodeTypeChip';
import { type GuiaProcedure } from '@/types/procedure-codes';

interface OpmeResumeCardProps {
  procedures: GuiaProcedure[];
  totalValue: number;
  validAnvisa: number;
  totalItems: number;
  completeQuotations: number;
}

function StatusChip({
  ok,
  total,
  okLabel,
  warnLabel,
}: {
  ok: number;
  total: number;
  okLabel: string;
  warnLabel: string;
}) {
  const allOk = ok === total;
  return (
    <Chip
      label={
        allOk
          ? `✅ ${String(ok)}/${String(total)} ${okLabel}`
          : `⚠ ${String(total - ok)}/${String(total)} ${warnLabel}`
      }
      size="small"
      sx={{
        backgroundColor: allOk ? 'rgba(22,163,74,0.1)' : 'rgba(245,158,11,0.12)',
        color: allOk ? '#16a34a' : '#b45309',
        fontWeight: 600,
        fontSize: 12,
        height: 22,
      }}
    />
  );
}

export default function OpmeResumeCard({
  procedures,
  totalValue,
  validAnvisa,
  totalItems,
  completeQuotations,
}: OpmeResumeCardProps) {
  return (
    <Card sx={{ mt: 4, bgcolor: 'rgba(0,0,0,0.02)' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
          Resumo da Solicitação
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {procedures.map((p) => (
            <Box key={p.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CodeTypeChip codeType={p.codeType} />
              <Typography sx={{ fontSize: 13 }}>
                {p.code} — {p.description}
              </Typography>
            </Box>
          ))}
          <Typography sx={{ fontSize: 13 }}>
            <strong>Materiais:</strong> {totalItems} {totalItems === 1 ? 'item' : 'itens'}
          </Typography>
          <Typography sx={{ fontSize: 13 }}>
            <strong>Valor total estimado:</strong>{' '}
            {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <StatusChip
              ok={validAnvisa}
              total={totalItems}
              okLabel="válidos"
              warnLabel="pendentes"
            />
            <StatusChip
              ok={completeQuotations}
              total={totalItems}
              okLabel="completas"
              warnLabel="incompletas"
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
