'use client';

import React from 'react';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { moduloLabels, getStep3Label } from '../constants/module-labels';
import { type FormData, type TerapiaProcedimento, type DocUpload } from '../types';

interface StepReviewProps {
  form: FormData;
  terapiaProcedimentos: TerapiaProcedimento[];
  docsObrigatorios: DocUpload[];
  docsAdicionais: DocUpload[];
}

// ── Helper: row renderer ─────────────────────────────────────────────
function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', py: 1, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <Typography
        variant="caption"
        sx={{ width: 180, flexShrink: 0, fontWeight: 600, color: 'text.secondary', fontSize: 12 }}
      >
        {label}
      </Typography>
      <Typography variant="caption" sx={{ fontSize: 12 }}>
        {value || '\u2014'}
      </Typography>
    </Box>
  );
}

// ── Step 3 content by request type ───────────────────────────────────
function getStep3Content(
  form: FormData,
  terapiaProcedimentos: TerapiaProcedimento[],
): React.ReactNode {
  const contentByType: Record<string, React.ReactNode> = {
    internacao: (
      <>
        <ReviewRow label="Tipo de Acomodação" value={form.tipoAcomodacao} />
        <ReviewRow label="Qtd. de Diárias" value={form.qtdDiarias} />
        <ReviewRow label="Data Prevista" value={form.dataInternacao} />
        <ReviewRow label="Regime" value={form.regimeInternacao} />
      </>
    ),
    urgencia: (
      <>
        <ReviewRow label="Classificação de Risco" value={form.classificacaoRisco} />
        <ReviewRow label="Tipo de Atendimento" value={form.tipoAtendimento} />
        <ReviewRow label="Queixa Principal" value={form.queixaPrincipal} />
      </>
    ),
    oncologia: (
      <>
        <ReviewRow label="Estadiamento TNM" value={form.estadiamentoTNM} />
        <ReviewRow label="Nº do Ciclo" value={form.numeroCiclo} />
        <ReviewRow label="Protocolo" value={form.protocoloQuimio} />
        <ReviewRow label="Tipo de Tratamento" value={form.tipoTratamento} />
        <ReviewRow label="Total de Ciclos" value={form.totalCiclos} />
      </>
    ),
    terapias: (
      <>
        <ReviewRow
          label="Etapa da Autorização"
          value={
            form.etapaAutorizacao === 'continuidade'
              ? 'Continuidade / Renovação'
              : form.etapaAutorizacao === 'primeira_solicitacao'
                ? 'Primeira Solicitação'
                : '\u2014'
          }
        />
        {terapiaProcedimentos.map((proc, idx) => (
          <Box key={proc.id} sx={{ mt: 1.5, mb: 0.5 }}>
            {terapiaProcedimentos.length > 1 && (
              <Typography
                variant="subtitle2"
                sx={{ fontSize: 12, fontWeight: 700, mb: 0.5, color: 'text.secondary' }}
              >
                Procedimento {idx + 1}
              </Typography>
            )}
            <ReviewRow label="Tipo de Terapia" value={proc.tipoTerapia} />
            <ReviewRow label="Código TUSS" value={proc.codigoTUSS} />
            <ReviewRow label="Nº de Sessões" value={proc.numeroSessoes} />
            <ReviewRow label="Data de Início" value={proc.dataInicio} />
            <ReviewRow label="Data de Término" value={proc.dataTermino} />
            <ReviewRow label="Frequência Semanal" value={proc.frequenciaSemanal} />
            <ReviewRow label="Duração da Sessão" value={`${proc.duracaoSessao} min`} />
          </Box>
        ))}
      </>
    ),
    homecare: (
      <>
        <ReviewRow label="Modalidade" value={form.modalidadeHomeCare} />
        <ReviewRow label="Período (dias)" value={form.periodoSolicitado} />
        <ReviewRow label="Cuidados Necessários" value={form.cuidadosNecessarios} />
      </>
    ),
    cirurgias: (
      <Box sx={{ py: 1 }}>
        <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
          {`${String(form.procedimentos.length)} procedimento(s) e ${String(form.opme.length)} material(is) OPME cadastrado(s).`}
        </Typography>
      </Box>
    ),
    exames: (
      <Box sx={{ py: 1 }}>
        <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
          {`${String(form.exames.length)} exame(s) solicitado(s).`}
        </Typography>
      </Box>
    ),
    opme: (
      <Box sx={{ py: 1 }}>
        <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
          {`${String(form.materiais.length)} material(is) cadastrado(s).`}
        </Typography>
      </Box>
    ),
  };

  return contentByType[form.tipoSolicitacao] ?? null;
}

// ── Documents review section ─────────────────────────────────────────
function DocumentsReviewSection({
  docsObrigatorios,
  docsAdicionais,
}: Pick<StepReviewProps, 'docsObrigatorios' | 'docsAdicionais'>) {
  if (docsObrigatorios.length === 0 && docsAdicionais.length === 0) return null;

  const pendentes = docsObrigatorios.filter((d) => d.obrigatorio && d.status === 'pendente');
  const total = docsObrigatorios.filter((d) => d.obrigatorio).length;
  const totalEnv = docsObrigatorios.filter((d) => d.obrigatorio && d.status === 'enviado').length;

  return (
    <>
      <Typography variant="body2" fontWeight={700} sx={{ mb: 1, fontSize: 13, color: '#902B29' }}>
        Documentos Anexados
        {total > 0 ? ` (${String(totalEnv)} de ${String(total)} obrigatórios)` : ''}
      </Typography>
      {pendentes.length > 0 && (
        <Alert severity="warning" sx={{ mb: 1.5, fontSize: 12 }}>
          {String(pendentes.length)} documento(s) obrigatório(s) pendente(s):{' '}
          <strong>{pendentes.map((d) => d.nome).join(', ')}</strong>
        </Alert>
      )}
      <Box sx={{ mb: 3 }}>
        {docsObrigatorios.map((d) => (
          <Box
            key={d.id}
            sx={{
              display: 'flex',
              py: 1,
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {d.status === 'enviado' ? (
              <CheckCircleOutlineIcon sx={{ fontSize: 15, color: '#16a34a', flexShrink: 0 }} />
            ) : (
              <WarningAmberIcon sx={{ fontSize: 15, color: '#f59e0b', flexShrink: 0 }} />
            )}
            <Typography variant="caption" sx={{ flex: 1, fontSize: 12 }}>
              {d.nome}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                color: d.status === 'enviado' ? '#15803d' : '#b45309',
                fontWeight: 600,
              }}
            >
              {d.status === 'enviado' ? d.tamanho : 'Pendente'}
            </Typography>
          </Box>
        ))}
        {docsAdicionais.map((d) => (
          <Box
            key={d.id}
            sx={{
              display: 'flex',
              py: 1,
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 15, color: '#16a34a', flexShrink: 0 }} />
            <Typography variant="caption" sx={{ flex: 1, fontSize: 12 }}>
              {d.nome}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 11, color: 'text.secondary' }}>
              {d.tipo} · {d.tamanho}
            </Typography>
          </Box>
        ))}
      </Box>
    </>
  );
}

// ── Main component ───────────────────────────────────────────────────
export function StepReview({
  form,
  terapiaProcedimentos,
  docsObrigatorios,
  docsAdicionais,
}: StepReviewProps) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Revisão da Solicitação
      </Typography>
      <Box
        sx={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 2,
          p: 2,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 18 }} />
        <Typography variant="body2" sx={{ fontSize: 13, color: '#15803d', fontWeight: 500 }}>
          Revise as informações antes de enviar. Após o envio a solicitação entrará na fila de
          análise.
        </Typography>
      </Box>
      {/* Beneficiário */}
      <Typography variant="body2" fontWeight={700} sx={{ mb: 1, fontSize: 13, color: '#902B29' }}>
        Dados do Beneficiário
      </Typography>
      <Box sx={{ mb: 3 }}>
        <ReviewRow
          label="Tipo de Solicitação"
          value={form.tipoSolicitacao ? moduloLabels[form.tipoSolicitacao] : ''}
        />
        <ReviewRow label="Nome" value={form.nomeBeneficiario} />
        <ReviewRow label="Carteirinha" value={form.carteirinha} />
        <ReviewRow label="Data de Nascimento" value={form.dataNascimento} />
        <ReviewRow label="CPF" value={form.cpf} />
        <ReviewRow label="Operadora / Plano" value={form.operadora} />
        <ReviewRow label="Validade da Carteirinha" value={form.validadeCarteirinha} />
      </Box>
      {/* Dados Clínicos */}
      <Typography variant="body2" fontWeight={700} sx={{ mb: 1, fontSize: 13, color: '#902B29' }}>
        Dados Clínicos
      </Typography>
      <Box sx={{ mb: 3 }}>
        <ReviewRow label="CID Principal" value={form.cidPrincipal} />
        {form.cidsSecundarios.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 1,
              py: 0.75,
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: '#64748b', fontSize: 12, minWidth: 160, flexShrink: 0 }}
            >
              CIDs Secundários
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {form.cidsSecundarios.map((cid, i) => (
                <Chip
                  key={i}
                  label={cid}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(37,99,235,0.08)',
                    color: '#2563eb',
                    fontWeight: 700,
                    fontSize: 11,
                    height: 20,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
        <ReviewRow label="Caráter do Atendimento" value={form.caraterAtendimento} />
        <ReviewRow label="Médico Solicitante" value={form.medicoSolicitante} />
        <ReviewRow label="CRM" value={form.crm} />
        <ReviewRow label="Indicação Clínica" value={form.indicacaoClinica} />
      </Box>
      {/* Step 3 summary */}
      {form.tipoSolicitacao ? (
        <>
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ mb: 1, fontSize: 13, color: '#902B29' }}
          >
            {getStep3Label(form.tipoSolicitacao)}
          </Typography>
          <Box sx={{ mb: 3 }}>{getStep3Content(form, terapiaProcedimentos)}</Box>
        </>
      ) : null}

      {/* Documentos Anexados */}
      <DocumentsReviewSection docsObrigatorios={docsObrigatorios} docsAdicionais={docsAdicionais} />
    </Box>
  );
}
