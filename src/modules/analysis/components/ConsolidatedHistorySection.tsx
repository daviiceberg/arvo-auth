'use client';

import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { type Request } from '@/types/pedido';

import { resolveConsolidatedHistory } from '../constants/consolidated-history-data';

import HistoryAuthorizations from './HistoryAuthorizations';
import HistoryCompleteness from './HistoryCompleteness';
import HistoryConsultations from './HistoryConsultations';
import HistoryEligibility from './HistoryEligibility';
import HistoryTimeline from './HistoryTimeline';
import HistoryWarnings from './HistoryWarnings';

// ---- Component ----
interface ConsolidatedHistorySectionProps {
  request: Request;
}

export default function ConsolidatedHistorySection({ request }: ConsolidatedHistorySectionProps) {
  const h = resolveConsolidatedHistory({ id: request.id, category: request.category });

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <HistoryCompleteness completeness={h.completeness} />

        <HistoryTimeline timeline={h.linhaDoTempo} assistedReading={h.leituraAssistida} />

        <HistoryConsultations
          consultations={h.consultasRecentes}
          relatedProcedures={h.procedimentosRelacionados}
          hospitalizations={h.internacoes}
          recurrentCid={h.cidRecorrente}
          monthlySessions={h.sessoesDoMes}
        />

        <HistoryAuthorizations authorizations={h.autorizacoesAnteriores} />

        <HistoryWarnings warnings={h.sinaisAtencao} request={request} />

        <HistoryEligibility eligibility={h.elegibilidade} request={request} />
      </CardContent>
    </Card>
  );
}
