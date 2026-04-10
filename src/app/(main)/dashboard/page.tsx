import { Suspense } from 'react';

import { DashboardPage, DashboardSkeleton } from '@/modules/dashboard';

export default function DashboardRoute() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardPage />
    </Suspense>
  );
}
