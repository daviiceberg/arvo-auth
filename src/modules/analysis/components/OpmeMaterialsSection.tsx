'use client';

import { useState } from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { anvisaStatusColorMap, opmeValueReasons } from '@/shared/constants';
import { type Adjustment, type OpmeMaterial, type OpmeQuotation } from '@/types/pedido';

import OpmeAdjustmentDialog from './OpmeAdjustmentDialog';

interface OpmeMaterialsSectionProps {
  materials: OpmeMaterial[];
  relatedSurgery?: string;
  onAdjustValue?: (adjustment: Omit<Adjustment, 'id'>) => void;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function cheapestId(quotations: OpmeQuotation[]): string | undefined {
  const valid = quotations.filter((q) => q.unitValue > 0);
  if (valid.length === 0) return undefined;
  return valid.reduce((min, q) => (q.unitValue < min.unitValue ? q : min)).id;
}

function StatusChip({ material }: { material: OpmeMaterial }) {
  const cfg = anvisaStatusColorMap[material.anvisaStatus];
  return (
    <Chip
      label={`ANVISA: ${cfg.label}`}
      size="small"
      sx={{
        fontSize: 11,
        fontWeight: 700,
        height: 22,
        backgroundColor: cfg.bg,
        color: cfg.text,
      }}
    />
  );
}

function ChoiceJustification({ material }: { material: OpmeMaterial }) {
  if (!material.chosenReasonCode) return null;
  const config = opmeValueReasons[material.chosenReasonCode];
  return (
    <Box
      sx={{
        mt: 1.5,
        px: 1.5,
        py: 1,
        border: '1px dashed rgba(180,83,9,0.4)',
        borderRadius: '8px',
        backgroundColor: 'rgba(217,119,6,0.05)',
      }}
    >
      <Typography variant="caption" fontWeight={700} sx={{ fontSize: 11, color: '#b45309' }}>
        Justificativa de escolha: {config.label}
      </Typography>
      {material.chosenReasonNote ? (
        <Typography variant="caption" sx={{ fontSize: 11, display: 'block', mt: 0.25 }}>
          {material.chosenReasonNote}
        </Typography>
      ) : null}
    </Box>
  );
}

function MaterialQuotations({ material }: { material: OpmeMaterial }) {
  const cheapest = cheapestId(material.quotations);
  return (
    <Box
      sx={{
        mt: 1.5,
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
            <TableCell sx={{ fontSize: 11, fontWeight: 700, py: 0.75 }}>Fornecedor</TableCell>
            <TableCell sx={{ fontSize: 11, fontWeight: 700, py: 0.75 }}>Marca</TableCell>
            <TableCell sx={{ fontSize: 11, fontWeight: 700, py: 0.75 }} align="right">
              Unit.
            </TableCell>
            <TableCell sx={{ fontSize: 11, fontWeight: 700, py: 0.75 }} align="right">
              Total
            </TableCell>
            <TableCell sx={{ fontSize: 11, fontWeight: 700, py: 0.75, width: 110 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {material.quotations.map((q) => {
            const isCheapest = cheapest === q.id;
            const isChosen = material.chosenQuotationId === q.id;
            return (
              <TableRow key={q.id} hover>
                <TableCell sx={{ fontSize: 12, py: 0.5 }}>{q.supplier || '—'}</TableCell>
                <TableCell sx={{ fontSize: 12, py: 0.5 }}>{q.brand || '—'}</TableCell>
                <TableCell sx={{ fontSize: 12, py: 0.5 }} align="right">
                  {q.unitValue > 0 ? formatCurrency(q.unitValue) : '—'}
                </TableCell>
                <TableCell sx={{ fontSize: 12, py: 0.5 }} align="right">
                  {q.totalValue > 0 ? formatCurrency(q.totalValue) : '—'}
                </TableCell>
                <TableCell sx={{ py: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {isCheapest ? (
                    <Chip
                      label="Mais barato"
                      size="small"
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        height: 18,
                        backgroundColor: 'rgba(22,163,74,0.12)',
                        color: '#16a34a',
                      }}
                    />
                  ) : null}
                  {isChosen ? (
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: 12, color: '#fff !important' }} />}
                      label="Escolhida"
                      size="small"
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        height: 18,
                        backgroundColor: 'primary.main',
                        color: '#fff',
                      }}
                    />
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}

function MaterialCard({ material, onAdjust }: { material: OpmeMaterial; onAdjust?: () => void }) {
  return (
    <Box
      sx={{
        borderTop: '1px solid rgba(0,0,0,0.06)',
        pt: 2,
        mt: 2,
        ':first-of-type': { borderTop: 0, mt: 0, pt: 0 },
      }}
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}
      >
        <Box>
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
            {material.description || material.materialCode}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: 'text.secondary' }}>
            {material.manufacturer || '—'}
            {material.brand ? ` · ${material.brand}` : ''}
            {` · Qtd ${String(material.quantity)}${material.unit ? ` ${material.unit}` : ''}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
          <StatusChip material={material} />
          <Typography variant="caption" sx={{ fontSize: 11, color: 'text.secondary' }}>
            ANVISA {material.anvisaRegistration || '—'}
          </Typography>
        </Box>
      </Box>
      {material.anvisaProductName ? (
        <Typography
          variant="caption"
          sx={{ fontSize: 11, color: 'text.secondary', display: 'block', mt: 0.5 }}
        >
          Produto ANVISA: {material.anvisaProductName}
          {material.anvisaValidUntil ? ` · vigência até ${material.anvisaValidUntil}` : ''}
        </Typography>
      ) : null}
      <MaterialQuotations material={material} />
      <ChoiceJustification material={material} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 1,
          px: 0.5,
        }}
      >
        <Typography variant="caption" sx={{ fontSize: 11, color: 'text.secondary' }}>
          Valor referência tabela
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
            {formatCurrency(material.totalValue)}
          </Typography>
          {onAdjust ? (
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<EditOutlinedIcon sx={{ fontSize: 14 }} />}
              onClick={onAdjust}
              sx={{ fontSize: 11, fontWeight: 600, py: 0.25, px: 1, minHeight: 24 }}
            >
              Ajustar valor
            </Button>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}

export default function OpmeMaterialsSection({
  materials,
  relatedSurgery,
  onAdjustValue,
}: OpmeMaterialsSectionProps) {
  const [adjustTarget, setAdjustTarget] = useState<OpmeMaterial | null>(null);

  if (materials.length === 0) return null;
  const total = materials.reduce((sum, m) => sum + m.totalValue, 0);

  return (
    <Card sx={{ overflow: 'visible' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
            Materiais OPME — TISS 19
          </Typography>
          <Chip
            label={`${String(materials.length)} item${materials.length === 1 ? '' : 'ns'}`}
            size="small"
            sx={{ fontSize: 11, fontWeight: 600, height: 22 }}
          />
        </Box>
        {relatedSurgery ? (
          <Box
            sx={{
              mb: 2,
              px: 1.5,
              py: 1,
              border: '1px dashed rgba(0,0,0,0.12)',
              borderRadius: '8px',
              backgroundColor: 'rgba(0,0,0,0.02)',
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ fontSize: 11, color: 'text.secondary', textTransform: 'uppercase' }}
            >
              Cirurgia/Procedimento associado
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 13, mt: 0.25 }}>
              {relatedSurgery}
            </Typography>
          </Box>
        ) : null}
        <Box>
          {materials.map((m) => (
            <MaterialCard
              key={m.id}
              material={m}
              onAdjust={
                onAdjustValue
                  ? () => {
                      setAdjustTarget(m);
                    }
                  : undefined
              }
            />
          ))}
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
            Total estimado OPME
          </Typography>
          <Typography variant="body2" fontWeight={700} sx={{ fontSize: 16, color: 'primary.main' }}>
            {formatCurrency(total)}
          </Typography>
        </Box>
      </CardContent>
      <OpmeAdjustmentDialog
        open={adjustTarget !== null}
        material={adjustTarget}
        onClose={() => {
          setAdjustTarget(null);
        }}
        onConfirm={(adj) => {
          onAdjustValue?.(adj);
          setAdjustTarget(null);
        }}
      />
    </Card>
  );
}
