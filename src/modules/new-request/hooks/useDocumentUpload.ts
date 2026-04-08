'use client'

import React, { useState, useEffect } from 'react'
import { type ModuloType, type DocUpload } from '../types'
import { DOCS_OBRIGATORIOS, DOCS_TERAPIAS_PRIMEIRA, DOCS_TERAPIAS_CONTINUIDADE } from '../constants/mandatory-documents'

interface UseDocumentUploadParams {
  activeModulo: ModuloType | ''
  etapaAutorizacao: string
}

export function useDocumentUpload({ activeModulo, etapaAutorizacao }: UseDocumentUploadParams) {
  const [docsObrigatorios, setDocsObrigatorios] = useState<DocUpload[]>([])
  const [docsAdicionais, setDocsAdicionais] = useState<DocUpload[]>([])
  const [showAddDocForm, setShowAddDocForm] = useState(false)
  const [newDocTipo, setNewDocTipo] = useState('')
  const [newDocFile, setNewDocFile] = useState<File | null>(null)
  const [newDocDescricao, setNewDocDescricao] = useState('')
  const [docDragOver, setDocDragOver] = useState(false)
  const docFileRef = React.useRef<HTMLInputElement>(null)

  // Initialize mandatory docs when modulo or etapaAutorizacao changes
  useEffect(() => {
    if (!activeModulo) return
    let reqs: { nome: string; descricao: string; obrigatorio: boolean }[]
    if (activeModulo === 'terapias') {
      reqs = etapaAutorizacao === 'continuidade' ? DOCS_TERAPIAS_CONTINUIDADE : DOCS_TERAPIAS_PRIMEIRA
    } else {
      reqs = DOCS_OBRIGATORIOS[activeModulo] ?? []
    }
    setDocsObrigatorios(reqs.map((r, i) => ({
      id: `OBR-${i}`,
      nome: r.nome,
      tipo: 'Obrigatório',
      tamanho: '',
      obrigatorio: r.obrigatorio,
      status: 'pendente' as const,
    })))
  }, [activeModulo, etapaAutorizacao])

  const pendentesObrig = docsObrigatorios.filter(d => d.obrigatorio && d.status === 'pendente')

  const handleObrigUpload = (id: string, file: File) => {
    setDocsObrigatorios(prev => prev.map(d =>
      d.id === id ? {
        ...d,
        status: 'enviado',
        nome: file.name,
        tamanho: file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
        file,
      } : d
    ))
  }

  const handleRemoveObrigDoc = (id: string, originalName: string) => {
    setDocsObrigatorios(prev => prev.map(d =>
      d.id === id ? { ...d, status: 'pendente' as const, nome: originalName, tamanho: '', file: undefined } : d
    ))
  }

  const handleAddDocAdicional = () => {
    if (!newDocTipo || !newDocFile) return
    setDocsAdicionais(prev => [...prev, {
      id: `ADD-${Date.now()}`,
      nome: newDocFile.name,
      tipo: newDocTipo,
      tamanho: newDocFile.size > 1024 * 1024 ? `${(newDocFile.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(newDocFile.size / 1024)} KB`,
      obrigatorio: false,
      status: 'enviado',
      file: newDocFile,
    }])
    setShowAddDocForm(false)
    setNewDocTipo('')
    setNewDocFile(null)
    setNewDocDescricao('')
  }

  const handleRemoveDocAdicional = (id: string) => {
    setDocsAdicionais(prev => prev.filter(d => d.id !== id))
  }

  const cancelAddDoc = () => {
    setShowAddDocForm(false)
    setNewDocTipo('')
    setNewDocFile(null)
    setNewDocDescricao('')
  }

  const resetDocs = () => {
    setDocsObrigatorios([])
    setDocsAdicionais([])
  }

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
  }
}
