'use client';

import { useState } from 'react';

import { type Document, type Request } from '@/types/pedido';

import { useDocumentModals } from './useDocumentModals';

export function useDocumentViewer(request: Request) {
  // Viewer-only state
  const [localDocs, setLocalDocs] = useState<Document[]>([]);
  const [viewDoc, setViewDoc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [expandedIA, setExpandedIA] = useState<Record<string, boolean>>({ '0': true });

  // Compose modal state (delegates localDocs mutation)
  const modals = useDocumentModals({ setLocalDocs });

  const allDocs = [...request.documents, ...localDocs];

  // Return flat object preserving the original API
  return {
    // Viewer state
    localDocs,
    viewDoc,
    setViewDoc,
    zoom,
    setZoom,
    expandedIA,
    setExpandedIA,
    allDocs,

    // Modal state (spread from useDocumentModals)
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
    showSolicitarModal: modals.showSolicitarModal,
    setShowSolicitarModal: modals.setShowSolicitarModal,
    solicitarDocs: modals.solicitarDocs,
    setSolicitarDocs: modals.setSolicitarDocs,
    solicitarMensagem: modals.solicitarMensagem,
    setSolicitarMensagem: modals.setSolicitarMensagem,
    solicitarPrazo: modals.solicitarPrazo,
    setSolicitarPrazo: modals.setSolicitarPrazo,
    fileInputRef: modals.fileInputRef,
    handleAddConfirm: modals.handleAddConfirm,
    handleAddModalClose: modals.handleAddModalClose,
    handleSolicitarConfirm: modals.handleSolicitarConfirm,
  };
}
