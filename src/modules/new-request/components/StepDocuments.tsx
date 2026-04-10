'use client';

import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {
  DOCS_OBRIGATORIOS,
  SUBTITULO_DOC,
  TIPOS_DOC_UPLOAD,
} from '../constants/mandatory-documents';
import { type ModuloType, type DocUpload } from '../types';

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
      <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 600, color: '#333' }}>
        {children}
      </Typography>
    </Box>
  );
}

interface StepDocumentsProps {
  modulo: ModuloType | '';
  docsObrigatorios: DocUpload[];
  docsAdicionais: DocUpload[];
  pendentesObrig: DocUpload[];
  showAddDocForm: boolean;
  setShowAddDocForm: (v: boolean) => void;
  newDocTipo: string;
  setNewDocTipo: (v: string) => void;
  newDocFile: File | null;
  setNewDocFile: (v: File | null) => void;
  newDocDescricao: string;
  setNewDocDescricao: (v: string) => void;
  docDragOver: boolean;
  setDocDragOver: (v: boolean) => void;
  docFileRef: React.RefObject<HTMLInputElement | null>;
  handleObrigUpload: (id: string, file: File) => void;
  handleRemoveObrigDoc: (id: string, originalName: string) => void;
  handleAddDocAdicional: () => void;
  handleRemoveDocAdicional: (id: string) => void;
  cancelAddDoc: () => void;
}

export function StepDocuments({
  modulo,
  docsObrigatorios,
  docsAdicionais,
  pendentesObrig,
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
  handleObrigUpload,
  handleRemoveObrigDoc,
  handleAddDocAdicional,
  handleRemoveDocAdicional,
  cancelAddDoc,
}: StepDocumentsProps) {
  const reqs = modulo ? DOCS_OBRIGATORIOS[modulo] : [];
  const subtitulo = modulo
    ? SUBTITULO_DOC[modulo]
    : 'Adicione documentos de suporte que auxiliem na análise da solicitação.';

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5, fontSize: 15 }}>
        Documentos Complementares
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: 13 }}>
        {subtitulo}
      </Typography>

      {/* Banner pendentes */}
      {pendentesObrig.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3, fontSize: 13 }}>
          {pendentesObrig.length} documento{pendentesObrig.length > 1 ? 's' : ''} obrigatório
          {pendentesObrig.length > 1 ? 's' : ''} pendente{pendentesObrig.length > 1 ? 's' : ''}
          :&nbsp;
          <strong>{pendentesObrig.map((d) => d.nome).join(', ')}</strong>. A solicitação pode ser
          enviada, mas a análise pode ser bloqueada até o envio.
        </Alert>
      )}

      {/* Documentos obrigatórios */}
      {reqs.length > 0 && (
        <>
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ mb: 1.5, fontSize: 13, color: '#902B29' }}
          >
            Documentos Obrigatórios
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
            {docsObrigatorios.map((doc) => {
              const req = reqs.find((_, i) => `OBR-${String(i)}` === doc.id);
              const inputRef = React.createRef<HTMLInputElement>();
              return (
                <Box
                  key={doc.id}
                  sx={{
                    border: `1px solid ${doc.status === 'enviado' ? 'rgba(22,163,74,0.3)' : 'rgba(0,0,0,0.12)'}`,
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: doc.status === 'enviado' ? 'rgba(22,163,74,0.04)' : '#fafafa',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 2,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
                          {'\u{1F4CB}'} {req?.nome ?? doc.nome}
                        </Typography>
                        {!req?.obrigatorio && (
                          <Chip
                            label="Opcional"
                            size="small"
                            sx={{
                              fontSize: 10,
                              height: 18,
                              backgroundColor: 'rgba(0,0,0,0.06)',
                              color: 'text.secondary',
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                        {doc.status === 'enviado'
                          ? `${doc.nome} \u00B7 ${doc.tamanho}`
                          : req
                            ? req.descricao
                            : ''}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                      {doc.status === 'enviado' ? (
                        <>
                          <Chip
                            label={'\u2705 Enviado'}
                            size="small"
                            sx={{
                              fontSize: 11,
                              fontWeight: 700,
                              backgroundColor: 'rgba(22,163,74,0.1)',
                              color: '#15803d',
                              height: 22,
                            }}
                          />
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              handleRemoveObrigDoc(doc.id, req?.nome ?? doc.nome);
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <Chip
                            label={'\u25CF Pendente'}
                            size="small"
                            sx={{
                              fontSize: 11,
                              fontWeight: 700,
                              backgroundColor: 'rgba(239,68,68,0.1)',
                              color: '#dc2626',
                              height: 22,
                            }}
                          />
                          <input
                            ref={inputRef}
                            type="file"
                            accept=".pdf,.jpg,.png"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleObrigUpload(doc.id, f);
                            }}
                          />
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<AttachFileIcon sx={{ fontSize: 13 }} />}
                            sx={{ fontSize: 11 }}
                            onClick={() => inputRef.current?.click()}
                          >
                            Anexar
                          </Button>
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </>
      )}

      {/* Documentos adicionais */}
      <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5, fontSize: 13, color: '#902B29' }}>
        Documentos Adicionais{' '}
        <Typography component="span" variant="caption" color="text.secondary">
          (opcional)
        </Typography>
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 1.5, fontSize: 12 }}
      >
        Outros arquivos de suporte à análise — exames, relatórios, pareceres adicionais.
      </Typography>

      {/* Docs adicionais enviados */}
      {docsAdicionais.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
          {docsAdicionais.map((doc) => (
            <Box
              key={doc.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1.5,
                border: '1px solid rgba(22,163,74,0.25)',
                borderRadius: 1.5,
                backgroundColor: 'rgba(22,163,74,0.04)',
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#16a34a', flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                  {doc.nome}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {doc.tipo} · {doc.tamanho}
                </Typography>
              </Box>
              <IconButton
                size="small"
                color="error"
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

      {/* Form adicionar */}
      {showAddDocForm ? (
        <Box
          sx={{
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: 2,
            p: 2,
            backgroundColor: '#fafafa',
          }}
        >
          <Typography variant="body2" fontWeight={700} sx={{ mb: 1.5, fontSize: 13 }}>
            Novo documento
          </Typography>
          <Grid container spacing={2} sx={{ mb: 1.5 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FieldLabel>
                Tipo do documento <span style={{ color: '#C62828' }}>*</span>
              </FieldLabel>
              <FormControl fullWidth size="small">
                <Select
                  value={newDocTipo}
                  displayEmpty
                  onChange={(e) => {
                    setNewDocTipo(e.target.value);
                  }}
                >
                  <MenuItem value="" disabled>
                    <em>Selecione...</em>
                  </MenuItem>
                  {TIPOS_DOC_UPLOAD.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FieldLabel>Descrição (opcional)</FieldLabel>
              <TextField
                fullWidth
                size="small"
                value={newDocDescricao}
                onChange={(e) => {
                  setNewDocDescricao(e.target.value);
                }}
                placeholder="Ex: Resultado do hemograma de 20/03"
              />
            </Grid>
          </Grid>
          {/* Drop zone */}
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
              if (f) setNewDocFile(f);
            }}
            onClick={() => docFileRef.current?.click()}
            sx={{
              border: `2px dashed ${docDragOver ? '#902B29' : newDocFile ? '#16a34a' : 'rgba(0,0,0,0.18)'}`,
              borderRadius: 2,
              p: 2,
              mb: 1.5,
              cursor: 'pointer',
              backgroundColor: newDocFile ? 'rgba(22,163,74,0.04)' : '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              '&:hover': { borderColor: '#902B29', backgroundColor: 'rgba(144,43,41,0.03)' },
              transition: 'all 0.15s ease',
            }}
          >
            <input
              ref={docFileRef}
              type="file"
              accept=".pdf,.jpg,.png"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setNewDocFile(f);
              }}
            />
            {newDocFile ? (
              <>
                <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 20 }} />
                <Typography variant="body2" fontWeight={600} sx={{ color: '#15803d' }}>
                  {newDocFile.name}
                </Typography>
              </>
            ) : (
              <>
                <UploadFileIcon sx={{ fontSize: 20, color: 'rgba(0,0,0,0.3)' }} />
                <Typography variant="body2" color="text.secondary">
                  Clique ou arraste o arquivo (PDF, JPG, PNG)
                </Typography>
              </>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="outlined" onClick={cancelAddDoc}>
              Cancelar
            </Button>
            <Button
              size="small"
              variant="contained"
              disabled={!newDocTipo || !newDocFile}
              onClick={handleAddDocAdicional}
            >
              Adicionar
            </Button>
          </Box>
        </Box>
      ) : (
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => {
            setShowAddDocForm(true);
          }}
          sx={{ fontSize: 13 }}
        >
          Adicionar documento
        </Button>
      )}
    </Box>
  );
}
