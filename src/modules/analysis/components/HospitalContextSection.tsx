'use client';

import Box from '@mui/material/Box';

import { type Request } from '@/types/pedido';

import HospitalEstimate from './HospitalEstimate';
import PreOpCard from './PreOpCard';

interface HospitalContextSectionProps {
  request: Request;
}

export default function HospitalContextSection({ request }: HospitalContextSectionProps) {
  const showHospitalization = Boolean(request.hospitalization);
  const showPreOp = Boolean(request.surgery && request.preOp);
  if (!showHospitalization && !showPreOp) return null;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {request.hospitalization ? (
        <HospitalEstimate
          hospitalization={request.hospitalization}
          auditLevel={request.auditLevel}
        />
      ) : null}
      {request.surgery && request.preOp ? (
        <PreOpCard surgery={request.surgery} preOp={request.preOp} />
      ) : null}
    </Box>
  );
}
