'use client';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

import { type PreOpItem, type PreOpItemStatus, type SurgeryContext } from '@/types/pedido';

interface PreOpCardProps {
  surgery: SurgeryContext;
  preOp: PreOpItem[];
}

const STATUS_COLOR: Record<PreOpItemStatus, { bg: string; color: string }> = {
  realizado: { bg: 'rgba(22,163,74,0.1)', color: '#16a34a' },
  agendado: { bg: 'rgba(8,145,178,0.1)', color: '#0891b2' },
  pendente: { bg: 'rgba(245,158,11,0.1)', color: '#b45309' },
};

const STATUS_LABEL: Record<PreOpItemStatus, string> = {
  realizado: 'Realizado',
  agendado: 'Agendado',
  pendente: 'Pendente',
};

const SURGERY_TYPE_LABEL: Record<SurgeryContext['type'], string> = {
  geral_eletiva: 'Geral Eletiva',
  ortopedica_programada: 'Ortopédica Programada',
  oftalmologica: 'Oftalmológica',
  plastica_reparadora: 'Plástica Reparadora',
  oncologica_eletiva: 'Oncológica Eletiva',
};

function StatusIcon({ status }: { status: PreOpItemStatus }) {
  const sx = { fontSize: 16, color: STATUS_COLOR[status].color };
  if (status === 'realizado') return <CheckCircleOutlineIcon sx={sx} />;
  if (status === 'agendado') return <EventOutlinedIcon sx={sx} />;
  return <HourglassEmptyIcon sx={sx} />;
}

export default function PreOpCard({ surgery, preOp }: PreOpCardProps) {
  const required = preOp.filter((i) => i.required);
  const completed = required.filter((i) => i.status === 'realizado');
  const pending = required.filter((i) => i.status === 'pendente');
  const totalRequired = required.length;
  const progress = totalRequired === 0 ? 0 : (completed.length / totalRequired) * 100;
  const blocked = pending.length > 0;

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              fontSize: 15,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: 'text.secondary',
            }}
          >
            Pré-Operatório
          </Typography>
          <Chip
            label={SURGERY_TYPE_LABEL[surgery.type]}
            size="small"
            sx={{
              fontSize: 11,
              height: 22,
              fontWeight: 600,
              backgroundColor: 'rgba(234,88,12,0.08)',
              color: '#ea580c',
            }}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              mb: 0.75,
            }}
          >
            <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
              Completude obrigatórios
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700 }}>
              {`${String(completed.length)}/${String(totalRequired)}`}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(0,0,0,0.06)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: blocked ? '#b45309' : '#16a34a',
              },
            }}
          />
        </Box>
        {blocked ? (
          <Box
            sx={{
              mb: 1.5,
              p: 1.5,
              borderRadius: 1,
              backgroundColor: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.3)',
            }}
          >
            <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: '#b45309' }}>
              {`Aprovação total bloqueada — ${String(pending.length)} item(ns) obrigatório(s) pendente(s).`}
            </Typography>
          </Box>
        ) : null}
        {surgery.hasOpme ? (
          <Box
            sx={{
              mb: 1.5,
              p: 1.5,
              borderRadius: 1,
              backgroundColor: 'rgba(8,145,178,0.06)',
              border: '1px dashed rgba(8,145,178,0.3)',
            }}
          >
            <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: '#0891b2' }}>
              OPME vinculado — materiais detalhados na seção Materiais OPME desta análise.
            </Typography>
          </Box>
        ) : null}
        {surgery.hasOncologyLink ? (
          <Box
            sx={{
              mb: 1.5,
              p: 1.5,
              borderRadius: 1,
              backgroundColor: 'rgba(147,51,234,0.06)',
              border: '1px dashed rgba(147,51,234,0.3)',
            }}
          >
            <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600, color: '#9333ea' }}>
              Cirurgia oncológica — vinculada ao protocolo oncológico (estadiamento + linha +
              ciclo).
            </Typography>
          </Box>
        ) : null}
        {surgery.notes ? (
          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: 'text.secondary',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                display: 'block',
                mb: 0.75,
              }}
            >
              Notas adicionais
            </Typography>
            <Typography variant="body2" sx={{ fontSize: 13 }}>
              {surgery.notes}
            </Typography>
          </Box>
        ) : null}
        <Box sx={{ mt: 2 }}>
          {preOp.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 0.6,
                borderBottom: '1px dashed rgba(0,0,0,0.06)',
              }}
            >
              <StatusIcon status={item.status} />
              <Typography variant="body2" sx={{ fontSize: 13, flex: 1 }}>
                {item.description}
              </Typography>
              {item.required ? (
                <Chip
                  label="Obrigatório"
                  size="small"
                  sx={{
                    fontSize: 10,
                    height: 18,
                    fontWeight: 700,
                    backgroundColor: 'rgba(220,38,38,0.06)',
                    color: '#dc2626',
                  }}
                />
              ) : null}
              <Chip
                label={STATUS_LABEL[item.status]}
                size="small"
                sx={{
                  fontSize: 10,
                  height: 18,
                  fontWeight: 700,
                  backgroundColor: STATUS_COLOR[item.status].bg,
                  color: STATUS_COLOR[item.status].color,
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
