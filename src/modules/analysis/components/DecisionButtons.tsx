'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';

interface MultiProcButtonsProps {
  isMultiProc: true;
  anyPending: boolean;
  isGuideFinalized: boolean;
  confirmBtnColor: string;
  confirmBtnHover: string;
  onConfirmClick: () => void;
  onPendencyClick: () => void;
  onBoardClick: () => void;
}

interface SingleProcButtonsProps {
  isMultiProc: false;
  isGuideFinalized: boolean;
  isBoardWaiting: boolean;
  loadingApprove: boolean;
  loadingDeny: boolean;
  onApproveClick: () => void;
  onDenyClick: () => void;
  onPendencyClick: () => void;
  onBoardClick: () => void;
}

type DecisionButtonsProps = MultiProcButtonsProps | SingleProcButtonsProps;

export default function DecisionButtons(props: DecisionButtonsProps) {
  const { isMultiProc, isGuideFinalized, onPendencyClick, onBoardClick } = props;

  return (
    <>
      {isMultiProc ? (
        <MultiProcConfirmButton
          anyPending={props.anyPending}
          isGuideFinalized={isGuideFinalized}
          confirmBtnColor={props.confirmBtnColor}
          confirmBtnHover={props.confirmBtnHover}
          onConfirmClick={props.onConfirmClick}
        />
      ) : (
        <SingleProcApprovalButtons
          isGuideFinalized={isGuideFinalized}
          isBoardWaiting={props.isBoardWaiting}
          loadingApprove={props.loadingApprove}
          loadingDeny={props.loadingDeny}
          onApproveClick={props.onApproveClick}
          onDenyClick={props.onDenyClick}
        />
      )}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={onPendencyClick}
          disabled={isGuideFinalized}
          sx={{ minHeight: 36, fontSize: 12 }}
        >
          Pendenciar
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={onBoardClick}
          disabled={isGuideFinalized}
          sx={{
            minHeight: 36,
            fontSize: 12,
            borderColor: '#2563eb',
            color: '#2563eb',
            '&:hover': { borderColor: '#1d4ed8', backgroundColor: 'rgba(37,99,235,0.05)' },
          }}
        >
          Junta Médica
        </Button>
      </Box>
    </>
  );
}

/* ---- Internal sub-components ---- */

interface MultiProcConfirmButtonProps {
  anyPending: boolean;
  isGuideFinalized: boolean;
  confirmBtnColor: string;
  confirmBtnHover: string;
  onConfirmClick: () => void;
}

function MultiProcConfirmButton({
  anyPending,
  isGuideFinalized,
  confirmBtnColor,
  confirmBtnHover,
  onConfirmClick,
}: MultiProcConfirmButtonProps) {
  return (
    <>
      <Tooltip
        title={anyPending ? 'Defina a decisão para todos os procedimentos' : ''}
        placement="top"
        disableHoverListener={!anyPending}
      >
        <span style={{ width: '100%' }}>
          <Button
            variant="contained"
            fullWidth
            disabled={anyPending || isGuideFinalized}
            onClick={onConfirmClick}
            sx={{
              minHeight: 40,
              backgroundColor: confirmBtnColor,
              '&:hover': { backgroundColor: confirmBtnHover },
              '&.Mui-disabled': { backgroundColor: 'rgba(0,0,0,0.12)' },
            }}
          >
            Confirmar Decisão
          </Button>
        </span>
      </Tooltip>
      <Divider sx={{ my: 0.5 }} />
    </>
  );
}

interface SingleProcApprovalButtonsProps {
  isGuideFinalized: boolean;
  isBoardWaiting: boolean;
  loadingApprove: boolean;
  loadingDeny: boolean;
  onApproveClick: () => void;
  onDenyClick: () => void;
}

function SingleProcApprovalButtons({
  isGuideFinalized,
  isBoardWaiting,
  loadingApprove,
  loadingDeny,
  onApproveClick,
  onDenyClick,
}: SingleProcApprovalButtonsProps) {
  return (
    <>
      <Tooltip
        title={isBoardWaiting ? 'Aguardando parecer da Junta Médica' : ''}
        placement="top"
        disableHoverListener={!isBoardWaiting}
      >
        <span style={{ width: '100%' }}>
          <Button
            variant="contained"
            fullWidth
            disabled={loadingApprove || isGuideFinalized || isBoardWaiting}
            onClick={onApproveClick}
            startIcon={loadingApprove ? <CircularProgress size={14} color="inherit" /> : undefined}
            sx={{
              minHeight: 40,
              backgroundColor: '#16a34a',
              '&:hover': { backgroundColor: '#15803d' },
            }}
          >
            {loadingApprove ? 'Processando...' : 'Aprovar'}
          </Button>
        </span>
      </Tooltip>
      <Tooltip
        title={isBoardWaiting ? 'Aguardando parecer da Junta Médica' : ''}
        placement="top"
        disableHoverListener={!isBoardWaiting}
      >
        <span style={{ width: '100%' }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            disabled={loadingDeny || isGuideFinalized || isBoardWaiting}
            onClick={onDenyClick}
            startIcon={loadingDeny ? <CircularProgress size={14} color="inherit" /> : undefined}
            sx={{ minHeight: 40 }}
          >
            {loadingDeny ? 'Processando...' : 'Negar'}
          </Button>
        </span>
      </Tooltip>
    </>
  );
}
