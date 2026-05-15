'use client';

import { useRouter } from 'next/navigation';

import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { findParentRequest, type ParentRequestLookupResult } from '../utils/parent-request-lookup';

interface ComplementaryBannerProps {
  parentRequestId: string;
}

function shortDate(value: string | undefined): string {
  if (!value) return '';
  // Aceita "DD/MM/YYYY HH:MM" ou "DD/MM/YYYY"
  return value.slice(0, 10);
}

function buildText(parentId: string, lookup: ParentRequestLookupResult): string {
  if (lookup.source === 'not_found') {
    return `vínculo a pedido ${parentId} não localizado`;
  }
  const cat = lookup.category ?? '';
  if (lookup.source === 'history') {
    const date = shortDate(lookup.decisionDate);
    if (lookup.decisao === 'Aprovado') {
      return `vinculado a ${parentId} (${cat} aprovada em ${date})`;
    }
    if (lookup.decisao === 'Negado') {
      return `vinculado a ${parentId} (${cat} negada em ${date})`;
    }
    if (lookup.decisao === 'Aprovado Parcial') {
      return `vinculado a ${parentId} (${cat} aprovada parcialmente em ${date})`;
    }
    return `vinculado a ${parentId} (${cat} ${lookup.decisao ?? ''} em ${date})`;
  }
  // queue
  const date = shortDate(lookup.protocolDate);
  return `vinculado a ${parentId} (${cat} em análise desde ${date})`;
}

export default function ComplementaryBanner({ parentRequestId }: ComplementaryBannerProps) {
  const router = useRouter();
  const lookup = findParentRequest(parentRequestId);
  const text = buildText(parentRequestId, lookup);

  const handleNavigate = () => {
    if (lookup.source === 'queue') {
      router.push(`/analise?id=${parentRequestId}`);
    } else if (lookup.source === 'history') {
      router.push(`/historico/${parentRequestId}`);
    }
  };

  const navigable = lookup.source !== 'not_found';
  const Icon = lookup.source === 'not_found' ? LinkOffIcon : LinkIcon;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.75,
        borderRadius: 2,
        backgroundColor: 'rgba(13,148,136,0.06)',
        border: '1px solid rgba(13,148,136,0.2)',
      }}
    >
      <Icon sx={{ fontSize: 18, color: lookup.source === 'not_found' ? '#9ca3af' : '#0d9488' }} />
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body2"
          sx={{ fontSize: 13, fontWeight: 700, color: '#0f766e', mb: 0.25 }}
        >
          Pedido complementar
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
          {text}
        </Typography>
      </Box>
      {navigable ? (
        <Box
          component="button"
          onClick={handleNavigate}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            background: 'none',
            border: 'none',
            p: 0,
            color: '#0d9488',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          ver pedido original
          <OpenInNewIcon sx={{ fontSize: 14 }} />
        </Box>
      ) : null}
    </Box>
  );
}
