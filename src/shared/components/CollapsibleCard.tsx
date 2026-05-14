'use client';

import { type ReactNode, useState } from 'react';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

interface CollapsibleCardProps {
  title: ReactNode;
  icon?: ReactNode;
  headerRight?: ReactNode;
  defaultExpanded?: boolean;
  cardSx?: Parameters<typeof Card>[0]['sx'];
  children: ReactNode;
}

export default function CollapsibleCard({
  title,
  icon,
  headerRight,
  defaultExpanded = false,
  cardSx,
  children,
}: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultExpanded);

  return (
    <Card sx={cardSx}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: open ? 3 : 3 } }}>
        <Box
          onClick={() => {
            setOpen((prev) => !prev);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            gap: 1,
            mb: open ? 2 : 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
            {icon}
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                fontSize: 15,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: 'text.secondary',
              }}
            >
              {title}
            </Typography>
            {headerRight}
          </Box>
          {open ? (
            <ExpandLessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          )}
        </Box>
        <Collapse in={open} timeout="auto" unmountOnExit>
          {children}
        </Collapse>
      </CardContent>
    </Card>
  );
}
