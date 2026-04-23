'use client';

import React from 'react';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';

import { type Request } from '@/types/pedido';

import { useDocumentViewer } from '../hooks/useDocumentViewer';

import DocumentList from './DocumentList';
import DocumentUploadModal from './DocumentUploadModal';
import DocumentViewer from './DocumentViewer';

interface DocumentsSectionProps {
  request: Request;
}

interface MandatoryDocInfo {
  name: string;
  missing: boolean;
}

function useMandatoryDocInfo(
  request: Request,
  allDocs: { nome: string; tipo: string }[],
): MandatoryDocInfo {
  const isContinuidade = request.authorizationStage === 'continuidade';
  const name = isContinuidade ? 'Relatório de Evolução Terapêutica' : 'Plano Terapêutico';
  const keywords = isContinuidade
    ? ['evolucao', 'evolução', 'relatório de evolução', 'relatorio de evolucao']
    : ['plano terapêutico', 'plano terapeutico', 'plano_terapeutico'];
  const hasDoc = allDocs.some((d) =>
    keywords.some((kw) => d.nome.toLowerCase().includes(kw) || d.tipo.toLowerCase().includes(kw)),
  );
  return { name, missing: !hasDoc };
}

interface MandatoryDocAlertProps {
  request: Request;
  mandatory: MandatoryDocInfo;
  onAdd: (preselectTipo: string) => void;
}

function MandatoryDocAlert({ request, mandatory, onAdd }: MandatoryDocAlertProps) {
  const isContinuidade = request.authorizationStage === 'continuidade';
  return (
    <Box
      sx={{
        border: '1px solid rgba(245,158,11,0.4)',
        borderRadius: 2,
        backgroundColor: 'rgba(255,251,235,0.7)',
        p: 2,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        mb: 1.5,
      }}
    >
      <WarningAmberIcon sx={{ fontSize: 20, color: 'warning.light', flexShrink: 0, mt: 0.1 }} />
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, color: 'warning.main' }}>
          Documento obrigatório ausente: {mandatory.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: 12, display: 'block', mt: 0.25 }}
        >
          {isContinuidade
            ? 'Solicitações de continuidade exigem relatório de evolução terapêutica emitido pelo profissional executante.'
            : 'Primeiras solicitações de terapia exigem plano terapêutico detalhado emitido pelo profissional responsável.'}
        </Typography>
      </Box>
      <Button
        size="small"
        variant="outlined"
        startIcon={<AttachFileIcon sx={{ fontSize: 14 }} />}
        onClick={() => {
          onAdd(mandatory.name);
        }}
        sx={{ fontSize: 12, py: 0.4, flexShrink: 0 }}
      >
        Adicionar
      </Button>
    </Box>
  );
}

export default function DocumentsSection({ request }: DocumentsSectionProps) {
  const doc = useDocumentViewer(request);
  const mandatory = useMandatoryDocInfo(request, doc.allDocs);

  const openAddModal = (preselectTipo?: string): void => {
    if (preselectTipo !== undefined) doc.setAddTipo(preselectTipo);
    doc.setShowAddModal(true);
  };

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                fontSize: 15,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: 'text.secondary',
              }}
            >
              Documentos ({doc.allDocs.length})
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: 11, display: 'block', mt: 0.25, mb: 1.5 }}
            >
              Documentos anexados são analisados automaticamente pela IA
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AttachFileIcon sx={{ fontSize: 14 }} />}
            onClick={() => {
              openAddModal();
            }}
            sx={{ fontSize: 12, py: 0.4 }}
          >
            Adicionar
          </Button>
        </Box>

        {mandatory.missing ? (
          <MandatoryDocAlert request={request} mandatory={mandatory} onAdd={openAddModal} />
        ) : null}

        <DocumentList
          documents={doc.allDocs}
          expandedIA={doc.expandedIA}
          processingId={doc.processingId}
          onToggleIA={(docKey) => {
            doc.setExpandedIA((prev) => ({ ...prev, [docKey]: !prev[docKey] }));
          }}
          onViewDoc={(name) => {
            doc.setViewDoc(name);
            doc.setZoom(100);
          }}
          onAddDocument={() => {
            openAddModal();
          }}
        />
      </CardContent>

      <DocumentUploadModal
        open={doc.showAddModal}
        addTipo={doc.addTipo}
        addFile={doc.addFile}
        addDragOver={doc.addDragOver}
        addDescricao={doc.addDescricao}
        addError={doc.addError}
        fileInputRef={doc.fileInputRef}
        onTipoChange={doc.setAddTipo}
        onFileChange={doc.setAddFile}
        onDragOverChange={doc.setAddDragOver}
        onDescricaoChange={doc.setAddDescricao}
        onClose={doc.handleAddModalClose}
        onConfirm={doc.handleAddConfirm}
      />

      <Snackbar
        open={doc.toast !== null}
        autoHideDuration={doc.toast?.severity === 'info' ? 6000 : 4000}
        onClose={() => {
          doc.setToast(null);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={doc.toast?.severity ?? 'info'}
          onClose={() => {
            doc.setToast(null);
          }}
          sx={{ minWidth: 320 }}
        >
          {doc.toast?.message ?? ''}
        </Alert>
      </Snackbar>

      <DocumentViewer
        docName={doc.viewDoc}
        zoom={doc.zoom}
        onZoomChange={doc.setZoom}
        onClose={() => {
          doc.setViewDoc(null);
          doc.setZoom(100);
        }}
      />
    </Card>
  );
}
