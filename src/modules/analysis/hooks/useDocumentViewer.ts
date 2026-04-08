'use client'

import { useState, useRef } from 'react'

import { type Pedido, type Documento } from '@/data/pedidos'

export function useDocumentViewer(pedido: Pedido) {
  const [localDocs, setLocalDocs] = useState<Documento[]>([])
  const [viewDoc, setViewDoc] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100)
  const [expandedIA, setExpandedIA] = useState<Record<string, boolean>>({ '0': true })
  const [showAddModal, setShowAddModal] = useState(false)
  const [addTipo, setAddTipo] = useState('')
  const [addDescricao, setAddDescricao] = useState('')
  const [addFile, setAddFile] = useState<File | null>(null)
  const [addDragOver, setAddDragOver] = useState(false)
  const [addError, setAddError] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [showSolicitarModal, setShowSolicitarModal] = useState(false)
  const [solicitarDocs, setSolicitarDocs] = useState<string[]>([])
  const [solicitarMensagem, setSolicitarMensagem] = useState('')
  const [solicitarPrazo, setSolicitarPrazo] = useState('5')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const allDocs = [...pedido.documentos, ...localDocs]

  const handleAddConfirm = () => {
    if (!addTipo) {
      setAddError('Selecione o tipo do documento.')
      return
    }
    if (!addFile) {
      setAddError('Selecione um arquivo.')
      return
    }
    setAddError('')
    const newId = `DOC-LOCAL-${String(Date.now())}`
    const newDoc: Documento = {
      id: newId,
      nome: addFile.name,
      tipo: addTipo,
      tamanho:
        addFile.size > 1024 * 1024
          ? `${String((addFile.size / 1024 / 1024).toFixed(1))} MB`
          : `${String(Math.round(addFile.size / 1024))} KB`,
      enviadoEm: new Date().toLocaleDateString('pt-BR'),
      obrigatorio: false,
      status: 'enviado',
    }
    setLocalDocs(prev => [...prev, newDoc])
    setShowAddModal(false)
    setAddTipo('')
    setAddDescricao('')
    setAddFile(null)
    setToast('Documento adicionado com sucesso')
    setProcessingId(newId)
    setTimeout(() => { setProcessingId(null); }, 2500)
  }

  const handleAddModalClose = () => {
    setShowAddModal(false)
    setAddTipo('')
    setAddDescricao('')
    setAddFile(null)
    setAddError('')
  }

  const handleSolicitarConfirm = () => {
    setShowSolicitarModal(false)
    setSolicitarDocs([])
    setSolicitarMensagem('')
    setToast('Solicitação enviada — pedido pendenciado aguardando documentação')
  }

  return {
    localDocs,
    viewDoc,
    setViewDoc,
    zoom,
    setZoom,
    expandedIA,
    setExpandedIA,
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
    allDocs,
    handleAddConfirm,
    handleAddModalClose,
    handleSolicitarConfirm,
  }
}
