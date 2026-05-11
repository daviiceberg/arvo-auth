'use client';

import { useState } from 'react';

import EmailIcon from '@mui/icons-material/Email';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

import { type PrestadorMessage } from '@/types/pedido';

interface PrestadorTimelineSectionProps {
  messages: PrestadorMessage[];
}

const STATUS_LABEL: Record<PrestadorMessage['status'], string> = {
  sent: 'Enviado',
  delivered: 'Entregue',
  read: 'Lido',
  failed: 'Falhou',
};

const STATUS_COLOR: Record<PrestadorMessage['status'], string> = {
  sent: '#92400e',
  delivered: '#1d4ed8',
  read: '#16a34a',
  failed: '#d4183d',
};

function ChannelIcon({ channel }: { channel: PrestadorMessage['channel'] }) {
  if (channel === 'whatsapp') return <WhatsAppIcon sx={{ fontSize: 14, color: '#25d366' }} />;
  return <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />;
}

export default function PrestadorTimelineSection({ messages }: PrestadorTimelineSectionProps) {
  const [open, setOpen] = useState(true);

  if (messages.length === 0) return null;

  // Apresentação: mais recente primeiro (mocks chegam ordem cronológica ascendente).
  const ordered = [...messages].reverse();

  return (
    <Card>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box
          onClick={() => {
            setOpen((p) => !p);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ForumOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="h6" fontWeight={700} sx={{ fontSize: 15 }}>
              Comunicação com Prestador
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                color: 'text.secondary',
                fontWeight: 600,
                backgroundColor: 'rgba(0,0,0,0.05)',
                px: 1,
                py: 0.25,
                borderRadius: 1,
              }}
            >
              {messages.length} {messages.length === 1 ? 'mensagem' : 'mensagens'}
            </Typography>
          </Box>
          {open ? (
            <ExpandLessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          ) : (
            <ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          )}
        </Box>
        <Collapse in={open}>
          <Box sx={{ mt: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {ordered.map((m) => (
              <Box
                key={m.id}
                sx={{
                  border: '1px solid rgba(0,0,0,0.04)',
                  borderRadius: 1.5,
                  p: 1.5,
                  backgroundColor: 'rgba(0,0,0,0.015)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <ChannelIcon channel={m.channel} />
                  <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, flex: 1 }}>
                    {m.subject}
                  </Typography>
                  <Chip
                    label={STATUS_LABEL[m.status]}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: 10,
                      height: 18,
                      color: STATUS_COLOR[m.status],
                      backgroundColor: 'rgba(0,0,0,0.04)',
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 12,
                    color: 'text.secondary',
                    display: 'block',
                    whiteSpace: 'pre-wrap',
                    mb: 0.5,
                  }}
                >
                  {m.body}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: 11, color: 'text.disabled', display: 'block' }}
                >
                  {new Date(m.sentAt).toLocaleString('pt-BR')}
                </Typography>
              </Box>
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
