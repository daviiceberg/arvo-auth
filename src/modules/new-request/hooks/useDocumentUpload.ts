'use client';

import React, { useState, useReducer, useEffect } from 'react';

import {
  DOCS_TERAPIAS_PRIMEIRA,
  DOCS_TERAPIAS_CONTINUIDADE,
} from '../constants/mandatory-documents';
import { type ModuloType, type DocUpload } from '../types';

interface UseDocumentUploadParams {
  activeModulo: ModuloType | '';
  etapaAutorizacao: string;
}

type ObrigAction =
  | { type: 'RESET'; payload: DocUpload[] }
  | { type: 'UPDATE'; id: string; patch: Partial<DocUpload> };

function obrigReducer(state: DocUpload[], action: ObrigAction): DocUpload[] {
  if (action.type === 'RESET') return action.payload;
  return state.map((d) => (d.id === action.id ? { ...d, ...action.patch } : d));
}

function buildRequiredDocs(activeModulo: ModuloType | '', etapaAutorizacao: string): DocUpload[] {
  if (!activeModulo) return [];
  const reqs =
    etapaAutorizacao === 'continuidade' ? DOCS_TERAPIAS_CONTINUIDADE : DOCS_TERAPIAS_PRIMEIRA;
  return reqs.map((r, i) => ({
    id: `OBR-${String(i)}`,
    nome: r.nome,
    tipo: 'Obrigatório',
    tamanho: '',
    obrigatorio: r.obrigatorio,
    status: 'pendente' as const,
  }));
}

export function useDocumentUpload({ activeModulo, etapaAutorizacao }: UseDocumentUploadParams) {
  const [docsObrigatorios, dispatchObrig] = useReducer(obrigReducer, undefined, () =>
    buildRequiredDocs(activeModulo, etapaAutorizacao),
  );
  const [docsAdicionais, setDocsAdicionais] = useState<DocUpload[]>([]);
  const [showAddDocForm, setShowAddDocForm] = useState(false);
  const [newDocTipo, setNewDocTipo] = useState('');
  const [newDocFile, setNewDocFile] = useState<File | null>(null);
  const [newDocDescricao, setNewDocDescricao] = useState('');
  const [docDragOver, setDocDragOver] = useState(false);
  const docFileRef = React.useRef<HTMLInputElement>(null);

  // Reset mandatory docs when modulo or etapaAutorizacao changes
  useEffect(() => {
    dispatchObrig({ type: 'RESET', payload: buildRequiredDocs(activeModulo, etapaAutorizacao) });
  }, [activeModulo, etapaAutorizacao]);

  const pendentesObrig = docsObrigatorios.filter((d) => d.obrigatorio && d.status === 'pendente');

  const handleObrigUpload = (id: string, file: File) => {
    dispatchObrig({
      type: 'UPDATE',
      id,
      patch: {
        status: 'enviado',
        nome: file.name,
        tamanho:
          file.size > 1024 * 1024
            ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
            : `${String(Math.round(file.size / 1024))} KB`,
        file,
      },
    });
  };

  const handleRemoveObrigDoc = (id: string, originalName: string) => {
    dispatchObrig({
      type: 'UPDATE',
      id,
      patch: { status: 'pendente' as const, nome: originalName, tamanho: '', file: undefined },
    });
  };

  const handleAddDocAdicional = () => {
    if (!newDocFile) return;
    setDocsAdicionais((prev) => [
      ...prev,
      {
        id: `ADD-${String(Date.now())}`,
        nome: newDocFile.name,
        tipo: newDocTipo || 'Documento',
        tamanho:
          newDocFile.size > 1024 * 1024
            ? `${(newDocFile.size / 1024 / 1024).toFixed(1)} MB`
            : `${String(Math.round(newDocFile.size / 1024))} KB`,
        obrigatorio: false,
        status: 'enviado',
        file: newDocFile,
      },
    ]);
    setShowAddDocForm(false);
    setNewDocTipo('');
    setNewDocFile(null);
    setNewDocDescricao('');
  };

  const handleRemoveDocAdicional = (id: string) => {
    setDocsAdicionais((prev) => prev.filter((d) => d.id !== id));
  };

  const cancelAddDoc = () => {
    setShowAddDocForm(false);
    setNewDocTipo('');
    setNewDocFile(null);
    setNewDocDescricao('');
  };

  const resetDocs = () => {
    dispatchObrig({ type: 'RESET', payload: [] });
    setDocsAdicionais([]);
  };

  return {
    docsObrigatorios,
    docsAdicionais,
    showAddDocForm,
    setShowAddDocForm,
    newDocTipo,
    setNewDocTipo,
    newDocFile,
    setNewDocFile,
    newDocDescricao,
    setNewDocDescricao,
    docDragOver,
    setDocDragOver,
    docFileRef,
    pendentesObrig,
    handleObrigUpload,
    handleRemoveObrigDoc,
    handleAddDocAdicional,
    handleRemoveDocAdicional,
    cancelAddDoc,
    resetDocs,
  };
}
