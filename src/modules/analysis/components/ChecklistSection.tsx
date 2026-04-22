'use client';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { type ChecklistItem, type Request } from '@/types/pedido';

interface ChecklistSectionProps {
  request: Request;
}

function buildContinuidadeItems(request: Request): ChecklistItem[] {
  const hasEvolutionReport = request.documents.some(
    (d) =>
      d.tipo === 'Relatório de Evolução' ||
      d.nome.toLowerCase().includes('evolucao') ||
      d.nome.toLowerCase().includes('evolução'),
  );

  if (hasEvolutionReport) {
    return [
      { texto: 'Relatório de evolução terapêutica anexado', status: 'ok' },
      { texto: 'Relatório emitido pelo profissional executante', status: 'ok' },
    ];
  }

  return [
    { texto: 'Relatório de evolução terapêutica ausente', status: 'error' },
    { texto: 'Emissão pelo profissional executante não confirmada', status: 'warning' },
  ];
}

const STATUS_ICON_MAP = {
  ok: (
    <CheckCircleOutlineIcon sx={{ fontSize: 15, color: 'success.main', flexShrink: 0, mt: 0.15 }} />
  ),
  warning: (
    <WarningAmberIcon sx={{ fontSize: 15, color: 'warning.light', flexShrink: 0, mt: 0.15 }} />
  ),
  error: <CloseIcon sx={{ fontSize: 15, color: 'error.main', flexShrink: 0, mt: 0.15 }} />,
} as const;

function getItemTextColor(status: ChecklistItem['status']): string {
  if (status === 'error') return 'error.main';
  if (status === 'warning') return 'warning.main';
  return 'text.primary';
}

export default function ChecklistSection({ request }: ChecklistSectionProps) {
  const isF84 = request.procedures.some((p) => p.cid.startsWith('F84'));
  const isContinuidade = request.authorizationStage === 'continuidade';

  const extraContinuidadeItems = isContinuidade ? buildContinuidadeItems(request) : [];
  const allItems: ChecklistItem[] = [...request.iaChecklist, ...extraContinuidadeItems];

  return (
    <Box>
      <Typography
        variant="caption"
        fontWeight={700}
        color="text.secondary"
        sx={{
          textTransform: 'uppercase',
          fontSize: 12,
          letterSpacing: 0.5,
          display: 'block',
          mb: 1,
        }}
      >
        Checklist{' '}
        {isContinuidade ? (
          <Typography
            component="span"
            variant="caption"
            sx={{ fontSize: 11, textTransform: 'none', color: 'info.main', fontWeight: 600 }}
          >
            — Continuidade
          </Typography>
        ) : null}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {/* RN 539/2022 info item for F84 CIDs */}
        {isF84 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              p: 1,
              borderRadius: 1.5,
              backgroundColor: 'rgba(37,99,235,0.06)',
              border: '1px solid rgba(37,99,235,0.15)',
              mb: 0.75,
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 15, color: 'info.main', flexShrink: 0, mt: 0.15 }} />
            <Box>
              <Typography
                variant="body2"
                sx={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8', lineHeight: 1.4 }}
              >
                RN 539/2022 — sessões ilimitadas aplicáveis para CID F84
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: 11,
                  color: 'info.main',
                  lineHeight: 1.4,
                  display: 'block',
                  mt: 0.25,
                }}
              >
                Operadora não pode negar por limite de sessões nem por escolha de método
                terapêutico. Espaço de negativa restrito a questões administrativas.
              </Typography>
            </Box>
          </Box>
        ) : null}
        {allItems.map((item) => (
          <Box key={item.texto} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            {STATUS_ICON_MAP[item.status]}
            <Typography
              variant="body2"
              sx={{
                fontSize: 13,
                fontWeight: item.status !== 'ok' ? 600 : 500,
                color: getItemTextColor(item.status),
                lineHeight: 1.45,
              }}
            >
              {item.texto}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
