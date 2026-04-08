'use client';

import React from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import GroupsIcon from '@mui/icons-material/Groups';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { DecisionActionChip } from '@/shared/components';
import { type Ajuste } from '@/types/pedido';

import useHistoryDetail from '../hooks/useHistoryDetail';
import AppealDialog from './AppealDialog';
import BeneficiarySection from './BeneficiarySection';
import ConsolidatedHistorySection from './ConsolidatedHistorySection';
import DecisionOriginChip from './DecisionOriginChip';
import DocumentsSection from './DocumentsSection';
import HistoryDetailHeader from './HistoryDetailHeader';
import ObservationsSection from './ObservationsSection';
import ProceduresSection from './ProceduresSection';

export default function HistoryDetailPage() {
  const vm = useHistoryDetail();

  if (!vm.entry) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="text.secondary">Pedido não encontrado.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => vm.router.push('/historico')} sx={{ mt: 2 }}>
          Voltar ao Histórico
        </Button>
      </Box>
    );
  }

  const entry = vm.entry;

  return (
    <Box
      sx={{
        height: 'calc(100vh - 60px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: 'background.default',
      }}
    >
      {/* Header */}
      <HistoryDetailHeader
        entry={entry}
        currentIndex={vm.currentIndex}
        total={vm.total}
        onBack={() => vm.router.push('/historico')}
        onPrev={vm.handlePrev}
        onNext={vm.handleNext}
      />

      {/* Body */}
      <Box sx={{ flex: 1, display: 'flex', gap: 2.5, px: 3, pt: 2, overflow: 'hidden' }}>
        {/* Left column — scrolls independently */}
        <Box sx={{ flex: 1, minWidth: 0, overflowY: 'auto', pb: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <BeneficiarySection entry={entry} />
            <ProceduresSection entry={entry} />
            <ObservationsSection entry={entry} />
            <ConsolidatedHistorySection entry={entry} />
            <DocumentsSection entry={entry} />
          </Box>
        </Box>

        {/* Right column — always fully visible, own scroll if needed */}
        <Box sx={{ width: 400, flexShrink: 0, overflowY: 'auto', pb: 2 }}>
          <Card sx={{ overflow: 'visible' }}>
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
              {/* Decision header */}
              <Box sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ fontSize: 12, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.6, mb: 1.5 }}
                >
                  Decisão Registrada
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <DecisionActionChip action={entry.acao} />
                  <DecisionOriginChip origin={entry.origem} />
                </Box>
              </Box>

              <Divider />

              <Box sx={{ px: 2.5, py: 2 }}>
                {/* IA automatica */}
                {entry.origem === 'ia_automatica' && (
                  <Box
                    sx={{
                      backgroundColor: 'rgba(37,99,235,0.04)',
                      border: '1px solid rgba(37,99,235,0.15)',
                      borderRadius: 2,
                      p: 2,
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <SmartToyIcon sx={{ fontSize: 16, color: '#2563eb' }} />
                      <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, color: '#2563eb' }}>
                        {entry.acao === 'Aprovado' ? 'Aprovado automaticamente pela IA' : 'Negado automaticamente pela IA'}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontSize: 12, color: '#374151', lineHeight: 1.6, display: 'block' }}>
                      {entry.motivoDecisao}
                    </Typography>
                    <Alert
                      severity="info"
                      sx={{ mt: 1.5, fontSize: 12, '& .MuiAlert-message': { fontSize: 12 } }}
                      icon={<InfoOutlinedIcon sx={{ fontSize: 15 }} />}
                    >
                      Decisão automática registrada para fins de auditoria.
                    </Alert>
                  </Box>
                )}

                {/* Analista */}
                {entry.origem === 'analista' && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2.5, mb: 1.5, flexWrap: 'wrap' }}>
                      <Box>
                        <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.25 }}>
                          Responsável
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 600 }}>
                            {entry.analista}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.25 }}>
                          Data da decisão
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: 13 }}>
                          {entry.dataDecisao}
                        </Typography>
                      </Box>
                    </Box>
                    {entry.tempoAnaliseMin > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
                          Tempo de análise: <strong>{entry.tempoAnaliseMin} min</strong>
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ backgroundColor: '#f9fafb', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2, p: 2 }}>
                      <Typography variant="caption" sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.75 }}>
                        Motivo da Decisão
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.6 }}>
                        {entry.motivoDecisao}
                      </Typography>
                      {entry.textoLivre && (
                        <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', mt: 1, display: 'block', lineHeight: 1.5 }}>
                          {entry.textoLivre}
                        </Typography>
                      )}
                    </Box>

                    {/* Ajustes aplicados */}
                    {entry.ajustes && entry.ajustes.length > 0 && (
                      <Box
                        sx={{
                          backgroundColor: 'rgba(255,251,235,0.8)',
                          border: '1px solid rgba(245,158,11,0.3)',
                          borderRadius: 2,
                          p: 2,
                          mt: 1.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#b45309',
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            display: 'block',
                            mb: 1.25,
                          }}
                        >
                          Ajustes Aplicados
                        </Typography>
                        <Divider sx={{ mb: 1.25, borderColor: 'rgba(245,158,11,0.2)' }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          {(entry.ajustes as Ajuste[]).map((aj) => {
                            const campoLabel =
                              aj.campo === 'quantidade'
                                ? 'Quantidade autorizada'
                                : aj.campo === 'prestador'
                                  ? 'Prestador executante'
                                  : 'Código do procedimento';
                            return (
                              <Box key={aj.id}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                                  <EditIcon sx={{ fontSize: 13, color: '#b45309', flexShrink: 0 }} />
                                  <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{campoLabel}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25, flexWrap: 'wrap' }}>
                                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Solicitado:</Typography>
                                  <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{aj.valorAnterior}</Typography>
                                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>→ Autorizado:</Typography>
                                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#b45309' }}>{aj.valorNovo}</Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, display: 'block', mb: 0.25 }}>
                                  Motivo: {aj.motivo}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                                  Por: {aj.operador} ·{' '}
                                  {new Date(aj.timestamp).toLocaleDateString('pt-BR')}{' '}
                                  {new Date(aj.timestamp).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Checklist IA */}
                {entry.iaChecklist && entry.iaChecklist.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      color="text.secondary"
                      sx={{ textTransform: 'uppercase', fontSize: 12, letterSpacing: 0.5, display: 'block', mb: 1 }}
                    >
                      Checklist IA
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      {entry.iaChecklist.map((item) => (
                        <Box key={item.texto} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          {item.status === 'ok' ? (
                            <CheckCircleOutlineIcon sx={{ fontSize: 15, color: '#16a34a', flexShrink: 0, mt: 0.15 }} />
                          ) : item.status === 'warning' ? (
                            <WarningAmberIcon sx={{ fontSize: 15, color: '#f59e0b', flexShrink: 0, mt: 0.15 }} />
                          ) : (
                            <CloseIcon sx={{ fontSize: 15, color: '#d4183d', flexShrink: 0, mt: 0.15 }} />
                          )}
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: 12,
                              fontWeight: item.status !== 'ok' ? 600 : 500,
                              color:
                                item.status === 'error'
                                  ? '#d4183d'
                                  : item.status === 'warning'
                                    ? '#b45309'
                                    : 'text.primary',
                              lineHeight: 1.4,
                            }}
                          >
                            {item.texto}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Sugestao da IA */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
                    Sugestão da IA
                  </Typography>
                  <Chip
                    label={entry.iaSugestao}
                    size="small"
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      height: 22,
                      backgroundColor:
                        entry.iaSugestao === 'Aprovar'
                          ? 'rgba(22,163,74,0.1)'
                          : entry.iaSugestao === 'Negar'
                            ? 'rgba(212,24,61,0.1)'
                            : 'rgba(245,158,11,0.12)',
                      color:
                        entry.iaSugestao === 'Aprovar'
                          ? '#16a34a'
                          : entry.iaSugestao === 'Negar'
                            ? '#d4183d'
                            : '#b45309',
                    }}
                  />
                </Box>

                {/* Divergencia */}
                {entry.divergencia ? (
                  <Alert
                    severity="warning"
                    icon={<WarningAmberIcon sx={{ fontSize: 16 }} />}
                    sx={{ mb: 2, '& .MuiAlert-message': { fontSize: 12 } }}
                  >
                    <Typography variant="caption" fontWeight={700} sx={{ fontSize: 12, display: 'block', mb: 0.5 }}>
                      Divergência com a IA
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 12 }}>
                      {entry.divergenciaMotivo}
                    </Typography>
                  </Alert>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 2 }}>
                    <CheckCircleIcon sx={{ fontSize: 14, color: '#16a34a' }} />
                    <Typography variant="caption" sx={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
                      Decisão alinhada com a sugestão da IA
                    </Typography>
                  </Box>
                )}

                {/* Junta Medica */}
                {entry.juntaMedica && (
                  <>
                    <Divider sx={{ my: 1.5 }} />
                    <Box
                      sx={{
                        backgroundColor: 'rgba(124,58,237,0.04)',
                        border: '1px solid rgba(124,58,237,0.18)',
                        borderRadius: 2,
                        p: 2,
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <GroupsIcon sx={{ fontSize: 17, color: '#7c3aed' }} />
                        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13, color: '#7c3aed' }}>
                          Junta Médica Realizada
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 3, mb: 1.5 }}>
                        <Box>
                          <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.25 }}>
                            Data da reunião
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: 13 }}>
                            {entry.juntaMedica.dataReuniao}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.25 }}>
                            N° da ata
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: 13, fontFamily: 'monospace' }}>
                            {entry.juntaMedica.numeroAta}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.75 }}>
                        Membros
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
                        {entry.juntaMedica.membros.map((m, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <PersonIcon sx={{ fontSize: 13, color: '#7c3aed', flexShrink: 0 }} />
                            <Typography variant="caption" sx={{ fontSize: 12, color: '#374151', lineHeight: 1.4 }}>
                              <strong>{m.nome}</strong> — {m.especialidade}
                              <Box component="span" sx={{ color: 'text.secondary' }}>
                                {' '}
                                ({m.crm})
                              </Box>
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
                        Parecer da Junta
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.6 }}>
                        {entry.juntaMedica.parecer}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>

              <Divider />

              {/* Action buttons */}
              <Box sx={{ px: 2.5, py: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  color="inherit"
                  fullWidth
                  startIcon={<DownloadIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
                  onClick={vm.handleDownloadPDF}
                  sx={{ fontWeight: 600, justifyContent: 'flex-start', px: 2, borderColor: 'rgba(0,0,0,0.2)', color: 'text.primary' }}
                >
                  Baixar PDF da Autorização
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<SendIcon />}
                  onClick={() => vm.setNotifyOpen(true)}
                  sx={{ fontWeight: 600, justifyContent: 'flex-start', px: 2 }}
                >
                  Informar Decisão ao Beneficiário
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Appeal / Notify Dialog + Snackbar */}
      <AppealDialog
        open={vm.notifyOpen}
        onClose={() => vm.setNotifyOpen(false)}
        entry={entry}
        notifyChannel={vm.notifyChannel}
        onNotifyChannelChange={vm.setNotifyChannel}
        onSend={vm.handleNotify}
        snackbarOpen={vm.snackbar.open}
        snackbarMessage={vm.snackbar.message}
        onSnackbarClose={vm.closeSnackbar}
      />
    </Box>
  );
}
