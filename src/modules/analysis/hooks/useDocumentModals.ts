'use client';

import { useState, useRef, type Dispatch, type SetStateAction } from 'react';

import { type Document } from '@/types/pedido';

export type DocumentToastSeverity = 'info' | 'success';
export interface DocumentToast {
  message: string;
  severity: DocumentToastSeverity;
}

interface UseDocumentModalsParams {
  setLocalDocs: Dispatch<SetStateAction<Document[]>>;
  onStructuralChange?: (description: string) => void;
}

export function useDocumentModals({ setLocalDocs, onStructuralChange }: UseDocumentModalsParams) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTipo, setAddTipo] = useState('');
  const [addDescricao, setAddDescricao] = useState('');
  const [addFile, setAddFile] = useState<File | null>(null);
  const [addDragOver, setAddDragOver] = useState(false);
  const [addError, setAddError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toast, setToast] = useState<DocumentToast | null>(null);

  const handleAddConfirm = () => {
    if (!addTipo) {
      setAddError('Selecione o tipo do documento.');
      return;
    }
    if (!addFile) {
      setAddError('Selecione um arquivo.');
      return;
    }
    setAddError('');
    const newId = `DOC-LOCAL-${String(Date.now())}`;
    const newDoc: Document = {
      id: newId,
      nome: addFile.name,
      tipo: addTipo,
      tamanho:
        addFile.size > 1024 * 1024
          ? `${(addFile.size / 1024 / 1024).toFixed(1)} MB`
          : `${String(Math.round(addFile.size / 1024))} KB`,
      enviadoEm: new Date().toLocaleDateString('pt-BR'),
      obrigatorio: false,
      status: 'enviado',
    };
    setLocalDocs((prev) => [...prev, newDoc]);
    setShowAddModal(false);
    setAddTipo('');
    setAddDescricao('');
    setAddFile(null);
    if (onStructuralChange) {
      onStructuralChange(`${newDoc.nome} adicionado`);
    }
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
    setAddTipo('');
    setAddDescricao('');
    setAddFile(null);
    setAddError('');
  };

  return {
    showAddModal,
    setShowAddModal,
    addTipo,
    setAddTipo,
    addDescricao,
    setAddDescricao,
    addFile,
    setAddFile,
    addDragOver,
    setAddDragOver,
    addError,
    processingId,
    setProcessingId,
    toast,
    setToast,
    fileInputRef,
    handleAddConfirm,
    handleAddModalClose,
  };
}
