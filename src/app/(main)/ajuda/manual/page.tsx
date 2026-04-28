'use client';

import Link from 'next/link';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const SECTIONS = [
  { id: 'visao-geral', title: '1. O que o sistema faz por você' },
  { id: 'fila', title: '2. Lendo a Fila Operacional' },
  { id: 'analise', title: '3. Analisando um pedido' },
  { id: 'ia', title: '4. Entendendo a Análise da IA' },
  { id: 'decisao', title: '5. Tomando a decisão' },
  { id: 'historico', title: '6. Consultando o Histórico' },
  { id: 'atalhos', title: '7. Atalhos de teclado úteis' },
] as const;

const SHORTCUTS = [
  ['← →  /  J K', 'Navegar entre guias'],
  ['A', 'Aprovar guia'],
  ['N', 'Negar guia'],
  ['?', 'Abrir Central de Ajuda'],
] as const;

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <Typography
      id={id}
      variant="h6"
      sx={{ fontSize: 17, fontWeight: 700, mb: 1.5, scrollMarginTop: 80 }}
    >
      {children}
    </Typography>
  );
}

function SectionCard({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <SectionTitle id={id}>{title}</SectionTitle>
        {children}
      </CardContent>
    </Card>
  );
}

function FlowDiagram() {
  const steps = [
    'Recebimento',
    'IA processa',
    'Fila Operacional',
    'Análise',
    'Decisão',
    'Histórico',
  ];
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        gap: 0.75,
        mt: 3,
        mb: 2.5,
        overflowX: 'auto',
      }}
    >
      {steps.map((label, i) => (
        <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
          <Box
            sx={{
              px: 1.25,
              py: 0.75,
              minHeight: 36,
              borderRadius: 1.5,
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              color: '#374151',
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </Box>
          {i < steps.length - 1 ? (
            <Box component="span" sx={{ color: '#9ca3af', fontSize: 14, lineHeight: 1 }}>
              →
            </Box>
          ) : null}
        </Box>
      ))}
    </Box>
  );
}

function QueueDiagram() {
  return (
    <svg
      viewBox="0 0 600 200"
      style={{ width: '100%', maxWidth: 600, marginTop: 8, marginBottom: 8 }}
    >
      <rect x={0} y={0} width={600} height={40} fill="#f3f4f6" />
      <text x={20} y={25} fontSize="12" fontWeight={600} fill="#374151">
        ID
      </text>
      <text x={100} y={25} fontSize="12" fontWeight={600} fill="#374151">
        Beneficiário
      </text>
      <text x={280} y={25} fontSize="12" fontWeight={600} fill="#374151">
        SLA
      </text>
      <text x={380} y={25} fontSize="12" fontWeight={600} fill="#374151">
        Sugestão IA
      </text>

      <rect x={0} y={40} width={600} height={50} fill="#fef2f2" stroke="#902B29" strokeWidth={1} />
      <text x={20} y={70} fontSize="11" fill="#374151">
        REQ-04797
      </text>
      <text x={100} y={70} fontSize="11" fill="#374151">
        Ana Paula F.
      </text>
      <circle cx={290} cy={65} r={5} fill="#dc2626" />
      <text x={305} y={70} fontSize="11" fill="#dc2626">
        Violado
      </text>
      <rect x={380} y={55} width={70} height={20} rx={10} fill="#fee2e2" />
      <text x={415} y={69} fontSize="10" fill="#991b1b" textAnchor="middle">
        Negar
      </text>

      <rect x={0} y={90} width={600} height={50} fill="#ffffff" stroke="#e5e7eb" strokeWidth={1} />
      <text x={20} y={120} fontSize="11" fill="#374151">
        REQ-04812
      </text>
      <text x={100} y={120} fontSize="11" fill="#374151">
        João Pedro A.
      </text>
      <circle cx={290} cy={115} r={5} fill="#f59e0b" />
      <text x={305} y={120} fontSize="11" fill="#92400e">
        Atenção
      </text>
      <rect x={380} y={105} width={70} height={20} rx={10} fill="#dcfce7" />
      <text x={415} y={119} fontSize="10" fill="#166534" textAnchor="middle">
        Aprovar
      </text>

      <rect x={0} y={140} width={600} height={50} fill="#ffffff" stroke="#e5e7eb" strokeWidth={1} />
      <text x={20} y={170} fontSize="11" fill="#374151">
        REQ-04825
      </text>
      <text x={100} y={170} fontSize="11" fill="#374151">
        Pedro Henrique S.
      </text>
      <circle cx={290} cy={165} r={5} fill="#16a34a" />
      <text x={305} y={170} fontSize="11" fill="#166534">
        No prazo
      </text>
      <rect x={380} y={155} width={70} height={20} rx={10} fill="#dcfce7" />
      <text x={415} y={169} fontSize="10" fill="#166534" textAnchor="middle">
        Aprovar
      </text>
    </svg>
  );
}

function AnalysisLayoutDiagram() {
  return (
    <svg
      viewBox="0 0 700 240"
      style={{ width: '100%', maxWidth: 700, marginTop: 8, marginBottom: 8 }}
    >
      <rect x={0} y={0} width={420} height={70} rx={6} fill="#f9fafb" stroke="#e5e7eb" />
      <text x={16} y={24} fontSize="12" fontWeight={600} fill="#374151">
        Beneficiário
      </text>
      <text x={16} y={44} fontSize="11" fill="#6b7280">
        Nome · CPF · Plano · Carência
      </text>
      <text x={16} y={60} fontSize="11" fill="#6b7280">
        CID principal F84.0
      </text>

      <rect x={0} y={80} width={420} height={70} rx={6} fill="#f9fafb" stroke="#e5e7eb" />
      <text x={16} y={104} fontSize="12" fontWeight={600} fill="#374151">
        Procedimentos
      </text>
      <text x={16} y={124} fontSize="11" fill="#6b7280">
        TUSS · qtd. solicitada · CID
      </text>
      <text x={16} y={140} fontSize="11" fill="#6b7280">
        Sessões / frequência / data
      </text>

      <rect x={0} y={160} width={420} height={70} rx={6} fill="#f9fafb" stroke="#e5e7eb" />
      <text x={16} y={184} fontSize="12" fontWeight={600} fill="#374151">
        Documentos
      </text>
      <text x={16} y={204} fontSize="11" fill="#6b7280">
        Pedido médico · Laudo · Plano terapêutico
      </text>
      <text x={16} y={220} fontSize="11" fill="#6b7280">
        Status: enviado / pendente
      </text>

      <rect x={440} y={0} width={260} height={140} rx={6} fill="#fef2f2" stroke="#902B29" />
      <text x={456} y={24} fontSize="12" fontWeight={600} fill="#902B29">
        Análise da IA
      </text>
      <text x={456} y={48} fontSize="11" fill="#6b7280">
        Ponto de vista + checklist
      </text>
      <text x={456} y={68} fontSize="11" fill="#16a34a">
        ✓ CRM validado
      </text>
      <text x={456} y={84} fontSize="11" fill="#16a34a">
        ✓ Laudo em vigência
      </text>
      <text x={456} y={100} fontSize="11" fill="#dc2626">
        ✗ Quantidade acima protocolo
      </text>
      <text x={456} y={120} fontSize="11" fill="#6b7280">
        Ver todas (15)
      </text>

      <rect x={440} y={150} width={260} height={80} rx={6} fill="#f9fafb" stroke="#e5e7eb" />
      <text x={456} y={174} fontSize="12" fontWeight={600} fill="#374151">
        Decisão do Analista
      </text>
      <rect x={456} y={188} width={100} height={26} rx={4} fill="#dcfce7" />
      <text x={506} y={205} fontSize="11" fill="#166534" textAnchor="middle">
        Aprovar
      </text>
      <rect x={566} y={188} width={100} height={26} rx={4} fill="#fee2e2" />
      <text x={616} y={205} fontSize="11" fill="#991b1b" textAnchor="middle">
        Negar
      </text>
    </svg>
  );
}

function IAChecklistDiagram() {
  return (
    <svg
      viewBox="0 0 600 280"
      style={{ width: '100%', maxWidth: 600, marginTop: 8, marginBottom: 8 }}
    >
      <rect x={0} y={0} width={600} height={280} rx={6} fill="#f9fafb" stroke="#e5e7eb" />

      <rect x={16} y={16} width={568} height={48} rx={4} fill="#dcfce7" stroke="#16a34a" />
      <text x={28} y={36} fontSize="12" fontWeight={700} fill="#166534">
        Ponto de Vista da IA — Critérios atendidos
      </text>
      <text x={28} y={54} fontSize="11" fill="#374151">
        Documentação completa, beneficiário elegível, RN 539/2022 aplicável.
      </text>

      <rect x={16} y={76} width={568} height={32} rx={4} fill="#dbeafe" stroke="#2563eb" />
      <text x={28} y={96} fontSize="11" fontWeight={600} fill="#1e40af">
        RN 539/2022 — sessões ilimitadas para CID F84.x
      </text>

      <text x={16} y={132} fontSize="12" fontWeight={700} fill="#374151">
        Checklist (6 de 15 itens)
      </text>

      <circle cx={28} cy={148} r={6} fill="#16a34a" />
      <text x={42} y={152} fontSize="11" fill="#374151">
        Diagnóstico CID F84.0 confirmado por laudo
      </text>

      <circle cx={28} cy={172} r={6} fill="#16a34a" />
      <text x={42} y={176} fontSize="11" fill="#374151">
        Laudo neuropsicológico em vigência (&lt;12 meses)
      </text>

      <circle cx={28} cy={196} r={6} fill="#16a34a" />
      <text x={42} y={200} fontSize="11" fill="#374151">
        CRM médico validado no CFM
      </text>

      <circle cx={28} cy={220} r={6} fill="#dc2626" />
      <text x={42} y={224} fontSize="11" fill="#374151">
        Quantidade solicitada acima do protocolo
      </text>

      <circle cx={28} cy={244} r={6} fill="#f59e0b" />
      <text x={42} y={248} fontSize="11" fill="#374151">
        Alta utilização: 84 sessões no mês
      </text>

      <text x={16} y={272} fontSize="11" fontWeight={600} fill="#902B29">
        Ver todas as 15 análises →
      </text>
    </svg>
  );
}

function DecisionPanelDiagram() {
  return (
    <svg
      viewBox="0 0 600 230"
      style={{ width: '100%', maxWidth: 600, marginTop: 8, marginBottom: 8 }}
    >
      <rect x={0} y={0} width={290} height={150} rx={6} fill="#f9fafb" stroke="#e5e7eb" />
      <text x={16} y={28} fontSize="12" fontWeight={700} fill="#374151">
        TUSS 50000470
      </text>
      <text x={16} y={48} fontSize="11" fill="#6b7280">
        Sessão ABA · 60 sessões
      </text>
      <rect x={16} y={64} width={120} height={28} rx={4} fill="#dcfce7" stroke="#16a34a" />
      <text x={76} y={82} fontSize="11" fill="#166534" fontWeight={600} textAnchor="middle">
        Aprovar
      </text>
      <rect x={150} y={64} width={120} height={28} rx={4} fill="#ffffff" stroke="#e5e7eb" />
      <text x={210} y={82} fontSize="11" fill="#6b7280" textAnchor="middle">
        Negar
      </text>
      <text x={16} y={120} fontSize="11" fill="#16a34a" fontWeight={600}>
        ✓ Decisão registrada
      </text>

      <rect x={310} y={0} width={290} height={150} rx={6} fill="#f9fafb" stroke="#e5e7eb" />
      <text x={326} y={28} fontSize="12" fontWeight={700} fill="#374151">
        TUSS 50000370
      </text>
      <text x={326} y={48} fontSize="11" fill="#6b7280">
        Sessão Fonoaudiologia · 12 sessões
      </text>
      <rect x={326} y={64} width={120} height={28} rx={4} fill="#ffffff" stroke="#e5e7eb" />
      <text x={386} y={82} fontSize="11" fill="#6b7280" textAnchor="middle">
        Aprovar
      </text>
      <rect x={460} y={64} width={120} height={28} rx={4} fill="#ffffff" stroke="#e5e7eb" />
      <text x={520} y={82} fontSize="11" fill="#6b7280" textAnchor="middle">
        Negar
      </text>
      <text x={326} y={120} fontSize="11" fill="#9ca3af">
        Aguardando decisão
      </text>

      <rect x={170} y={180} width={260} height={40} rx={6} fill="#902B29" />
      <text x={300} y={205} fontSize="13" fontWeight={700} fill="#ffffff" textAnchor="middle">
        Confirmar Decisão
      </text>
    </svg>
  );
}

function HistoryDiagram() {
  return (
    <svg
      viewBox="0 0 600 200"
      style={{ width: '100%', maxWidth: 600, marginTop: 8, marginBottom: 8 }}
    >
      <rect x={0} y={0} width={600} height={40} fill="#f3f4f6" />
      <text x={20} y={25} fontSize="12" fontWeight={600} fill="#374151">
        ID
      </text>
      <text x={100} y={25} fontSize="12" fontWeight={600} fill="#374151">
        Beneficiário
      </text>
      <text x={280} y={25} fontSize="12" fontWeight={600} fill="#374151">
        Decisão
      </text>
      <text x={400} y={25} fontSize="12" fontWeight={600} fill="#374151">
        Origem
      </text>
      <text x={500} y={25} fontSize="12" fontWeight={600} fill="#374151">
        Data
      </text>

      {[
        {
          y: 40,
          id: 'HIS-04797',
          name: 'Ana Paula F.',
          dec: 'Aprovado',
          decBg: '#dcfce7',
          decColor: '#166534',
          org: 'Analista',
        },
        {
          y: 90,
          id: 'HIS-04795',
          name: 'João Pedro A.',
          dec: 'Negado',
          decBg: '#fee2e2',
          decColor: '#991b1b',
          org: 'IA',
        },
        {
          y: 140,
          id: 'HIS-04790',
          name: 'Pedro Henrique S.',
          dec: 'Aprovado',
          decBg: '#dcfce7',
          decColor: '#166534',
          org: 'Analista',
        },
      ].map((row) => (
        <g key={row.id}>
          <rect x={0} y={row.y} width={600} height={50} fill="#ffffff" stroke="#e5e7eb" />
          <text x={20} y={row.y + 30} fontSize="11" fill="#374151">
            {row.id}
          </text>
          <text x={100} y={row.y + 30} fontSize="11" fill="#374151">
            {row.name}
          </text>
          <rect x={280} y={row.y + 15} width={80} height={20} rx={10} fill={row.decBg} />
          <text x={320} y={row.y + 29} fontSize="10" fill={row.decColor} textAnchor="middle">
            {row.dec}
          </text>
          <text x={400} y={row.y + 30} fontSize="11" fill="#6b7280">
            {row.org}
          </text>
          <text x={500} y={row.y + 30} fontSize="11" fill="#6b7280">
            28/Abr/2026
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function ManualPage() {
  return (
    <Box sx={{ maxWidth: 'md', mx: 'auto', p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Link href="/ajuda" style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              color: 'text.secondary',
              fontSize: 13,
              '&:hover': { color: 'primary.main' },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 14 }} />
            Voltar para Ajuda
          </Box>
        </Link>
      </Box>

      <Typography variant="caption" sx={{ fontSize: 12, color: 'text.disabled' }}>
        Ajuda › Manual do Autorizador
      </Typography>
      <Typography variant="h4" sx={{ fontSize: 28, fontWeight: 800, mt: 0.5 }}>
        Manual do Autorizador
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 14, color: 'text.secondary', mb: 3 }}>
        Guia rápido para usar o Arvo Auth no seu dia a dia
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Typography
            variant="caption"
            sx={{
              textTransform: 'uppercase',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: 'text.secondary',
            }}
          >
            Sumário
          </Typography>
          <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{ color: '#902B29', fontSize: 14, textDecoration: 'none' }}
              >
                {s.title}
              </a>
            ))}
          </Box>
        </CardContent>
      </Card>

      <SectionCard id="visao-geral" title="1. O que o sistema faz por você">
        <Typography variant="body2" sx={{ fontSize: 14, lineHeight: 1.7, mb: 1 }}>
          O Arvo Auth recebe pedidos de autorização médica de várias fontes (portal do prestador,
          e-mail, WhatsApp), processa automaticamente com IA e organiza em uma fila priorizada para
          sua análise. A IA extrai dados dos documentos, valida elegibilidade, checa compatibilidade
          do procedimento e prepara um parecer com sugestão de decisão — você revisa, ajusta o que
          precisar e decide.
        </Typography>
        <FlowDiagram />
        <Box component="ul" sx={{ pl: 2.5, mt: 1.5, color: 'text.secondary', fontSize: 13 }}>
          <li>Pedidos chegam de qualquer canal e entram na mesma fila unificada.</li>
          <li>
            A IA cuida da parte administrativa repetitiva (CRM, CNES, Rol, DUT) para você focar na
            decisão clínica.
          </li>
          <li>
            Em casos administrativamente claros, a IA pode aprovar autonomamente — você é
            notificado.
          </li>
        </Box>
      </SectionCard>

      <SectionCard id="fila" title="2. Lendo a Fila Operacional">
        <Typography variant="body2" sx={{ fontSize: 14, lineHeight: 1.7, mb: 1 }}>
          A Fila Operacional mostra todos os pedidos prontos para análise, ordenados por SLA. Cada
          linha tem cor por status do prazo: verde (no prazo), amarelo (atenção — menos de 48h
          restantes), vermelho (violado). Use os filtros de Categoria, Prestador e Sugestão da IA
          para encontrar pedidos rapidamente.
        </Typography>
        <QueueDiagram />
        <Alert severity="info" sx={{ mt: 1.5, fontSize: 13 }}>
          Dica: clicar em &quot;Analisar&quot; na linha do pedido leva direto para a tela de
          análise.
        </Alert>
      </SectionCard>

      <SectionCard id="analise" title="3. Analisando um pedido">
        <Typography variant="body2" sx={{ fontSize: 14, lineHeight: 1.7, mb: 1 }}>
          Ao abrir um pedido, a tela é dividida em duas colunas. À esquerda, você vê todos os dados
          do pedido — beneficiário, procedimentos, sessões, documentos anexados, sinais de atenção.
          À direita, fica a Análise da IA (parecer + checklist) e o painel de Decisão. Tudo o que a
          IA inferiu é mostrado, mas a decisão final é sempre sua.
        </Typography>
        <AnalysisLayoutDiagram />
      </SectionCard>

      <SectionCard id="ia" title="4. Entendendo a Análise da IA">
        <Typography variant="body2" sx={{ fontSize: 14, lineHeight: 1.7, mb: 1 }}>
          O card &quot;Análise da IA&quot; resume o que o sistema concluiu sobre o pedido. No topo,
          o <strong>Ponto de Vista da IA</strong> com a justificativa em texto livre. Abaixo, um{' '}
          <strong>checklist</strong> com até 6 análises ranqueadas por importância. Cada item tem um
          chip de origem: IA (extração), DADOS (consulta a base) ou ENG (catálogo do produto). O
          link &quot;Ver todas&quot; abre um modal com todas as N análises rodadas, agrupadas por
          categoria.
        </Typography>
        <IAChecklistDiagram />
        <Alert severity="info" sx={{ mt: 1.5, fontSize: 13 }}>
          Itens em vermelho são bloqueios; em amarelo são alertas; em verde, validações que
          passaram. Se está em verde, a IA já checou — você não precisa rever manualmente.
        </Alert>
      </SectionCard>

      <SectionCard id="decisao" title="5. Tomando a decisão">
        <Typography variant="body2" sx={{ fontSize: 14, lineHeight: 1.7, mb: 1 }}>
          Cada procedimento do pedido tem um painel próprio com botões &quot;Aprovar&quot; e
          &quot;Negar&quot;. Você pode decidir cada um separadamente. Após escolher para todos os
          procedimentos, clique em &quot;Confirmar Decisão&quot; para registrar. Se discordar da
          sugestão da IA, o sistema pede um motivo estruturado — útil para auditoria e para melhorar
          o modelo.
        </Typography>
        <DecisionPanelDiagram />
        <Box component="ul" sx={{ pl: 2.5, mt: 1.5, color: 'text.secondary', fontSize: 13 }}>
          <li>Decisões são imutáveis após confirmadas.</li>
          <li>
            Atalhos <strong>A</strong> (aprovar) e <strong>N</strong> (negar) funcionam quando o
            foco está no painel de decisão.
          </li>
        </Box>
      </SectionCard>

      <SectionCard id="historico" title="6. Consultando o Histórico">
        <Typography variant="body2" sx={{ fontSize: 14, lineHeight: 1.7, mb: 1 }}>
          O Histórico exibe todos os pedidos já decididos — tanto pela IA autonomamente quanto por
          você ou outros analistas. Filtre por origem da decisão (IA / Analista), ação (Aprovado /
          Negado), categoria e período. Útil para auditoria e para revisar decisões passadas do
          mesmo beneficiário.
        </Typography>
        <HistoryDiagram />
      </SectionCard>

      <SectionCard id="atalhos" title="7. Atalhos de teclado úteis">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
          {SHORTCUTS.map(([key, label]) => (
            <Box
              key={key}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 0.5,
              }}
            >
              <Typography variant="body2" sx={{ fontSize: 13, color: 'text.secondary' }}>
                {label}
              </Typography>
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  backgroundColor: 'rgba(0,0,0,0.07)',
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'text.secondary',
                }}
              >
                {key}
              </Box>
            </Box>
          ))}
        </Box>
      </SectionCard>
    </Box>
  );
}
