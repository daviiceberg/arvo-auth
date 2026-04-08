'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export interface MetricCardProps {
  value: number | string;
  label: string;
  sublabel?: string;
  linkLabel: string;
  onLinkClick: () => void;
  valueColor?: string;
  icon: React.ReactNode;
  iconBg: string;
}

export default function MetricCard({
  value,
  label,
  sublabel,
  linkLabel,
  onLinkClick,
  valueColor,
  icon,
  iconBg,
}: MetricCardProps) {
  return (
    <Card
      onClick={onLinkClick}
      sx={{
        flex: 1,
        cursor: 'pointer',
        transition: 'box-shadow 150ms ease, transform 150ms ease',
        '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.12)', transform: 'translateY(-1px)' },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 1.5,
          }}
        >
          <Box>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.3 }}
            >
              {label}
            </Typography>
            {sublabel ? (
              <Typography
                variant="caption"
                sx={{
                  fontSize: 12,
                  color: 'text.secondary',
                  opacity: 0.75,
                  lineHeight: 1.2,
                  display: 'block',
                  mt: 0.25,
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

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            lineHeight: 1,
            color: valueColor ?? 'text.primary',
            fontSize: 26,
            mb: 0.75,
          }}
        >
          {value}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: 'primary.main',
            fontWeight: 600,
            fontSize: 12,
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {linkLabel} →
        </Typography>
      </CardContent>
    </Card>
  );
}
