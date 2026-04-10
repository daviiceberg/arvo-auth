import { Suspense } from 'react';

import { QueuePage, QueueSkeleton } from '@/modules/queue';

export default function FilaPage() {
  return (
    <Suspense fallback={<QueueSkeleton />}>
      <QueuePage />
    </Suspense>
  );
}
