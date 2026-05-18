'use client';

import { type ReactNode, useState } from 'react';

import CallSplitIcon from '@mui/icons-material/CallSplit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { alertOutlines, type ChipColor, iaSuggestionColorMap } from '@/shared/constants';
import { type IASuggestion, type Request } from '@/types/pedido';

import { type ProcDecision } from '../types';

import ChecklistSection from './ChecklistSection';
import DecisionButtons from './DecisionButtons';
import ProcedureDecisionCard from './ProcedureDecisionCard';

interface SidebarPermissions {
  canApprove: boolean;
  canDeny: boolean;
  canPendency: boolean;
  canForwardToJunta: boolean;
}

interface AssistantSidebarProps {
  request: Request;
  onAprovarClick: () => void;
  onNegarClick: () => void;
  procDecisoes: Record<string, ProcDecision>;
  onProcDecisaoChange: (codigo: string, decisao: ProcDecision) => void;
  onConfirmarDecisaoClick: () => void;
  onPendenciarClick?: () => void;
  onJuntaMedicaClick?: () => void;
  permissions?: SidebarPermissions;
  isLocked?: boolean;
}

const PILL_LABEL: Record<string, string> = {
  Aprovar: 'Critérios atendidos',
  Negar: 'Bloqueios identificados',
  Pendenciar: 'Pendenciar — documentação incompleta',
};

/* ---------- Consolidated badge helper ---------- */

interface BadgeProps {
  icon: ReactNode;
  text: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

function getConsolidatedBadgeProps(
  allApproved: boolean,
  allDenied: boolean,
  nApproved: number,
  nDenied: number,
): BadgeProps {
  if (allApproved) {
    return {
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'success.main', flexShrink: 0 }} />,
      text: 'Aprovação Total',
      bgColor: 'rgba(22,163,74,0.06)',
      borderColor: 'rgba(22,163,74,0.2)',
      textColor: 'success.main',
    };
  }
  if (allDenied) {
    return {
      icon: <CloseIcon sx={{ fontSize: 16, color: 'error.main', flexShrink: 0 }} />,
      text: 'Negativa Total',
      bgColor: 'rgba(212,24,61,0.06)',
      borderColor: 'rgba(212,24,61,0.2)',
      textColor: 'error.main',
    };
  }
  return {
    icon: <CallSplitIcon sx={{ fontSize: 16, color: 'warning.main', flexShrink: 0 }} />,
    text: `Aprovação Parcial — ${String(nApproved)} aprovado(s) · ${String(nDenied)} negado(s)`,
    bgColor: 'rgba(217,119,6,0.08)',
    borderColor: 'rgba(217,119,6,0.25)',
    textColor: 'warning.main',
  };
}

/* ---------- Suggestion section ---------- */

interface SuggestionSectionProps {
  iaSuggestion: IASuggestion;
  sc: ChipColor;
  iaJustification: string;
  isReprocessing: boolean;
}

function SuggestionSection({
  iaSuggestion,
  sc,
  iaJustification,
  isReprocessing,
}: SuggestionSectionProps) {
  if (isReprocessing) {
    return (
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          backgroundColor: 'rgba(0,0,0,0.02)',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CircularProgress size={14} thickness={5} />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 12, fontWeight: 600 }}
          >
            Reprocessando análise…
          </Typography>
        </Box>
        <Skeleton variant="rounded" width={140} height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="92%" height={16} />
        <Skeleton variant="text" width="78%" height={16} />
      </Box>
    );
  }
  return (
    <Box
      sx={{ p: 1.5, borderRadius: 2, backgroundColor: sc.bg, border: `1px solid ${sc.color}33` }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 0.5, fontSize: 12 }}
      >
        Ponto de vista da IA
      </Typography>
      <Chip
        label={PILL_LABEL[iaSuggestion] ?? iaSuggestion}
        size="small"
        sx={{ backgroundColor: sc.bg, color: sc.color, fontWeight: 700, mb: 1 }}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', fontSize: 12, lineHeight: 1.5 }}
      >
        {iaJustification}
      </Typography>
    </Box>
  );
}

/* ---------- Special alerts section ---------- */

type SpecialAlertSeverity = 'error' | 'warning';

interface SpecialAlertConfig {
  match: string;
  title: string;
  message: string;
  severity: SpecialAlertSeverity;
}

/**
 * Alerts renderizados aqui são os que NÃO têm UI dedicada em banner/chip.
 * SLA Violado, Pendência ativa, Junta médica já são tratados em outros componentes.
 */
const SPECIAL_ALERTS_CONFIG: SpecialAlertConfig[] = [
  {
    match: 'Fora do Rol ANS',
    title: 'Fora do Rol ANS',
    message: 'Procedimento fora da cobertura obrigatória. Avaliação crítica necessária.',
    severity: 'error',
  },
  {
    match: 'High-User',
    title: 'Beneficiário high-user',
    message: 'Padrão de utilização atípico. Verifique histórico de autorizações antes de decidir.',
    severity: 'warning',
  },
];

function SpecialAlertsSection({ alerts }: { alerts: string[] }) {
  const matched = SPECIAL_ALERTS_CONFIG.filter((c) => alerts.includes(c.match));
  if (matched.length === 0) return null;
  return (
    <>
      {matched.map((c) => (
        <Alert
          key={c.match}
          severity={c.severity}
          icon={<ErrorOutlineIcon fontSize="small" />}
          sx={{ borderRadius: 2, border: alertOutlines[c.severity] }}
        >
          <Typography variant="caption" fontWeight={700} display="block" gutterBottom>
            {c.title}
          </Typography>
          <Typography variant="caption">{c.message}</Typography>
        </Alert>
      ))}
    </>
  );
}

/* ---------- Analyst decision section ---------- */

interface AnalystDecisionSectionProps {
  request: Request;
  isMultiProc: boolean;
  procDecisoes: Record<string, ProcDecision>;
  onProcDecisaoChange: (codigo: string, decisao: ProcDecision) => void;
  isGuideFinalized: boolean;
  anyPending: boolean;
  allApproved: boolean;
  allDenied: boolean;
  nApproved: number;
  nDenied: number;
  confirmBtnColor: string;
  confirmBtnHover: string;
  onConfirmarDecisaoClick: () => void;
  loadingApprove: boolean;
  loadingDeny: boolean;
  onApproveClick: () => void;
  onDenyClick: () => void;
  onPendenciarClick?: () => void;
  onJuntaMedicaClick?: () => void;
  permissions?: SidebarPermissions;
  isLocked?: boolean;
}

// eslint-disable-next-line complexity -- consolidated decision section: 1 primary path (single/multi), 2 secondary actions, lock guard, finalized guard
function AnalystDecisionSection({
  request,
  isMultiProc,
  procDecisoes,
  onProcDecisaoChange,
  isGuideFinalized,
  anyPending,
  allApproved,
  allDenied,
  nApproved,
  nDenied,
  confirmBtnColor,
  confirmBtnHover,
  onConfirmarDecisaoClick,
  loadingApprove,
  loadingDeny,
  onApproveClick,
  onDenyClick,
  onPendenciarClick,
  onJuntaMedicaClick,
  permissions,
  isLocked,
}: AnalystDecisionSectionProps) {
  return (
    <Card sx={{ mt: 2, overflow: 'hidden' }}>
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: '1px solid rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          backgroundColor: 'rgba(0,0,0,0.02)',
        }}
      >
        <Typography
          variant="body2"
          fontWeight={700}
          sx={{
            color: 'text.primary',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          Decisão do analista
        </Typography>
      </Box>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {isMultiProc ? (
          <>
            <Typography
              variant="caption"
              fontWeight={700}
              color="text.secondary"
              sx={{
                textTransform: 'uppercase',
                fontSize: 11,
                letterSpacing: 0.5,
                display: 'block',
                mb: 0.5,
              }}
            >
              Decisão por procedimento
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {request.procedures.map((proc) => (
                <ProcedureDecisionCard
                  key={proc.code}
                  procedure={proc}
                  decision={procDecisoes[proc.code] ?? 'pendente'}
                  isGuideFinalized={isGuideFinalized}
                  onDecisionChange={onProcDecisaoChange}
                />
              ))}
            </Box>

            {!anyPending &&
              (() => {
                const badge = getConsolidatedBadgeProps(allApproved, allDenied, nApproved, nDenied);
                return (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1.25,
                      borderRadius: 1.5,
                      backgroundColor: badge.bgColor,
                      border: `1px solid ${badge.borderColor}`,
                    }}
                  >
                    {badge.icon}
                    <Typography
                      variant="body2"
                      sx={{ fontSize: 12, fontWeight: 700, color: badge.textColor }}
                    >
                      {badge.text}
                    </Typography>
                  </Box>
                );
              })()}
          </>
        ) : null}

        {isMultiProc ? (
          <DecisionButtons
            isMultiProc
            anyPending={anyPending}
            isGuideFinalized={isGuideFinalized || (isLocked ?? false)}
            confirmBtnColor={confirmBtnColor}
            confirmBtnHover={confirmBtnHover}
            onConfirmClick={onConfirmarDecisaoClick}
            canApprove={permissions?.canApprove}
            canDeny={permissions?.canDeny}
          />
        ) : (
          <DecisionButtons
            isMultiProc={false}
            isGuideFinalized={isGuideFinalized || (isLocked ?? false)}
            loadingApprove={loadingApprove}
            loadingDeny={loadingDeny}
            onApproveClick={onApproveClick}
            onDenyClick={onDenyClick}
            canApprove={permissions?.canApprove}
            canDeny={permissions?.canDeny}
          />
        )}
        {(onPendenciarClick || onJuntaMedicaClick) && !isGuideFinalized ? (
          <SecondaryDecisionButtons
            onPendenciarClick={onPendenciarClick}
            onJuntaMedicaClick={onJuntaMedicaClick}
            permissions={permissions}
            isLocked={isLocked ?? false}
          />
        ) : null}
      </Box>
    </Card>
  );
}

/* ---------- Secondary decision buttons (M1) ---------- */

interface SecondaryDecisionButtonsProps {
  onPendenciarClick?: () => void;
  onJuntaMedicaClick?: () => void;
  permissions?: SidebarPermissions;
  isLocked: boolean;
}

function SecondaryDecisionButtons({
  onPendenciarClick,
  onJuntaMedicaClick,
  permissions,
  isLocked,
}: SecondaryDecisionButtonsProps) {
  const canPendency = permissions?.canPendency ?? true;
  const canForwardToJunta = permissions?.canForwardToJunta ?? true;

  return (
    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
      {onPendenciarClick ? (
        <Tooltip
          title={
            isLocked
              ? 'Guia bloqueada por outra pessoa'
              : !canPendency
                ? 'Apenas Analista Sênior pode pendenciar'
                : ''
          }
          placement="top"
        >
          <Box component="span" sx={{ flex: 1 }}>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              disabled={isLocked || !canPendency}
              onClick={onPendenciarClick}
              sx={{ fontSize: 12, minHeight: 32 }}
            >
              Pendenciar
            </Button>
          </Box>
        </Tooltip>
      ) : null}
      {onJuntaMedicaClick ? (
        <Tooltip
          title={
            isLocked
              ? 'Guia bloqueada por outra pessoa'
              : !canForwardToJunta
                ? 'Apenas Analista Sênior pode encaminhar para junta'
                : ''
          }
          placement="top"
        >
          <Box component="span" sx={{ flex: 1 }}>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              disabled={isLocked || !canForwardToJunta}
              onClick={onJuntaMedicaClick}
              sx={{
                fontSize: 12,
                minHeight: 32,
                color: '#6d28d9',
                borderColor: 'rgba(124,58,237,0.4)',
                '&:hover': { borderColor: '#6d28d9', backgroundColor: 'rgba(124,58,237,0.04)' },
              }}
            >
              Junta Médica
            </Button>
          </Box>
        </Tooltip>
      ) : null}
    </Box>
  );
}

/* ---------- Main component ---------- */

export default function AssistantSidebar({
  request,
  onAprovarClick,
  onNegarClick,
  procDecisoes,
  onProcDecisaoChange,
  onConfirmarDecisaoClick,
  onPendenciarClick,
  onJuntaMedicaClick,
  permissions,
  isLocked,
}: AssistantSidebarProps) {
  const iaSuggestion: IASuggestion = request.iaSuggestion;
  const iaJustification = request.iaJustification;
  const sc = iaSuggestionColorMap[iaSuggestion];
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingDeny, setLoadingDeny] = useState(false);
  const isGuideFinalized = ['Aprovado', 'Negado', 'Aprovado Parcial'].includes(request.status);

  const isMultiProc = request.procedures.length > 1;
  const decisions = request.procedures.map((pr) => procDecisoes[pr.code] ?? 'pendente');
  const nApproved = decisions.filter((d) => d === 'aprovado').length;
  const nDenied = decisions.filter((d) => d === 'negado').length;
  const anyPending = decisions.some((d) => d === 'pendente');
  const allApproved = nApproved === request.procedures.length;
  const allDenied = nDenied === request.procedures.length;
  const confirmBtnColor = allApproved ? 'success.main' : allDenied ? 'error.main' : 'primary.main';
  const confirmBtnHover = allApproved ? '#15803d' : allDenied ? '#b91c1c' : 'primary.dark';

  const handleApproveWithLoading = () => {
    setLoadingApprove(true);
    setTimeout(() => {
      setLoadingApprove(false);
      onAprovarClick();
    }, 600);
  };

  const handleDenyWithLoading = () => {
    setLoadingDeny(true);
    setTimeout(() => {
      setLoadingDeny(false);
      onNegarClick();
    }, 600);
  };

  return (
    <>
      <Card sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: '1px solid rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'rgba(144,43,41,0.03)',
          }}
        >
          <SmartToyIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{
              color: 'primary.main',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Análise da IA
          </Typography>
        </Box>

        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <SuggestionSection
            iaSuggestion={iaSuggestion}
            sc={sc}
            iaJustification={iaJustification}
            isReprocessing={request.iaReprocessing ?? false}
          />
          <ChecklistSection request={request} />
          <SpecialAlertsSection alerts={request.alerts} />
        </Box>
      </Card>

      <AnalystDecisionSection
        request={request}
        isMultiProc={isMultiProc}
        procDecisoes={procDecisoes}
        onProcDecisaoChange={onProcDecisaoChange}
        isGuideFinalized={isGuideFinalized}
        anyPending={anyPending}
        allApproved={allApproved}
        allDenied={allDenied}
        nApproved={nApproved}
        nDenied={nDenied}
        confirmBtnColor={confirmBtnColor}
        confirmBtnHover={confirmBtnHover}
        onConfirmarDecisaoClick={onConfirmarDecisaoClick}
        loadingApprove={loadingApprove}
        loadingDeny={loadingDeny}
        onApproveClick={handleApproveWithLoading}
        onDenyClick={handleDenyWithLoading}
        onPendenciarClick={onPendenciarClick}
        onJuntaMedicaClick={onJuntaMedicaClick}
        permissions={permissions}
        isLocked={isLocked}
      />
    </>
  );
}
