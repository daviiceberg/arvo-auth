'use client';

import React from 'react';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import { type Category } from '@/types/pedido';

import { type FormData, type TerapiaProcedimento, type DocUpload } from '../types';

const SECTION_TITLE_BY_CATEGORY: Record<Category, string> = {
  'Terapias Especiais': 'Sessões de Terapia',
  SADT: 'Procedimento SADT',
  'Exames Alta Complexidade': 'Exame de Alta Complexidade',
  'Home Care': 'Plano de Home Care',
  'Urgência/Emergência': 'Atendimento de Urgência',
  Oncologia: 'Protocolo Oncológico',
  Internação: 'Plano de Internação',
  'Cirurgias Eletivas': 'Plano Cirúrgico',
  OPME: 'Materiais OPME',
};

function etapaLabel(etapa: string): string {
  if (etapa === 'continuidade') return 'Continuidade / Renovação';
  if (etapa === 'primeira_solicitacao') return 'Primeira Solicitação';
  return '—';
}

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
        {value || '—'}
      </Typography>
    </Box>
  );
}

// ── Dynamic step content por categoria ───────────────────────────────
function getTherapiesContent(procedures: TerapiaProcedimento[]): React.ReactNode {
  return (
    <>
      {procedures.map((proc, idx) => (
        <Box key={proc.id} sx={{ mt: 1.5, mb: 0.5 }}>
          {procedures.length > 1 && (
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
          <ReviewRow label="Data da Solicitação" value={proc.dataSolicitacao} />
          <ReviewRow label="Validade da Senha" value={proc.dataValidadeSenha} />
          <ReviewRow label="Frequência Semanal" value={proc.frequenciaSemanal} />
        </Box>
      ))}
    </>
  );
}

function getDynamicSectionContent(
  form: FormData,
  procedures: TerapiaProcedimento[],
): React.ReactNode {
  if (form.category === 'Terapias Especiais') return getTherapiesContent(procedures);
  if (form.category === 'SADT') {
    return (
      <>
        {form.sadtProcedimentos.map((proc, index) => (
          <Box key={proc.id} sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, fontSize: 12 }}>
              Procedimento {index + 1}
            </Typography>
            <ReviewRow label="Código TUSS" value={proc.codigoTUSS} />
            <ReviewRow label="Tipo" value={proc.tipo} />
            <ReviewRow label="Quantidade" value={proc.quantidade} />
            <ReviewRow label="Frequência" value={proc.frequencia} />
          </Box>
        ))}
      </>
    );
  }
  if (form.category === 'Exames Alta Complexidade') {
    return (
      <>
        {form.examsProcedimentos.map((proc, index) => (
          <Box key={proc.id} sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, fontSize: 12 }}>
              Procedimento {index + 1}
            </Typography>
            <ReviewRow label="Código TUSS" value={proc.codigoTUSS} />
            <ReviewRow label="Região anatômica" value={proc.regiaoAnatomica} />
            <ReviewRow label="Hipótese diagnóstica" value={proc.hipoteseDiagnostica} />
            <ReviewRow label="Exames anteriores" value={proc.historicoExamesAnteriores} />
          </Box>
        ))}
      </>
    );
  }
  if (form.category === 'Home Care') {
    return (
      <>
        {form.homeCareProcedimentos.map((proc, index) => (
          <Box key={proc.id} sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, fontSize: 12 }}>
              Plano {index + 1}
            </Typography>
            <ReviewRow label="Tipo" value={proc.tipo} />
            <ReviewRow label="Frequência" value={proc.frequencia} />
            <ReviewRow label="Duração (dias)" value={proc.duracaoDias} />
            <ReviewRow label="Escala de cuidadores" value={proc.escalaCuidadores} />
            <ReviewRow label="Equipamentos / materiais" value={proc.equipamentos} />
          </Box>
        ))}
      </>
    );
  }
  if (form.category === 'Urgência/Emergência') {
    return (
      <>
        {form.urgencyProcedimentos.map((proc, index) => (
          <Box key={proc.id} sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, fontSize: 12 }}>
              Atendimento {index + 1}
            </Typography>
            <ReviewRow label="Classificação de Risco" value={proc.classificacaoRisco} />
            <ReviewRow label="Tipo de Atendimento" value={proc.tipo} />
            <ReviewRow label="Código TUSS" value={proc.codigoTUSS} />
            <ReviewRow label="Quantidade" value={proc.quantidade} />
            <ReviewRow label="Justificativa clínica" value={proc.justificativaClinica} />
          </Box>
        ))}
      </>
    );
  }
  if (form.category === 'Oncologia') {
    return (
      <>
        <ReviewRow label="Estadiamento (TNM)" value={form.estadiamentoTNM} />
        <ReviewRow label="Nº do Ciclo" value={form.numeroCiclo} />
        <ReviewRow label="Protocolo Quimioterápico" value={form.protocoloQuimio} />
        <ReviewRow label="Tipo de Tratamento" value={form.tipoTratamento} />
        <ReviewRow label="Número de Ciclos Totais" value={form.totalCiclos} />
        {form.oncologyProcedimentos.map((proc, index) => (
          <Box key={proc.id} sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1, fontSize: 12 }}>
              Procedimento {index + 1}
            </Typography>
            <ReviewRow label="Código TUSS" value={proc.codigoTUSS} />
            <ReviewRow label="Descrição" value={proc.descricaoTUSS} />
            <ReviewRow label="Quantidade" value={proc.quantidade} />
          </Box>
        ))}
      </>
    );
  }
  if (form.category === 'Internação') return getInternacaoContent(form);
  if (form.category === 'Cirurgias Eletivas') return getCirurgiasContent(form);
  return null;
}

const HOSPITALIZATION_TIPO_LABEL: Record<string, string> = {
  clinica_eletiva: 'Clínica Eletiva',
  semi_eletiva: 'Semi-Eletiva',
  domiciliar_alta_complexidade: 'Domiciliar Alta Complexidade',
};

const SURGERY_TIPO_LABEL: Record<string, string> = {
  geral_eletiva: 'Geral Eletiva',
  ortopedica_programada: 'Ortopédica Programada',
  oftalmologica: 'Oftalmológica',
  plastica_reparadora: 'Plástica Reparadora',
  oncologica_eletiva: 'Oncológica Eletiva',
};

const AUDIT_LEVEL_LABEL: Record<string, string> = {
  AMBULATORIAL: 'Ambulatorial',
  HOSPITALAR: 'Hospitalar',
  UTI: 'UTI',
};

function getInternacaoContent(form: FormData): React.ReactNode {
  return (
    <>
      <ReviewRow
        label="Tipo de Internação"
        value={HOSPITALIZATION_TIPO_LABEL[form.hospitalizationTipo] ?? ''}
      />
      <ReviewRow
        label="Nível de Auditoria"
        value={AUDIT_LEVEL_LABEL[form.hospitalizationAuditLevel] ?? ''}
      />
      <ReviewRow label="Data Prevista" value={form.hospitalizationDataPrevista} />
      <ReviewRow
        label="Duração estimada"
        value={form.hospitalizationDuracao ? `${form.hospitalizationDuracao} diária(s)` : ''}
      />
      {form.hospitalizationAuditLevel === 'UTI' ? (
        <ReviewRow label="Justificativa UTI" value={form.hospitalizationUtiJustificativa} />
      ) : null}
      {form.hospitalizationProcedimentos.map((proc, idx) => (
        <Box key={proc.id} sx={{ mt: 2 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1, fontSize: 12 }}>
            Procedimento {idx + 1}
          </Typography>
          <ReviewRow label="Código TUSS" value={proc.codigoTUSS} />
          <ReviewRow label="Descrição" value={proc.descricaoTUSS} />
          <ReviewRow label="CID" value={proc.cid} />
          <ReviewRow label="Quantidade" value={proc.qtd} />
        </Box>
      ))}
      {form.hospitalizationTaxas.length > 0 ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1, fontSize: 12 }}>
            Taxas hospitalares ({form.hospitalizationTaxas.length})
          </Typography>
          {form.hospitalizationTaxas.map((t, idx) => (
            <ReviewRow
              key={t.id}
              label={`${String(idx + 1)}. ${t.code || '(sem código)'}`}
              value={`${t.description} × ${t.quantity} (R$ ${t.estimatedValue})`}
            />
          ))}
        </Box>
      ) : null}
    </>
  );
}

function getCirurgiasContent(form: FormData): React.ReactNode {
  return (
    <>
      <ReviewRow label="Tipo de Cirurgia" value={SURGERY_TIPO_LABEL[form.surgeryTipo] ?? ''} />
      <ReviewRow label="Procedimento Principal (TUSS)" value={form.surgeryMainProcedureCode} />
      <ReviewRow label="Descrição" value={form.surgeryMainProcedureDescription} />
      {form.surgeryAcessorios.length > 0 ? (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5, fontSize: 12 }}>
            Acessórios ({form.surgeryAcessorios.length})
          </Typography>
          {form.surgeryAcessorios.map((a, idx) => (
            <ReviewRow
              key={a.id}
              label={`Acessório ${String(idx + 1)}`}
              value={`${a.codigoTUSS} — ${a.descricaoTUSS}`}
            />
          ))}
        </Box>
      ) : null}
      <ReviewRow label="OPME?" value={form.surgeryHasOpme ? 'Sim (M5)' : 'Não'} />
      <ReviewRow
        label="Cirurgia Oncológica?"
        value={form.surgeryHasOncologyLink ? 'Sim (vínculo M3)' : 'Não'}
      />
      {form.surgeryHasOncologyLink ? (
        <>
          <ReviewRow label="Estadiamento (TNM)" value={form.estadiamentoTNM} />
          <ReviewRow label="Protocolo Cirúrgico" value={form.protocoloQuimio} />
        </>
      ) : null}
      <ReviewRow label="Notas" value={form.surgeryNotes} />
      {/* Reuso bloco internação para hospitalização pós-cirurgia */}
      {getInternacaoContent(form)}
      {form.preOpItens.length > 0 ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5, fontSize: 12 }}>
            Pré-Operatório ({form.preOpItens.length})
          </Typography>
          {form.preOpItens.map((item) => (
            <ReviewRow
              key={item.id}
              label={`${item.required ? '★ ' : ''}${item.description}`}
              value={`${item.status}${item.date ? ` em ${item.date}` : ''}`}
            />
          ))}
        </Box>
      ) : null}
    </>
  );
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
      <Typography
        variant="body2"
        fontWeight={700}
        sx={{ mb: 1, fontSize: 13, color: 'primary.main' }}
      >
        Documentos Anexados
        {total > 0 ? ` (${String(totalEnv)} de ${String(total)} obrigatórios)` : ''}
      </Typography>
      <Alert severity="info" sx={{ mb: 1.5, fontSize: 12 }}>
        Os documentos anexados serão analisados pela IA após o envio para leitura. Documentos que
        não foram enviados ficarão em pendência
        {pendentes.length > 0 ? (
          <>
            : <strong>{pendentes.map((d) => d.nome).join(', ')}</strong>
          </>
        ) : (
          '.'
        )}
      </Alert>
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
              <CheckCircleOutlineIcon sx={{ fontSize: 15, color: 'success.main', flexShrink: 0 }} />
            ) : (
              <WarningAmberIcon sx={{ fontSize: 15, color: 'warning.light', flexShrink: 0 }} />
            )}
            <Typography variant="caption" sx={{ flex: 1, fontSize: 12 }}>
              {d.nome}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: 11,
                color: d.status === 'enviado' ? '#15803d' : 'warning.main',
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
            <CheckCircleOutlineIcon sx={{ fontSize: 15, color: 'success.main', flexShrink: 0 }} />
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
  const dynamicTitle = form.category ? SECTION_TITLE_BY_CATEGORY[form.category] : '';
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5, fontSize: 15 }}>
        Revisão da Solicitação
      </Typography>
      {!form.cidPrincipal ? (
        <Alert severity="error" sx={{ mb: 2, fontSize: 12, borderRadius: 2 }}>
          CID Principal é obrigatório. Volte à etapa &quot;Clínico&quot; e preencha o CID.
        </Alert>
      ) : null}
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
        <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: 18 }} />
        <Typography variant="body2" sx={{ fontSize: 13, color: '#15803d', fontWeight: 500 }}>
          Revise as informações antes de enviar. Após o envio a solicitação entrará na fila de
          análise.
        </Typography>
      </Box>
      {/* Beneficiário */}
      <Typography
        variant="body2"
        fontWeight={700}
        sx={{ mb: 1, fontSize: 13, color: 'primary.main' }}
      >
        Dados do Beneficiário
      </Typography>
      <Box sx={{ mb: 3 }}>
        <ReviewRow label="Categoria" value={form.category} />
        <ReviewRow label="Nome" value={form.nomeBeneficiario} />
        <ReviewRow label="Carteirinha" value={form.carteirinha} />
        <ReviewRow label="Data de Nascimento" value={form.dataNascimento} />
        <ReviewRow label="CPF" value={form.cpf} />
        <ReviewRow label="Operadora / Plano" value={form.operadora} />
        <ReviewRow label="Validade da Carteirinha" value={form.validadeCarteirinha} />
      </Box>
      {/* Dados Clínicos */}
      <Typography
        variant="body2"
        fontWeight={700}
        sx={{ mb: 1, fontSize: 13, color: 'primary.main' }}
      >
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
                    color: 'info.main',
                    fontWeight: 700,
                    fontSize: 11,
                    height: 20,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
        <ReviewRow label="Profissional Solicitante" value={form.profissionalSolicitante} />
        <ReviewRow
          label="Conselho"
          value={`${form.conselhoTipo} ${form.conselhoNumero}/${form.conselhoUF}`}
        />
        <ReviewRow label="Indicação Clínica" value={form.indicacaoClinica} />
      </Box>
      {/* Categoria-specific summary */}
      {form.category ? (
        <>
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{ mb: 1, fontSize: 13, color: 'primary.main' }}
          >
            {dynamicTitle}
          </Typography>
          <Box sx={{ mb: 3 }}>
            <ReviewRow label="Etapa da Autorização" value={etapaLabel(form.etapaAutorizacao)} />
            {getDynamicSectionContent(form, terapiaProcedimentos)}
          </Box>
        </>
      ) : null}

      {/* Documentos Anexados */}
      <DocumentsReviewSection docsObrigatorios={docsObrigatorios} docsAdicionais={docsAdicionais} />
    </Box>
  );
}
