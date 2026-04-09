'use client';

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { type HistoryEntry } from '@/types/pedido';

interface ProceduresSectionProps {
  entry: HistoryEntry;
}

export default function ProceduresSection({ entry }: ProceduresSectionProps) {
  const procs = entry.detailedProcedures ?? [
    {
      code: '00000000',
      tuss: '00000000',
      description: entry.procedure,
      qty: 1,
      authorizedQty: entry.action !== 'Negado' ? 1 : undefined,
      startDate: entry.decisionDate,
      endDate: entry.decisionDate,
      cid: entry.cid,
      auditLevel:
        entry.category === 'Internação' ||
        entry.category === 'Urgência/Emergência' ||
        entry.category === 'Oncologia'
          ? ('HOSPITALAR' as const)
          : ('AMBULATORIAL' as const),
    },
  ];

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ mb: 2, fontSize: 15, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}
        >
          Procedimentos ({procs.length})
        </Typography>
        <Table size="small">
          <TableBody>
            {procs.map((proc, idx) => (
              <TableRow
                key={proc.code + String(idx)}
                sx={{
                  cursor: 'default',
                  '& td': {
                    borderBottom: idx < procs.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                  },
                  '&:not(:first-of-type) td': { pt: 2 },
                  '&:hover': { backgroundColor: 'transparent' },
                }}
              >
                <TableCell sx={{ pl: 0, fontWeight: 700, fontSize: 13, width: 120, verticalAlign: 'top', pt: 1.5 }}>
                  {proc.tuss}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: 13, verticalAlign: 'top', pt: 1.5 }}>
                  {proc.description}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 12, verticalAlign: 'top', pt: 1.5 }}>
                  Qtd: {proc.qty}
                  {proc.authorizedQty !== undefined ? ` · Aut: ${String(proc.authorizedQty)}` : ''}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: 12, verticalAlign: 'top', pt: 1.5 }}>
                  {proc.startDate} → {proc.endDate}
                </TableCell>
                <TableCell sx={{ verticalAlign: 'top', pt: 1.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 0.5 }}>
                    {proc.cid ? <Chip
                        label={`CID ${proc.cid}`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(37,99,235,0.08)',
                          color: '#2563eb',
                          fontWeight: 700,
                          fontSize: 12,
                          height: 20,
                        }}
                      /> : null}
                    <Chip
                      label={proc.auditLevel}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        color: '#6b7280',
                        fontWeight: 600,
                        fontSize: 11,
                        height: 20,
                      }}
                    />
                  </Box>
                </TableCell>
                {entry.action === 'Aprovado Parcial' && (
                  <TableCell sx={{ verticalAlign: 'top', pt: 1.5, pr: 0 }}>
                    {proc.decisao === 'aprovado' ? (
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: 12, ml: '4px !important', color: '#16a34a !important' }} />}
                        label="Aprovado"
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(22,163,74,0.1)',
                          color: '#16a34a',
                          fontWeight: 700,
                          fontSize: 11,
                          height: 20,
                        }}
                      />
                    ) : proc.decisao === 'negado' ? (
                      <Box>
                        <Chip
                          icon={<CancelIcon sx={{ fontSize: 12, ml: '4px !important', color: '#d4183d !important' }} />}
                          label="Negado"
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(212,24,61,0.1)',
                            color: '#d4183d',
                            fontWeight: 700,
                            fontSize: 11,
                            height: 20,
                            mb: 0.5,
                          }}
                        />
                        {proc.motivoDecisao ? <Typography variant="caption" sx={{ fontSize: 11, color: 'text.secondary', display: 'block' }}>
                            {proc.motivoDecisao}
                          </Typography> : null}
                      </Box>
                    ) : null}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {entry.secondaryCids && entry.secondaryCids.length > 0 ? <Box sx={{ px: 0, pb: 1.5, pt: 0.5 }}>
            <Typography
              variant="caption"
              sx={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}
            >
              CIDs Secundários
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.75 }}>
              {entry.secondaryCids.map((cid, i) => (
                <Chip
                  key={i}
                  label={cid}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(100,116,139,0.08)',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: 12,
                    height: 20,
                  }}
                />
              ))}
            </Box>
          </Box> : null}
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', pt: 2.5, mt: 2, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          {[
            { label: 'Prestador', value: entry.provider },
            { label: 'Médico Solicitante', value: entry.requestingDoctor },
            { label: 'Tipo de Guia', value: entry.guideType },
            { label: 'Categoria', value: entry.category },
          ].map((f) => (
            <Box key={f.label}>
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
                {f.label}
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                {f.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
