'use client';

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
}

interface SingleProcButtonsProps {
  isMultiProc: false;
  isGuideFinalized: boolean;
  loadingApprove: boolean;
  loadingDeny: boolean;
  onApproveClick: () => void;
  onDenyClick: () => void;
}

type DecisionButtonsProps = MultiProcButtonsProps | SingleProcButtonsProps;

export default function DecisionButtons(props: DecisionButtonsProps) {
  const { isMultiProc, isGuideFinalized } = props;

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
          loadingApprove={props.loadingApprove}
          loadingDeny={props.loadingDeny}
          onApproveClick={props.onApproveClick}
          onDenyClick={props.onDenyClick}
        />
      )}
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
  loadingApprove: boolean;
  loadingDeny: boolean;
  onApproveClick: () => void;
  onDenyClick: () => void;
}

function SingleProcApprovalButtons({
  isGuideFinalized,
  loadingApprove,
  loadingDeny,
  onApproveClick,
  onDenyClick,
}: SingleProcApprovalButtonsProps) {
  return (
    <>
      <Button
        variant="contained"
        fullWidth
        disabled={loadingApprove || isGuideFinalized}
        onClick={onApproveClick}
        startIcon={loadingApprove ? <CircularProgress size={14} color="inherit" /> : undefined}
        sx={{
          minHeight: 40,
          backgroundColor: 'success.main',
          '&:hover': { backgroundColor: '#15803d' },
        }}
      >
        {loadingApprove ? 'Processando...' : 'Aprovar'}
      </Button>
      <Button
        variant="contained"
        color="error"
        fullWidth
        disabled={loadingDeny || isGuideFinalized}
        onClick={onDenyClick}
        startIcon={loadingDeny ? <CircularProgress size={14} color="inherit" /> : undefined}
        sx={{ minHeight: 40 }}
      >
        {loadingDeny ? 'Processando...' : 'Negar'}
      </Button>
    </>
  );
}
