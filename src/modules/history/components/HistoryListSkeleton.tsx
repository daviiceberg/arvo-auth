'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';

export default function HistoryListSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width={180} height={36} />
        <Skeleton variant="text" width={320} height={20} />
      </Box>

      {/* KPI strip */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} sx={{ flex: 1, minWidth: 140 }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Skeleton variant="text" width={100} height={16} sx={{ mb: 1.5 }} />
              <Skeleton variant="text" width={60} height={28} />
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Filter bar */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rounded" width={240} height={36} />
            <Skeleton variant="rounded" width={150} height={36} />
            <Skeleton variant="rounded" width={140} height={36} />
            <Skeleton variant="rounded" width={180} height={36} />
          </Box>
        </CardContent>
      </Card>

      {/* Table rows */}
      <Card>
        <Box sx={{ p: 2 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="text" height={44} sx={{ mb: 0.5 }} />
          ))}
        </Box>
      </Card>
    </Box>
  );
}
