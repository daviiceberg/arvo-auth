'use client';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { slaColorMap } from '@/shared/constants';
import { type Request } from '@/types/pedido';

interface SLADualBadgeProps {
  request: Request;
  showOperationalContext?: boolean;
}

const SUSPENSION_REASON_LABEL = {
  EXAME_COMPLEMENTAR: 'pedido de exame complementar pelo desempatador',
  AUSENCIA_BENEFICIARIO: 'ausência injustificada do beneficiário à junta presencial',
} as const;

/**
 * Badge dual de SLA — separa visualmente a visão regulatória (RN 259/2011)
 * da visão operacional (interna, informativa).
 *
 * Regra crítica (RN 259/2011 + RN 424/2017):
 * SLA regulatório NÃO pausa em pendência ao prestador.
 * SLA suspende em junta médica APENAS quando: (a) exame complementar pelo
 * desempatador, OU (b) ausência injustificada do beneficiário à junta
 * presencial. 3 dias úteis exatos, 1× por pedido.
 */
export default function SLADualBadge({
  request,
  showOperationalContext = true,
}: SLADualBadgeProps) {
  const regColor = slaColorMap[request.slaStatus];
  const isPendency = request.subStatus?.startsWith('PENDENTE') ?? false;
  const isJunta = request.subStatus?.startsWith('JUNTA') ?? false;
  const suspended = Boolean(request.slaSuspension);
  const suspensionReason = request.slaSuspension?.reason;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Tooltip
        title={
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
              SLA regulatório (RN 259/2011)
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, display: 'block' }}>
              Conta sempre da data do protocolo. NÃO pausa em pendência ao prestador.
            </Typography>
            {suspended ? (
              <Typography
                variant="caption"
                sx={{ fontSize: 11, display: 'block', mt: 0.5, fontStyle: 'italic' }}
              >
                Suspenso por 3 dias úteis:{' '}
                {SUSPENSION_REASON_LABEL[suspensionReason ?? 'EXAME_COMPLEMENTAR']}
              </Typography>
            ) : null}
          </Box>
        }
        placement="bottom"
      >
        <Chip
          label={`SLA: ${request.slaText}`}
          size="small"
          sx={{
            backgroundColor: regColor.bg,
            color: regColor.color,
            fontWeight: 700,
            fontSize: 12,
            height: 22,
          }}
        />
      </Tooltip>

      {showOperationalContext && (isPendency || isJunta) ? (
        <Tooltip
          title={
            isPendency
              ? 'Operacionalmente, o pedido está com o prestador. Visão interna do tenant — não tem proteção regulatória.'
              : 'Junta em andamento. Operacionalmente o relógio interno pode pausar, mas o regulatório segue contando.'
          }
          placement="bottom"
        >
          <Chip
            icon={<InfoOutlinedIcon sx={{ fontSize: 12, color: 'text.secondary' }} />}
            label={
              isPendency ? 'Operacional: aguardando prestador' : 'Operacional: aguardando junta'
            }
            size="small"
            variant="outlined"
            sx={{
              borderColor: 'rgba(0,0,0,0.15)',
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: 11,
              height: 22,
            }}
          />
        </Tooltip>
      ) : null}

      {suspended ? (
        <Chip
          label={`SLA suspenso (3d úteis)`}
          size="small"
          sx={{
            backgroundColor: 'rgba(124,58,237,0.12)',
            color: '#6d28d9',
            fontWeight: 700,
            fontSize: 11,
            height: 22,
          }}
        />
      ) : null}
    </Box>
  );
}
