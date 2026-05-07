'use client';

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Chip from '@mui/material/Chip';

import { originConfigMap } from '@/shared/constants';
import { type RequestOrigin } from '@/types/pedido';

import { CHIP_BASE_SX, CHIP_ICON_FONT_SIZE } from './chip-styles';

const originIconMap: Record<RequestOrigin, React.ReactNode> = {
  app: <PhoneAndroidIcon sx={{ fontSize: CHIP_ICON_FONT_SIZE }} />,
  whatsapp: <WhatsAppIcon sx={{ fontSize: CHIP_ICON_FONT_SIZE }} />,
  email: <EmailOutlinedIcon sx={{ fontSize: CHIP_ICON_FONT_SIZE }} />,
  prestador: <LocalHospitalOutlinedIcon sx={{ fontSize: CHIP_ICON_FONT_SIZE }} />,
  call_center: <PhoneAndroidIcon sx={{ fontSize: CHIP_ICON_FONT_SIZE }} />,
};

interface OriginChipProps {
  origin: RequestOrigin;
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
        ...CHIP_BASE_SX,
        backgroundColor: config.bg,
        color: config.color,
        '& .MuiChip-icon': { color: config.color },
      }}
    />
  );
}
