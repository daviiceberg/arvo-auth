'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

function CardSkeleton() {
  return (
    <Card sx={{ height: 104 }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Skeleton variant="rounded" width={38} height={38} sx={{ mb: 1.5 }} />
        <Skeleton variant="text" width="55%" height={28} />
        <Skeleton variant="text" width="75%" height={14} />
      </CardContent>
    </Card>
  );
}

export default function DashboardSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header skeleton */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={360} height={40} />
        <Skeleton variant="text" width={280} height={20} sx={{ mt: 0.5 }} />
      </Box>

      {/* KPI row skeleton */}
      <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 'grow' }}>
            <CardSkeleton />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export { CardSkeleton };
