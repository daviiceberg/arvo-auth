'use client';

import { type ReactNode } from 'react';

import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import GroupsIcon from '@mui/icons-material/Groups';
import ScienceIcon from '@mui/icons-material/Science';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

/**
 * Componente preservado para reuso em tela futura de Analytics/BI.
 * Removido do topo do Histórico — métricas cumulativas pertencem a tela
 * dedicada com tendência temporal, drill-down e comparação. Aqui ficam
 * apenas a busca + filtros + tabela auditável.
 */

type KpiKey = 'all' | 'pendency' | 'junta' | 'divergence';

interface KpiCardModel {
  key: KpiKey;
  label: string;
  value: number;
  icon: ReactNode;
  iconBg: string;
  accentColor: string;
  subtitle?: string;
}

interface KpiCardProps {
  model: KpiCardModel;
  active: boolean;
  onClick: () => void;
}

function KpiCard({ model, active, onClick }: KpiCardProps) {
  return (
    <Card
      sx={{
        flex: 1,
        minWidth: 180,
        border: active ? `1.5px solid ${model.accentColor}` : '1px solid rgba(0,0,0,0.07)',
        boxShadow: active ? `0 0 0 3px ${model.accentColor}1a` : 'none',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              mb: 1.5,
            }}
          >
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.3 }}
            >
              {model.label}
            </Typography>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                backgroundColor: model.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {model.icon}
            </Box>
          </Box>
          <Typography
            sx={{
              fontWeight: 800,
              lineHeight: 1,
              color: active ? model.accentColor : 'text.primary',
              fontSize: model.key === 'all' ? 32 : 28,
            }}
          >
            {model.value}
          </Typography>
          {model.subtitle ? (
            <Typography
              variant="caption"
              sx={{ display: 'block', mt: 0.75, fontSize: 11, color: 'text.secondary' }}
            >
              {model.subtitle}
            </Typography>
          ) : null}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

interface HistoryKpisProps {
  totalEntries: number;
  totalIA: number;
  totalAnalyst: number;
  totalViaPendencia: number;
  pendenciaRetornadaTempo: number;
  pendenciaNaoRetornada: number;
  totalViaJunta: number;
  juntaParecerFavoravel: number;
  juntaParecerContrario: number;
  totalDivergences: number;
  activeKpiFilter: KpiKey;
  onActiveKpiFilterChange: (next: KpiKey) => void;
}

export default function HistoryKpis({
  totalEntries,
  totalIA,
  totalAnalyst,
  totalViaPendencia,
  pendenciaRetornadaTempo,
  pendenciaNaoRetornada,
  totalViaJunta,
  juntaParecerFavoravel,
  juntaParecerContrario,
  totalDivergences,
  activeKpiFilter,
  onActiveKpiFilterChange,
}: HistoryKpisProps) {
  const kpis: KpiCardModel[] = [
    {
      key: 'all',
      label: 'Total de Solicitações',
      value: totalEntries,
      icon: <ScienceIcon sx={{ fontSize: 18, color: 'primary.main' }} />,
      iconBg: 'rgba(144,43,41,0.1)',
      accentColor: '#902B29',
      subtitle: `${String(totalIA)} IA · ${String(totalAnalyst)} Analista`,
    },
    {
      key: 'pendency',
      label: 'Pedidos via Pendência',
      value: totalViaPendencia,
      icon: <AssignmentReturnIcon sx={{ fontSize: 18, color: '#d97706' }} />,
      iconBg: 'rgba(245,158,11,0.18)',
      accentColor: '#d97706',
      subtitle:
        totalViaPendencia > 0
          ? `${String(pendenciaRetornadaTempo)} retornaram a tempo · ${String(pendenciaNaoRetornada)} não retornaram`
          : undefined,
    },
    {
      key: 'junta',
      label: 'Pedidos via Junta Médica',
      value: totalViaJunta,
      icon: <GroupsIcon sx={{ fontSize: 18, color: '#6d28d9' }} />,
      iconBg: 'rgba(124,58,237,0.12)',
      accentColor: '#6d28d9',
      subtitle:
        totalViaJunta > 0
          ? `${String(juntaParecerFavoravel)} parecer favorável · ${String(juntaParecerContrario)} contrário`
          : undefined,
    },
    {
      key: 'divergence',
      label: 'Divergências da IA',
      value: totalDivergences,
      icon: <WarningAmberIcon sx={{ fontSize: 18, color: 'warning.main' }} />,
      iconBg: 'rgba(245,158,11,0.12)',
      accentColor: '#d97706',
      subtitle: 'auditoria de qualidade da IA',
    },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      {kpis.map((kpi) => (
        <KpiCard
          key={kpi.key}
          model={kpi}
          active={activeKpiFilter === kpi.key}
          onClick={() => {
            onActiveKpiFilterChange(kpi.key);
          }}
        />
      ))}
    </Box>
  );
}
