'use client';

import Link from 'next/link';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const RESOURCES = [
  {
    title: 'Rol de Procedimentos da ANS',
    description:
      'Lista oficial de procedimentos de cobertura obrigatória, atualizada semestralmente pela ANS. Inclui todos os anexos do Rol vigente.',
    url: 'https://www.gov.br/ans/pt-br/acesso-a-informacao/participacao-da-sociedade/atualizacao-do-rol-de-procedimentos',
    cta: 'Acessar no portal ANS',
  },
  {
    title: 'Diretrizes de Utilização (DUT) — Anexo II',
    description:
      'Critérios baseados em evidências científicas para cobertura obrigatória de procedimentos específicos do Rol. Define quem é elegível para cada procedimento listado.',
    url: 'https://bvsms.saude.gov.br/bvs/saudelegis/ans/2021/res0465_02_03_2021.html',
    cta: 'Consultar Anexo II (RN 465/2021)',
  },
  {
    title: 'Diretrizes Clínicas (DC) — Anexo III',
    description:
      'Guias de melhor prática clínica para procedimentos do Rol, baseados em evidências científicas. Orientam o manejo, não os critérios de cobertura.',
    url: 'https://bvsms.saude.gov.br/bvs/saudelegis/ans/2021/res0465_02_03_2021.html',
    cta: 'Consultar Anexo III (RN 465/2021)',
  },
  {
    title: 'Padrão TISS — Troca de Informações em Saúde Suplementar',
    description:
      'Padronização obrigatória do conteúdo das transações entre operadoras e prestadores. Define códigos, formatos e fluxos de autorização.',
    url: 'https://www.gov.br/ans/pt-br/assuntos/prestadores/padrao-para-troca-de-informacao-de-saude-suplementar-tiss',
    cta: 'Acessar padrão TISS',
  },
  {
    title: 'IN 40 — Rol Exemplificativo',
    description:
      'Instrução Normativa que regulamenta a Lei 14.454/2022, sobre cobertura de procedimentos não listados no Rol em casos específicos.',
    url: 'https://www.gov.br/ans/pt-br',
    cta: 'Consultar regulamentação',
  },
] as const;

export default function DutsProtocolosPage() {
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
        Ajuda › DUTs e Protocolos ANS
      </Typography>
      <Typography variant="h4" sx={{ fontSize: 28, fontWeight: 800, mt: 0.5 }}>
        DUTs e Protocolos ANS
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 14, color: 'text.secondary', mb: 3 }}>
        Recursos oficiais da ANS para consulta de coberturas e diretrizes regulatórias
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Typography variant="body2" sx={{ fontSize: 14, lineHeight: 1.7 }}>
            <strong>DUT (Diretriz de Utilização)</strong> é um conjunto de critérios definidos pela
            ANS, baseados em evidências científicas, que estabelecem em quais casos um procedimento
            do Rol deve ter cobertura obrigatória. Por exemplo: a DUT 105 define os critérios para
            Análise Comportamental Aplicada (ABA) em pacientes com TEA. O Rol da ANS é organizado em
            quatro anexos — Anexo I (lista de procedimentos), Anexo II (DUTs), Anexo III (Diretrizes
            Clínicas), Anexo IV (Protocolos de Utilização).
          </Typography>
        </CardContent>
      </Card>

      <Alert severity="warning" sx={{ mb: 3, fontSize: 13 }}>
        <strong>Conteúdo regulatório atualizado periodicamente.</strong> O Rol da ANS é revisto
        semestralmente. Os links abaixo apontam sempre para as versões oficiais publicadas pela ANS
        — confira a vigência da norma antes de usar como base de decisão.
      </Alert>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2.5,
        }}
      >
        {RESOURCES.map((r) => (
          <Card
            key={r.title}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              transition: 'border-color 0.15s',
              '&:hover': { borderColor: 'primary.main' },
            }}
          >
            <CardContent
              sx={{
                p: 2.5,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                '&:last-child': { pb: 2.5 },
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 1 }}>{r.title}</Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.6, mb: 2 }}
                >
                  {r.description}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                fullWidth
                endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ fontSize: 13, fontWeight: 600 }}
              >
                {r.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
