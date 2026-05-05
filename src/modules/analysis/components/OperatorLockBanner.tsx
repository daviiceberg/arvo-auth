'use client';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

import { alertOutlines } from '@/shared/constants';
import { type OperatorLock } from '@/types/pedido';

interface OperatorLockBannerProps {
  lock: OperatorLock;
  canForceUnlock: boolean;
  onForceUnlock: () => void;
}

export default function OperatorLockBanner({
  lock,
  canForceUnlock,
  onForceUnlock,
}: OperatorLockBannerProps) {
  return (
    <Alert
      severity="warning"
      icon={<LockOutlinedIcon />}
      sx={{ mb: 0, borderRadius: 2, border: alertOutlines.warning }}
      action={
        <Tooltip
          title={canForceUnlock ? '' : 'Apenas Analista Sênior pode forçar destravamento'}
          placement="top"
        >
          <Box component="span">
            <Button
              color="inherit"
              size="small"
              variant="outlined"
              disabled={!canForceUnlock}
              onClick={onForceUnlock}
              sx={{ fontSize: 12 }}
            >
              Forçar destravamento
            </Button>
          </Box>
        </Tooltip>
      }
    >
      <AlertTitle sx={{ fontWeight: 700 }}>
        Esta guia está sendo analisada por outra pessoa
      </AlertTitle>
      <Box>
        <strong>{lock.userName}</strong> abriu o pedido em <strong>{lock.lockedAt}</strong>.
        Decisões estão desabilitadas para evitar conflito.
      </Box>
    </Alert>
  );
}
