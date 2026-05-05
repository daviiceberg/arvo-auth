'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';

interface MultiProcButtonsProps {
  isMultiProc: true;
  anyPending: boolean;
  isGuideFinalized: boolean;
  confirmBtnColor: string;
  confirmBtnHover: string;
  onConfirmClick: () => void;
  canApprove?: boolean;
  canDeny?: boolean;
}

interface SingleProcButtonsProps {
  isMultiProc: false;
  isGuideFinalized: boolean;
  loadingApprove: boolean;
  loadingDeny: boolean;
  onApproveClick: () => void;
  onDenyClick: () => void;
  canApprove?: boolean;
  canDeny?: boolean;
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
          canApprove={props.canApprove}
          canDeny={props.canDeny}
        />
      ) : (
        <SingleProcApprovalButtons
          isGuideFinalized={isGuideFinalized}
          loadingApprove={props.loadingApprove}
          loadingDeny={props.loadingDeny}
          onApproveClick={props.onApproveClick}
          onDenyClick={props.onDenyClick}
          canApprove={props.canApprove}
          canDeny={props.canDeny}
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
  canApprove?: boolean;
  canDeny?: boolean;
}

function MultiProcConfirmButton({
  anyPending,
  isGuideFinalized,
  confirmBtnColor,
  confirmBtnHover,
  onConfirmClick,
  canApprove = true,
  canDeny = true,
}: MultiProcConfirmButtonProps) {
  const noPermission = !canApprove && !canDeny;
  const tooltipText = anyPending
    ? 'Defina a decisão para todos os procedimentos'
    : noPermission
      ? 'Auditor não pode aprovar nem negar'
      : '';
  return (
    <>
      <Tooltip
        title={tooltipText}
        placement="top"
        disableHoverListener={!anyPending && !noPermission}
      >
        <Box component="span" sx={{ width: '100%' }}>
          <Button
            variant="contained"
            fullWidth
            disabled={anyPending || isGuideFinalized || noPermission}
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
        </Box>
      </Tooltip>
    </>
  );
}

interface SingleProcApprovalButtonsProps {
  isGuideFinalized: boolean;
  loadingApprove: boolean;
  loadingDeny: boolean;
  onApproveClick: () => void;
  onDenyClick: () => void;
  canApprove?: boolean;
  canDeny?: boolean;
}

function SingleProcApprovalButtons({
  isGuideFinalized,
  loadingApprove,
  loadingDeny,
  onApproveClick,
  onDenyClick,
  canApprove = true,
  canDeny = true,
}: SingleProcApprovalButtonsProps) {
  return (
    <>
      <Tooltip
        title={!canApprove ? 'Auditor não pode aprovar — apenas Analista Sênior' : ''}
        placement="top"
        disableHoverListener={canApprove}
      >
        <Box component="span" sx={{ width: '100%' }}>
          <Button
            variant="contained"
            fullWidth
            disabled={loadingApprove || isGuideFinalized || !canApprove}
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
        </Box>
      </Tooltip>
      <Tooltip
        title={!canDeny ? 'Auditor não pode negar — apenas Analista Sênior' : ''}
        placement="top"
        disableHoverListener={canDeny}
      >
        <Box component="span" sx={{ width: '100%' }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            disabled={loadingDeny || isGuideFinalized || !canDeny}
            onClick={onDenyClick}
            startIcon={loadingDeny ? <CircularProgress size={14} color="inherit" /> : undefined}
            sx={{ minHeight: 40 }}
          >
            {loadingDeny ? 'Processando...' : 'Negar'}
          </Button>
        </Box>
      </Tooltip>
    </>
  );
}
