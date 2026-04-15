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
import DocumentRequestModal from './DocumentRequestModal';
import DocumentUploadModal from './DocumentUploadModal';
import DocumentViewer from './DocumentViewer';

// ---- Component ----
interface DocumentsSectionProps {
  request: Request;
}

export default function DocumentsSection({ request }: DocumentsSectionProps) {
  const doc = useDocumentViewer(request);

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AttachFileIcon sx={{ fontSize: 14 }} />}
              onClick={() => {
                doc.setShowAddModal(true);
              }}
              sx={{ fontSize: 12, py: 0.4 }}
            >
              Adicionar
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<WarningAmberIcon sx={{ fontSize: 14 }} />}
              onClick={() => {
                doc.setShowSolicitarModal(true);
              }}
              sx={{ fontSize: 12, py: 0.4 }}
            >
              Solicitar complementar
            </Button>
          </Box>
        </Box>

        {/* Terapias Especiais -- missing mandatory doc warning */}
        {(() => {
          const isContinuidade = request.authorizationStage === 'continuidade';
          const mandatoryDocName = isContinuidade
            ? 'Relatório de Evolução Terapêutica'
            : 'Plano Terapêutico';
          const mandatoryDocKeywords = isContinuidade
            ? ['evolucao', 'evolução', 'relatório de evolução', 'relatorio de evolucao']
            : ['plano terapêutico', 'plano terapeutico', 'plano_terapeutico'];
          const hasDoc = doc.allDocs.some((d) =>
            mandatoryDocKeywords.some(
              (kw) => d.nome.toLowerCase().includes(kw) || d.tipo.toLowerCase().includes(kw),
            ),
          );
          if (hasDoc) return null;
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
              <WarningAmberIcon
                sx={{ fontSize: 20, color: 'warning.light', flexShrink: 0, mt: 0.1 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ fontSize: 13, color: 'warning.main' }}
                >
                  Documento obrigatório ausente: {mandatoryDocName}
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
                color="primary"
                startIcon={<WarningAmberIcon sx={{ fontSize: 14 }} />}
                onClick={() => {
                  doc.setShowSolicitarModal(true);
                }}
                sx={{ fontSize: 12, py: 0.4, flexShrink: 0 }}
              >
                Solicitar complementar
              </Button>
            </Box>
          );
        })()}

        {/* Document list */}
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
            doc.setShowAddModal(true);
          }}
        />
      </CardContent>

      {/* Upload modal */}
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

      {/* Request complementary docs modal */}
      <DocumentRequestModal
        open={doc.showSolicitarModal}
        selectedDocs={doc.solicitarDocs}
        deadline={doc.solicitarPrazo}
        message={doc.solicitarMensagem}
        onDocsChange={doc.setSolicitarDocs}
        onDeadlineChange={doc.setSolicitarPrazo}
        onMessageChange={doc.setSolicitarMensagem}
        onClose={() => {
          doc.setShowSolicitarModal(false);
        }}
        onConfirm={doc.handleSolicitarConfirm}
      />

      {/* Toast */}
      <Snackbar
        open={!!doc.toast}
        autoHideDuration={4000}
        onClose={() => {
          doc.setToast('');
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity="success"
          onClose={() => {
            doc.setToast('');
          }}
          sx={{ minWidth: 280 }}
        >
          {doc.toast}
        </Alert>
      </Snackbar>

      {/* Document lightbox viewer */}
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
