'use client'

import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { type FormData, type TerapiaProcedimento, type DocUpload } from '../types'
import { moduloLabels } from '../constants/module-labels'
import { getStep3Label } from '../constants/module-labels'

interface StepReviewProps {
  form: FormData
  terapiaProcedimentos: TerapiaProcedimento[]
  docsObrigatorios: DocUpload[]
  docsAdicionais: DocUpload[]
}

export function StepReview({ form, terapiaProcedimentos, docsObrigatorios, docsAdicionais }: StepReviewProps) {
  const rows = (label: string, value: string) => (
    <Box key={label} sx={{ display: 'flex', py: 1, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <Typography variant="caption" sx={{ width: 180, flexShrink: 0, fontWeight: 600, color: 'text.secondary', fontSize: 12 }}>{label}</Typography>
      <Typography variant="caption" sx={{ fontSize: 12 }}>{value || '\u2014'}</Typography>
    </Box>
  )

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>Revisão da Solicitação</Typography>
      <Box sx={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 2, p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CheckCircleOutlineIcon sx={{ color: '#16a34a', fontSize: 18 }} />
        <Typography variant="body2" sx={{ fontSize: 13, color: '#15803d', fontWeight: 500 }}>
          Revise as informações antes de enviar. Após o envio a solicitação entrará na fila de análise.
        </Typography>
      </Box>
      {/* Beneficiário */}
      <Typography variant="body2" fontWeight={700} sx={{ mb: 1, fontSize: 13, color: '#902B29' }}>Dados do Beneficiário</Typography>
      <Box sx={{ mb: 3 }}>
        {rows('Tipo de Solicitação', form.tipoSolicitacao ? moduloLabels[form.tipoSolicitacao] : '')}
        {rows('Nome', form.nomeBeneficiario)}
        {rows('Carteirinha', form.carteirinha)}
        {rows('Data de Nascimento', form.dataNascimento)}
        {rows('CPF', form.cpf)}
        {rows('Operadora / Plano', form.operadora)}
        {rows('Validade da Carteirinha', form.validadeCarteirinha)}
      </Box>
      {/* Dados Clínicos */}
      <Typography variant="body2" fontWeight={700} sx={{ mb: 1, fontSize: 13, color: '#902B29' }}>Dados Clínicos</Typography>
      <Box sx={{ mb: 3 }}>
        {rows('CID Principal', form.cidPrincipal)}
        {form.cidsSecundarios.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, py: 0.75, borderBottom: '1px solid #f1f5f9' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: 12, minWidth: 160, flexShrink: 0 }}>
              CIDs Secundários
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {form.cidsSecundarios.map((cid, i) => (
                <Chip key={i} label={cid} size="small"
                  sx={{ backgroundColor: 'rgba(37,99,235,0.08)', color: '#2563eb', fontWeight: 700, fontSize: 11, height: 20 }} />
              ))}
            </Box>
          </Box>
        )}
        {rows('Caráter do Atendimento', form.caraterAtendimento)}
        {rows('Médico Solicitante', form.medicoSolicitante)}
        {rows('CRM', form.crm)}
        {rows('Indicação Clínica', form.indicacaoClinica)}
      </Box>
      {/* Step 3 summary */}
      {form.tipoSolicitacao && (
        <>
          <Typography variant="body2" fontWeight={700} sx={{ mb: 1, fontSize: 13, color: '#902B29' }}>
            {getStep3Label(form.tipoSolicitacao)}
          </Typography>
          <Box sx={{ mb: 3 }}>
            {form.tipoSolicitacao === 'internacao' && <>
              {rows('Tipo de Acomodação', form.tipoAcomodacao)}
              {rows('Qtd. de Diárias', form.qtdDiarias)}
              {rows('Data Prevista', form.dataInternacao)}
              {rows('Regime', form.regimeInternacao)}
            </>}
            {form.tipoSolicitacao === 'urgencia' && <>
              {rows('Classificação de Risco', form.classificacaoRisco)}
              {rows('Tipo de Atendimento', form.tipoAtendimento)}
              {rows('Queixa Principal', form.queixaPrincipal)}
            </>}
            {form.tipoSolicitacao === 'oncologia' && <>
              {rows('Estadiamento TNM', form.estadiamentoTNM)}
              {rows('Nº do Ciclo', form.numeroCiclo)}
              {rows('Protocolo', form.protocoloQuimio)}
              {rows('Tipo de Tratamento', form.tipoTratamento)}
              {rows('Total de Ciclos', form.totalCiclos)}
            </>}
            {form.tipoSolicitacao === 'terapias' && <>
              {rows('Etapa da Autorização', form.etapaAutorizacao === 'continuidade' ? 'Continuidade / Renovação' : form.etapaAutorizacao === 'primeira_solicitacao' ? 'Primeira Solicitação' : '\u2014')}
              {terapiaProcedimentos.map((proc, idx) => (
                <Box key={proc.id} sx={{ mt: 1.5, mb: 0.5 }}>
                  {terapiaProcedimentos.length > 1 && (
                    <Typography variant="subtitle2" sx={{ fontSize: 12, fontWeight: 700, mb: 0.5, color: 'text.secondary' }}>
                      Procedimento {idx + 1}
                    </Typography>
                  )}
                  {rows('Tipo de Terapia', proc.tipoTerapia)}
                  {rows('Código TUSS', proc.codigoTUSS)}
                  {rows('Nº de Sessões', proc.numeroSessoes)}
                  {rows('Data de Início', proc.dataInicio)}
                  {rows('Data de Término', proc.dataTermino)}
                  {rows('Frequência Semanal', proc.frequenciaSemanal)}
                  {rows('Duração da Sessão', `${proc.duracaoSessao} min`)}
                </Box>
              ))}
            </>}
            {form.tipoSolicitacao === 'homecare' && <>
              {rows('Modalidade', form.modalidadeHomeCare)}
              {rows('Período (dias)', form.periodoSolicitado)}
              {rows('Cuidados Necessários', form.cuidadosNecessarios)}
            </>}
            {(form.tipoSolicitacao === 'cirurgias' || form.tipoSolicitacao === 'exames' || form.tipoSolicitacao === 'opme') && (
              <Box sx={{ py: 1 }}>
                <Typography variant="caption" sx={{ fontSize: 12, color: 'text.secondary' }}>
                  {form.tipoSolicitacao === 'cirurgias' && `${form.procedimentos.length} procedimento(s) e ${form.opme.length} material(is) OPME cadastrado(s).`}
                  {form.tipoSolicitacao === 'exames' && `${form.exames.length} exame(s) solicitado(s).`}
                  {form.tipoSolicitacao === 'opme' && `${form.materiais.length} material(is) cadastrado(s).`}
                </Typography>
              </Box>
            )}
          </Box>
        </>
      )}

      {/* Documentos Anexados */}
      {(() => {
        const pendentes = docsObrigatorios.filter(d => d.obrigatorio && d.status === 'pendente')
        const total = docsObrigatorios.filter(d => d.obrigatorio).length
        const totalEnv = docsObrigatorios.filter(d => d.obrigatorio && d.status === 'enviado').length
        if (docsObrigatorios.length === 0 && docsAdicionais.length === 0) return null
        return (
          <>
            <Typography variant="body2" fontWeight={700} sx={{ mb: 1, fontSize: 13, color: '#902B29' }}>
              Documentos Anexados{total > 0 ? ` (${totalEnv} de ${total} obrigatórios)` : ''}
            </Typography>
            {pendentes.length > 0 && (
              <Alert severity="warning" sx={{ mb: 1.5, fontSize: 12 }}>
                {pendentes.length} documento(s) obrigatório(s) pendente(s): <strong>{pendentes.map(d => d.nome).join(', ')}</strong>
              </Alert>
            )}
            <Box sx={{ mb: 3 }}>
              {docsObrigatorios.map(d => (
                <Box key={d.id} sx={{ display: 'flex', py: 1, borderBottom: '1px solid rgba(0,0,0,0.06)', alignItems: 'center', gap: 1 }}>
                  {d.status === 'enviado'
                    ? <CheckCircleOutlineIcon sx={{ fontSize: 15, color: '#16a34a', flexShrink: 0 }} />
                    : <WarningAmberIcon sx={{ fontSize: 15, color: '#f59e0b', flexShrink: 0 }} />}
                  <Typography variant="caption" sx={{ flex: 1, fontSize: 12 }}>{d.status === 'enviado' ? d.nome : d.nome}</Typography>
                  <Typography variant="caption" sx={{ fontSize: 11, color: d.status === 'enviado' ? '#15803d' : '#b45309', fontWeight: 600 }}>
                    {d.status === 'enviado' ? `${d.tamanho}` : 'Pendente'}
                  </Typography>
                </Box>
              ))}
              {docsAdicionais.map(d => (
                <Box key={d.id} sx={{ display: 'flex', py: 1, borderBottom: '1px solid rgba(0,0,0,0.06)', alignItems: 'center', gap: 1 }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 15, color: '#16a34a', flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ flex: 1, fontSize: 12 }}>{d.nome}</Typography>
                  <Typography variant="caption" sx={{ fontSize: 11, color: 'text.secondary' }}>{d.tipo} · {d.tamanho}</Typography>
                </Box>
              ))}
            </Box>
          </>
        )
      })()}
    </Box>
  )
}
