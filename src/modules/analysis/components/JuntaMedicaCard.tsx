'use client';

import GroupsIcon from '@mui/icons-material/Groups';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { type JuntaMedicaContext, type SubStatus } from '@/types/pedido';

interface JuntaMedicaCardProps {
  subStatus: SubStatus;
  context: JuntaMedicaContext;
  slaAlreadySuspended?: boolean;
  onSimulateParecer?: () => void;
  onSuspendSla?: () => void;
}

const PURPLE_BG = 'rgba(139, 92, 246, 0.08)';
const PURPLE_BORDER = 'rgba(139, 92, 246, 0.2)';
const PURPLE_DARK = '#6d28d9';
const PURPLE_TEXT = '#4c1d95';

const DECISION_LABEL: Record<'aprovado' | 'negado' | 'aprovado_parcial', string> = {
  aprovado: 'Aprovar',
  negado: 'Negar',
  aprovado_parcial: 'Aprovar Parcial',
};

const DECISION_BADGE: Record<
  'aprovado' | 'negado' | 'aprovado_parcial',
  { bg: string; color: string; border: string }
> = {
  aprovado: {
    bg: 'rgba(22,163,74,0.12)',
    color: '#15803d',
    border: 'rgba(22,163,74,0.4)',
  },
  negado: {
    bg: 'rgba(212,24,61,0.12)',
    color: '#b91c1c',
    border: 'rgba(212,24,61,0.4)',
  },
  aprovado_parcial: {
    bg: 'rgba(245,158,11,0.18)',
    color: '#92400e',
    border: 'rgba(245,158,11,0.5)',
  },
};

/**
 * M1 — Card único consolidado para Junta Médica.
 *
 * Cobre dois estados:
 *  - JUNTA_AGUARDANDO: header "Encaminhado para Junta Médica" + contexto + footer
 *  - JUNTA_PARECER_RECEBIDO: header "Parecer da Junta Médica" + badge de decisão
 *    + contexto + bloco branco com parecer destacado + footer com fluxo temporal
 *
 * Substitui JuntaMedicaBanner + JuntaParecerCard + chip "Junta" isolado (que
 * eram redundantes).
 */
export default function JuntaMedicaCard({
  subStatus,
  context,
  slaAlreadySuspended,
  onSimulateParecer,
  onSuspendSla,
}: JuntaMedicaCardProps) {
  const isAwaiting = subStatus === 'JUNTA_AGUARDANDO';
  const parecer = !isAwaiting ? context.parecer : undefined;

  const desempatadorLine = buildDesempatadorLine(context);

  return (
    <Box
      sx={{
        backgroundColor: PURPLE_BG,
        border: `1px solid ${PURPLE_BORDER}`,
        borderRadius: 2,
        mb: 0,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
        }}
      >
        <GroupsIcon sx={{ fontSize: 22, color: PURPLE_DARK, mt: 0.25, flexShrink: 0 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: PURPLE_TEXT }}>
              {parecer ? 'Parecer da Junta Médica' : 'Encaminhado para Junta Médica'}
            </Typography>
            {parecer ? (
              <Chip
                label={DECISION_LABEL[parecer.suggestedDecision]}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: 11,
                  height: 22,
                  backgroundColor: DECISION_BADGE[parecer.suggestedDecision].bg,
                  color: DECISION_BADGE[parecer.suggestedDecision].color,
                  border: `1px solid ${DECISION_BADGE[parecer.suggestedDecision].border}`,
                }}
              />
            ) : null}
          </Box>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
            {parecer
              ? 'Recebido — pronto para revisão final'
              : 'Aguardando parecer do desempatador'}
          </Typography>
        </Box>
        {isAwaiting ? (
          <AwaitingActions
            onSimulateParecer={onSimulateParecer}
            onSuspendSla={onSuspendSla}
            slaAlreadySuspended={slaAlreadySuspended ?? false}
          />
        ) : null}
      </Box>

      <Divider sx={{ borderColor: PURPLE_BORDER }} />

      {/* Contexto do encaminhamento */}
      <Box sx={{ px: 2.5, py: 2 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: 'text.secondary',
            mb: 1,
          }}
        >
          Por que foi para junta
        </Typography>
        <Box sx={{ mb: 1 }}>
          <Typography
            component="span"
            sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}
          >
            Motivo:{' '}
          </Typography>
          <Typography component="span" sx={{ fontSize: 13, color: 'text.primary' }}>
            {context.reason}
          </Typography>
        </Box>
        <Box>
          <Typography
            component="span"
            sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}
          >
            Justificativa:{' '}
          </Typography>
          <Typography
            component="span"
            sx={{ fontSize: 13, color: 'text.primary', lineHeight: 1.6 }}
          >
            {context.justification}
          </Typography>
        </Box>

        {/* Bloco do parecer destacado */}
        {parecer ? (
          <Box
            sx={{
              mt: 2,
              p: 2.5,
              backgroundColor: '#ffffff',
              border: '1px solid rgba(0,0,0,0.05)',
              borderRadius: 1,
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.6,
                color: PURPLE_DARK,
                mb: 1,
              }}
            >
              Parecer da Junta
            </Typography>
            <Typography sx={{ fontSize: 14, lineHeight: 1.6, color: 'text.primary' }}>
              {parecer.text}
            </Typography>
          </Box>
        ) : null}
      </Box>

      <Divider sx={{ borderColor: PURPLE_BORDER }} />

      {/* Footer com metadados */}
      <Box sx={{ px: 2.5, py: 1.5 }}>
        <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.5 }}>
          {parecer ? (
            <>
              Encaminhado em <strong>{context.forwardedAt}</strong> → Parecer em{' '}
              <strong>{parecer.issuedAt}</strong>
              {desempatadorLine ? <> · {desempatadorLine}</> : null}
            </>
          ) : (
            <>
              Encaminhado em <strong>{context.forwardedAt}</strong>
              {context.meetingDate && context.meetingDate !== '—' ? (
                <>
                  {' '}
                  · Reunião agendada para <strong>{context.meetingDate}</strong>
                </>
              ) : null}
              {desempatadorLine ? <> · {desempatadorLine}</> : null}
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
}

function buildDesempatadorLine(context: JuntaMedicaContext): string {
  const name = context.parecer?.desempatadorName ?? context.desempatadorName;
  if (!name) return '';
  const crm = context.desempatadorCrm;
  return crm ? `Desempatador: ${name} (${crm})` : `Desempatador: ${name}`;
}

interface AwaitingActionsProps {
  onSimulateParecer?: () => void;
  onSuspendSla?: () => void;
  slaAlreadySuspended: boolean;
}

function AwaitingActions({
  onSimulateParecer,
  onSuspendSla,
  slaAlreadySuspended,
}: AwaitingActionsProps) {
  if (!onSimulateParecer && !onSuspendSla) return null;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flexShrink: 0 }}>
      {onSimulateParecer ? (
        <Button
          size="small"
          onClick={onSimulateParecer}
          sx={{ fontSize: 11, color: PURPLE_DARK, minHeight: 26 }}
        >
          Processar parecer
        </Button>
      ) : null}
      {onSuspendSla ? (
        <Tooltip
          title={slaAlreadySuspended ? 'SLA já foi suspenso uma vez (idempotência)' : ''}
          placement="top"
        >
          <Box component="span">
            <Button
              size="small"
              disabled={slaAlreadySuspended}
              onClick={onSuspendSla}
              sx={{ fontSize: 11, color: PURPLE_DARK, minHeight: 26 }}
            >
              {slaAlreadySuspended ? 'SLA suspenso' : 'Suspender SLA (3d)'}
            </Button>
          </Box>
        </Tooltip>
      ) : null}
    </Box>
  );
}
