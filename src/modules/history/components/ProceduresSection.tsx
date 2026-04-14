'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';

import { type HistoryEntry } from '@/types/pedido';

import HistoryProcedureRow from './HistoryProcedureRow';

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
      codeType: 'TUSS' as const,
    },
  ];

  const [expandedCodes, setExpandedCodes] = useState(new Set<string>());

  const toggleExpand = (code: string) => {
    setExpandedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            mb: 2,
            fontSize: 15,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: 'text.secondary',
          }}
        >
          Procedimentos ({procs.length})
        </Typography>
        <Table size="small">
          <TableBody>
            {procs.map((proc, idx) => (
              <HistoryProcedureRow
                key={proc.code + String(idx)}
                proc={proc}
                isLast={idx === procs.length - 1}
                isPartial={entry.action === 'Aprovado Parcial'}
                isExpanded={expandedCodes.has(proc.code)}
                onToggleExpand={() => {
                  toggleExpand(proc.code);
                }}
              />
            ))}
          </TableBody>
        </Table>
        {entry.secondaryCids && entry.secondaryCids.length > 0 ? (
          <Box sx={{ px: 0, pb: 1.5, pt: 0.5 }}>
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.4,
              }}
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
          </Box>
        ) : null}
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            flexWrap: 'wrap',
            pt: 2.5,
            mt: 2,
            borderTop: '1px solid rgba(0,0,0,0.08)',
          }}
        >
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
