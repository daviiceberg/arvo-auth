'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import DutModal from '@/shared/components/dut-modal/DutModal';
import { useDutModal } from '@/shared/components/dut-modal/useDutModal';
import { logger } from '@/shared/utils/logger';
import { type HistoryEntry } from '@/types/pedido';

import HistoryProcedureRow from './HistoryProcedureRow';

const TH_SX = {
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  color: 'text.secondary',
  py: '6px',
  px: 2,
  borderBottom: '1px solid rgba(0,0,0,0.08)',
};

interface ProceduresSectionProps {
  entry: HistoryEntry;
}

export default function ProceduresSection({ entry }: ProceduresSectionProps) {
  const procs =
    entry.detailedProcedures ??
    (() => {
      logger.warn(
        `[DATA INCONSISTENCY] HistoryEntry ${entry.id} lacks detailedProcedures. Falling back to single procedure from procedure text. DUT will not be displayed.`,
      );
      return [
        {
          code: '00000000',
          tuss: '00000000',
          description: entry.procedure,
          qty: 1,
          authorizedQty: entry.action !== 'Negado' ? 1 : undefined,
          requestDate: entry.protocolDate,
          passwordExpiryDate: entry.decisionDate,
          cid: entry.cid,
          auditLevel: 'AMBULATORIAL' as const,
          codeType: 'TUSS' as const,
        },
      ];
    })();

  if (
    entry.action === 'Aprovado Parcial' &&
    (!entry.detailedProcedures || entry.detailedProcedures.length < 2)
  ) {
    logger.warn(
      `[DATA INCONSISTENCY] Entry ${entry.id} marked as 'Aprovado Parcial' but lacks detailedProcedures with 2+ items.`,
    );
  }

  const [expandedCodes, setExpandedCodes] = useState(new Set<string>());
  const dutModal = useDutModal();

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
        <Box
          sx={{
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <Table size="small" sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...TH_SX, width: 80 }}>Tipo</TableCell>
                <TableCell sx={{ ...TH_SX, width: 120 }}>Código</TableCell>
                <TableCell sx={TH_SX}>Descrição</TableCell>
                <TableCell sx={{ ...TH_SX, width: 80 }}>Qtd</TableCell>
                <TableCell sx={{ ...TH_SX, minWidth: 120 }}>Prestador</TableCell>
                <TableCell sx={{ ...TH_SX, width: 140 }}>Datas</TableCell>
                <TableCell sx={TH_SX}>CID</TableCell>
                <TableCell sx={{ ...TH_SX, width: 70 }}>DUT</TableCell>
                {entry.action === 'Aprovado Parcial' ? (
                  <TableCell sx={{ ...TH_SX, minWidth: 100 }}>Decisão</TableCell>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {procs.map((proc, idx) => (
                <HistoryProcedureRow
                  key={proc.code + String(idx)}
                  proc={proc}
                  executingProviderName={entry.executingProviderName}
                  isLast={idx === procs.length - 1}
                  isPartial={entry.action === 'Aprovado Parcial'}
                  isExpanded={expandedCodes.has(proc.code)}
                  onToggleExpand={() => {
                    toggleExpand(proc.code);
                  }}
                  onDutClick={dutModal.open}
                />
              ))}
            </TableBody>
          </Table>
        </Box>
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
              Profissional Solicitante
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
              {entry.requestingProfessional}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <DutModal open={dutModal.isOpen} onClose={dutModal.close} dutEntry={dutModal.dutEntry} />
    </Card>
  );
}
