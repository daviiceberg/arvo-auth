'use client';

import { type ReactNode, useState } from 'react';

import CallSplitIcon from '@mui/icons-material/CallSplit';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import GavelIcon from '@mui/icons-material/Gavel';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { type IASuggestion, type Request } from '@/data/pedidos';
import { type ChipColor, iaSuggestionColorMap } from '@/shared/constants';

import { type ProcDecision } from '../types';

import ChecklistSection from './ChecklistSection';
import DecisionButtons from './DecisionButtons';
import ProcedureDecisionCard from './ProcedureDecisionCard';

interface AssistantSidebarProps {
  request: Request;
  onAprovarClick: () => void;
  onNegarClick: () => void;
  onPendenciarClick: () => void;
  onJuntaClick: () => void;
  procDecisoes: Record<string, ProcDecision>;
  onProcDecisaoChange: (codigo: string, decisao: ProcDecision) => void;
  onConfirmarDecisaoClick: () => void;
}

const PILL_LABEL: Record<string, string> = {
  Aprovar: 'Critérios atendidos',
  Negar: 'Bloqueios identificados',
  'Junta Médica': 'Análise clínica necessária',
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
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#16a34a', flexShrink: 0 }} />,
      text: 'Aprovação Total',
      bgColor: 'rgba(22,163,74,0.06)',
      borderColor: 'rgba(22,163,74,0.2)',
      textColor: '#16a34a',
    };
  }
  if (allDenied) {
    return {
      icon: <CloseIcon sx={{ fontSize: 16, color: '#d4183d', flexShrink: 0 }} />,
      text: 'Negativa Total',
      bgColor: 'rgba(212,24,61,0.06)',
      borderColor: 'rgba(212,24,61,0.2)',
      textColor: '#d4183d',
    };
  }
  return {
    icon: <CallSplitIcon sx={{ fontSize: 16, color: '#b45309', flexShrink: 0 }} />,
    text: `Aprovação Parcial — ${String(nApproved)} aprovado(s) · ${String(nDenied)} negado(s)`,
    bgColor: 'rgba(217,119,6,0.08)',
    borderColor: 'rgba(217,119,6,0.25)',
    textColor: '#b45309',
  };
}

/* ---------- Suggestion section ---------- */

interface SuggestionSectionProps {
  iaSuggestion: IASuggestion;
  sc: ChipColor;
  opinionReceived: boolean;
  iaJustification: string;
}

function SuggestionSection({
  iaSuggestion,
  sc,
  opinionReceived,
  iaJustification,
}: SuggestionSectionProps) {
  return (
    <Box
      sx={{ p: 1.5, borderRadius: 2, backgroundColor: sc.bg, border: `1px solid ${sc.color}33` }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 0.5, fontSize: 12 }}
      >
        {opinionReceived
          ? 'Ponto de vista com base no parecer da Junta Médica'
          : 'Ponto de vista da IA'}
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
      {alerts.includes('Liminar Judicial') && (
        <Alert severity="warning" icon={<GavelIcon fontSize="small" />} sx={{ borderRadius: 2 }}>
          <Typography variant="caption" fontWeight={700} display="block" gutterBottom>
            Liminar Judicial Ativa
          </Typography>
          <Typography variant="caption">
            A autorização pode ser mandatória por determinação judicial. Consulte o jurídico antes
            de negar.
          </Typography>
        </Alert>
      )}

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
  isBoardWaiting: boolean;
  anyPending: boolean;
  allApproved: boolean;
  allDenied: boolean;
  nApproved: number;
  nDenied: number;
  confirmBtnColor: string;
  confirmBtnHover: string;
  onConfirmarDecisaoClick: () => void;
  onPendenciarClick: () => void;
  onJuntaClick: () => void;
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
  isBoardWaiting,
  anyPending,
  allApproved,
  allDenied,
  nApproved,
  nDenied,
  confirmBtnColor,
  confirmBtnHover,
  onConfirmarDecisaoClick,
  onPendenciarClick,
  onJuntaClick,
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
            onPendencyClick={onPendenciarClick}
            onBoardClick={onJuntaClick}
          />
        ) : (
          <DecisionButtons
            isMultiProc={false}
            isGuideFinalized={isGuideFinalized}
            isBoardWaiting={isBoardWaiting}
            loadingApprove={loadingApprove}
            loadingDeny={loadingDeny}
            onApproveClick={onApproveClick}
            onDenyClick={onDenyClick}
            onPendencyClick={onPendenciarClick}
            onBoardClick={onJuntaClick}
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
  onPendenciarClick,
  onJuntaClick,
  procDecisoes,
  onProcDecisaoChange,
  onConfirmarDecisaoClick,
}: AssistantSidebarProps) {
  const opinionReceived =
    request.subStatus === 'JUNTA_PARECER_RECEBIDO' && !!request.boardRecommendation;
  const iaSuggestion: IASuggestion =
    (opinionReceived ? request.boardRecommendation : undefined) ?? request.iaSuggestion;
  const iaJustification = opinionReceived ? (request.boardOpinion ?? '') : request.iaJustification;
  const sc = iaSuggestionColorMap[iaSuggestion];
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingDeny, setLoadingDeny] = useState(false);
  const isGuideFinalized = ['Aprovado', 'Negado', 'Aprovado Parcial'].includes(request.status);
  const isBoardWaiting = request.subStatus === 'JUNTA_AGUARDANDO';

  const isMultiProc = request.procedures.length > 1;
  const decisions = request.procedures.map((pr) => procDecisoes[pr.code] ?? 'pendente');
  const nApproved = decisions.filter((d) => d === 'aprovado').length;
  const nDenied = decisions.filter((d) => d === 'negado').length;
  const anyPending = decisions.some((d) => d === 'pendente');
  const allApproved = nApproved === request.procedures.length;
  const allDenied = nDenied === request.procedures.length;
  const confirmBtnColor = allApproved ? '#16a34a' : allDenied ? '#d4183d' : '#902B29';
  const confirmBtnHover = allApproved ? '#15803d' : allDenied ? '#b91c1c' : '#6e1f1d';

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
            opinionReceived={opinionReceived}
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
        isBoardWaiting={isBoardWaiting}
        anyPending={anyPending}
        allApproved={allApproved}
        allDenied={allDenied}
        nApproved={nApproved}
        nDenied={nDenied}
        confirmBtnColor={confirmBtnColor}
        confirmBtnHover={confirmBtnHover}
        onConfirmarDecisaoClick={onConfirmarDecisaoClick}
        onPendenciarClick={onPendenciarClick}
        onJuntaClick={onJuntaClick}
        loadingApprove={loadingApprove}
        loadingDeny={loadingDeny}
        onApproveClick={handleApproveWithLoading}
        onDenyClick={handleDenyWithLoading}
      />
    </>
  );
}
