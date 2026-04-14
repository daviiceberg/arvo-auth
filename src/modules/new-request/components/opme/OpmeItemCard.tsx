'use client';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { type OpmeItemData } from '@/modules/new-request/types/opme';

import OpmeAnvisaSection from './OpmeAnvisaSection';
import OpmeItemFields from './OpmeItemFields';
import OpmeQuotationsSection from './OpmeQuotationsSection';

interface OpmeItemCardProps {
  index: number;
  item: OpmeItemData;
  onUpdate: (item: OpmeItemData) => void;
  onRemove: () => void;
  canRemove: boolean;
  onConsultAnvisa: () => void;
}

export default function OpmeItemCard({
  index,
  item,
  onUpdate,
  onRemove,
  canRemove,
  onConsultAnvisa,
}: OpmeItemCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Material {index}
          </Typography>
          {canRemove ? (
            <IconButton
              size="small"
              onClick={onRemove}
              sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          ) : null}
        </Box>
        <OpmeItemFields item={item} onUpdate={onUpdate} />
        <OpmeAnvisaSection item={item} onUpdate={onUpdate} onConsult={onConsultAnvisa} />
        <OpmeQuotationsSection item={item} onUpdate={onUpdate} />
      </CardContent>
    </Card>
  );
}
