'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          fontSize: 13,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          color: 'text.secondary',
        }}
      >
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}
