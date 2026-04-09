'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function AnalysisSkeleton() {
  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Skeleton variant="text" width={300} height={32} />
      <Skeleton variant="rounded" height={80} />
      <Skeleton variant="rounded" height={160} />
      <Skeleton variant="rounded" height={200} />
    </Box>
  );
}
