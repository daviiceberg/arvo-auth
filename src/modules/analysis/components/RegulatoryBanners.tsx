'use client';

import { type Request } from '@/types/pedido';

import ComplementaryBanner from './ComplementaryBanner';
import InjunctionBanner from './InjunctionBanner';
import NipBanner from './NipBanner';

interface RegulatoryBannersProps {
  request: Request;
}

export default function RegulatoryBanners({ request }: RegulatoryBannersProps) {
  return (
    <>
      {request.parentRequestId ? (
        <ComplementaryBanner parentRequestId={request.parentRequestId} />
      ) : null}
      {request.injunction ? <InjunctionBanner context={request.injunction} /> : null}
      {request.nip ? <NipBanner context={request.nip} /> : null}
    </>
  );
}
