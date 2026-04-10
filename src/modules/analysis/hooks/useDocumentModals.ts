'use client';

import { useState, useRef, type Dispatch, type SetStateAction } from 'react';

import { type Document } from '@/types/pedido';

interface UseDocumentModalsParams {
  setLocalDocs: Dispatch<SetStateAction<Document[]>>;
}

export function useDocumentModals({ setLocalDocs }: UseDocumentModalsParams) {
  // Add document modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTipo, setAddTipo] = useState('');
  const [addDescricao, setAddDescricao] = useState('');
  const [addFile, setAddFile] = useState<File | null>(null);
  const [addDragOver, setAddDragOver] = useState(false);
  const [addError, setAddError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Request documents modal state
  const [showSolicitarModal, setShowSolicitarModal] = useState(false);
  const [solicitarDocs, setSolicitarDocs] = useState<string[]>([]);
  const [solicitarMensagem, setSolicitarMensagem] = useState('');
  const [solicitarPrazo, setSolicitarPrazo] = useState('5');

  // Shared state
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

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
    setToast('Documento adicionado com sucesso');
    setProcessingId(newId);
    setTimeout(() => {
      setProcessingId(null);
    }, 2500);
  };

  const handleAddModalClose = () => {
    setShowAddModal(false);
    setAddTipo('');
    setAddDescricao('');
    setAddFile(null);
    setAddError('');
  };

  const handleSolicitarConfirm = () => {
    setShowSolicitarModal(false);
    setSolicitarDocs([]);
    setSolicitarMensagem('');
    setToast('Solicitação enviada — pedido pendenciado aguardando documentação');
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
    toast,
    setToast,
    showSolicitarModal,
    setShowSolicitarModal,
    solicitarDocs,
    setSolicitarDocs,
    solicitarMensagem,
    setSolicitarMensagem,
    solicitarPrazo,
    setSolicitarPrazo,
    fileInputRef,
    handleAddConfirm,
    handleAddModalClose,
    handleSolicitarConfirm,
  };
}
