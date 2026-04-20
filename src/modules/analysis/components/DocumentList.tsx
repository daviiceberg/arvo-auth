'use client';

import React from 'react';

import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import GavelIcon from '@mui/icons-material/Gavel';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { type Document } from '@/types/pedido';

import { getIAExtractionFields } from '../utils/ia-extraction';

import IAExtractionPanel from './IAExtractionPanel';

// ---- docIcon helper ----
function docIcon(tipo: string) {
  if (
    tipo.toLowerCase().includes('pdf') ||
    tipo.toLowerCase().includes('médico') ||
    tipo.toLowerCase().includes('laudo')
  ) {
    return <PictureAsPdfIcon sx={{ color: 'error.main', fontSize: 28 }} />;
  }
  if (tipo.toLowerCase().includes('judicial') || tipo.toLowerCase().includes('jurídico')) {
    return <GavelIcon sx={{ color: 'secondary.main', fontSize: 28 }} />;
  }
  if (tipo.toLowerCase().includes('imagem') || tipo.toLowerCase().includes('exame')) {
    return <ImageOutlinedIcon sx={{ color: 'info.main', fontSize: 28 }} />;
  }
  return <DescriptionOutlinedIcon sx={{ color: '#6b7280', fontSize: 28 }} />;
}

// ---- Component ----
interface DocumentListProps {
  documents: Document[];
  expandedIA: Record<string, boolean>;
  processingId: string | null;
  onToggleIA: (docKey: string) => void;
  onViewDoc: (docName: string) => void;
  onAddDocument: () => void;
}

export default function DocumentList({
  documents,
  expandedIA,
  processingId,
  onToggleIA,
  onViewDoc,
  onAddDocument,
}: DocumentListProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {documents.map((docItem) => {
        const docKey = docItem.id;
        const iaOpen = !!expandedIA[docKey];

        // Pending document -- differentiated visual
        if (docItem.status === 'pendente') {
          return (
            <Box
              key={docKey}
              sx={{
                border: '1px solid rgba(245,158,11,0.4)',
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: 'rgba(255,251,235,0.6)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                <WarningAmberIcon sx={{ fontSize: 20, color: 'warning.light', flexShrink: 0 }} />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {docItem.nome}
                    </Typography>
                    <Chip
                      label="Documento pendente"
                      size="small"
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: 'rgba(245,158,11,0.15)',
                        color: 'warning.main',
                        height: 20,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                    {docItem.obrigatorio ? 'Obrigatório' : 'Opcional'} · Não enviado pelo
                    solicitante
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AttachFileIcon sx={{ fontSize: 14 }} />}
                  onClick={onAddDocument}
                  sx={{
                    fontSize: 12,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: 'rgba(144,43,41,0.04)',
                    },
                  }}
                >
                  Adicionar documento
                </Button>
              </Box>
            </Box>
          );
        }

        // Sent document -- standard visual
        const iaFields =
          processingId === docKey ? null : getIAExtractionFields(docItem.nome, docItem.tipo);

        return (
          <Box
            key={docKey}
            sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden' }}
          >
            {/* Doc row */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                backgroundColor: 'rgba(0,0,0,0.01)',
              }}
            >
              {docIcon(docItem.tipo)}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body2" fontWeight={600}>
                    {docItem.nome}
                  </Typography>
                  {(docItem.tipo === 'Laudo Médico' ||
                    docItem.nome.toLowerCase().includes('laudo')) && (
                    <Chip
                      icon={<WarningAmberIcon sx={{ fontSize: 11, ml: '4px !important' }} />}
                      label="Validade: 6 meses"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(245,158,11,0.1)',
                        color: 'warning.main',
                        fontWeight: 700,
                        fontSize: 11,
                        height: 20,
                      }}
                    />
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                  {docItem.tipo}
                  {docItem.tamanho ? ` · ${docItem.tamanho}` : ''}
                  {docItem.enviadoEm ? ` · Enviado em ${docItem.enviadoEm}` : ''}
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                startIcon={<VisibilityIcon fontSize="small" />}
                aria-label={`Visualizar ${docItem.nome}`}
                onClick={() => {
                  onViewDoc(docItem.nome);
                }}
              >
                Visualizar
              </Button>
            </Box>

            {/* IA Extraction panel */}
            <IAExtractionPanel
              isOpen={iaOpen}
              isProcessing={processingId === docKey}
              fields={iaFields}
              onToggle={() => {
                onToggleIA(docKey);
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}
