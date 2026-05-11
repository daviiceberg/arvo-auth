'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';

export default function HistoryDetailSkeleton() {
  return (
    <Box
      sx={{
        height: 'calc(100vh - 60px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: 'background.default',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 1.75,
          backgroundColor: 'transparent',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <Skeleton variant="text" width={80} height={18} sx={{ mb: 0.75 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Skeleton variant="text" width={160} height={32} />
          <Skeleton variant="rounded" width={70} height={22} />
          <Skeleton variant="rounded" width={80} height={22} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2.5, mt: 0.75 }}>
          <Skeleton variant="text" width={180} height={18} />
          <Skeleton variant="text" width={160} height={18} />
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, display: 'flex', gap: 2.5, px: 3, pt: 2 }}>
        {/* Left column */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: 3 }}>
              <Skeleton variant="text" width={120} height={20} sx={{ mb: 2 }} />
              <Skeleton variant="text" width={200} height={28} />
              <Skeleton variant="text" width="100%" height={80} />
            </CardContent>
          </Card>
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: 3 }}>
              <Skeleton variant="text" width={160} height={20} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" height={60} />
              <Skeleton variant="text" width="100%" height={60} />
            </CardContent>
          </Card>
        </Box>

        {/* Right column */}
        <Box sx={{ width: 400, flexShrink: 0 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Skeleton variant="text" width={140} height={20} sx={{ mb: 1.5 }} />
              <Skeleton variant="rounded" width={90} height={22} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" height={120} />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
