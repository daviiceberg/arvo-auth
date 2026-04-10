'use client';

import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export interface KpiCardProps {
  icon: React.ReactNode;
  iconBg: string;
  value: string | number;
  label: string;
  sublabel?: React.ReactNode;
  sublabelColor?: string;
  valueColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  onClick?: () => void;
}

export default function KpiCard({
  icon,
  iconBg,
  value,
  label,
  sublabel,
  sublabelColor,
  valueColor,
  trend,
  trendLabel,
  onClick,
}: KpiCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 150ms ease, transform 150ms ease',
        '&:hover': onClick
          ? { boxShadow: '0 4px 16px rgba(0,0,0,0.12)', transform: 'translateY(-1px)' }
          : {},
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          '&:last-child': { pb: 2.5 },
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant="body2"
              sx={{ fontSize: 13, fontWeight: 600, color: 'text.secondary' }}
            >
              {label}
            </Typography>
            {sublabel ? (
              <Typography
                variant="caption"
                sx={{
                  fontSize: 12,
                  color: sublabelColor ?? 'text.secondary',
                  lineHeight: 1.2,
                  display: 'block',
                  mt: 0.25,
                  fontWeight: sublabelColor ? 600 : 400,
                }}
              >
                {sublabel}
              </Typography>
            ) : null}
          </Box>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              backgroundColor: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>

        <Box sx={{ mt: 'auto', pt: 1, display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              lineHeight: 1,
              color: valueColor ?? 'text.primary',
              fontSize: 26,
            }}
          >
            {value}
          </Typography>
          {trend && trendLabel ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
              {trend === 'up' ? (
                <TrendingUpIcon sx={{ fontSize: 13, color: '#16a34a' }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 13, color: '#d4183d' }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: trend === 'up' ? '#16a34a' : '#d4183d',
                }}
              >
                {trendLabel}
              </Typography>
            </Box>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  );
}
