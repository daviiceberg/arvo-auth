'use client';

import React from 'react';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { type DocUpload } from '../types';

function getDocIcon(filename: string): React.ReactNode {
  const ext = filename.toLowerCase().split('.').pop() ?? '';
  if (ext === 'pdf') {
    return <PictureAsPdfIcon sx={{ color: 'error.main', fontSize: 28 }} />;
  }
  if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
    return <ImageOutlinedIcon sx={{ color: 'info.main', fontSize: 28 }} />;
  }
  return <DescriptionOutlinedIcon sx={{ color: '#6b7280', fontSize: 28 }} />;
}

interface StepDocumentsProps {
  etapaAutorizacao: string;
  docsAdicionais: DocUpload[];
  docDragOver: boolean;
  setDocDragOver: (v: boolean) => void;
  docFileRef: React.RefObject<HTMLInputElement | null>;
  setNewDocFile: (v: File | null) => void;
  handleAddDocAdicional: () => void;
  handleRemoveDocAdicional: (id: string) => void;
}

export function StepDocuments({
  etapaAutorizacao,
  docsAdicionais,
  docDragOver,
  setDocDragOver,
  docFileRef,
  setNewDocFile,
  handleAddDocAdicional,
  handleRemoveDocAdicional,
}: StepDocumentsProps) {
  const isContinuidade = etapaAutorizacao === 'continuidade';

  const handleFileSelect = (file: File) => {
    setNewDocFile(file);
    setTimeout(() => {
      handleAddDocAdicional();
    }, 100);
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, fontSize: 15 }}>
        Documentos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: 13 }}>
        Anexe os documentos necessários para a análise da solicitação.
      </Typography>

      {/* Instructions */}
      <Box
        sx={{
          border: '1px solid rgba(37,99,235,0.2)',
          borderRadius: 2,
          backgroundColor: 'rgba(37,99,235,0.03)',
          p: 2.5,
          mb: 3,
        }}
      >
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, mb: 1.5 }}>
          Documentos necessários para autorização de Terapias Especiais:
        </Typography>

        {isContinuidade ? (
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            <Typography component="li" variant="body2" sx={{ fontSize: 13, mb: 0.5 }}>
              Pedido médico com CID (assinado pelo profissional solicitante)
            </Typography>
            <Typography component="li" variant="body2" sx={{ fontSize: 13, mb: 0.5 }}>
              Relatório de Evolução Terapêutica (emitido pelo terapeuta)
            </Typography>
            <Typography component="li" variant="body2" sx={{ fontSize: 13 }}>
              Laudo neuropsicológico (se expirado)
            </Typography>
          </Box>
        ) : (
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            <Typography component="li" variant="body2" sx={{ fontSize: 13, mb: 0.5 }}>
              Pedido médico com CID (assinado pelo profissional solicitante)
            </Typography>
            <Typography component="li" variant="body2" sx={{ fontSize: 13, mb: 0.5 }}>
              Laudo neuropsicológico atualizado (validade: 12 meses)
            </Typography>
            <Typography component="li" variant="body2" sx={{ fontSize: 13 }}>
              Plano terapêutico (elaborado pelo profissional executante)
            </Typography>
          </Box>
        )}

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 1.5, fontSize: 12 }}
        >
          Você pode enviar todos os documentos em um único arquivo ou separados.
        </Typography>
      </Box>

      {/* Uploaded files */}
      {docsAdicionais.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          {docsAdicionais.map((doc) => (
            <Box
              key={doc.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 2,
                backgroundColor: '#ffffff',
                transition: 'all 0.15s ease',
                '&:hover': {
                  borderColor: 'rgba(0,0,0,0.15)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                },
              }}
            >
              <Box sx={{ flexShrink: 0 }}>{getDocIcon(doc.nome)}</Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {doc.nome}
                  </Typography>
                  <Chip
                    icon={
                      <CheckCircleOutlineIcon
                        sx={{ fontSize: 11, ml: '4px !important', color: 'success.main' }}
                      />
                    }
                    label="Anexado"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(22,163,74,0.08)',
                      color: 'success.main',
                      fontWeight: 600,
                      fontSize: 11,
                      height: 20,
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: 12, display: 'block', mt: 0.25 }}
                >
                  {doc.tamanho}
                </Typography>
              </Box>
              <IconButton
                size="small"
                color="error"
                aria-label={`Remover ${doc.nome}`}
                onClick={() => {
                  handleRemoveDocAdicional(doc.id);
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {docsAdicionais.length > 0 && (
        <Alert
          severity="info"
          icon={<AutoAwesomeIcon sx={{ fontSize: 18 }} />}
          sx={{
            mb: 2,
            borderRadius: 2,
            border: '1px solid rgba(37,99,235,0.2)',
            backgroundColor: 'rgba(37,99,235,0.04)',
            '& .MuiAlert-icon': { color: 'info.main' },
          }}
        >
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, mb: 0.5 }}>
            Documentos serão analisados pela IA após o envio
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 12, display: 'block' }}
          >
            Ao concluir a solicitação, a IA fará a extração e verificação automática dos arquivos
            anexados. Isso leva alguns minutos — você será notificado quando a análise estiver
            concluída.
          </Typography>
        </Alert>
      )}

      {/* Upload area */}
      <Box
        onDragOver={(e) => {
          e.preventDefault();
          setDocDragOver(true);
        }}
        onDragLeave={() => {
          setDocDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDocDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFileSelect(f);
        }}
        onClick={() => docFileRef.current?.click()}
        sx={{
          border: `2px dashed ${docDragOver ? '#902B29' : 'rgba(0,0,0,0.18)'}`,
          borderRadius: 2,
          p: 4,
          cursor: 'pointer',
          backgroundColor: docDragOver ? 'rgba(144,43,41,0.03)' : '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          '&:hover': { borderColor: 'primary.main', backgroundColor: 'rgba(144,43,41,0.03)' },
          transition: 'all 0.15s ease',
        }}
      >
        <input
          ref={docFileRef}
          type="file"
          accept=".pdf,.jpg,.png,.jpeg"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileSelect(f);
          }}
        />
        <UploadFileIcon sx={{ fontSize: 32, color: 'rgba(0,0,0,0.25)' }} />
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
          Clique ou arraste arquivos aqui
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11 }}>
          PDF, JPG ou PNG
        </Typography>
      </Box>
    </Box>
  );
}
