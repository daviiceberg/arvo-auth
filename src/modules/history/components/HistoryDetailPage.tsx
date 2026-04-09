'use client';

import React from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
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

import useHistoryDetail from '../hooks/useHistoryDetail';

import AnalystDecisionSection from './AnalystDecisionSection';
import AppealDialog from './AppealDialog';
import BeneficiarySection from './BeneficiarySection';
import ConsolidatedHistorySection from './ConsolidatedHistorySection';
import DecisionOriginChip from './DecisionOriginChip';
import DocumentsSection from './DocumentsSection';
import HistoryDetailHeader from './HistoryDetailHeader';
import IAChecklistSection from './IAChecklistSection';
import IADecisionSection from './IADecisionSection';
import ObservationsSection from './ObservationsSection';
import ProceduresSection from './ProceduresSection';

export default function HistoryDetailPage() {
  const vm = useHistoryDetail();

  if (!vm.entry) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="text.secondary">Pedido não encontrado.</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            vm.router.push('/historico');
          }}
          sx={{ mt: 2 }}
        >
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
        onBack={() => {
          vm.router.push('/historico');
        }}
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
                  sx={{
                    fontSize: 12,
                    color: 'primary.main',
                    textTransform: 'uppercase',
                    letterSpacing: 0.6,
                    mb: 1.5,
                  }}
                >
                  Decisão Registrada
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <DecisionActionChip action={entry.action} />
                  <DecisionOriginChip origin={entry.origin} />
                </Box>
              </Box>

              <Divider />

              <Box sx={{ px: 2.5, py: 2 }}>
                {/* IA automatica */}
                {entry.origin === 'ia_automatica' && <IADecisionSection entry={entry} />}

                {/* Analista */}
                {entry.origin === 'analista' && <AnalystDecisionSection entry={entry} />}

                {/* Checklist IA */}
                {entry.iaChecklist && entry.iaChecklist.length > 0 ? (
                  <IAChecklistSection iaChecklist={entry.iaChecklist} />
                ) : null}

                {/* Sugestao da IA */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 12,
                      color: 'text.secondary',
                      fontWeight: 600,
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    Sugestão da IA
                  </Typography>
                  <Chip
                    label={entry.iaSuggestion}
                    size="small"
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      height: 22,
                      backgroundColor:
                        entry.iaSuggestion === 'Aprovar'
                          ? 'rgba(22,163,74,0.1)'
                          : entry.iaSuggestion === 'Negar'
                            ? 'rgba(212,24,61,0.1)'
                            : 'rgba(245,158,11,0.12)',
                      color:
                        entry.iaSuggestion === 'Aprovar'
                          ? '#16a34a'
                          : entry.iaSuggestion === 'Negar'
                            ? '#d4183d'
                            : '#b45309',
                    }}
                  />
                </Box>

                {/* Divergencia */}
                {entry.divergence ? (
                  <Alert
                    severity="warning"
                    icon={<WarningAmberIcon sx={{ fontSize: 16 }} />}
                    sx={{ mb: 2, '& .MuiAlert-message': { fontSize: 12 } }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      sx={{ fontSize: 12, display: 'block', mb: 0.5 }}
                    >
                      Divergência com a IA
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 12 }}>
                      {entry.divergenceReason}
                    </Typography>
                  </Alert>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 2 }}>
                    <CheckCircleIcon sx={{ fontSize: 14, color: '#16a34a' }} />
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}
                    >
                      Decisão alinhada com a sugestão da IA
                    </Typography>
                  </Box>
                )}

                {/* Junta Medica */}
                {entry.medicalBoard ? (
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
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          sx={{ fontSize: 13, color: '#7c3aed' }}
                        >
                          Junta Médica Realizada
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 3, mb: 1.5 }}>
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: 12,
                              color: 'text.secondary',
                              fontWeight: 600,
                              display: 'block',
                              mb: 0.25,
                            }}
                          >
                            Data da reunião
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: 13 }}>
                            {entry.medicalBoard.dataReuniao}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: 12,
                              color: 'text.secondary',
                              fontWeight: 600,
                              display: 'block',
                              mb: 0.25,
                            }}
                          >
                            N° da ata
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ fontSize: 13, fontFamily: 'monospace' }}
                          >
                            {entry.medicalBoard.numeroAta}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: 12,
                          color: 'text.secondary',
                          fontWeight: 600,
                          display: 'block',
                          mb: 0.75,
                        }}
                      >
                        Membros
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
                        {entry.medicalBoard.membros.map((m, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <PersonIcon sx={{ fontSize: 13, color: '#7c3aed', flexShrink: 0 }} />
                            <Typography
                              variant="caption"
                              sx={{ fontSize: 12, color: '#374151', lineHeight: 1.4 }}
                            >
                              <strong>{m.nome}</strong> — {m.especialidade}
                              <Box component="span" sx={{ color: 'text.secondary' }}>
                                {' '}
                                ({m.crm})
                              </Box>
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: 12,
                          color: 'text.secondary',
                          fontWeight: 600,
                          display: 'block',
                          mb: 0.5,
                        }}
                      >
                        Parecer da Junta
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.6 }}>
                        {entry.medicalBoard.parecer}
                      </Typography>
                    </Box>
                  </>
                ) : null}
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
                  sx={{
                    fontWeight: 600,
                    justifyContent: 'flex-start',
                    px: 2,
                    borderColor: 'rgba(0,0,0,0.2)',
                    color: 'text.primary',
                  }}
                >
                  Baixar PDF da Autorização
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<SendIcon />}
                  onClick={() => {
                    vm.setNotifyOpen(true);
                  }}
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
        onClose={() => {
          vm.setNotifyOpen(false);
        }}
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
