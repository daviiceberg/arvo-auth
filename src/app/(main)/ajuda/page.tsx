'use client';
import { useState } from 'react';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const faqs = [
  {
    question: 'Como funciona o bloqueio de solicitações durante a análise?',
    answer:
      'Ao abrir um pedido para análise, o sistema registra que você está com ele em análise, evitando conflito com outros autorizadores. Finalize ou saia da tela para liberar o pedido para a fila novamente.',
  },
  {
    question: 'O que significa a prioridade visual dos pedidos?',
    answer:
      'Os pontos coloridos na coluna de prioridade indicam urgência: vermelho (alta), amarelo (média) e verde (baixa). Pedidos com SLA violado ou em risco são automaticamente elevados à prioridade máxima independentemente da categoria.',
  },
  {
    question: 'Como funciona o SLA regulatório da ANS?',
    answer:
      'O sistema monitora automaticamente os prazos da ANS para cada solicitação. Os status são: "No prazo" (verde), "Atenção" (amarelo — menos de 30% do prazo restante) e "Violado" (vermelho). Pedidos com SLA próximo do fim ou vencido aparecem em destaque na fila.',
  },
  {
    question: 'O que é a sugestão de decisão da IA?',
    answer:
      'O sistema de IA analisa cada solicitação considerando o histórico do beneficiário, cobertura contratual, documentação anexada e protocolos clínicos do Rol da ANS. A sugestão (Aprovar ou Negar) é informativa — a decisão final é do autorizador. Em casos em que todas as validações administrativas passam 100%, a IA pode aprovar ou negar autonomamente, e o autorizador é notificado para auditoria.',
  },
  {
    question: 'Posso discordar da sugestão da IA?',
    answer:
      'Sim. Você pode tomar qualquer decisão independentemente da sugestão da IA. Quando há divergência, o sistema registra o motivo para fins de auditoria e melhoria contínua do modelo. Esse registro é consultável na tela de Histórico.',
  },
  {
    question: 'Como usar os filtros da Fila Operacional?',
    answer:
      'A Fila Operacional tem filtros por Categoria, Situação de SLA, Prestador e Sugestão da IA, além de busca por ID, nome do beneficiário ou carteirinha. Use o botão "Limpar" para redefinir todos os filtros de uma vez.',
  },
  {
    question: 'O que significam as abas da Fila Operacional?',
    answer:
      '"Fila Geral" exibe todos os pedidos ativos. "SLA em Risco" filtra pedidos com prazo próximo do vencimento. "SLA Violado" filtra pedidos com prazo já vencido.',
  },
  {
    question: 'O que é a tela de Histórico?',
    answer:
      'O Histórico exibe todos os pedidos já processados — tanto decisões automáticas da IA quanto decisões dos autorizadores. Você pode filtrar por origem da decisão, ação tomada e categoria. Divergências entre IA e autorizador ficam destacadas para revisão.',
  },
  {
    question: 'As decisões ficam registradas e são auditáveis?',
    answer:
      'Sim. Todas as decisões são gravadas com data/hora, usuário responsável, motivo estruturado e eventual divergência com a IA. Esses registros são imutáveis e consultáveis na tela de Histórico. Gestores e auditores têm acesso completo ao log.',
  },
  {
    question: 'Quais são os perfis de usuário e suas permissões?',
    answer:
      'Existem três perfis: Gestor (acesso total, incluindo cadastro de usuários e configurações), Autorizador (análise e decisão de pedidos) e Auditor (visualização de relatórios e histórico, sem poder decisório). As permissões podem ser ajustadas individualmente por gestor na tela de Usuários.',
  },
  {
    question: 'Como acessar os Links Úteis (Rol ANS, ANVISA, TISS)?',
    answer:
      'A seção "Links Úteis" fica na parte inferior da barra lateral esquerda e contém acesso direto ao Rol de Procedimentos da ANS, Consulta de Medicamentos da ANVISA, Árvore de Códigos TUSS e ao Padrão TISS 2026. Todos os links abrem em nova aba.',
  },
];

const TIPO_OPTIONS = ['Bug', 'Sugestão', 'Dúvida', 'Performance', 'Outro'];
const MAX_DESC = 1000;
const MAX_ASSUNTO = 100;

export default function AjudaPage() {
  const [expanded, setExpanded] = useState<string | false>(false);

  // Form state
  const [tipo, setTipo] = useState('');
  const [emailContato, setEmailContato] = useState('');
  const [assunto, setAssunto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleAccordion = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTipo('');
      setEmailContato('');
      setAssunto('');
      setDescricao('');
    }, 3000);
  };

  const handleLimpar = () => {
    setTipo('');
    setEmailContato('');
    setAssunto('');
    setDescricao('');
  };

  const isFormValid = tipo.trim() !== '' && assunto.trim() !== '' && descricao.trim() !== '';

  return (
    <Box sx={{ p: 3, maxWidth: 820, mx: 'auto' }}>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            backgroundColor: 'rgba(144,43,41,0.08)',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HelpOutlineIcon sx={{ fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ fontSize: 22, lineHeight: 1.2 }}>
            Central de Ajuda
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            Tire suas dúvidas e encontre respostas sobre o sistema
          </Typography>
        </Box>
      </Box>

      {/* Card 1 — FAQ */}
      <Card sx={{ mb: 3, mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body1" fontWeight={700} sx={{ fontSize: 15, mb: 2 }}>
            Perguntas Frequentes
          </Typography>
          {faqs.map((faq, i) => (
            <Accordion
              key={i}
              expanded={expanded === `faq-${String(i)}`}
              onChange={handleAccordion(`faq-${String(i)}`)}
              disableGutters
              elevation={0}
              sx={{
                border: 'none',
                borderTop: i > 0 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                '&:before': { display: 'none' },
                backgroundColor: 'transparent',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
                sx={{
                  px: 0,
                  minHeight: 48,
                  '& .MuiAccordionSummary-content': { my: 1 },
                }}
              >
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13.5 }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0, pt: 0, pb: 1.5 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: 13, lineHeight: 1.65 }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>

      {/* Card 2 — Relatar Problema ou Sugestão */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body1" fontWeight={700} sx={{ fontSize: 15, mb: 0.5 }}>
            Relatar Problema ou Sugestão
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mb: 2.5 }}>
            Nossa equipe analisará sua mensagem e responderá em até 24 horas úteis.
          </Typography>

          {submitted ? (
            <Box
              sx={{
                py: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 52, color: 'success.main' }} />
              <Typography variant="body1" fontWeight={700} sx={{ fontSize: 16 }}>
                Mensagem enviada!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                Obrigado pelo seu contato. Retornaremos em breve.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2.5,
                }}
              >
                <FormControl size="small" fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    label="Tipo"
                    value={tipo}
                    onChange={(e) => {
                      setTipo(e.target.value);
                    }}
                  >
                    {TIPO_OPTIONS.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="E-mail para contato (opcional)"
                  value={emailContato}
                  onChange={(e) => {
                    setEmailContato(e.target.value);
                  }}
                  size="small"
                  fullWidth
                  type="email"
                />
              </Box>

              <TextField
                label="Assunto"
                value={assunto}
                onChange={(e) => {
                  setAssunto(e.target.value.slice(0, MAX_ASSUNTO));
                }}
                size="small"
                fullWidth
                helperText={`${String(assunto.length)}/${String(MAX_ASSUNTO)} caracteres`}
                slotProps={{ formHelperText: { sx: { textAlign: 'right' } } }}
              />

              <TextField
                label="Descrição"
                value={descricao}
                onChange={(e) => {
                  setDescricao(e.target.value.slice(0, MAX_DESC));
                }}
                size="small"
                fullWidth
                multiline
                minRows={4}
                helperText={`${String(descricao.length)}/${String(MAX_DESC)} caracteres`}
                slotProps={{ formHelperText: { sx: { textAlign: 'right' } } }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                <Button
                  variant="outlined"
                  startIcon={<RestartAltIcon sx={{ fontSize: 17 }} />}
                  onClick={handleLimpar}
                  sx={{ fontWeight: 600 }}
                >
                  Limpar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SendOutlinedIcon sx={{ fontSize: 17 }} />}
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  sx={{ fontWeight: 600, px: 2.5 }}
                >
                  Enviar
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Info box */}
      <Box
        sx={{
          backgroundColor: 'rgba(37,99,235,0.06)',
          border: '1px solid rgba(37,99,235,0.2)',
          borderRadius: 2,
          p: 2,
          display: 'flex',
          gap: 1.5,
        }}
      >
        <InfoOutlinedIcon sx={{ color: '#2563eb', fontSize: 20, flexShrink: 0, mt: 0.25 }} />
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ color: '#1d4ed8', mb: 0.5 }}>
            Precisa de ajuda imediata?
          </Typography>
          <Typography variant="body2" sx={{ color: '#1e40af', fontSize: 13 }}>
            Para questões urgentes relacionadas à análise de solicitações, entre em contato com sua
            coordenação ou gestor imediato. Para dúvidas técnicas sobre o sistema, utilize o
            formulário acima — nossa equipe retornará em até 24 horas úteis.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
