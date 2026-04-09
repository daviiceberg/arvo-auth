'use client'

import { useState } from 'react'

import CallSplitIcon from '@mui/icons-material/CallSplit'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CloseIcon from '@mui/icons-material/Close'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import GavelIcon from '@mui/icons-material/Gavel'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { type Request } from '@/data/pedidos'
import { iaSuggestionColorMap } from '@/shared/constants'

import { type ProcDecision } from '../types'

interface AssistantSidebarProps {
  request: Request
  onAprovarClick: () => void
  onNegarClick: () => void
  onPendenciarClick: () => void
  onJuntaClick: () => void
  procDecisoes: Record<string, ProcDecision>
  onProcDecisaoChange: (codigo: string, decisao: ProcDecision) => void
  onConfirmarDecisaoClick: () => void
}

export default function AssistantSidebar({ request, onAprovarClick, onNegarClick, onPendenciarClick, onJuntaClick, procDecisoes, onProcDecisaoChange, onConfirmarDecisaoClick }: AssistantSidebarProps) {
  const { iaChecklist } = request
  const opinionReceived = request.subStatus === 'JUNTA_PARECER_RECEBIDO' && !!request.boardRecommendation
  const iaSuggestion = opinionReceived ? request.boardRecommendation! : request.iaSuggestion
  const iaJustification = opinionReceived ? request.boardOpinion! : request.iaJustification
  const sc = iaSuggestionColorMap[iaSuggestion]
  const [loadingApprove, setLoadingApprove] = useState(false)
  const [loadingDeny, setLoadingDeny] = useState(false)
  const isGuideFinalized = ['Aprovado', 'Negado', 'Aprovado Parcial'].includes(request.status)
  const isBoardWaiting = request.subStatus === 'JUNTA_AGUARDANDO'

  // Multi-procedure flow
  const isMultiProc = request.procedures.length > 1
  const decisions = request.procedures.map(pr => procDecisoes[pr.code] ?? 'pendente')
  const nApproved = decisions.filter(d => d === 'aprovado').length
  const nDenied = decisions.filter(d => d === 'negado').length
  const anyPending = decisions.some(d => d === 'pendente')
  const allApproved = nApproved === request.procedures.length
  const allDenied = nDenied === request.procedures.length
  const confirmBtnColor = allApproved ? '#16a34a' : allDenied ? '#d4183d' : '#902B29'
  const confirmBtnHover = allApproved ? '#15803d' : allDenied ? '#b91c1c' : '#6e1f1d'

  const pillLabel: Record<string, string> = {
    'Aprovar': 'Critérios atendidos',
    'Negar': 'Bloqueios identificados',
    'Junta Médica': 'Análise clínica necessária',
  }

  const handleAprovarWithLoading = () => {
    setLoadingApprove(true)
    setTimeout(() => { setLoadingApprove(false); onAprovarClick() }, 600)
  }

  const handleNegarWithLoading = () => {
    setLoadingDeny(true)
    setTimeout(() => { setLoadingDeny(false); onNegarClick() }, 600)
  }

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: '1px solid rgba(0,0,0,0.07)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'rgba(144,43,41,0.03)',
          }}
        >
          <SmartToyIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography variant="body2" fontWeight={700} color="primary.main">
            Análise da IA
          </Typography>
        </Box>

        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Ponto de vista */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: sc.bg,
              border: `1px solid ${sc.color}33`,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: 12 }}>
              {opinionReceived ? 'Ponto de vista com base no parecer da Junta Médica' : 'Ponto de vista da IA'}
            </Typography>
            <Chip
              label={pillLabel[iaSuggestion] ?? iaSuggestion}
              size="small"
              sx={{ backgroundColor: sc.bg, color: sc.color, fontWeight: 700, mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 12, lineHeight: 1.5 }}>
              {iaJustification}
            </Typography>
          </Box>

          {/* Checklist */}
          {(() => {
            const isTerapias = request.category === 'Terapias Especiais'
            const isF84 = isTerapias && request.procedures.some(p => p.cid?.startsWith('F84'))
            const isContinuidade = request.authorizationStage === 'continuidade'

            // Extra checklist items for Terapias continuidade
            const extraContinuidadeItems: { texto: string; sub?: string; status: 'ok' | 'warning' | 'error' }[] = isTerapias && isContinuidade ? [
              {
                texto: 'Relatório de evolução terapêutica anexado',
                status: request.documents.some(d => d.tipo === 'Relatório de Evolução' || d.nome.toLowerCase().includes('evolucao') || d.nome.toLowerCase().includes('evolução')) ? 'ok' : 'error',
              },
              {
                texto: 'Relatório emitido pelo profissional executante',
                status: request.documents.some(d => d.tipo === 'Relatório de Evolução' || d.nome.toLowerCase().includes('evolucao') || d.nome.toLowerCase().includes('evolução')) ? 'ok' : 'warning',
              },
            ] : []

            // Extra checklist items for OPME with valorUnitario
            const isOpme = request.category === 'OPME'
            const opmeProcsComValor = request.procedures.filter(p => p.manufacturer !== undefined)
            const extraOpmeItems: { texto: string; status: 'ok' | 'warning' | 'error' }[] = isOpme && opmeProcsComValor.length > 0
              ? opmeProcsComValor.map(p => {
                  if (!p.unitValue) return { texto: 'Valor unitário não informado — obrigatório para OPME', status: 'error' as const }
                  const valorAlertaExistente = iaChecklist.some(c => c.status === 'error' && c.texto.toLowerCase().includes('valor'))
                  return valorAlertaExistente
                    ? { texto: 'Valor unitário não verificado — conferir tabela de referência da operadora', status: 'warning' as const }
                    : { texto: 'Valor unitário dentro da referência contratual', status: 'ok' as const }
                })
              : []

            const allItems = [...iaChecklist, ...extraContinuidadeItems, ...extraOpmeItems]

            return (
              <Box>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5, display: 'block', mb: 1 }}>
                  Checklist {isTerapias && isContinuidade ? <Typography component="span" variant="caption" sx={{ fontSize: 11, textTransform: 'none', color: '#2563eb', fontWeight: 600 }}>— Continuidade</Typography> : null}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  {/* RN 539/2022 info item for F84 CIDs */}
                  {isF84 ? <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, p: 1, borderRadius: 1.5, backgroundColor: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)', mb: 0.75 }}>
                      <InfoOutlinedIcon sx={{ fontSize: 15, color: '#2563eb', flexShrink: 0, mt: 0.15 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8', lineHeight: 1.4 }}>
                          RN 539/2022 — sessões ilimitadas aplicáveis para CID F84
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: 11, color: '#2563eb', lineHeight: 1.4, display: 'block', mt: 0.25 }}>
                          Operadora não pode negar por limite de sessões nem por escolha de método terapêutico. Espaço de negativa restrito a questões administrativas.
                        </Typography>
                      </Box>
                    </Box> : null}
                  {allItems.map((item) => (
                    <Box key={item.texto} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      {item.status === 'ok' ? (
                        <CheckCircleOutlineIcon sx={{ fontSize: 15, color: '#16a34a', flexShrink: 0, mt: 0.15 }} />
                      ) : item.status === 'warning' ? (
                        <WarningAmberIcon sx={{ fontSize: 15, color: '#f59e0b', flexShrink: 0, mt: 0.15 }} />
                      ) : (
                        <CloseIcon sx={{ fontSize: 15, color: '#d4183d', flexShrink: 0, mt: 0.15 }} />
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: 13,
                          fontWeight: item.status !== 'ok' ? 600 : 500,
                          color: item.status === 'error' ? '#d4183d' : item.status === 'warning' ? '#b45309' : 'text.primary',
                          lineHeight: 1.45,
                        }}
                      >
                        {item.texto}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )
          })()}

          {/* Alertas especiais */}
          {request.alerts.includes('Liminar Judicial') && (
            <Alert severity="warning" icon={<GavelIcon fontSize="small" />} sx={{ borderRadius: 2 }}>
              <Typography variant="caption" fontWeight={700} display="block" gutterBottom>
                Liminar Judicial Ativa
              </Typography>
              <Typography variant="caption">
                A autorização pode ser mandatória por determinação judicial. Consulte o jurídico antes de negar.
              </Typography>
            </Alert>
          )}

          {request.alerts.includes('Fora do Rol ANS') && (
            <Alert severity="error" icon={<ErrorOutlineIcon fontSize="small" />} sx={{ borderRadius: 2 }}>
              <Typography variant="caption" fontWeight={700} display="block" gutterBottom>
                Fora do Rol ANS
              </Typography>
              <Typography variant="caption">
                Procedimento fora da cobertura obrigatória. Avaliação crítica necessária.
              </Typography>
            </Alert>
          )}
        </Box>
      </Card>

      {/* Decisão do analista */}
      <Card sx={{ mt: 2, overflow: 'hidden' }}>
        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 1, backgroundColor: 'rgba(0,0,0,0.02)' }}>
          <Typography variant="body2" fontWeight={700} color="text.primary">
            Decisão do analista
          </Typography>
        </Box>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {isMultiProc ? (
            <>
              {/* Per-procedure cards */}
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
                Decisão por procedimento
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {request.procedures.map(proc => {
                  const dec = procDecisoes[proc.code] ?? 'pendente'
                  const isAprovado = dec === 'aprovado'
                  const isNegado = dec === 'negado'
                  return (
                    <Box key={proc.code} sx={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 1.5, p: 1.5 }}>
                      <Typography variant="body2" sx={{ fontSize: 12, lineHeight: 1.4, mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Box component="span" sx={{ fontWeight: 700 }}>{proc.tuss}</Box>
                        <Box component="span" sx={{ color: 'text.secondary' }}> · {proc.description}</Box>
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.75 }}>
                        <Tooltip title={isNegado ? `Trocar para Aprovar — ${proc.description}` : ''} placement="top" disableHoverListener={!isNegado}>
                          <Button
                            size="small"
                            fullWidth
                            variant={isAprovado ? 'contained' : 'outlined'}
                            startIcon={isAprovado ? <CheckCircleOutlineIcon sx={{ fontSize: 14 }} /> : undefined}
                            onClick={() => { onProcDecisaoChange(proc.code, isAprovado ? 'pendente' : 'aprovado'); }}
                            disabled={isGuideFinalized}
                            aria-label={isAprovado ? `Desfazer aprovação de ${proc.description}` : `Aprovar ${proc.description}`}
                            sx={{
                              minHeight: 32, fontSize: 12, fontWeight: 600,
                              ...(isAprovado
                                ? { backgroundColor: '#16a34a', '&:hover': { backgroundColor: '#15803d' } }
                                : isNegado
                                ? { borderColor: 'rgba(0,0,0,0.2)', color: 'text.disabled', '&:hover': { borderColor: '#16a34a', color: '#16a34a', backgroundColor: 'rgba(22,163,74,0.04)' } }
                                : { borderColor: '#16a34a', color: '#16a34a', '&:hover': { backgroundColor: 'rgba(22,163,74,0.06)', borderColor: '#16a34a' } }
                              ),
                            }}
                          >
                            Aprovar
                          </Button>
                        </Tooltip>
                        <Tooltip title={isAprovado ? `Trocar para Negar — ${proc.description}` : ''} placement="top" disableHoverListener={!isAprovado}>
                          <Button
                            size="small"
                            fullWidth
                            variant={isNegado ? 'contained' : 'outlined'}
                            startIcon={isNegado ? <CloseIcon sx={{ fontSize: 14 }} /> : undefined}
                            onClick={() => { onProcDecisaoChange(proc.code, isNegado ? 'pendente' : 'negado'); }}
                            disabled={isGuideFinalized}
                            aria-label={isNegado ? `Desfazer negativa de ${proc.description}` : `Negar ${proc.description}`}
                            sx={{
                              minHeight: 32, fontSize: 12, fontWeight: 600,
                              ...(isNegado
                                ? { backgroundColor: '#d4183d', '&:hover': { backgroundColor: '#b91c1c' } }
                                : isAprovado
                                ? { borderColor: 'rgba(0,0,0,0.2)', color: 'text.disabled', '&:hover': { borderColor: '#d4183d', color: '#d4183d', backgroundColor: 'rgba(212,24,61,0.04)' } }
                                : { borderColor: '#d4183d', color: '#d4183d', '&:hover': { backgroundColor: 'rgba(212,24,61,0.06)', borderColor: '#d4183d' } }
                              ),
                            }}
                          >
                            Negar
                          </Button>
                        </Tooltip>
                      </Box>
                    </Box>
                  )
                })}
              </Box>

              {/* Consolidated status badge -- only when all decided */}
              {!anyPending && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.25, borderRadius: 1.5, backgroundColor: allApproved ? 'rgba(22,163,74,0.06)' : allDenied ? 'rgba(212,24,61,0.06)' : 'rgba(217,119,6,0.08)', border: `1px solid ${allApproved ? 'rgba(22,163,74,0.2)' : allDenied ? 'rgba(212,24,61,0.2)' : 'rgba(217,119,6,0.25)'}` }}>
                  {allApproved
                    ? <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#16a34a', flexShrink: 0 }} />
                    : allDenied
                    ? <CloseIcon sx={{ fontSize: 16, color: '#d4183d', flexShrink: 0 }} />
                    : <CallSplitIcon sx={{ fontSize: 16, color: '#b45309', flexShrink: 0 }} />
                  }
                  <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 700, color: allApproved ? '#16a34a' : allDenied ? '#d4183d' : '#b45309' }}>
                    {allApproved
                      ? 'Aprovação Total'
                      : allDenied
                      ? 'Negativa Total'
                      : `Aprovação Parcial — ${String(nApproved)} aprovado(s) · ${String(nDenied)} negado(s)`}
                  </Typography>
                </Box>
              )}

              {/* Confirmar Decisão */}
              <Tooltip
                title={anyPending ? 'Defina a decisão para todos os procedimentos' : ''}
                placement="top"
                disableHoverListener={!anyPending}
              >
                <span style={{ width: '100%' }}>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={anyPending || isGuideFinalized}
                    onClick={onConfirmarDecisaoClick}
                    sx={{ minHeight: 40, backgroundColor: confirmBtnColor, '&:hover': { backgroundColor: confirmBtnHover }, '&.Mui-disabled': { backgroundColor: 'rgba(0,0,0,0.12)' } }}
                  >
                    Confirmar Decisão
                  </Button>
                </span>
              </Tooltip>

              <Divider sx={{ my: 0.5 }} />
            </>
          ) : (
            <>
              <Tooltip title={isBoardWaiting ? 'Aguardando parecer da Junta Médica' : ''} placement="top" disableHoverListener={!isBoardWaiting}>
                <span style={{ width: '100%' }}>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={loadingApprove || isGuideFinalized || isBoardWaiting}
                    onClick={handleAprovarWithLoading}
                    startIcon={loadingApprove ? <CircularProgress size={14} color="inherit" /> : undefined}
                    sx={{ minHeight: 40, backgroundColor: '#16a34a', '&:hover': { backgroundColor: '#15803d' } }}
                  >
                    {loadingApprove ? 'Processando...' : 'Aprovar'}
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title={isBoardWaiting ? 'Aguardando parecer da Junta Médica' : ''} placement="top" disableHoverListener={!isBoardWaiting}>
                <span style={{ width: '100%' }}>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    disabled={loadingDeny || isGuideFinalized || isBoardWaiting}
                    onClick={handleNegarWithLoading}
                    startIcon={loadingDeny ? <CircularProgress size={14} color="inherit" /> : undefined}
                    sx={{ minHeight: 40 }}
                  >
                    {loadingDeny ? 'Processando...' : 'Negar'}
                  </Button>
                </span>
              </Tooltip>
            </>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" fullWidth onClick={onPendenciarClick} disabled={isGuideFinalized} sx={{ minHeight: 36, fontSize: 12 }}>
              Pendenciar
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={onJuntaClick}
              disabled={isGuideFinalized}
              sx={{ minHeight: 36, fontSize: 12, borderColor: '#2563eb', color: '#2563eb', '&:hover': { borderColor: '#1d4ed8', backgroundColor: 'rgba(37,99,235,0.05)' } }}
            >
              Junta Médica
            </Button>
          </Box>
        </Box>
      </Card>
    </>
  )
}
