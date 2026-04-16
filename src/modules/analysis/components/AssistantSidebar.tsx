'use client';

import { type ReactNode, useState } from 'react';

import CallSplitIcon from '@mui/icons-material/CallSplit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { type ChipColor, iaSuggestionColorMap } from '@/shared/constants';
import { type IASuggestion, type Request } from '@/types/pedido';

import { type ProcDecision } from '../types';

import ChecklistSection from './ChecklistSection';
import DecisionButtons from './DecisionButtons';
import ProcedureDecisionCard from './ProcedureDecisionCard';

interface AssistantSidebarProps {
  request: Request;
  onAprovarClick: () => void;
  onNegarClick: () => void;
  procDecisoes: Record<string, ProcDecision>;
  onProcDecisaoChange: (codigo: string, decisao: ProcDecision) => void;
  onConfirmarDecisaoClick: () => void;
}

const PILL_LABEL: Record<string, string> = {
  Aprovar: 'Critérios atendidos',
  Negar: 'Bloqueios identificados',
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
}

function SuggestionSection({ iaSuggestion, sc, iaJustification }: SuggestionSectionProps) {
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

function SpecialAlertsSection({ alerts }: { alerts: string[] }) {
  return (
    <>
      {alerts.includes('Fora do Rol ANS') && (
        <Alert
          severity="error"
          icon={<ErrorOutlineIcon fontSize="small" />}
          sx={{ borderRadius: 2 }}
        >
          <Typography variant="caption" fontWeight={700} display="block" gutterBottom>
            Fora do Rol ANS
          </Typography>
          <Typography variant="caption">
            Procedimento fora da cobertura obrigatória. Avaliação crítica necessária.
          </Typography>
        </Alert>
      )}
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
}

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
}: AnalystDecisionSectionProps) {
  return (
    <Card sx={{ mt: 2, overflow: 'hidden' }}>
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          backgroundColor: 'rgba(0,0,0,0.02)',
        }}
      >
        <Typography variant="body2" fontWeight={700} color="text.primary">
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
            isGuideFinalized={isGuideFinalized}
            confirmBtnColor={confirmBtnColor}
            confirmBtnHover={confirmBtnHover}
            onConfirmClick={onConfirmarDecisaoClick}
          />
        ) : (
          <DecisionButtons
            isMultiProc={false}
            isGuideFinalized={isGuideFinalized}
            loadingApprove={loadingApprove}
            loadingDeny={loadingDeny}
            onApproveClick={onApproveClick}
            onDenyClick={onDenyClick}
          />
        )}
      </Box>
    </Card>
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
            borderBottom: '1px solid rgba(0,0,0,0.07)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'rgba(144,43,41,0.03)',
          }}
        >
          <SmartToyIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="body2" fontWeight={700} color="primary.main">
            Análise da IA
          </Typography>
        </Box>

        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <SuggestionSection
            iaSuggestion={iaSuggestion}
            sc={sc}
            iaJustification={iaJustification}
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
      />
    </>
  );
}
