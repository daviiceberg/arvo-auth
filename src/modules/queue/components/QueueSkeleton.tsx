'use client';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function QueueSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      <Skeleton variant="text" width={300} height={40} sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={88} sx={{ flex: 1, borderRadius: 2 }} />
        ))}
      </Box>
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
    </Box>
  );
}
