'use client';

import { useState } from 'react';

import { type Document, type Request } from '@/types/pedido';

import { useDocumentModals } from './useDocumentModals';

interface UseDocumentViewerParams {
  onStructuralChange?: (description: string) => void;
}

export function useDocumentViewer(request: Request, params: UseDocumentViewerParams = {}) {
  const [localDocs, setLocalDocs] = useState<Document[]>([]);
  const [removedServerDocIds, setRemovedServerDocIds] = useState(new Set<string>());
  const [viewDoc, setViewDoc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [expandedIA, setExpandedIA] = useState<Record<string, boolean>>({ '0': true });

  const modals = useDocumentModals({
    setLocalDocs,
    onStructuralChange: params.onStructuralChange,
  });

  const allDocs = [
    ...request.documents.filter((d) => !removedServerDocIds.has(d.id)),
    ...localDocs,
  ];

  const removeDocument = (docId: string, _docName: string) => {
    const isLocal = localDocs.some((d) => d.id === docId);
    if (isLocal) {
      setLocalDocs((prev) => prev.filter((d) => d.id !== docId));
    } else {
      setRemovedServerDocIds((prev) => {
        const next = new Set(prev);
        next.add(docId);
        return next;
      });
    }
  };

  return {
    localDocs,
    viewDoc,
    setViewDoc,
    zoom,
    setZoom,
    expandedIA,
    setExpandedIA,
    allDocs,
    removeDocument,

    showAddModal: modals.showAddModal,
    setShowAddModal: modals.setShowAddModal,
    addTipo: modals.addTipo,
    setAddTipo: modals.setAddTipo,
    addDescricao: modals.addDescricao,
    setAddDescricao: modals.setAddDescricao,
    addFile: modals.addFile,
    setAddFile: modals.setAddFile,
    addDragOver: modals.addDragOver,
    setAddDragOver: modals.setAddDragOver,
    addError: modals.addError,
    processingId: modals.processingId,
    toast: modals.toast,
    setToast: modals.setToast,
    fileInputRef: modals.fileInputRef,
    handleAddConfirm: modals.handleAddConfirm,
    handleAddModalClose: modals.handleAddModalClose,
  };
}
