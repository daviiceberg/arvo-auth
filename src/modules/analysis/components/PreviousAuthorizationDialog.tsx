'use client';

import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { historicoEntries } from '@/data/pedidos';
import { decisionActionConfigMap } from '@/shared/constants';
import { type HistoryEntry } from '@/types/pedido';

interface PreviousAuthorizationDialogProps {
  open: boolean;
  onClose: () => void;
  authorizationId: string | null;
}

function findEntry(id: string | null): HistoryEntry | undefined {
  if (id === null) return undefined;
  return historicoEntries.find((e) => e.id === id);
}

function HeaderBlock({ entry }: { entry: HistoryEntry }) {
  const decisionConfig = decisionActionConfigMap[entry.action];
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Chip
          label={entry.action}
          size="small"
          sx={{
            backgroundColor: decisionConfig.bg,
            color: decisionConfig.color,
            fontWeight: 700,
            height: 24,
            fontSize: 12,
          }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
          Decisão em <strong>{entry.decisionDate}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
          · ID <strong>{entry.id}</strong>
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{
          fontSize: 13,
          backgroundColor: 'rgba(144,43,41,0.06)',
          color: 'primary.main',
          fontWeight: 600,
          px: 1.25,
          py: 0.75,
          borderRadius: 1,
          display: 'inline-block',
          alignSelf: 'flex-start',
        }}
      >
        Analista: {entry.analyst}
      </Typography>
    </Box>
  );
}

function FlagsRow({ entry }: { entry: HistoryEntry }) {
  const flags: { label: string; bg: string; color: string }[] = [];
  if (entry.passedThroughPendency === true) {
    flags.push({ label: 'Passou por pendência', bg: 'rgba(245,158,11,0.12)', color: '#a16207' });
  }
  if (entry.passedThroughJunta === true) {
    flags.push({ label: 'Passou por junta médica', bg: 'rgba(124,58,237,0.12)', color: '#6d28d9' });
  }
  if (entry.divergence) {
    flags.push({ label: 'Houve divergência com IA', bg: 'rgba(212,24,61,0.1)', color: '#d4183d' });
  }
  if (flags.length === 0) return null;
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.5 }}>
      {flags.map((f) => (
        <Chip
          key={f.label}
          label={f.label}
          size="small"
          sx={{ backgroundColor: f.bg, color: f.color, fontWeight: 600, fontSize: 11, height: 22 }}
        />
      ))}
    </Box>
  );
}

function ReasonBlock({ entry }: { entry: HistoryEntry }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="caption"
        fontWeight={700}
        color="text.secondary"
        sx={{
          textTransform: 'uppercase',
          fontSize: 11,
          letterSpacing: 0.5,
          display: 'block',
          mb: 1,
        }}
      >
        Motivo e Observação
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.55, mb: 1 }}>
        {entry.decisionReason}
      </Typography>
      {entry.freeText !== undefined && entry.freeText !== '' ? (
        <Typography
          variant="body2"
          sx={{ fontSize: 13, lineHeight: 1.55, mb: 1, color: 'text.secondary' }}
        >
          {entry.freeText}
        </Typography>
      ) : null}
      {entry.observations !== undefined && entry.observations !== '' ? (
        <Typography
          variant="body2"
          sx={{ fontSize: 13, lineHeight: 1.55, color: 'text.secondary' }}
        >
          {entry.observations}
        </Typography>
      ) : null}
      {entry.divergenceReason !== undefined && entry.divergenceReason !== '' ? (
        <Typography
          variant="caption"
          sx={{ fontSize: 12, display: 'block', mt: 1, color: '#d4183d', fontStyle: 'italic' }}
        >
          Divergência IA: {entry.divergenceReason}
        </Typography>
      ) : null}
      <FlagsRow entry={entry} />
    </Box>
  );
}

function ProceduresBlock({ entry }: { entry: HistoryEntry }) {
  const procedures = entry.detailedProcedures;
  if (!procedures || procedures.length === 0) return null;
  return (
    <Box>
      <Typography
        variant="caption"
        fontWeight={700}
        color="text.secondary"
        sx={{
          textTransform: 'uppercase',
          fontSize: 11,
          letterSpacing: 0.5,
          display: 'block',
          mb: 1,
        }}
      >
        Procedimentos autorizados
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {procedures.map((p) => (
          <Box
            key={p.code}
            sx={{
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: 1.5,
              p: 1.25,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
                {p.description}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                TUSS {p.code}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                Solicitado: <strong>{p.qty}</strong>
              </Typography>
              {p.authorizedQty !== undefined ? (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                  Autorizado: <strong>{p.authorizedQty}</strong>
                </Typography>
              ) : null}
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                Pedido: <strong>{p.requestDate}</strong>
              </Typography>
              {p.passwordExpiryDate !== undefined && p.passwordExpiryDate !== '' ? (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                  Válido até: <strong>{p.passwordExpiryDate}</strong>
                </Typography>
              ) : null}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function EmptyState() {
  return (
    <Box sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
        Detalhes da autorização não disponíveis.
      </Typography>
    </Box>
  );
}

export default function PreviousAuthorizationDialog({
  open,
  onClose,
  authorizationId,
}: PreviousAuthorizationDialogProps) {
  const entry = findEntry(authorizationId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6, fontSize: 16, fontWeight: 700 }}>
        Autorização anterior
        <IconButton
          aria-label="Fechar"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2.5 }}>
        {entry === undefined ? (
          <EmptyState />
        ) : (
          <>
            <HeaderBlock entry={entry} />
            <Divider sx={{ mb: 2 }} />
            <ReasonBlock entry={entry} />
            <Divider sx={{ mb: 2 }} />
            <ProceduresBlock entry={entry} />
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="contained" onClick={onClose}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
