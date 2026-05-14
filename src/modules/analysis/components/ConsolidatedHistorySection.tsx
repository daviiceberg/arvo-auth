'use client';

import React from 'react';

import Typography from '@mui/material/Typography';

import { CollapsibleCard } from '@/shared/components';
import { type Request } from '@/types/pedido';

import { resolveConsolidatedHistory } from '../constants/consolidated-history-data';

import HistoryAuthorizations from './HistoryAuthorizations';
import HistoryCompleteness from './HistoryCompleteness';
import HistoryConsultations from './HistoryConsultations';
import HistoryEligibility from './HistoryEligibility';
import HistoryTimeline from './HistoryTimeline';
import HistoryWarnings from './HistoryWarnings';

interface ConsolidatedHistorySectionProps {
  request: Request;
}

export default function ConsolidatedHistorySection({ request }: ConsolidatedHistorySectionProps) {
  const h = resolveConsolidatedHistory({ id: request.id, category: request.category });

  return (
    <CollapsibleCard
      title="Histórico Consolidado"
      headerRight={<HistoryCompleteness completeness={h.completeness} />}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5 }}>
        Resumo assistencial e regulatório para suporte à decisão
      </Typography>

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
    </CollapsibleCard>
  );
}
