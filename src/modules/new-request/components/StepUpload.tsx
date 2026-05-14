'use client';

import React, { type RefObject } from 'react';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { CATEGORIES_ORDER } from '@/shared/constants';

import { type FormData } from '../types';

const CATEGORY_OPTIONS = CATEGORIES_ORDER;

interface StepUploadProps {
  uploadState: 'idle' | 'uploading' | 'waiting' | 'processed';
  uploadProgress: number;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileSelected: (file: File) => void;
  onSkip: () => void;
  category: FormData['category'];
  setCategory: (next: FormData['category']) => void;
}

/**
 * File picker input positioned off-screen but still reachable by keyboard and
 * assistive tech. The surrounding `<Box component="label">` delegates the
 * click/Enter/Space activation to this input natively, so we don't need a
 * synthetic `onClick` on the drop zone.
 */
const VISUALLY_HIDDEN_INPUT_SX = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
} as const;

const FILE_INPUT_ID = 'step-upload-file';

interface CategorySelectorProps {
  category: FormData['category'];
  setCategory: (next: FormData['category']) => void;
  disabled: boolean;
}

function CategorySelector({ category, setCategory, disabled }: CategorySelectorProps) {
  return (
    <Box sx={{ width: '100%', maxWidth: 480 }}>
      <Typography
        variant="caption"
        sx={{ fontSize: 12, fontWeight: 600, color: '#333', display: 'block', mb: 0.75 }}
      >
        Tipo de Solicitação *
      </Typography>
      <FormControl fullWidth size="small">
        <Select<FormData['category']>
          value={category}
          displayEmpty
          disabled={disabled}
          sx={{ backgroundColor: '#fff' }}
          onChange={(e) => {
            setCategory(e.target.value as FormData['category']);
          }}
          renderValue={(selected) =>
            selected === '' ? (
              <Box component="em" sx={{ color: 'text.disabled' }}>
                Selecione o tipo de solicitação...
              </Box>
            ) : (
              selected
            )
          }
        >
          {CATEGORY_OPTIONS.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

// eslint-disable-next-line complexity
export function StepUpload({
  uploadState,
  uploadProgress,
  dragOver,
  setDragOver,
  fileInputRef,
  onFileSelected,
  onSkip,
  category,
  setCategory,
}: StepUploadProps) {
  const isIdle = uploadState === 'idle';
  const isCategorySelected = category !== '';
  const canInteractWithUpload = isIdle && isCategorySelected;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelected(file);
    // Reset so the same file can be reselected after a failure.
    event.target.value = '';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 3,
        px: 4,
      }}
    >
      <Box sx={{ textAlign: 'center', maxWidth: 460, textWrap: 'balance' }}>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
          Nova Solicitação de Autorização
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Selecione o tipo de solicitação para que os agentes específicos sejam acionados no
          processamento. Depois, envie o pedido médico ou preencha manualmente.
        </Typography>
      </Box>

      <CategorySelector category={category} setCategory={setCategory} disabled={!isIdle} />

      {/* Drop zone — rendered as a <label> so keyboard users can activate the
          hidden file input with Enter/Space, and screen readers announce it
          correctly. Tooltip wrapper communicates the blocked state while the
          category is empty. */}
      <Tooltip
        title={
          isCategorySelected ? '' : 'Selecione o tipo de solicitação antes de enviar o pedido.'
        }
        arrow
        disableHoverListener={isCategorySelected}
        disableFocusListener={isCategorySelected}
      >
        <Box sx={{ width: '100%', maxWidth: 480, display: 'flex', justifyContent: 'center' }}>
          <Box
            component="label"
            htmlFor={FILE_INPUT_ID}
            onDragOver={(e) => {
              e.preventDefault();
              if (canInteractWithUpload) setDragOver(true);
            }}
            onDragLeave={() => {
              setDragOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (!canInteractWithUpload) return;
              const file = e.dataTransfer.files[0];
              if (file) onFileSelected(file);
            }}
            sx={{
              width: '100%',
              maxWidth: 480,
              border: `2px dashed ${dragOver ? '#902B29' : 'rgba(0,0,0,0.2)'}`,
              borderRadius: 3,
              backgroundColor: dragOver
                ? 'rgba(144,43,41,0.07)'
                : uploadState === 'uploading' || uploadState === 'waiting'
                  ? 'rgba(37,99,235,0.03)'
                  : '#fafafa',
              boxShadow: dragOver ? '0 0 0 4px rgba(144,43,41,0.12)' : 'none',
              transform: dragOver ? 'scale(1.01)' : 'scale(1)',
              transition: 'all 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              py: 5,
              px: 3,
              cursor: canInteractWithUpload ? 'pointer' : 'not-allowed',
              opacity: isCategorySelected ? 1 : 0.5,
              pointerEvents: canInteractWithUpload ? 'auto' : 'none',
              '&:hover': canInteractWithUpload
                ? { borderColor: 'primary.main', backgroundColor: 'rgba(144,43,41,0.03)' }
                : {},
            }}
          >
            <Box
              component="input"
              id={FILE_INPUT_ID}
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              disabled={!canInteractWithUpload}
              onChange={handleChange}
              sx={VISUALLY_HIDDEN_INPUT_SX}
            />

            {isIdle ? (
              <>
                <UploadFileIcon sx={{ fontSize: 48, color: 'rgba(0,0,0,0.25)' }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" fontWeight={700} sx={{ mb: 0.5 }}>
                    Arraste o pedido médico aqui
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ou clique para selecionar o arquivo
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  PDF, JPG, PNG — até 10MB
                </Typography>
              </>
            ) : null}

            {uploadState === 'uploading' ? (
              <>
                <CircularProgress size={40} thickness={3} sx={{ color: 'info.main' }} />
                <Typography variant="body1" fontWeight={700} sx={{ color: 'info.main' }}>
                  Enviando documento...
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Aguarde enquanto o envio é concluído
                </Typography>
                <Box sx={{ width: '100%', mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(37,99,235,0.12)',
                      '& .MuiLinearProgress-bar': { borderRadius: 3, backgroundColor: 'info.main' },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', textAlign: 'right', mt: 0.5, color: 'text.secondary' }}
                  >
                    {uploadProgress}%
                  </Typography>
                </Box>
              </>
            ) : null}

            {uploadState === 'waiting' ? (
              <>
                <CircularProgress size={40} thickness={3} sx={{ color: 'info.main' }} />
                <Typography variant="body1" fontWeight={700} sx={{ color: 'info.main' }}>
                  Aguardando processamento...
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                  A análise ocorre em segundo plano. Isso pode levar alguns instantes.
                </Typography>
              </>
            ) : null}

            {uploadState === 'processed' ? (
              <>
                <CheckCircleOutlineIcon sx={{ fontSize: 44, color: 'success.main' }} />
                <Typography variant="body1" fontWeight={700} sx={{ color: 'success.main' }}>
                  Arquivo processado!
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Clique em &quot;Próxima Etapa&quot; para continuar.
                </Typography>
              </>
            ) : null}
          </Box>
        </Box>
      </Tooltip>

      {isIdle ? (
        <Tooltip
          title={
            isCategorySelected
              ? ''
              : 'Selecione o tipo de solicitação antes de preencher manualmente.'
          }
          arrow
          disableHoverListener={isCategorySelected}
          disableFocusListener={isCategorySelected}
        >
          <Box component="span">
            <Button
              variant="text"
              size="small"
              endIcon={<ChevronRightIcon />}
              disabled={!isCategorySelected}
              onClick={onSkip}
              sx={{ color: 'text.secondary', fontSize: 13 }}
            >
              Preencher manualmente sem upload
            </Button>
          </Box>
        </Tooltip>
      ) : null}
    </Box>
  );
}
