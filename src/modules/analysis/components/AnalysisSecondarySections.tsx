'use client';

import { type RefObject } from 'react';

import { type Request } from '@/types/pedido';

import AuditLogSection from './AuditLogSection';
import ConsolidatedHistorySection from './ConsolidatedHistorySection';
import DocumentsSection from './DocumentsSection';
import InternalNotesSection from './InternalNotesSection';
import ObservationsSection from './ObservationsSection';
import PrestadorTimelineSection from './PrestadorTimelineSection';

interface AnalysisSecondarySectionsProps {
  request: Request;
  internalNotes: string;
  onInternalNotesChange: (value: string) => void;
  pendingReprocess: boolean;
  isReprocessing: boolean;
  onRequestReprocess: () => void;
  onStructuralChange: (description: string) => void;
  attachHandlerRef: RefObject<(() => void) | null>;
}

/**
 * Wrapper de seções secundárias da Análise — colapsa em Modo Compacto (M3).
 * Banners regulatórios, Beneficiary, Procedures e AssistantSidebar permanecem
 * sempre fora desse wrapper (R-M3-07).
 */
export default function AnalysisSecondarySections({
  request,
  internalNotes,
  onInternalNotesChange,
  pendingReprocess,
  isReprocessing,
  onRequestReprocess,
  onStructuralChange,
  attachHandlerRef,
}: AnalysisSecondarySectionsProps) {
  return (
    <>
      <ObservationsSection request={request} />
      <InternalNotesSection
        key={`notes-${request.id}`}
        value={internalNotes}
        onChange={onInternalNotesChange}
      />
      <AuditLogSection entries={request.auditLog ?? []} />
      <ConsolidatedHistorySection request={request} />
      <DocumentsSection
        request={request}
        pendingReprocess={pendingReprocess}
        isReprocessing={isReprocessing}
        onRequestReprocess={onRequestReprocess}
        onStructuralChange={onStructuralChange}
        attachHandlerRef={attachHandlerRef}
      />
      {request.prestadorMessages && request.prestadorMessages.length > 0 ? (
        <PrestadorTimelineSection messages={request.prestadorMessages} />
      ) : null}
    </>
  );
}
