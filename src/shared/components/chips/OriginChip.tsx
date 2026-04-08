'use client';

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Chip from '@mui/material/Chip';

import { originConfigMap } from '@/shared/constants';
import { type OrigemPedido } from '@/types/pedido';

const originIconMap: Record<OrigemPedido, React.ReactNode> = {
  app: <PhoneAndroidIcon sx={{ fontSize: 11 }} />,
  whatsapp: <WhatsAppIcon sx={{ fontSize: 11 }} />,
  email: <EmailOutlinedIcon sx={{ fontSize: 11 }} />,
  prestador: <LocalHospitalOutlinedIcon sx={{ fontSize: 11 }} />,
  call_center: <PhoneAndroidIcon sx={{ fontSize: 11 }} />,
};

interface OriginChipProps {
  origin: OrigemPedido;
  size?: 'small' | 'medium';
}

export default function OriginChip({ origin, size = 'small' }: OriginChipProps) {
  const config = originConfigMap[origin];
  const icon = originIconMap[origin];

  return (
    <Chip
      icon={icon as React.ReactElement}
      label={config.label}
      size={size}
      sx={{
        backgroundColor: config.bg,
        color: config.color,
        fontWeight: 600,
        fontSize: 11,
        height: 22,
        '& .MuiChip-icon': { color: config.color },
      }}
    />
  );
}
