'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined'
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined'

const initialNotifications = [
  {
    id: 'n-1',
    pedidoId: 'ATH-2026-00423',
    type: 'devolutiva',
    title: 'Devolutiva recebida',
    message: 'O prestador Hospital São Lucas enviou documentação complementar para o pedido ATH-2026-00423 (Cirurgia Eletiva).',
    time: '12min atrás',
    read: false,
  },
  {
    id: 'n-2',
    pedidoId: 'ATH-2026-00387',
    type: 'sla',
    title: 'SLA em risco',
    message: 'O pedido ATH-2026-00387 da categoria Internação vence o prazo regulatório em menos de 2 horas. Ação imediata recomendada.',
    time: '45min atrás',
    read: false,
  },
  {
    id: 'n-3',
    pedidoId: 'ATH-2026-00431',
    type: 'urgencia',
    title: 'Novo pedido de Urgência/Emergência',
    message: 'O pedido ATH-2026-00431 foi adicionado à fila de Urgência/Emergência e aguarda análise prioritária.',
    time: '1h atrás',
    read: true,
  },
]

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  devolutiva: {
    icon: <AssignmentReturnOutlinedIcon sx={{ fontSize: 18 }} />,
    color: '#2563eb',
    bg: 'rgba(37,99,235,0.1)',
  },
  sla: {
    icon: <ReportProblemOutlinedIcon sx={{ fontSize: 18 }} />,
    color: '#b45309',
    bg: 'rgba(245,158,11,0.12)',
  },
  urgencia: {
    icon: <LocalHospitalOutlinedIcon sx={{ fontSize: 18 }} />,
    color: '#d4183d',
    bg: 'rgba(212,24,61,0.1)',
  },
}

export default function NotificacoesPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleClick = (n: (typeof notifications)[number]) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
    )
    router.push(`/analise?id=${n.pedidoId}`)
  }

  return (
    <Box sx={{ p: 3, maxWidth: 760, mx: 'auto' }}>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: 22, mb: 0.5 }}>
            Notificações
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            {unreadCount > 0
              ? `Você tem ${unreadCount} notificaç${unreadCount === 1 ? 'ão não lida' : 'ões não lidas'}`
              : 'Nenhuma notificação não lida'}
          </Typography>
        </Box>
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            size="small"
            onClick={markAllRead}
            sx={{ fontSize: 12, fontWeight: 600, mt: 0.5 }}
          >
            Marcar todas como lidas
          </Button>
        )}
      </Box>

      {/* Notifications card */}
      <Card sx={{ overflow: 'hidden' }}>
        {notifications.length === 0 ? (
          <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <NotificationsNoneIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Nenhuma notificação
            </Typography>
          </Box>
        ) : (
          notifications.map((n, i) => {
            const config = typeConfig[n.type] ?? typeConfig.devolutiva
            return (
              <Box key={n.id}>
                {i > 0 && <Divider />}
                <Box
                  onClick={() => handleClick(n)}
                  sx={{
                    px: 2.5,
                    py: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    cursor: 'pointer',
                    backgroundColor: n.read ? 'transparent' : 'rgba(144,43,41,0.025)',
                    '&:hover': { backgroundColor: 'rgba(144,43,41,0.04)' },
                    transition: 'background-color 150ms ease',
                  }}
                >
                  {/* Type icon */}
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      backgroundColor: config.bg,
                      color: config.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      mt: 0.25,
                    }}
                  >
                    {config.icon}
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                      <Typography
                        variant="body2"
                        fontWeight={n.read ? 500 : 700}
                        sx={{ fontSize: 14, lineHeight: 1.3 }}
                      >
                        {n.title}
                      </Typography>
                      <Chip
                        label={n.pedidoId}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: 12,
                          fontWeight: 600,
                          backgroundColor: 'rgba(0,0,0,0.06)',
                          color: 'text.secondary',
                          '& .MuiChip-label': { px: 0.75 },
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: 13, lineHeight: 1.5, display: 'block' }}
                    >
                      {n.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ fontSize: 12, display: 'block', mt: 0.5 }}
                    >
                      {n.time}
                    </Typography>
                  </Box>

                  {/* Unread dot */}
                  {!n.read && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        flexShrink: 0,
                        mt: 1,
                      }}
                    />
                  )}
                </Box>
              </Box>
            )
          })
        )}
      </Card>
    </Box>
  )
}
