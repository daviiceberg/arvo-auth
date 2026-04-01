export type StatusGuia = 'Em Análise' | 'Aprovado' | 'Negado' | 'Aprovado Parcial' | 'Pendente' | 'Devolutiva'
export type SubStatus =
  | 'PENDENTE_AGUARDANDO'
  | 'PENDENTE_RETORNO_RECEBIDO'
  | 'JUNTA_AGUARDANDO'
  | 'JUNTA_PARECER_RECEBIDO'
export type TipoGuia = 'Eleitiva' | 'Urgente' | 'Emergência'
export type OrigemPedido = 'app' | 'whatsapp' | 'email' | 'prestador'
export type NivelAuditoria = 'AMBULATORIAL' | 'HOSPITALAR' | 'UTI'
export type SLAStatus = 'ok' | 'warning' | 'violated'
export type IASugestao = 'Aprovar' | 'Negar' | 'Junta Médica'
export type Categoria =
  | 'Internação'
  | 'Urgência/Emergência'
  | 'Oncologia'
  | 'Terapias Especiais'
  | 'OPME'
  | 'Exames Alta Complexidade'
  | 'Cirurgias Eletivas'
  | 'Home Care'
  | 'SADT'

export type Procedimento = {
  codigo: string
  tuss: string
  descricao: string
  qty: number
  qtyAutorizada?: number
  dataInicio: string
  dataFim: string
  cid: string
  nivelAud: NivelAuditoria
}

export interface Ajuste {
  id: string
  procedimentoCodigo: string
  procedimentoDescricao: string
  campo: 'quantidade' | 'prestador' | 'codigo'
  valorAnterior: string
  valorNovo: string
  motivo: string
  fundamentacao?: string
  operador: string
  perfil: string
  timestamp: string
}

export type Pedido = {
  id: string
  status: StatusGuia
  tipoGuia: TipoGuia
  categoria: Categoria
  nivelAuditoria: NivelAuditoria
  prioridade: 'alta' | 'media' | 'baixa'
  dataProtocolo: string
  tempoFila: string
  slaStatus: SLAStatus
  slaTexto: string
  beneficiario: {
    nome: string
    carteirinha: string
    cpf: string
    dataNascimento: string
    idade: number
    sexo: 'M' | 'F'
    plano: string
    carencia: boolean
  }
  prestador: {
    hospital: string
    medico: string
    crm: string
    especialidade: string
  }
  origem: OrigemPedido
  procedimentos: Procedimento[]
  alertas: string[]
  iaSugestao: IASugestao
  iaJustificativa: string
  iaChecklist: { texto: string; status: 'ok' | 'warning' | 'error' }[]
  observacoes: string
  documentos: Documento[]
  pendenciaMotivos?: string[]
  pendenciaResponsavel?: string
  pendenciaData?: string
  subStatus?: SubStatus
  juntaParecer?: string
  juntaRecomendacao?: 'Aprovar' | 'Negar'
  etapaAutorizacao?: 'primeira_solicitacao' | 'continuidade'
  ajustes?: Ajuste[]
}

export interface Documento {
  id: string
  nome: string
  tipo: string
  tamanho?: string
  enviadoEm?: string
  obrigatorio: boolean
  status: 'enviado' | 'pendente'
}

export const pedidos: Pedido[] = [
  {
    id: 'REQ-2026-04797',
    status: 'Em Análise',
    tipoGuia: 'Urgente',
    categoria: 'Terapias Especiais',
    nivelAuditoria: 'AMBULATORIAL',
    prioridade: 'alta',
    origem: 'prestador',
    dataProtocolo: '24/03/2026 14:30',
    tempoFila: '8 horas',
    slaStatus: 'violated',
    slaTexto: 'VIOLADO',
    beneficiario: {
      nome: 'Ana Paula Ferreira',
      carteirinha: '0034978900023007',
      cpf: '432.109.876-21',
      dataNascimento: '15/04/2018',
      idade: 8,
      sexo: 'F',
      plano: 'Premium Familiar',
      carencia: false,
    },
    prestador: {
      hospital: 'Clínica Integrar TEA',
      medico: 'Dra. Camila Rodrigues',
      crm: '87654-SP',
      especialidade: 'Neuropsicologia Infantil',
    },
    procedimentos: [
      {
        codigo: '50000470',
        tuss: '50000470',
        descricao: 'Sessão de Terapia ABA — Análise Comportamental Aplicada',
        qty: 20,
        qtyAutorizada: 20,
        dataInicio: '01/04/2026',
        dataFim: '30/04/2026',
        cid: 'F84.0',
        nivelAud: 'AMBULATORIAL',
      },
      {
        codigo: '50000370',
        tuss: '50000370',
        descricao: 'Sessão de Fonoaudiologia',
        qty: 8,
        qtyAutorizada: 8,
        dataInicio: '01/04/2026',
        dataFim: '30/04/2026',
        cid: 'F80.1',
        nivelAud: 'AMBULATORIAL',
      },
    ],
    alertas: ['Liminar Judicial', 'High-User'],
    iaSugestao: 'Aprovar',
    iaJustificativa:
      'Beneficiária possui diagnóstico confirmado de TEA (F84.0) com laudo neuropsicológico datado de 10/01/2026. O histórico de 12 meses indica resposta terapêutica positiva. A frequência solicitada está dentro do protocolo EIBI para casos moderados. Existe liminar judicial ativa — autorização mandatória conforme decisão do processo nº 0012345-67.2025.8.26.',
    iaChecklist: [
      { texto: 'Diagnóstico CID-10 F84.0 confirmado por laudo', status: 'ok' },
      { texto: 'Laudo neuropsicológico em vigência', status: 'ok' },
      { texto: 'Frequência dentro do protocolo EIBI', status: 'ok' },
      { texto: 'Liminar judicial ativa — autorização mandatória', status: 'warning' },
      { texto: 'Alta utilização identificada nos últimos 30 dias', status: 'warning' },
      { texto: 'CRM médico validado', status: 'ok' },
    ],
    observacoes: 'Criança com TEA grau 2. Pais solicitam manutenção do protocolo intensivo conforme recomendação do neuropediatra. Liminar em vigor desde janeiro/2026.',
    documentos: [
      { id: 'DOC-001', nome: 'Laudo-Neuropsicologico-2026.pdf', tipo: 'Laudo Médico', tamanho: '2.1 MB', enviadoEm: '10/01/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-002', nome: 'Liminar-Judicial-0012345.pdf', tipo: 'Documento Jurídico', tamanho: '340 KB', enviadoEm: '15/01/2026', obrigatorio: false, status: 'enviado' },
      { id: 'DOC-003', nome: 'Pedido-Medico-ABA.pdf', tipo: 'Pedido Médico', tamanho: '180 KB', enviadoEm: '20/03/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-004', nome: 'Relatorio-Evolucao-Q1-2026.pdf', tipo: 'Relatório de Evolução', tamanho: '890 KB', enviadoEm: '22/03/2026', obrigatorio: true, status: 'enviado' },
    ],
    etapaAutorizacao: 'continuidade',
  },
  {
    id: 'REQ-2026-04801',
    status: 'Em Análise',
    tipoGuia: 'Urgente',
    categoria: 'Oncologia',
    nivelAuditoria: 'HOSPITALAR',
    prioridade: 'alta',
    origem: 'prestador',
    dataProtocolo: '24/03/2026 09:15',
    tempoFila: '12 horas',
    slaStatus: 'warning',
    slaTexto: '1h restante',
    beneficiario: {
      nome: 'Roberto Alves Santos',
      carteirinha: '0098123400067002',
      cpf: '123.456.789-00',
      dataNascimento: '03/07/1968',
      idade: 57,
      sexo: 'M',
      plano: 'Premium Familiar',
      carencia: false,
    },
    prestador: {
      hospital: 'Hospital Sírio-Libanês SP',
      medico: 'Dr. Marcos Andrade',
      crm: '34521-SP',
      especialidade: 'Oncologia Clínica',
    },
    procedimentos: [
      {
        codigo: '90020040',
        tuss: '90020040',
        descricao: 'Quimioterapia Endovenosa — Protocolo FOLFOX',
        qty: 1,
        qtyAutorizada: undefined,
        dataInicio: '26/03/2026',
        dataFim: '26/03/2026',
        cid: 'C18.9',
        nivelAud: 'HOSPITALAR',
      },
      {
        codigo: '90020092',
        tuss: '90020092',
        descricao: 'Oxaliplatina 85mg/m² EV',
        qty: 1,
        qtyAutorizada: undefined,
        dataInicio: '26/03/2026',
        dataFim: '26/03/2026',
        cid: 'C18.9',
        nivelAud: 'HOSPITALAR',
      },
    ],
    alertas: ['Liminar Judicial', 'NIP Ativa', 'Fora do Rol ANS'],
    iaSugestao: 'Junta Médica',
    iaJustificativa:
      'Protocolo FOLFOX indicado para adenocarcinoma de cólon estágio III. O medicamento oxaliplatina está fora do rol ANS para esta indicação específica. Existe NIP ativa e liminar judicial solicitando cobertura. A complexidade clínica e jurídica recomenda avaliação por junta médica antes da decisão.',
    iaChecklist: [
      { texto: 'Protocolo oncológico reconhecido pela ASCO', status: 'ok' },
      { texto: 'CID C18.9 compatível com indicação clínica', status: 'ok' },
      { texto: 'Oxaliplatina fora do rol ANS para indicação', status: 'error' },
      { texto: 'NIP Ativa — verificar notificação', status: 'error' },
      { texto: 'Liminar judicial ativa', status: 'warning' },
      { texto: 'Laudo oncológico completo anexado', status: 'ok' },
    ],
    observacoes: 'Paciente em 4º ciclo de quimioterapia adjuvante. NIP aberta em fevereiro/2026 por uso off-label. Advogado responsável: Dr. Paulo Mendes (OAB/SP 123456).',
    documentos: [
      { id: 'DOC-011', nome: 'Laudo-Oncologico-Completo.pdf', tipo: 'Laudo Médico', tamanho: '3.8 MB', enviadoEm: '15/03/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-012', nome: 'Protocolo-FOLFOX-ASCO.pdf', tipo: 'Protocolo Clínico', tamanho: '780 KB', enviadoEm: '01/01/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-013', nome: 'NIP-2026-0234.pdf', tipo: 'Notificação', tamanho: '210 KB', enviadoEm: '10/02/2026', obrigatorio: false, status: 'enviado' },
      { id: 'DOC-014', nome: 'Liminar-Judicial-0098765.pdf', tipo: 'Documento Jurídico', tamanho: '340 KB', enviadoEm: '20/02/2026', obrigatorio: false, status: 'enviado' },
    ],
    subStatus: 'JUNTA_PARECER_RECEBIDO',
    juntaParecer: 'Após análise coletiva realizada em 28/03/2026, a Junta Médica recomenda aprovação do protocolo FOLFOX para adenocarcinoma de cólon estágio III (C18.9). O uso off-label de Oxaliplatina é respaldado pela diretriz ASCO 2024 e pelo histórico de resposta terapêutica documentado. Condições: monitorização quinzenal da função renal e hepática, avaliação de toxicidade ao 2º ciclo. A liminar judicial em vigor corrobora a indicação. Responsável pelo parecer: Dr. Henrique Mello — Oncologista Sênior (CRM 11234-SP).',
    juntaRecomendacao: 'Aprovar',
  },
  {
    id: 'REQ-2026-04812',
    status: 'Em Análise',
    tipoGuia: 'Eleitiva',
    categoria: 'Terapias Especiais',
    nivelAuditoria: 'AMBULATORIAL',
    prioridade: 'media',
    origem: 'app',
    dataProtocolo: '24/03/2026 10:30',
    tempoFila: '6 horas',
    slaStatus: 'ok',
    slaTexto: '6h restantes',
    beneficiario: {
      nome: 'Beatriz Lima Cardozo',
      carteirinha: '0034978900045001',
      cpf: '567.890.123-45',
      dataNascimento: '22/08/2019',
      idade: 6,
      sexo: 'F',
      plano: 'Premium Familiar',
      carencia: false,
    },
    prestador: {
      hospital: 'Clínica Integrar TEA',
      medico: 'Dra. Fernanda Souza',
      crm: '65432-SP',
      especialidade: 'Terapia Ocupacional',
    },
    procedimentos: [
      {
        codigo: '50000471',
        tuss: '50000471',
        descricao: 'Terapia ABA Intensiva — Programa de Intervenção Precoce',
        qty: 24,
        qtyAutorizada: 20,
        dataInicio: '01/04/2026',
        dataFim: '30/04/2026',
        cid: 'F84.0',
        nivelAud: 'AMBULATORIAL',
      },
    ],
    alertas: [],
    iaSugestao: 'Junta Médica',
    iaJustificativa:
      'Criança de 6 anos com diagnóstico de TEA grau 1. Laudos em ordem e dentro da validade. A quantidade solicitada (24 sessões) excede marginalmente o protocolo padrão (20 sessões). A divergência na frequência semanal requer avaliação especializada por Junta Médica antes da decisão final.',
    iaChecklist: [
      { texto: 'Diagnóstico TEA confirmado com laudo', status: 'ok' },
      { texto: 'CID F84.0 compatível com procedimento', status: 'ok' },
      { texto: 'Quantidade solicitada acima do protocolo', status: 'warning' },
      { texto: 'Histórico de resposta terapêutica positiva', status: 'ok' },
      { texto: 'Documentação completa e dentro do prazo', status: 'ok' },
    ],
    observacoes: 'Renovação trimestral. Mãe relata progresso significativo em comunicação e interação social. Médico solicita aumento de frequência para 6x/semana.',
    documentos: [
      { id: 'DOC-021', nome: 'Laudo-TEA-Pediatra.pdf', tipo: 'Laudo Médico', tamanho: '1.4 MB', enviadoEm: '05/03/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-022', nome: 'Relatorio-Progresso-Q1.pdf', tipo: 'Relatório Terapêutico', tamanho: '890 KB', enviadoEm: '18/03/2026', obrigatorio: true, status: 'enviado' },
    ],
    ajustes: [
      {
        id: 'ADJ-001',
        procedimentoCodigo: '50000471',
        procedimentoDescricao: 'Terapia ABA Intensiva — Programa de Intervenção Precoce',
        campo: 'quantidade',
        valorAnterior: '24',
        valorNovo: '20',
        motivo: 'Quantidade acima do protocolo clínico da operadora',
        operador: 'Ana Paula Santos',
        perfil: 'Autorizadora',
        timestamp: '2026-03-24T10:52:00',
      },
    ],
    subStatus: 'JUNTA_AGUARDANDO',
    etapaAutorizacao: 'continuidade',
  },
  {
    id: 'REQ-2026-04820',
    status: 'Em Análise',
    tipoGuia: 'Eleitiva',
    categoria: 'OPME',
    nivelAuditoria: 'HOSPITALAR',
    prioridade: 'alta',
    origem: 'email',
    dataProtocolo: '23/03/2026 16:00',
    tempoFila: '22 horas',
    slaStatus: 'violated',
    slaTexto: 'VIOLADO',
    beneficiario: {
      nome: 'Fernando Oliveira Cruz',
      carteirinha: '0087654300089004',
      cpf: '234.567.890-12',
      dataNascimento: '14/11/1957',
      idade: 68,
      sexo: 'M',
      plano: 'Gold',
      carencia: false,
    },
    prestador: {
      hospital: 'Hospital São Lucas',
      medico: 'Dr. Ricardo Fonseca',
      crm: '12345-SP',
      especialidade: 'Ortopedia e Traumatologia',
    },
    procedimentos: [
      {
        codigo: '81000100',
        tuss: '81000100',
        descricao: 'Sistema de Fixação Pedicular Lombar — OPME Coluna Vertebral L4-L5',
        qty: 1,
        qtyAutorizada: undefined,
        dataInicio: '05/04/2026',
        dataFim: '05/04/2026',
        cid: 'M51.1',
        nivelAud: 'HOSPITALAR',
      },
      {
        codigo: '30603010',
        tuss: '30603010',
        descricao: 'Artrodese Lombar Posterior — Cirurgia de Coluna',
        qty: 1,
        qtyAutorizada: undefined,
        dataInicio: '05/04/2026',
        dataFim: '05/04/2026',
        cid: 'M51.1',
        nivelAud: 'HOSPITALAR',
      },
    ],
    alertas: ['High-User', 'Prestador Não Credenciado'],
    iaSugestao: 'Junta Médica',
    iaJustificativa:
      'Paciente com espondilolistese grau II L4-L5 com falha conservadora de 6 meses documentada. O implante solicitado (marca XYZ Titanium) possui valor 43% acima da tabela OPME vigente. Prestador com credenciamento suspenso desde 01/02/2026. Alta utilização com 3 procedimentos de alta complexidade nos últimos 12 meses. Recomenda-se junta médica para avaliação do implante e verificação do credenciamento.',
    iaChecklist: [
      { texto: 'CID M51.1 compatível com indicação cirúrgica', status: 'ok' },
      { texto: 'Falha conservadora documentada por 6 meses', status: 'ok' },
      { texto: 'Valor do implante acima da tabela OPME', status: 'error' },
      { texto: 'Prestador com credenciamento suspenso', status: 'error' },
      { texto: 'Alta utilização nos últimos 12 meses', status: 'warning' },
      { texto: 'Relatório de imagem (RNM) anexado', status: 'ok' },
      { texto: 'Cotação de fornecedores pendente (exigência OPME)', status: 'warning' },
    ],
    observacoes: 'Paciente refere dor incapacitante VAS 8/10. Fisioterapia realizada por 8 meses sem melhora. RNM de 10/02/2026 confirma herniação. Conferir situação do credenciamento do hospital antes de liberar.',
    documentos: [
      { id: 'DOC-031', nome: 'RNM-Coluna-Lombar-2026.pdf', tipo: 'Exame de Imagem', tamanho: '12.4 MB', enviadoEm: '10/02/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-032', nome: 'Relatorio-Fisioterapia.pdf', tipo: 'Relatório Clínico', tamanho: '420 KB', enviadoEm: '01/03/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-033', nome: 'Orcamento-OPME-XYZ.pdf', tipo: 'Orçamento / Cotação', tamanho: '890 KB', enviadoEm: '15/03/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-PENDENTE-001', nome: 'Cotação de Fornecedores (3 cópias)', tipo: 'Orçamento / Cotação', tamanho: undefined, enviadoEm: undefined, obrigatorio: true, status: 'pendente' },
    ],
    ajustes: [
      {
        id: 'ADJ-002',
        procedimentoCodigo: '81000100',
        procedimentoDescricao: 'Sistema de Fixação Pedicular Lombar — OPME Coluna Vertebral L4-L5',
        campo: 'prestador',
        valorAnterior: 'Hospital São Lucas',
        valorNovo: 'Hospital Universitário Regional',
        motivo: 'Prestador não credenciado para este procedimento',
        operador: 'Ana Paula Santos',
        perfil: 'Autorizadora',
        timestamp: '2026-03-23T14:30:00',
      },
    ],
  },
  {
    id: 'REQ-2026-04831',
    status: 'Devolutiva',
    tipoGuia: 'Eleitiva',
    categoria: 'Terapias Especiais',
    nivelAuditoria: 'AMBULATORIAL',
    prioridade: 'media',
    origem: 'whatsapp',
    dataProtocolo: '24/03/2026 11:45',
    tempoFila: '5 horas',
    slaStatus: 'warning',
    slaTexto: '3h restantes',
    beneficiario: {
      nome: 'Gabriel Henrique Mota',
      carteirinha: '0034978900056003',
      cpf: '678.901.234-56',
      dataNascimento: '10/06/2016',
      idade: 9,
      sexo: 'M',
      plano: 'Premium Familiar',
      carencia: false,
    },
    prestador: {
      hospital: 'Centro de Terapias Vida',
      medico: 'Dr. João Paulo Ferreira',
      crm: '43210-SP',
      especialidade: 'Psiquiatria Infantojuvenil',
    },
    procedimentos: [
      {
        codigo: '50000472',
        tuss: '50000472',
        descricao: 'Sessão ABA — Manutenção e Generalização de Habilidades',
        qty: 16,
        qtyAutorizada: undefined,
        dataInicio: '01/04/2026',
        dataFim: '30/04/2026',
        cid: 'F84.5',
        nivelAud: 'AMBULATORIAL',
      },
    ],
    alertas: ['High-User'],
    iaSugestao: 'Aprovar',
    iaJustificativa:
      'Paciente com Síndrome de Asperger (F84.5) em manutenção terapêutica. A solicitação retornou em devolutiva por ausência do relatório de progresso atualizado. O histórico clínico é favorável e a quantidade está dentro do protocolo. Pendência documental: relatório do terapeuta referente ao trimestre anterior.',
    iaChecklist: [
      { texto: 'Diagnóstico F84.5 compatível com ABA', status: 'ok' },
      { texto: 'Relatório de progresso do trimestre anterior ausente', status: 'error' },
      { texto: 'Quantidade solicitada dentro do protocolo', status: 'ok' },
      { texto: 'Alta utilização identificada (flag preventivo)', status: 'warning' },
      { texto: 'CRM e especialidade do médico validados', status: 'ok' },
    ],
    observacoes: 'Devolvido em 20/03/2026 por falta do relatório de progresso Q4/2025. Família foi notificada por e-mail e tem prazo até 27/03/2026 para envio.',
    documentos: [
      { id: 'DOC-041', nome: 'Pedido-Medico-ABA-Manutencao.pdf', tipo: 'Pedido Médico', tamanho: '165 KB', enviadoEm: '18/03/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-042', nome: 'Laudo-Psiquiatra-Infantil.pdf', tipo: 'Laudo Médico', tamanho: '1.1 MB', enviadoEm: '01/02/2026', obrigatorio: true, status: 'enviado' },
    ],
    etapaAutorizacao: 'continuidade',
    pendenciaMotivos: [
      'Relatório de progresso do terapeuta (Q4/2025) ausente',
      'Carta de encaminhamento médica sem assinatura reconhecida',
    ],
    pendenciaResponsavel: 'Carlos Eduardo Ramos',
    pendenciaData: '20/03/2026',
    subStatus: 'PENDENTE_AGUARDANDO',
  },
  {
    id: 'REQ-2026-04843',
    status: 'Em Análise',
    tipoGuia: 'Eleitiva',
    categoria: 'Exames Alta Complexidade',
    nivelAuditoria: 'AMBULATORIAL',
    prioridade: 'baixa',
    origem: 'app',
    dataProtocolo: '24/03/2026 15:00',
    tempoFila: '2 horas',
    slaStatus: 'ok',
    slaTexto: '8h restantes',
    beneficiario: {
      nome: 'Camila Torres Braga',
      carteirinha: '0056789100034005',
      cpf: '345.678.901-23',
      dataNascimento: '07/03/1997',
      idade: 29,
      sexo: 'F',
      plano: 'Premium',
      carencia: false,
    },
    prestador: {
      hospital: 'Lab Diagnostium',
      medico: 'Dr. Paulo Henrique Ramos',
      crm: '21098-SP',
      especialidade: 'Neurorradiologia',
    },
    procedimentos: [
      {
        codigo: '40901010',
        tuss: '40901010',
        descricao: 'Ressonância Magnética de Crânio com e sem Contraste',
        qty: 1,
        qtyAutorizada: 1,
        dataInicio: '28/03/2026',
        dataFim: '28/03/2026',
        cid: 'G43.9',
        nivelAud: 'AMBULATORIAL',
      },
    ],
    alertas: [],
    iaSugestao: 'Aprovar',
    iaJustificativa:
      'Paciente com cefaleia crônica (G43.9 — enxaqueca) e histórico de 3 episódios de cefaleia súbita intensa nos últimos 2 meses. RNM indicada para rastreamento de lesão estrutural. Procedimento está no rol ANS, indicação clínica compatível, documentação completa. Recomenda-se aprovação imediata.',
    iaChecklist: [
      { texto: 'Procedimento constante no rol ANS', status: 'ok' },
      { texto: 'CID G43.9 compatível com indicação', status: 'ok' },
      { texto: 'Pedido médico com justificativa clínica', status: 'ok' },
      { texto: 'Sem histórico de uso recente do mesmo procedimento', status: 'ok' },
      { texto: 'Prestador credenciado e habilitado', status: 'ok' },
    ],
    observacoes: 'Solicitação de rotina. Paciente relatou episódio de cefaleia em trovão em 15/03/2026. Neurologia solicita exclusão de hemorragia subaracnóidea.',
    documentos: [
      { id: 'DOC-051', nome: 'Pedido-Medico-RNM.pdf', tipo: 'Pedido Médico', tamanho: '145 KB', enviadoEm: '22/03/2026', obrigatorio: true, status: 'enviado' },
    ],
  },
  {
    id: 'REQ-2026-04855',
    status: 'Devolutiva',
    tipoGuia: 'Eleitiva',
    categoria: 'Cirurgias Eletivas',
    nivelAuditoria: 'HOSPITALAR',
    prioridade: 'alta',
    origem: 'email',
    dataProtocolo: '22/03/2026 14:00',
    tempoFila: '48 horas',
    slaStatus: 'violated',
    slaTexto: 'VIOLADO',
    beneficiario: {
      nome: 'Paulo Henrique Vasquez',
      carteirinha: '0098765400012006',
      cpf: '456.789.012-34',
      dataNascimento: '29/01/1972',
      idade: 54,
      sexo: 'M',
      plano: 'Gold',
      carencia: false,
    },
    prestador: {
      hospital: 'Hospital São Lucas',
      medico: 'Dr. Antonio Cardoso',
      crm: '56789-SP',
      especialidade: 'Cirurgia Cardiovascular',
    },
    procedimentos: [
      {
        codigo: '30603015',
        tuss: '30603015',
        descricao: 'Revascularização do Miocárdio — Safenectomia',
        qty: 1,
        qtyAutorizada: undefined,
        dataInicio: '10/04/2026',
        dataFim: '10/04/2026',
        cid: 'I25.1',
        nivelAud: 'HOSPITALAR',
      },
    ],
    alertas: ['NIP Ativa'],
    iaSugestao: 'Negar',
    iaJustificativa:
      'Solicitação de revascularização retornou em devolutiva — exames pré-operatórios incompletos. Faltam ecocardiograma e teste ergométrico. NIP ativa por exames pré-op pendentes aberta em 18/03/2026. Sem esses documentos, a indicação cirúrgica não pode ser validada conforme protocolo institucional.',
    iaChecklist: [
      { texto: 'Indicação cirúrgica documentada', status: 'ok' },
      { texto: 'Ecocardiograma pré-operatório ausente', status: 'error' },
      { texto: 'Teste ergométrico ausente', status: 'error' },
      { texto: 'NIP aberta por documentação incompleta', status: 'error' },
      { texto: 'CID I25.1 compatível com procedimento', status: 'ok' },
      { texto: 'Anestesista designado confirmado', status: 'warning' },
    ],
    observacoes: 'NIP aberta em 18/03/2026 solicitando ecocardiograma e teste ergométrico. Prazo para resposta: 01/04/2026. Paciente tem histórico de IAM em 2019.',
    documentos: [
      { id: 'DOC-061', nome: 'Laudo-Cardiologista.pdf', tipo: 'Laudo Médico', tamanho: '920 KB', enviadoEm: '10/03/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-062', nome: 'Cinecoronariografia-2026.pdf', tipo: 'Exame de Imagem', tamanho: '8.2 MB', enviadoEm: '05/03/2026', obrigatorio: true, status: 'enviado' },
    ],
    pendenciaMotivos: [
      'Ecocardiograma pré-operatório não apresentado',
      'Teste ergométrico ausente',
      'Laudo cardiológico sem data de validade informada',
    ],
    pendenciaResponsavel: 'Juliana Costa',
    pendenciaData: '18/03/2026',
    subStatus: 'PENDENTE_RETORNO_RECEBIDO',
  },
  {
    id: 'REQ-2026-04790',
    status: 'Em Análise',
    tipoGuia: 'Urgente',
    categoria: 'Internação',
    nivelAuditoria: 'HOSPITALAR',
    prioridade: 'alta',
    origem: 'prestador',
    dataProtocolo: '24/03/2026 08:00',
    tempoFila: '10 horas',
    slaStatus: 'ok',
    slaTexto: '5h restantes',
    beneficiario: {
      nome: 'Carlos Eduardo Lima',
      carteirinha: '0012345600078007',
      cpf: '789.012.345-67',
      dataNascimento: '21/05/1984',
      idade: 41,
      sexo: 'M',
      plano: 'Gold',
      carencia: false,
    },
    prestador: {
      hospital: 'Hospital São Lucas',
      medico: 'Dr. Sergio Nunes',
      crm: '78901-SP',
      especialidade: 'Clínica Médica',
    },
    procedimentos: [
      {
        codigo: '40301010',
        tuss: '40301010',
        descricao: 'Internação em Enfermaria Clínica — Pós-operatório',
        qty: 5,
        qtyAutorizada: 5,
        dataInicio: '24/03/2026',
        dataFim: '28/03/2026',
        cid: 'J18.9',
        nivelAud: 'HOSPITALAR',
      },
    ],
    alertas: [],
    iaSugestao: 'Aprovar',
    iaJustificativa:
      'Internação para tratamento de pneumonia adquirida na comunidade (J18.9) com necessidade de antibioticoterapia EV. Paciente com SpO2 92% na admissão, indicação de internação hospitalar clara e documentada. Tempo estimado de 5 dias dentro do protocolo para pneumonia moderada (PSI score III). Recomenda-se aprovação.',
    iaChecklist: [
      { texto: 'Indicação de internação justificada (PSI score III)', status: 'ok' },
      { texto: 'CID J18.9 compatível com clínica apresentada', status: 'ok' },
      { texto: 'Tempo de internação dentro do protocolo', status: 'ok' },
      { texto: 'Gasometria e exames laboratoriais anexados', status: 'ok' },
      { texto: 'Prestador credenciado', status: 'ok' },
    ],
    observacoes: 'Paciente admitido via pronto-socorro às 06h. Hemograma com leucocitose (14.200). Raio-X com consolidação em lobo inferior direito. Iniciado Amoxicilina + Clavulanato EV.',
    documentos: [
      { id: 'DOC-071', nome: 'Boletim-Entrada-Pronto-Socorro.pdf', tipo: 'Documento Hospitalar', tamanho: '310 KB', enviadoEm: '24/03/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-072', nome: 'Raio-X-Torax.pdf', tipo: 'Exame de Imagem', tamanho: '4.1 MB', enviadoEm: '24/03/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-073', nome: 'Hemograma-Completo.pdf', tipo: 'Exame Laboratorial', tamanho: '190 KB', enviadoEm: '24/03/2026', obrigatorio: true, status: 'enviado' },
    ],
  },
  {
    id: 'REQ-2026-04795',
    status: 'Em Análise',
    tipoGuia: 'Emergência',
    categoria: 'Urgência/Emergência',
    nivelAuditoria: 'UTI',
    prioridade: 'alta',
    origem: 'prestador',
    dataProtocolo: '24/03/2026 03:22',
    tempoFila: '15 horas',
    slaStatus: 'violated',
    slaTexto: 'VIOLADO',
    beneficiario: {
      nome: 'Maria Fernanda Costa',
      carteirinha: '0056312900089008',
      cpf: '890.123.456-78',
      dataNascimento: '11/09/1989',
      idade: 36,
      sexo: 'F',
      plano: 'Premium',
      carencia: false,
    },
    prestador: {
      hospital: 'Hospital Municipal Central',
      medico: 'Dr. Rafael Mendes',
      crm: '90123-SP',
      especialidade: 'Medicina Intensiva',
    },
    procedimentos: [
      {
        codigo: '40301020',
        tuss: '40301020',
        descricao: 'Internação em UTI Adulto — Suporte Ventilatório',
        qty: 3,
        qtyAutorizada: undefined,
        dataInicio: '24/03/2026',
        dataFim: '26/03/2026',
        cid: 'J80',
        nivelAud: 'UTI',
      },
    ],
    alertas: ['NIP Ativa', 'Prestador Não Credenciado'],
    iaSugestao: 'Aprovar',
    iaJustificativa:
      'Paciente em síndrome do desconforto respiratório agudo (SDRA) com indicação de internação em UTI para suporte ventilatório invasivo. Caráter de emergência absoluta — atendimento em hospital não credenciado por ausência de leito na rede. Cobertura obrigatória conforme RN 259 ANS (emergência). NIP aberta por credenciamento. Aprovação mandatória.',
    iaChecklist: [
      { texto: 'Emergência confirmada — cobertura obrigatória ANS', status: 'ok' },
      { texto: 'CID J80 (SDRA) com indicação de UTI', status: 'ok' },
      { texto: 'Prestador não credenciado — emergência justifica', status: 'warning' },
      { texto: 'NIP ativa pelo prestador não credenciado', status: 'warning' },
      { texto: 'Relatório médico de admissão em UTI anexado', status: 'ok' },
    ],
    observacoes: 'Admissão de emergência às 03h22. Sem leito disponível na rede credenciada. Conforme RN 259, cobertura obrigatória em emergência. UTI com suporte de ventilação mecânica invasiva.',
    documentos: [
      { id: 'DOC-081', nome: 'Relatorio-Admissao-UTI.pdf', tipo: 'Documento Hospitalar', tamanho: '450 KB', enviadoEm: '24/03/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-082', nome: 'Gasometria-Arterial.pdf', tipo: 'Exame Laboratorial', tamanho: '95 KB', enviadoEm: '24/03/2026', obrigatorio: true, status: 'enviado' },
    ],
  },
  {
    id: 'REQ-2026-04870',
    status: 'Em Análise',
    tipoGuia: 'Eleitiva',
    categoria: 'Oncologia',
    nivelAuditoria: 'HOSPITALAR',
    prioridade: 'media',
    origem: 'app',
    dataProtocolo: '23/03/2026 11:00',
    tempoFila: '27 horas',
    slaStatus: 'warning',
    slaTexto: '2h restantes',
    beneficiario: {
      nome: 'Luiza Aparecida Neves',
      carteirinha: '0078901200056009',
      cpf: '901.234.567-89',
      dataNascimento: '03/04/1955',
      idade: 70,
      sexo: 'F',
      plano: 'Gold',
      carencia: false,
    },
    prestador: {
      hospital: 'Clínica Oncovida',
      medico: 'Dra. Patricia Almeida',
      crm: '11234-SP',
      especialidade: 'Oncologia Clínica',
    },
    procedimentos: [
      {
        codigo: '90020055',
        tuss: '90020055',
        descricao: 'Imunoterapia — Pembrolizumabe 200mg EV',
        qty: 1,
        qtyAutorizada: undefined,
        dataInicio: '30/03/2026',
        dataFim: '30/03/2026',
        cid: 'C50.9',
        nivelAud: 'HOSPITALAR',
      },
    ],
    alertas: ['Liminar Judicial'],
    iaSugestao: 'Aprovar',
    iaJustificativa:
      'Pembrolizumabe indicado para carcinoma de mama metastático PD-L1 positivo (CPS ≥10). Resultado do teste PD-L1 confirma elegibilidade (CPS 18). Liminar judicial ativa garantindo cobertura. Medicamento aprovado pela FDA e ANVISA para essa indicação. Recomenda-se aprovação considerando os elementos clínicos e jurídicos.',
    iaChecklist: [
      { texto: 'PD-L1 positivo CPS ≥10 confirmado em exame', status: 'ok' },
      { texto: 'Indicação aprovada FDA e ANVISA', status: 'ok' },
      { texto: 'Liminar judicial ativa garantindo cobertura', status: 'warning' },
      { texto: 'CID C50.9 compatível com indicação', status: 'ok' },
      { texto: 'Ciclo anterior documentado sem toxicidade grave', status: 'ok' },
    ],
    observacoes: 'Paciente em 6º ciclo de pembrolizumabe. Boa tolerância até o momento. Liminar obtida em outubro/2025 para cobertura do tratamento completo.',
    documentos: [
      { id: 'DOC-091', nome: 'Laudo-PD-L1-CPS18.pdf', tipo: 'Laudo Médico', tamanho: '2.6 MB', enviadoEm: '10/03/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-092', nome: 'Liminar-Pembrolizumabe.pdf', tipo: 'Documento Jurídico', tamanho: '290 KB', enviadoEm: '15/10/2025', obrigatorio: false, status: 'enviado' },
      { id: 'DOC-093', nome: 'Prescricao-Oncologica.pdf', tipo: 'Pedido Médico', tamanho: '175 KB', enviadoEm: '20/03/2026', obrigatorio: true, status: 'enviado' },
    ],
  },
  {
    id: 'REQ-2026-04882',
    status: 'Em Análise',
    tipoGuia: 'Eleitiva',
    categoria: 'Home Care',
    nivelAuditoria: 'AMBULATORIAL',
    prioridade: 'baixa',
    origem: 'whatsapp',
    dataProtocolo: '24/03/2026 13:00',
    tempoFila: '5 horas',
    slaStatus: 'ok',
    slaTexto: '7h restantes',
    beneficiario: {
      nome: 'Helena Costa Rodrigues',
      carteirinha: '0034567800023010',
      cpf: '012.345.678-90',
      dataNascimento: '30/12/1941',
      idade: 84,
      sexo: 'F',
      plano: 'Sênior',
      carencia: false,
    },
    prestador: {
      hospital: 'CuidarBem Home Care',
      medico: 'Dra. Monica Lima',
      crm: '33456-SP',
      especialidade: 'Geriatria',
    },
    procedimentos: [
      {
        codigo: '40101010',
        tuss: '40101010',
        descricao: 'Visita Domiciliar de Enfermagem — Curativo e Medicação EV',
        qty: 30,
        qtyAutorizada: 30,
        dataInicio: '01/04/2026',
        dataFim: '30/04/2026',
        cid: 'Z75.0',
        nivelAud: 'AMBULATORIAL',
      },
    ],
    alertas: [],
    iaSugestao: 'Aprovar',
    iaJustificativa:
      'Paciente idosa com mobilidade reduzida e úlcera por pressão grau II em região sacral. Home care indicado para evitar hospitalização. Alta hospitalar recente após fratura de fêmur. Protocolo de curativo domiciliar adequado. Documentação completa e dentro do prazo.',
    iaChecklist: [
      { texto: 'Alta hospitalar recente justifica home care', status: 'ok' },
      { texto: 'Indicação clínica para cuidado domiciliar', status: 'ok' },
      { texto: 'Plano de cuidados assinado por geriatra', status: 'ok' },
      { texto: 'Documentação completa e atualizada', status: 'ok' },
      { texto: 'Prestador home care credenciado', status: 'ok' },
    ],
    observacoes: 'Alta hospitalar em 20/03/2026 após fratura de fêmur. Paciente não deambula. Úlcera por pressão em sacral necessitando curativo diário. Família presente para suporte.',
    documentos: [
      { id: 'DOC-101', nome: 'Sumario-Alta-Hospitalar.pdf', tipo: 'Documento Hospitalar', tamanho: '380 KB', enviadoEm: '20/03/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-102', nome: 'Plano-Cuidados-Home-Care.pdf', tipo: 'Relatório Clínico', tamanho: '240 KB', enviadoEm: '22/03/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-103', nome: 'Prescricao-Geriatrica.pdf', tipo: 'Pedido Médico', tamanho: '155 KB', enviadoEm: '22/03/2026', obrigatorio: true, status: 'enviado' },
    ],
  },
  {
    id: 'REQ-2026-04891',
    status: 'Em Análise',
    tipoGuia: 'Eleitiva',
    categoria: 'Internação',
    nivelAuditoria: 'HOSPITALAR',
    prioridade: 'media',
    origem: 'email',
    dataProtocolo: '23/03/2026 09:30',
    tempoFila: '28 horas',
    slaStatus: 'warning',
    slaTexto: '1h restante',
    beneficiario: {
      nome: 'Juliana Pereira Mota',
      carteirinha: '0045678900034011',
      cpf: '123.890.456-70',
      dataNascimento: '17/07/1993',
      idade: 32,
      sexo: 'F',
      plano: 'Essencial',
      carencia: true,
    },
    prestador: {
      hospital: 'Maternidade Santa Cruz',
      medico: 'Dra. Viviane Torres',
      crm: '22345-SP',
      especialidade: 'Obstetrícia',
    },
    procedimentos: [
      {
        codigo: '31309046',
        tuss: '31309046',
        descricao: 'Parto Cesariano — Primeira Gestação',
        qty: 1,
        qtyAutorizada: undefined,
        dataInicio: '28/03/2026',
        dataFim: '28/03/2026',
        cid: 'O82',
        nivelAud: 'HOSPITALAR',
      },
      {
        codigo: '40301012',
        tuss: '40301012',
        descricao: 'Internação Maternidade — Leito Hospitalar (3 dias)',
        qty: 3,
        qtyAutorizada: undefined,
        dataInicio: '28/03/2026',
        dataFim: '30/03/2026',
        cid: 'O82',
        nivelAud: 'HOSPITALAR',
      },
    ],
    alertas: [],
    iaSugestao: 'Aprovar',
    iaJustificativa:
      'Parto cesariano indicado por desproporção cefalopélvica confirmada em USG pélvica. Gestação de 38 semanas com boa vitalidade fetal. A beneficiária possui carência ativa para o plano Essencial, porém parto é procedimento com cobertura obrigatória independente de carência conforme RN 162 ANS. Recomenda-se aprovação.',
    iaChecklist: [
      { texto: 'Parto isento de carência conforme RN 162 ANS', status: 'ok' },
      { texto: 'Indicação cirúrgica (DCP) documentada em USG', status: 'ok' },
      { texto: 'Gestação 38 semanas — termo confirmado', status: 'ok' },
      { texto: 'Carência ativa no plano — não se aplica a parto', status: 'warning' },
      { texto: 'Exames pré-natal completos e atualizados', status: 'ok' },
    ],
    observacoes: 'Primigesta, 38 semanas. USG de 20/03/2026 confirma DCP. Carência ativa no plano Essencial, mas parto tem cobertura obrigatória independente de carência.',
    documentos: [
      { id: 'DOC-111', nome: 'USG-Pelve-38semanas.pdf', tipo: 'Exame de Imagem', tamanho: '3.4 MB', enviadoEm: '20/03/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-112', nome: 'Cartao-Pre-Natal.pdf', tipo: 'Documento Clínico', tamanho: '520 KB', enviadoEm: '20/03/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-113', nome: 'Pedido-Internacao-Maternidade.pdf', tipo: 'Pedido Médico', tamanho: '160 KB', enviadoEm: '22/03/2026', obrigatorio: true, status: 'enviado' },
    ],
  },
  {
    id: 'REQ-2026-04905',
    status: 'Em Análise',
    tipoGuia: 'Eleitiva',
    categoria: 'OPME',
    nivelAuditoria: 'HOSPITALAR',
    prioridade: 'baixa',
    origem: 'app',
    dataProtocolo: '24/03/2026 16:30',
    tempoFila: '2 horas',
    slaStatus: 'ok',
    slaTexto: '10h restantes',
    beneficiario: {
      nome: 'Rodrigo Santana Pires',
      carteirinha: '0067890100045012',
      cpf: '234.901.567-81',
      dataNascimento: '25/02/1978',
      idade: 48,
      sexo: 'M',
      plano: 'Premium',
      carencia: false,
    },
    prestador: {
      hospital: 'Hospital São Lucas',
      medico: 'Dr. Eduardo Moreira',
      crm: '44567-SP',
      especialidade: 'Ortopedia e Traumatologia',
    },
    procedimentos: [
      {
        codigo: '81000200',
        tuss: '81000200',
        descricao: 'Prótese Total de Quadril Não Cimentada — Sistema Modular',
        qty: 1,
        qtyAutorizada: undefined,
        dataInicio: '15/04/2026',
        dataFim: '15/04/2026',
        cid: 'M16.1',
        nivelAud: 'HOSPITALAR',
      },
    ],
    alertas: [],
    iaSugestao: 'Aprovar',
    iaJustificativa:
      'Artroplastia total de quadril para osteoartrose bilateral grau IV. Falha conservadora documentada (12 meses de fisioterapia e analgesia). Valor do implante dentro da tabela OPME vigente. Prestador credenciado e com histórico de cirurgias bem-sucedidas. Indicação clínica sólida com escala de dor Oxford score 14/48.',
    iaChecklist: [
      { texto: 'Artrose grau IV confirmada em radiografia', status: 'ok' },
      { texto: 'Falha conservadora documentada por 12 meses', status: 'ok' },
      { texto: 'Valor do implante dentro da tabela OPME', status: 'ok' },
      { texto: 'Prestador credenciado', status: 'ok' },
      { texto: 'Exames pré-operatórios completos', status: 'warning' },
    ],
    observacoes: 'Paciente com coxartrose bilateral grau IV. Oxford Hip Score 14/48 (grave). Radiografia panorâmica confirmando perda articular total. Exames pré-op em andamento.',
    documentos: [
      { id: 'DOC-121', nome: 'Radiografia-Quadril-Bilateral.pdf', tipo: 'Exame de Imagem', tamanho: '5.8 MB', enviadoEm: '01/03/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-122', nome: 'Laudo-Ortopedico.pdf', tipo: 'Laudo Médico', tamanho: '780 KB', enviadoEm: '10/03/2026', obrigatorio: true, status: 'enviado' },
      { id: 'DOC-123', nome: 'Orcamento-OPME-Quadril.pdf', tipo: 'Orçamento / Cotação', tamanho: '640 KB', enviadoEm: '18/03/2026', obrigatorio: true, status: 'enviado' },
    ],
  },
  {
    id: 'REQ-2026-04868',
    status: 'Devolutiva',
    tipoGuia: 'Urgente',
    categoria: 'Oncologia',
    nivelAuditoria: 'HOSPITALAR',
    prioridade: 'alta',
    origem: 'prestador',
    dataProtocolo: '21/03/2026 09:15',
    tempoFila: '72 horas',
    slaStatus: 'violated',
    slaTexto: 'VIOLADO',
    beneficiario: {
      nome: 'Renata Souza Barros',
      carteirinha: '0045678900067009',
      cpf: '567.890.123-45',
      dataNascimento: '03/07/1978',
      idade: 47,
      sexo: 'F',
      plano: 'Premium',
      carencia: false,
    },
    prestador: {
      hospital: 'Instituto Oncológico Esperança',
      medico: 'Dr. Felipe Monteiro',
      crm: '67890-SP',
      especialidade: 'Oncologia Clínica',
    },
    procedimentos: [
      {
        codigo: '40302148',
        tuss: '40302148',
        descricao: 'Quimioterapia antineoplásica — Carboplatina + Paclitaxel (ciclo 3/6)',
        qty: 1,
        qtyAutorizada: undefined,
        dataInicio: '02/04/2026',
        dataFim: '02/04/2026',
        cid: 'C50.9',
        nivelAud: 'HOSPITALAR',
      },
    ],
    alertas: ['Alta Complexidade'],
    iaSugestao: 'Aprovar',
    iaJustificativa:
      'Paciente em protocolo de quimioterapia para carcinoma de mama (C50.9). Ciclo 3/6 — solicitação dentro do plano terapêutico aprovado. Pendência: laudo oncológico do ciclo anterior e protocolo atualizado com estadiamento não foram anexados pelo prestador.',
    iaChecklist: [
      { texto: 'CID C50.9 compatível com protocolo QT', status: 'ok' },
      { texto: 'Laudo oncológico do ciclo anterior ausente', status: 'error' },
      { texto: 'Protocolo de quimioterapia desatualizado', status: 'error' },
      { texto: 'Plano terapêutico inicial disponível no sistema', status: 'ok' },
      { texto: 'Prestador credenciado para procedimentos oncológicos', status: 'ok' },
    ],
    observacoes: 'Pendência aberta em 21/03/2026. Prestador notificado por sistema interno. Prazo de resposta: 28/03/2026. SLA violado aguardando documentação complementar.',
    documentos: [
      { id: 'DOC-131', nome: 'Pedido-Medico-QT-Ciclo3.pdf', tipo: 'Pedido Médico', tamanho: '185 KB', enviadoEm: '20/03/2026', obrigatorio: true, status: 'enviado' },
    ],
    pendenciaMotivos: [
      'Laudo oncológico do ciclo anterior (ciclo 2) não anexado',
      'Protocolo de quimioterapia desatualizado — necessário estadiamento atual',
    ],
    pendenciaResponsavel: 'Ana Paula Santos',
    pendenciaData: '21/03/2026',
  },
]

// dashboardMetrics is defined at the bottom of this file (after historicoEntries) so it can be computed from both arrays.

// ── Histórico ──────────────────────────────────────────────────────────

export type DecisaoAcao = 'Aprovado' | 'Negado' | 'Aprovado Parcial' | 'Devolutiva'
export type DecisaoOrigem = 'ia_automatica' | 'analista'

export interface JuntaMedica {
  dataReuniao: string
  numeroAta: string
  parecer: string
  membros: { nome: string; especialidade: string; crm: string }[]
}

export interface HistoricoEntry {
  id: string
  beneficiario: string
  carteirinha: string
  plano: string
  categoria: Categoria
  procedimento: string
  cid: string
  prestador: string
  medicoSolicitante: string
  tipoGuia: TipoGuia
  dataProtocolo: string
  dataDecisao: string
  acao: DecisaoAcao
  origem: DecisaoOrigem
  analista: string
  motivoDecisao: string
  textoLivre?: string
  iaSugestao: IASugestao
  divergencia: boolean
  divergenciaMotivo?: string
  tempoAnaliseMin: number
  observacoes?: string
  sexo?: 'M' | 'F'
  idade?: number
  cpf?: string
  dataNascimento?: string
  carencia?: boolean
  procedimentosDetalhados?: {
    codigo: string
    tuss: string
    descricao: string
    qty: number
    qtyAutorizada?: number
    dataInicio: string
    dataFim: string
    cid: string
    nivelAud: 'AMBULATORIAL' | 'HOSPITALAR' | 'UTI'
    decisao?: 'aprovado' | 'negado'
    motivoDecisao?: string
  }[]
  alertas?: string[]
  iaChecklist?: { texto: string; status: 'ok' | 'warning' | 'error' }[]
  documentos?: { nome: string; tipo: string; data: string }[]
  juntaMedica?: JuntaMedica
  ajustes?: Ajuste[]
}

export const historicoEntries: HistoricoEntry[] = [
  // ── IA Automática — SADT N1 simples ───────────────────────────────
  {
    id: 'HIS-2026-0041',
    beneficiario: 'Carla Mendes Teixeira',
    carteirinha: '0081234500019001',
    plano: 'Bradesco Saúde — Plano Essencial',
    categoria: 'Exames Alta Complexidade',
    procedimento: 'Hemograma completo + PCR + Glicemia em jejum',
    cid: 'R50.9 — Febre de origem inespecífica',
    prestador: 'Lab Central Diagnósticos',
    medicoSolicitante: 'Dr. Fábio Mendes — CRM/SP 88712',
    tipoGuia: 'Eleitiva',
    dataProtocolo: '23/03/2026 09:14',
    dataDecisao: '23/03/2026 09:14',
    acao: 'Aprovado',
    origem: 'ia_automatica',
    analista: 'Sistema IA',
    motivoDecisao: 'Exames de rotina com CID compatível e médico credenciado. Procedimento consta no Rol ANS vigente.',
    iaSugestao: 'Aprovar',
    divergencia: false,
    tempoAnaliseMin: 0,
    sexo: 'F',
    idade: 38,
    cpf: '812.345.001-90',
    dataNascimento: '15/07/1987',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '40301012', tuss: '40301012', descricao: 'Hemograma completo + PCR + Glicemia em jejum', qty: 1, qtyAutorizada: 1, dataInicio: '23/03/2026', dataFim: '23/03/2026', cid: 'R50.9', nivelAud: 'AMBULATORIAL' },
    ],
    alertas: [],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'ok' },
      { texto: 'Decisão alinhada com sugestão da IA', status: 'ok' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0041.pdf', tipo: 'Laudo Médico', data: '23/03/2026 09:14' },
    ],
  },
  {
    id: 'HIS-2026-0040',
    beneficiario: 'José Ricardo Alves',
    carteirinha: '0081234500031004',
    plano: 'Amil — Plano 400',
    categoria: 'Exames Alta Complexidade',
    procedimento: 'Glicemia em jejum + HbA1c + Colesterol total e frações',
    cid: 'E11.9 — Diabetes mellitus tipo 2',
    prestador: 'Clínica São Lucas',
    medicoSolicitante: 'Dra. Renata Campos — CRM/SP 45023',
    tipoGuia: 'Eleitiva',
    dataProtocolo: '23/03/2026 10:02',
    dataDecisao: '23/03/2026 10:02',
    acao: 'Aprovado',
    origem: 'ia_automatica',
    analista: 'Sistema IA',
    motivoDecisao: 'Controle metabólico periódico para paciente diabético. Indicação clínica compatível com CID. Cobertura obrigatória pela RN 465/2021.',
    iaSugestao: 'Aprovar',
    divergencia: false,
    tempoAnaliseMin: 0,
    sexo: 'M',
    idade: 58,
    cpf: '123.450.003-10',
    dataNascimento: '20/05/1967',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '40301032', tuss: '40301032', descricao: 'Glicemia em jejum + HbA1c + Colesterol total e frações', qty: 1, qtyAutorizada: 1, dataInicio: '23/03/2026', dataFim: '23/03/2026', cid: 'E11.9', nivelAud: 'AMBULATORIAL' },
    ],
    alertas: [],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'ok' },
      { texto: 'Decisão alinhada com sugestão da IA', status: 'ok' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0040.pdf', tipo: 'Laudo Médico', data: '23/03/2026 10:02' },
    ],
  },
  {
    id: 'HIS-2026-0039',
    beneficiario: 'Fernanda Lima Rodrigues',
    carteirinha: '0081234500044007',
    plano: 'Unimed — Plano Flex',
    categoria: 'Exames Alta Complexidade',
    procedimento: 'Urocultura + Antibiograma',
    cid: 'N39.0 — Infecção do trato urinário',
    prestador: 'Lab Saúde & Vida',
    medicoSolicitante: 'Dr. Marcelo Carvalho — CRM/MG 32100',
    tipoGuia: 'Urgente',
    dataProtocolo: '22/03/2026 16:45',
    dataDecisao: '22/03/2026 16:45',
    acao: 'Aprovado',
    origem: 'ia_automatica',
    analista: 'Sistema IA',
    motivoDecisao: 'Exame diagnóstico para ITU aguda. Caráter urgente justificado. Procedimento dentro do Rol ANS.',
    iaSugestao: 'Aprovar',
    divergencia: false,
    tempoAnaliseMin: 0,
    sexo: 'F',
    idade: 32,
    cpf: '812.345.004-40',
    dataNascimento: '09/11/1993',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '40308060', tuss: '40308060', descricao: 'Urocultura + Antibiograma', qty: 1, qtyAutorizada: 1, dataInicio: '22/03/2026', dataFim: '22/03/2026', cid: 'N39.0', nivelAud: 'AMBULATORIAL' },
    ],
    alertas: [],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'ok' },
      { texto: 'Decisão alinhada com sugestão da IA', status: 'ok' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0039.pdf', tipo: 'Laudo Médico', data: '22/03/2026 16:45' },
    ],
  },
  {
    id: 'HIS-2026-0038',
    beneficiario: 'Paulo Sergio Nunes',
    carteirinha: '0081234500052009',
    plano: 'SulAmérica — Plano Clássico',
    categoria: 'Exames Alta Complexidade',
    procedimento: 'TSH + T4 Livre + Anti-TPO',
    cid: 'E03.9 — Hipotireoidismo inespecífico',
    prestador: 'Diagnosi Lab',
    medicoSolicitante: 'Dra. Beatriz Souza — CRM/RJ 61004',
    tipoGuia: 'Eleitiva',
    dataProtocolo: '22/03/2026 11:30',
    dataDecisao: '22/03/2026 11:30',
    acao: 'Aprovado',
    origem: 'ia_automatica',
    analista: 'Sistema IA',
    motivoDecisao: 'Acompanhamento de hipotireoidismo. CID compatível, médico credenciado, exames dentro do Rol ANS.',
    iaSugestao: 'Aprovar',
    divergencia: false,
    tempoAnaliseMin: 0,
    sexo: 'M',
    idade: 45,
    cpf: '812.345.005-20',
    dataNascimento: '03/06/1980',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '40301104', tuss: '40301104', descricao: 'TSH + T4 Livre + Anti-TPO', qty: 1, qtyAutorizada: 1, dataInicio: '22/03/2026', dataFim: '22/03/2026', cid: 'E03.9', nivelAud: 'AMBULATORIAL' },
    ],
    alertas: [],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'ok' },
      { texto: 'Decisão alinhada com sugestão da IA', status: 'ok' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0038.pdf', tipo: 'Laudo Médico', data: '22/03/2026 11:30' },
    ],
  },
  {
    id: 'HIS-2026-0037',
    beneficiario: 'Mariana Costa Braga',
    carteirinha: '0081234500063012',
    plano: 'Bradesco Saúde — Plano Top',
    categoria: 'Exames Alta Complexidade',
    procedimento: 'Raio-X de tórax PA e perfil',
    cid: 'J06.9 — Infecção aguda das vias aéreas superiores',
    prestador: 'Centro Radiológico Ipanema',
    medicoSolicitante: 'Dr. André Lima — CRM/RJ 77540',
    tipoGuia: 'Eleitiva',
    dataProtocolo: '21/03/2026 08:55',
    dataDecisao: '21/03/2026 08:55',
    acao: 'Aprovado',
    origem: 'ia_automatica',
    analista: 'Sistema IA',
    motivoDecisao: 'Exame de imagem rotineiro com CID compatível. Primeira solicitação do período. Cobertura obrigatória.',
    iaSugestao: 'Aprovar',
    divergencia: false,
    tempoAnaliseMin: 0,
    sexo: 'F',
    idade: 29,
    cpf: '812.345.006-30',
    dataNascimento: '22/09/1996',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '40901016', tuss: '40901016', descricao: 'Raio-X de tórax PA e perfil', qty: 1, qtyAutorizada: 1, dataInicio: '21/03/2026', dataFim: '21/03/2026', cid: 'J06.9', nivelAud: 'AMBULATORIAL' },
    ],
    alertas: [],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'ok' },
      { texto: 'Decisão alinhada com sugestão da IA', status: 'ok' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0037.pdf', tipo: 'Laudo Médico', data: '21/03/2026 08:55' },
    ],
  },
  {
    id: 'HIS-2026-0036',
    beneficiario: 'Roberto Figueiredo',
    carteirinha: '0081234500071015',
    plano: 'Hapvida — Plano Nacional',
    categoria: 'Exames Alta Complexidade',
    procedimento: 'Perfil lipídico completo (LDL, HDL, TG, colesterol total)',
    cid: 'E78.5 — Hiperlipidemia mista',
    prestador: 'LabVida',
    medicoSolicitante: 'Dra. Cláudia Pinheiro — CRM/SP 53318',
    tipoGuia: 'Eleitiva',
    dataProtocolo: '21/03/2026 14:10',
    dataDecisao: '21/03/2026 14:10',
    acao: 'Negado',
    origem: 'ia_automatica',
    analista: 'Sistema IA',
    motivoDecisao: 'Exame realizado há 22 dias — intervalo mínimo de 30 dias não atingido. Solicitação de repetição não justificada clinicamente.',
    iaSugestao: 'Negar',
    divergencia: false,
    tempoAnaliseMin: 0,
    sexo: 'M',
    idade: 52,
    cpf: '812.345.007-10',
    dataNascimento: '14/02/1974',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '40302605', tuss: '40302605', descricao: 'Perfil lipídico completo (LDL, HDL, TG, colesterol total)', qty: 1, dataInicio: '21/03/2026', dataFim: '21/03/2026', cid: 'E78.5', nivelAud: 'AMBULATORIAL' },
    ],
    alertas: [],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'error' },
      { texto: 'Decisão alinhada com sugestão da IA', status: 'ok' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0036.pdf', tipo: 'Laudo Médico', data: '21/03/2026 14:10' },
    ],
  },
  {
    id: 'HIS-2026-0035',
    beneficiario: 'Luciana Martins Pereira',
    carteirinha: '0081234500089017',
    plano: 'Amil — Plano 500',
    categoria: 'Terapias Especiais',
    procedimento: 'Fisioterapia respiratória — 10 sessões',
    cid: 'J45.9 — Asma não especificada',
    prestador: 'Clínica Fisiomed',
    medicoSolicitante: 'Dr. Eduardo Torres — CRM/SP 40219',
    tipoGuia: 'Eleitiva',
    dataProtocolo: '20/03/2026 09:00',
    dataDecisao: '20/03/2026 09:00',
    acao: 'Aprovado',
    origem: 'ia_automatica',
    analista: 'Sistema IA',
    motivoDecisao: 'Fisioterapia respiratória indicada para asma. Número de sessões dentro do limite do protocolo clínico. CID e prestador credenciado.',
    iaSugestao: 'Aprovar',
    divergencia: false,
    tempoAnaliseMin: 0,
    sexo: 'F',
    idade: 41,
    cpf: '812.345.008-97',
    dataNascimento: '17/08/1984',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '50000470', tuss: '50000470', descricao: 'Fisioterapia respiratória — 10 sessões', qty: 10, qtyAutorizada: 10, dataInicio: '20/03/2026', dataFim: '20/03/2026', cid: 'J45.9', nivelAud: 'AMBULATORIAL' },
    ],
    alertas: [],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'ok' },
      { texto: 'Decisão alinhada com sugestão da IA', status: 'ok' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0035.pdf', tipo: 'Laudo Médico', data: '20/03/2026 09:00' },
    ],
  },
  {
    id: 'HIS-2026-0034',
    beneficiario: 'Gabriel Henrique Oliveira',
    carteirinha: '0081234500097020',
    plano: 'NotreDame Intermédica — Plano Silver',
    categoria: 'Terapias Especiais',
    procedimento: 'Terapia Ocupacional para TEA — 12 sessões',
    cid: 'F84.0 — Autismo infantil',
    prestador: 'Instituto Neuro Vida',
    medicoSolicitante: 'Dra. Patrícia Rocha — CRM/SP 29004',
    tipoGuia: 'Eleitiva',
    dataProtocolo: '20/03/2026 10:40',
    dataDecisao: '20/03/2026 10:40',
    acao: 'Aprovado',
    origem: 'ia_automatica',
    analista: 'Sistema IA',
    motivoDecisao: 'Primeira solicitação do período. Documentação completa: laudo neuropediatra + relatório de TO. Cobertura obrigatória RN 539/2022.',
    iaSugestao: 'Aprovar',
    divergencia: false,
    tempoAnaliseMin: 0,
    sexo: 'M',
    idade: 7,
    cpf: '812.345.009-75',
    dataNascimento: '05/03/2019',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '50000489', tuss: '50000489', descricao: 'Terapia Ocupacional para TEA — 12 sessões', qty: 12, qtyAutorizada: 12, dataInicio: '20/03/2026', dataFim: '20/03/2026', cid: 'F84.0', nivelAud: 'AMBULATORIAL' },
    ],
    alertas: [],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'ok' },
      { texto: 'Decisão alinhada com sugestão da IA', status: 'ok' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0034.pdf', tipo: 'Laudo Médico', data: '20/03/2026 10:40' },
    ],
  },
  // ── Analista — decisões humanas ────────────────────────────────────
  {
    id: 'HIS-2026-0033',
    beneficiario: 'Ana Claudia Monteiro',
    carteirinha: '0081234500105022',
    plano: 'Bradesco Saúde — Plano Premium',
    categoria: 'Cirurgias Eletivas',
    procedimento: 'Artroplastia total de joelho — prótese não cimentada',
    cid: 'M17.1 — Gonartrose primária bilateral',
    prestador: 'Hospital Santa Cruz',
    medicoSolicitante: 'Dr. Neander Oliveira — CRM/SP 19485',
    tipoGuia: 'Eleitiva',
    dataProtocolo: '19/03/2026 08:00',
    dataDecisao: '21/03/2026 10:15',
    acao: 'Aprovado',
    origem: 'analista',
    analista: 'Ana Paula Santos',
    motivoDecisao: 'Documentação completa. Radiografia confirmando Kellgren-Lawrence grau IV. Tratamento conservador esgotado (fisioterapia por 6 meses). OPME aprovada conforme cotações apresentadas.',
    iaSugestao: 'Aprovar',
    divergencia: false,
    tempoAnaliseMin: 23,
    observacoes: 'Autorizado com quantidade parcial: 1 joelho (esquerdo). Direito deverá ser solicitado separadamente após recuperação.',
    sexo: 'F',
    idade: 62,
    cpf: '812.345.010-52',
    dataNascimento: '30/04/1963',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '30722013', tuss: '30722013', descricao: 'Artroplastia total de joelho — prótese não cimentada', qty: 1, qtyAutorizada: 1, dataInicio: '21/03/2026', dataFim: '21/03/2026', cid: 'M17.1', nivelAud: 'AMBULATORIAL' },
    ],
    alertas: [],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'ok' },
      { texto: 'Decisão alinhada com sugestão da IA', status: 'ok' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0033.pdf', tipo: 'Laudo Médico', data: '19/03/2026 08:00' },
      { nome: 'Guia de Autorização — HIS-2026-0033.pdf', tipo: 'Guia Médica', data: '21/03/2026 10:15' },
    ],
    ajustes: [
      {
        id: 'ADJ-003',
        procedimentoCodigo: '30722013',
        procedimentoDescricao: 'Artroplastia total de joelho — prótese não cimentada',
        campo: 'prestador',
        valorAnterior: 'Hospital São Camilo',
        valorNovo: 'Hospital Santa Cruz',
        motivo: 'Prestador não credenciado para este procedimento',
        fundamentacao: 'Hospital São Camilo com credenciamento suspenso para cirurgias ortopédicas desde 01/03/2026. Redirecionado para Hospital Santa Cruz, credenciado e com equipe disponível.',
        operador: 'Ana Paula Santos',
        perfil: 'Gestora',
        timestamp: '2026-03-21T09:40:00',
      },
    ],
  },
  {
    id: 'HIS-2026-0032',
    beneficiario: 'Clarice Albuquerque',
    carteirinha: '0081234500113024',
    plano: 'Unimed Nacional — Plano Ouro',
    categoria: 'Internação',
    procedimento: 'Internação clínica — Pneumonia bacteriana — 5 diárias UTI',
    cid: 'J18.9 — Pneumonia não especificada',
    prestador: 'Hospital Sírio-Libanês',
    medicoSolicitante: 'Dr. Jorge Bastos — CRM/SP 12098',
    tipoGuia: 'Urgente',
    dataProtocolo: '18/03/2026 22:10',
    dataDecisao: '18/03/2026 22:45',
    acao: 'Aprovado',
    origem: 'analista',
    analista: 'Carlos Eduardo Ramos',
    motivoDecisao: 'Caráter urgente confirmado. Saturação O₂ < 92%, necessidade de suporte ventilatório. Autorizada UTI por 5 dias com reavaliação.',
    iaSugestao: 'Aprovar',
    divergencia: false,
    tempoAnaliseMin: 35,
    sexo: 'F',
    idade: 70,
    cpf: '812.345.011-33',
    dataNascimento: '08/01/1956',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '30718014', tuss: '30718014', descricao: 'Internação clínica — Pneumonia bacteriana — 5 diárias UTI', qty: 5, qtyAutorizada: 5, dataInicio: '18/03/2026', dataFim: '22/03/2026', cid: 'J18.9', nivelAud: 'UTI' },
    ],
    alertas: [],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'ok' },
      { texto: 'Decisão alinhada com sugestão da IA', status: 'ok' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0032.pdf', tipo: 'Laudo Médico', data: '18/03/2026 22:10' },
      { nome: 'Guia de Autorização — HIS-2026-0032.pdf', tipo: 'Guia Médica', data: '18/03/2026 22:45' },
    ],
  },
  {
    id: 'HIS-2026-0031',
    beneficiario: 'Diego Ferraz Cunha',
    carteirinha: '0081234500121027',
    plano: 'SulAmérica — Plano Premium',
    categoria: 'OPME',
    procedimento: 'Stent coronariano farmacológico — 2 unidades',
    cid: 'I25.1 — Doença aterosclerótica do coração',
    prestador: 'Hospital do Coração',
    medicoSolicitante: 'Dra. Vanessa Alves — CRM/SP 55204',
    tipoGuia: 'Urgente',
    dataProtocolo: '17/03/2026 14:00',
    dataDecisao: '17/03/2026 16:30',
    acao: 'Aprovado',
    origem: 'analista',
    analista: 'Ana Paula Santos',
    motivoDecisao: 'Cateterismo confirma estenose >70% em 2 artérias. Stent farmacológico indicado por protocolo ACC/AHA. OPME aprovada — fabricante validado, 3 cotações apresentadas.',
    iaSugestao: 'Aprovar',
    divergencia: false,
    tempoAnaliseMin: 150,
    sexo: 'M',
    idade: 55,
    cpf: '812.345.012-12',
    dataNascimento: '25/07/1970',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '30507026', tuss: '30507026', descricao: 'Stent coronariano farmacológico — 2 unidades', qty: 2, qtyAutorizada: 2, dataInicio: '17/03/2026', dataFim: '17/03/2026', cid: 'I25.1', nivelAud: 'HOSPITALAR' },
    ],
    alertas: [],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'ok' },
      { texto: 'Decisão alinhada com sugestão da IA', status: 'ok' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0031.pdf', tipo: 'Laudo Médico', data: '17/03/2026 14:00' },
      { nome: 'Guia de Autorização — HIS-2026-0031.pdf', tipo: 'Guia Médica', data: '17/03/2026 16:30' },
    ],
  },
  {
    id: 'HIS-2026-0030',
    beneficiario: 'Simone Aparecida Brito',
    carteirinha: '0081234500139029',
    plano: 'Hapvida — Plano Especial',
    categoria: 'Oncologia',
    procedimento: 'Quimioterapia FOLFOX — 6º ciclo',
    cid: 'C18.7 — Neoplasia maligna do sigmoide',
    prestador: 'Instituto Oncológico Nacional',
    medicoSolicitante: 'Dr. Fernando Motta — CRM/SP 34401',
    tipoGuia: 'Eleitiva',
    dataProtocolo: '16/03/2026 09:30',
    dataDecisao: '17/03/2026 11:00',
    acao: 'Aprovado',
    origem: 'analista',
    analista: 'Juliana Costa',
    motivoDecisao: 'Estadiamento T3N2M0. Protocolo FOLFOX dentro da diretriz ASCO para CCR estágio III. Resposta positiva nos ciclos anteriores. Aprovado.',
    iaSugestao: 'Aprovar',
    divergencia: false,
    tempoAnaliseMin: 41,
    sexo: 'F',
    idade: 54,
    cpf: '812.345.013-91',
    dataNascimento: '11/12/1971',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '90010019', tuss: '90010019', descricao: 'Quimioterapia FOLFOX — 6º ciclo', qty: 1, qtyAutorizada: 1, dataInicio: '17/03/2026', dataFim: '17/03/2026', cid: 'C18.7', nivelAud: 'HOSPITALAR' },
    ],
    alertas: [],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'ok' },
      { texto: 'Decisão alinhada com sugestão da IA', status: 'ok' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0030.pdf', tipo: 'Laudo Médico', data: '16/03/2026 09:30' },
      { nome: 'Guia de Autorização — HIS-2026-0030.pdf', tipo: 'Guia Médica', data: '17/03/2026 11:00' },
    ],
  },
  {
    id: 'HIS-2026-0029',
    beneficiario: 'Henrique Barbosa Lima',
    carteirinha: '0081234500147031',
    plano: 'NotreDame Intermédica — Plano Gold',
    categoria: 'Exames Alta Complexidade',
    procedimento: 'Ressonância magnética do joelho com contraste',
    cid: 'M23.2 — Desordem do menisco por ruptura',
    prestador: 'Centro de Imagem Avançada',
    medicoSolicitante: 'Dr. Ricardo Neves — CRM/SP 67890',
    tipoGuia: 'Eleitiva',
    dataProtocolo: '15/03/2026 10:00',
    dataDecisao: '16/03/2026 09:45',
    acao: 'Negado',
    origem: 'analista',
    analista: 'Ana Paula Santos',
    motivoDecisao: 'Solicitação de contraste não justificada na indicação clínica. Necessário relatório específico do ortopedista descrevendo suspeita de lesão que exige contraste.',
    textoLivre: 'Pedido retorna sem o laudo complementar do ortopedista. RM sem contraste poderia ser aprovada, mas o médico indicou explicitamente "com contraste".',
    iaSugestao: 'Aprovar',
    divergencia: true,
    divergenciaMotivo: 'IA aprovou sem avaliar especificidade do contraste. Análise humana identificou ausência de justificativa técnica para o contraste.',
    tempoAnaliseMin: 18,
    sexo: 'M',
    idade: 36,
    cpf: '812.345.014-70',
    dataNascimento: '19/06/1989',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '40901024', tuss: '40901024', descricao: 'Ressonância magnética do joelho com contraste', qty: 1, dataInicio: '16/03/2026', dataFim: '16/03/2026', cid: 'M23.2', nivelAud: 'AMBULATORIAL' },
    ],
    alertas: ['Divergência IA'],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'ok' },
      { texto: 'Sugestão da IA difere da decisão tomada', status: 'warning' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0029.pdf', tipo: 'Laudo Médico', data: '15/03/2026 10:00' },
      { nome: 'Guia de Autorização — HIS-2026-0029.pdf', tipo: 'Guia Médica', data: '16/03/2026 09:45' },
    ],
  },
  {
    id: 'HIS-2026-0028',
    beneficiario: 'Tereza Cristina Ramos',
    carteirinha: '0081234500155034',
    plano: 'Amil — Plano 300',
    categoria: 'Terapias Especiais',
    procedimento: 'Psicoterapia — 40 sessões anuais',
    cid: 'F33.1 — Transtorno depressivo recorrente moderado',
    prestador: 'Clínica Mente & Vida',
    medicoSolicitante: 'Dra. Sônia Guimarães — CRM/SP 71023',
    tipoGuia: 'Eleitiva',
    dataProtocolo: '14/03/2026 11:15',
    dataDecisao: '15/03/2026 14:30',
    acao: 'Aprovado',
    origem: 'analista',
    analista: 'Juliana Costa',
    motivoDecisao: 'Diagnóstico confirmado por psiquiatra. Sessões dentro do limite de 40 sessões/ano previsto no contrato. Psicóloga credenciada.',
    iaSugestao: 'Junta Médica',
    divergencia: true,
    divergenciaMotivo: 'IA sinalizou Junta Médica por quantidade de sessões acima da média. Analista verificou cláusula contratual específica do plano que permite 40 sessões — dentro da cobertura contratada.',
    tempoAnaliseMin: 27,
    sexo: 'F',
    idade: 47,
    cpf: '812.345.015-58',
    dataNascimento: '27/03/1978',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '50000404', tuss: '50000404', descricao: 'Psicoterapia — 40 sessões anuais', qty: 40, qtyAutorizada: 40, dataInicio: '15/03/2026', dataFim: '15/03/2026', cid: 'F33.1', nivelAud: 'AMBULATORIAL' },
    ],
    alertas: ['Divergência IA'],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'ok' },
      { texto: 'Sugestão da IA difere da decisão tomada', status: 'warning' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0028.pdf', tipo: 'Laudo Médico', data: '14/03/2026 11:15' },
      { nome: 'Guia de Autorização — HIS-2026-0028.pdf', tipo: 'Guia Médica', data: '15/03/2026 14:30' },
    ],
    juntaMedica: {
      dataReuniao: '15/03/2026 10:00',
      numeroAta: 'ATA-2026-0428',
      parecer: 'Junta médica revisou o histórico clínico da beneficiária e a cláusula contratual do plano Amil 300. Por unanimidade, a junta concluiu que as 40 sessões anuais de psicoterapia estão dentro da cobertura contratada. Decisão: APROVADO.',
      membros: [
        { nome: 'Dr. Antônio Mello',    especialidade: 'Psiquiatria',              crm: 'CRM/SP 41203' },
        { nome: 'Dra. Fernanda Lopes',  especialidade: 'Auditoria Médica',         crm: 'CRM/SP 59871' },
        { nome: 'Dr. Ricardo Azevedo',  especialidade: 'Saúde Mental / Perícia',   crm: 'CRM/SP 33902' },
      ],
    },
  },
  {
    id: 'HIS-2026-0027',
    beneficiario: 'Augusto Pimental Dias',
    carteirinha: '0081234500163036',
    plano: 'SulAmérica — Plano Clássico',
    categoria: 'Internação',
    procedimento: 'Internação clínica — Cardiomiopatia dilatada — apartamento, 3 diárias',
    cid: 'I42.0 — Cardiomiopatia dilatada',
    prestador: 'Hospital Beneficência Portuguesa',
    medicoSolicitante: 'Dr. Paulo Mendes — CRM/SP 28776',
    tipoGuia: 'Eleitiva',
    dataProtocolo: '13/03/2026 07:00',
    dataDecisao: '13/03/2026 09:00',
    acao: 'Negado',
    origem: 'analista',
    analista: 'Carlos Eduardo Ramos',
    motivoDecisao: 'Paciente em período de carência (ingresso há 28 dias). Internação eletiva não coberta antes de completar 180 dias de carência — conforme cláusula 8.2 do contrato. Indicado encaminhamento para Urgência se houver descompensação.',
    iaSugestao: 'Aprovar',
    divergencia: true,
    divergenciaMotivo: 'IA aprovou sem identificar o período de carência ativo do beneficiário. Verificação manual da data de ingresso revelou carência em vigência.',
    tempoAnaliseMin: 120,
    sexo: 'M',
    idade: 63,
    cpf: '812.345.016-36',
    dataNascimento: '02/09/1962',
    carencia: true,
    procedimentosDetalhados: [
      { codigo: '30718014', tuss: '30718014', descricao: 'Internação clínica — Cardiomiopatia dilatada — apartamento, 3 diárias', qty: 3, dataInicio: '13/03/2026', dataFim: '13/03/2026', cid: 'I42.0', nivelAud: 'HOSPITALAR' },
    ],
    alertas: ['Carência Ativa', 'Divergência IA'],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'error' },
      { texto: 'Sugestão da IA difere da decisão tomada', status: 'warning' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0027.pdf', tipo: 'Laudo Médico', data: '13/03/2026 07:00' },
      { nome: 'Guia de Autorização — HIS-2026-0027.pdf', tipo: 'Guia Médica', data: '13/03/2026 09:00' },
    ],
  },
  {
    id: 'HIS-2026-0026',
    beneficiario: 'Renata Silveira Moraes',
    carteirinha: '0081234500171039',
    plano: 'Bradesco Saúde — Plano Essencial',
    categoria: 'Urgência/Emergência',
    procedimento: 'Atendimento de urgência — Appendicite aguda + Appendicectomia laparoscópica',
    cid: 'K35.8 — Apendicite aguda',
    prestador: 'Hospital Municipal Dr. Mário Gatti',
    medicoSolicitante: 'Dr. Samuel Faria — CRM/SP 90034',
    tipoGuia: 'Emergência',
    dataProtocolo: '12/03/2026 03:15',
    dataDecisao: '12/03/2026 03:15',
    acao: 'Aprovado',
    origem: 'ia_automatica',
    analista: 'Sistema IA',
    motivoDecisao: 'Emergência cirúrgica confirmada (apendicite aguda). Cobertura obrigatória em qualquer rede. Autorização automática por protocolo de urgência/emergência.',
    iaSugestao: 'Aprovar',
    divergencia: false,
    tempoAnaliseMin: 0,
    sexo: 'F',
    idade: 28,
    cpf: '812.345.017-15',
    dataNascimento: '14/08/1997',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '30707005', tuss: '30707005', descricao: 'Atendimento de urgência — Appendicite aguda + Appendicectomia laparoscópica', qty: 1, qtyAutorizada: 1, dataInicio: '12/03/2026', dataFim: '12/03/2026', cid: 'K35.8', nivelAud: 'HOSPITALAR' },
    ],
    alertas: [],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'ok' },
      { texto: 'Decisão alinhada com sugestão da IA', status: 'ok' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0026.pdf', tipo: 'Laudo Médico', data: '12/03/2026 03:15' },
    ],
  },
  {
    id: 'HIS-2026-0025',
    beneficiario: 'Marcos Vinicius Leal',
    carteirinha: '0081234500189041',
    plano: 'Unimed — Plano Flex',
    categoria: 'Cirurgias Eletivas',
    procedimento: 'Rinoplastia estética',
    cid: 'Z41.1 — Procedimento para fins estéticos',
    prestador: 'Clínica Estética Excellence',
    medicoSolicitante: 'Dr. Gustavo Rios — CRM/SP 44321',
    tipoGuia: 'Eleitiva',
    dataProtocolo: '11/03/2026 13:00',
    dataDecisao: '11/03/2026 13:00',
    acao: 'Negado',
    origem: 'ia_automatica',
    analista: 'Sistema IA',
    motivoDecisao: 'Rinoplastia com finalidade exclusivamente estética não consta no Rol de Procedimentos ANS. CID Z41.1 indica procedimento para fins estéticos. Cobertura negada conforme RN 465/2021.',
    iaSugestao: 'Negar',
    divergencia: false,
    tempoAnaliseMin: 0,
    sexo: 'M',
    idade: 25,
    cpf: '812.345.018-94',
    dataNascimento: '07/04/2000',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '31308083', tuss: '31308083', descricao: 'Rinoplastia estética', qty: 1, dataInicio: '11/03/2026', dataFim: '11/03/2026', cid: 'Z41.1', nivelAud: 'AMBULATORIAL' },
    ],
    alertas: [],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'error' },
      { texto: 'Decisão alinhada com sugestão da IA', status: 'ok' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0025.pdf', tipo: 'Laudo Médico', data: '11/03/2026 13:00' },
    ],
  },
  {
    id: 'HIS-2026-0024',
    beneficiario: 'Isabela Fernandes Vieira',
    carteirinha: '0081234500197044',
    plano: 'Hapvida — Plano Nacional',
    categoria: 'Home Care',
    procedimento: 'Home Care AD2 — pós AVC isquêmico — 30 dias',
    cid: 'I63.9 — Infarto cerebral não especificado',
    prestador: 'Home Med Assistência Domiciliar',
    medicoSolicitante: 'Dra. Letícia Campos — CRM/SP 58812',
    tipoGuia: 'Eleitiva',
    dataProtocolo: '10/03/2026 10:00',
    dataDecisao: '11/03/2026 08:30',
    acao: 'Aprovado',
    origem: 'analista',
    analista: 'Ana Paula Santos',
    motivoDecisao: 'Alta hospitalar recente (3 dias). Paciente com sequelas motoras leves pós-AVC. AD2 indicada pela médica assistente. Empresa de Home Care credenciada. Aprovado por 30 dias com reavaliação.',
    iaSugestao: 'Aprovar',
    divergencia: false,
    tempoAnaliseMin: 32,
    sexo: 'F',
    idade: 68,
    cpf: '812.345.019-72',
    dataNascimento: '03/02/1958',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '92000019', tuss: '92000019', descricao: 'Home Care AD2 — pós AVC isquêmico — 30 dias', qty: 30, qtyAutorizada: 30, dataInicio: '11/03/2026', dataFim: '10/04/2026', cid: 'I63.9', nivelAud: 'AMBULATORIAL' },
    ],
    alertas: [],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'ok' },
      { texto: 'Decisão alinhada com sugestão da IA', status: 'ok' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0024.pdf', tipo: 'Laudo Médico', data: '10/03/2026 10:00' },
      { nome: 'Guia de Autorização — HIS-2026-0024.pdf', tipo: 'Guia Médica', data: '11/03/2026 08:30' },
    ],
  },
  {
    id: 'HIS-2026-0023',
    beneficiario: 'Wellington Borges',
    carteirinha: '0081234500205046',
    plano: 'Amil — Plano 500',
    categoria: 'Exames Alta Complexidade',
    procedimento: 'PET-CT oncológico corpo inteiro',
    cid: 'C34.1 — Neoplasia maligna do lobo superior do pulmão',
    prestador: 'Hospital Albert Einstein — PET Center',
    medicoSolicitante: 'Dr. Alexandre Fonseca — CRM/SP 30044',
    tipoGuia: 'Eleitiva',
    dataProtocolo: '09/03/2026 09:00',
    dataDecisao: '10/03/2026 15:00',
    acao: 'Aprovado',
    origem: 'analista',
    analista: 'Juliana Costa',
    motivoDecisao: 'PET-CT solicitado para estadiamento de neoplasia pulmonar confirmada por biópsia. Exame dentro das diretrizes INCA/SBCO. Aprovado.',
    iaSugestao: 'Junta Médica',
    divergencia: true,
    divergenciaMotivo: 'IA sugeriu Junta Médica por ser exame de alto custo. Analista avaliou que diretrizes oncológicas são claras para este caso — estadiamento pré-cirúrgico é mandatório.',
    tempoAnaliseMin: 55,
    sexo: 'M',
    idade: 57,
    cpf: '812.345.020-50',
    dataNascimento: '18/10/1968',
    carencia: false,
    procedimentosDetalhados: [
      { codigo: '40901064', tuss: '40901064', descricao: 'PET-CT oncológico corpo inteiro', qty: 1, qtyAutorizada: 1, dataInicio: '10/03/2026', dataFim: '10/03/2026', cid: 'C34.1', nivelAud: 'HOSPITALAR' },
    ],
    alertas: ['Divergência IA'],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'ok' },
      { texto: 'Sugestão da IA difere da decisão tomada', status: 'warning' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0023.pdf', tipo: 'Laudo Médico', data: '09/03/2026 09:00' },
      { nome: 'Guia de Autorização — HIS-2026-0023.pdf', tipo: 'Guia Médica', data: '10/03/2026 15:00' },
    ],
    juntaMedica: {
      dataReuniao: '10/03/2026 08:30',
      numeroAta: 'ATA-2026-0389',
      parecer: 'Junta oncológica confirmou indicação de PET-CT para estadiamento pré-cirúrgico de neoplasia pulmonar (C34.1). Exame previsto nas diretrizes INCA/SBCO para este estadio. Custo justificado pela necessidade clínica. Decisão: APROVADO.',
      membros: [
        { nome: 'Dr. Alexandre Fonseca', especialidade: 'Oncologia Clínica',    crm: 'CRM/SP 30044' },
        { nome: 'Dra. Mariana Souza',    especialidade: 'Medicina Nuclear',     crm: 'CRM/SP 72314' },
        { nome: 'Dr. Paulo Henrique',    especialidade: 'Auditoria Médica',     crm: 'CRM/SP 48903' },
      ],
    },
  },
  {
    id: 'HIS-2026-0022',
    beneficiario: 'Natalia Guedes Torres',
    carteirinha: '0081234500213049',
    plano: 'SulAmérica — Plano Premium',
    categoria: 'Terapias Especiais',
    procedimento: 'Fonoaudiologia — 20 sessões',
    cid: 'R47.0 — Disfasia e afasia',
    prestador: 'Clínica Fala & Voz',
    medicoSolicitante: 'Dra. Carmen Rocha — CRM/SP 62190',
    tipoGuia: 'Eleitiva',
    dataProtocolo: '08/03/2026 08:30',
    dataDecisao: '08/03/2026 08:30',
    acao: 'Negado',
    origem: 'ia_automatica',
    analista: 'Sistema IA',
    motivoDecisao: 'Beneficiária em período de carência para terapias especiais (ingresso há 89 dias — carência de 180 dias para esta cobertura). Solicitação negada conforme contrato.',
    iaSugestao: 'Negar',
    divergencia: false,
    tempoAnaliseMin: 0,
    sexo: 'F',
    idade: 34,
    cpf: '812.345.021-29',
    dataNascimento: '21/05/1991',
    carencia: true,
    procedimentosDetalhados: [
      { codigo: '50000463', tuss: '50000463', descricao: 'Fonoaudiologia — 20 sessões', qty: 20, dataInicio: '08/03/2026', dataFim: '08/03/2026', cid: 'R47.0', nivelAud: 'AMBULATORIAL' },
    ],
    alertas: ['Carência Ativa'],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'error' },
      { texto: 'Decisão alinhada com sugestão da IA', status: 'ok' },
    ],
    documentos: [
      { nome: 'Laudo Médico — HIS-2026-0022.pdf', tipo: 'Laudo Médico', data: '08/03/2026 08:30' },
    ],
  },
  // ── Aprovação Parcial — Terapias Especiais ─────────────────────────
  {
    id: 'HIS-2026-0042',
    beneficiario: 'Carlos Eduardo Lima',
    carteirinha: '0081234500049012',
    plano: 'Unimed — Premium Familiar',
    categoria: 'Terapias Especiais',
    procedimento: 'Sessão Terapia ABA + Sessão Fonoaudiologia',
    cid: 'F84.0 — Autismo infantil',
    prestador: 'Clínica Integrar Desenvolvimento',
    medicoSolicitante: 'Dra. Fernanda Lopes — CRM/SP 71234',
    tipoGuia: 'Eleitiva',
    dataProtocolo: '01/04/2026 10:15',
    dataDecisao: '01/04/2026 14:30',
    acao: 'Aprovado Parcial',
    origem: 'analista',
    analista: 'Ana Paula Santos',
    motivoDecisao: 'ABA aprovado por critérios atendidos (RN 539/2022). Fonoaudiologia negada por documentação clínica incompleta — relatório de evolução ausente.',
    iaSugestao: 'Aprovar',
    divergencia: true,
    divergenciaMotivo: 'Decisão parcial: ABA aprovado conforme RN 539/2022, Fonoaudiologia negada por ausência de relatório de evolução terapêutica.',
    tempoAnaliseMin: 35,
    sexo: 'M',
    idade: 7,
    cpf: '123.456.789-01',
    dataNascimento: '14/02/2019',
    carencia: false,
    procedimentosDetalhados: [
      {
        codigo: '50000470',
        tuss: '50000470',
        descricao: 'Sessão Terapia ABA',
        qty: 20,
        qtyAutorizada: 20,
        dataInicio: '01/04/2026',
        dataFim: '30/04/2026',
        cid: 'F84.0',
        nivelAud: 'AMBULATORIAL',
        decisao: 'aprovado',
      },
      {
        codigo: '50000370',
        tuss: '50000370',
        descricao: 'Sessão Fonoaudiologia',
        qty: 8,
        qtyAutorizada: undefined,
        dataInicio: '01/04/2026',
        dataFim: '30/04/2026',
        cid: 'F84.0',
        nivelAud: 'AMBULATORIAL',
        decisao: 'negado',
        motivoDecisao: 'Documentação clínica incompleta',
      },
    ],
    alertas: [],
    iaChecklist: [
      { texto: 'Médico credenciado na rede', status: 'ok' },
      { texto: 'Procedimento consta no Rol ANS', status: 'ok' },
      { texto: 'Decisão parcialmente alinhada com a IA', status: 'warning' },
    ],
    documentos: [
      { nome: 'Laudo Neuropsicológico — HIS-2026-0042.pdf', tipo: 'Laudo Médico', data: '01/04/2026 10:15' },
    ],
  },
]

// ── Dashboard Metrics (computed from real data) ─────────────────────────
export const dashboardMetrics = (() => {
  const _emAnalise = pedidos.filter(p => p.status === 'Em Análise').length
  const _devolutivas = pedidos.filter(p => p.status === 'Devolutiva').length
  const _urgencias = pedidos.filter(p => p.tipoGuia === 'Urgente' || p.tipoGuia === 'Emergência').length
  const _aprovados = historicoEntries.filter(h => h.acao === 'Aprovado').length
  const _negados = historicoEntries.filter(h => h.acao === 'Negado').length
  const _taxaBase = _aprovados + _negados
  // Irregularidades: total de alertas nos pedidos ativos
  const _totalAlertasAtivos = pedidos.reduce((s, p) => s + p.alertas.length, 0)
  const _pedidosComAlerta = pedidos.filter(p => p.alertas.length > 0).length
  // Devolutivas por sub-estado
  const _devolutivasAguardando = pedidos.filter(p => p.subStatus === 'PENDENTE_AGUARDANDO').length
  const _devolutivasRetorno = pedidos.filter(p => p.subStatus === 'PENDENTE_RETORNO_RECEBIDO').length
  const _retornosRecebidos = pedidos.filter(p => p.subStatus === 'PENDENTE_RETORNO_RECEBIDO' || p.subStatus === 'JUNTA_PARECER_RECEBIDO').length
  // Taxa de detecção da IA: % de negativas no histórico onde IA sugeriu Negar ou Junta antes do operador
  const _criticosHist = historicoEntries.filter(h => h.acao === 'Negado')
  const _iaSinalizouCriticos = _criticosHist.filter(h => h.iaSugestao === 'Negar' || h.iaSugestao === 'Junta Médica').length
  const _taxaDeteccaoIA = _criticosHist.length > 0 ? Math.round((_iaSinalizouCriticos / _criticosHist.length) * 100) : 0
  const _slaViolados = pedidos.filter(p => p.slaStatus === 'violated').length
  // Aprovadas sem alertas (genuinamente limpas)
  const _aprovadosHist = historicoEntries.filter(h => h.acao === 'Aprovado')
  const _aprovadosSemAlerta = _aprovadosHist.length > 0
    ? Math.round((_aprovadosHist.filter(h => !h.alertas || h.alertas.length === 0).length / _aprovadosHist.length) * 100)
    : 0
  const catColors: Record<string, string> = {
    'Internação': '#902B29',
    'Urgência/Emergência': '#d4183d',
    'Oncologia': '#7c3aed',
    'Terapias Especiais': '#2563eb',
    'OPME': '#b45309',
    'Exames Alta Complexidade': '#0891b2',
    'Cirurgias Eletivas': '#059669',
    'Home Care': '#16a34a',
    'SADT': '#16a34a',
  }
  const catOrder = ['Internação', 'Urgência/Emergência', 'Oncologia', 'Terapias Especiais', 'OPME', 'Exames Alta Complexidade', 'Cirurgias Eletivas', 'Home Care', 'SADT']
  const counts: Record<string, { total: number; pendentes: number }> = {}
  for (const p of pedidos) {
    if (!counts[p.categoria]) counts[p.categoria] = { total: 0, pendentes: 0 }
    counts[p.categoria].total++
    if (['Em Análise', 'Pendente', 'Devolutiva'].includes(p.status)) counts[p.categoria].pendentes++
  }
  const porCategoria = catOrder
    .filter(cat => counts[cat]?.total > 0)
    .map(cat => ({ categoria: cat as Categoria, total: counts[cat].total, pendentes: counts[cat].pendentes, color: catColors[cat] }))

  return {
    total: pedidos.length + historicoEntries.length,
    emAnalise: _emAnalise,
    aprovados: _aprovados,
    negados: _negados,
    devolutivas: _devolutivas,
    devolutivasTotal: _devolutivas + historicoEntries.filter(h => h.acao === 'Devolutiva').length,
    devolutivasAguardando: _devolutivasAguardando,
    devolutivasRetorno: _devolutivasRetorno,
    totalAlertasAtivos: _totalAlertasAtivos,
    pedidosComAlerta: _pedidosComAlerta,
    taxaDeteccaoIA: _taxaDeteccaoIA,
    iaSinalizouCriticos: _iaSinalizouCriticos,
    totalCriticosHist: _criticosHist.length,
    aprovadosSemAlerta: _aprovadosSemAlerta,
    valorTotal: 'R$ 487.350,00',
    valorAprovado: 'R$ 312.800,00',
    valorNegado: 'R$ 89.200,00',
    taxaAprovacao: _taxaBase > 0 ? Math.round((_aprovados / _taxaBase) * 100) : 0,
    taxaNegacao: _taxaBase > 0 ? Math.round((_negados / _taxaBase) * 100) : 0,
    slaViolados: _slaViolados,
    slaOk: pedidos.filter(p => p.slaStatus === 'ok').length,
    slaWarning: pedidos.filter(p => p.slaStatus === 'warning').length,
    iaSugestaoAprovar: pedidos.filter(p => p.iaSugestao === 'Aprovar').length,
    iaSugestaoNegar: pedidos.filter(p => p.iaSugestao === 'Negar').length,
    iaSugestaoJunta: pedidos.filter(p => p.iaSugestao === 'Junta Médica').length,
    urgencias: _urgencias,
    monthlyTrend: [
      { mes: 'Out', aprovados: 142, negados: 28 },
      { mes: 'Nov', aprovados: 158, negados: 31 },
      { mes: 'Dez', aprovados: 134, negados: 24 },
      { mes: 'Jan', aprovados: 167, negados: 38 },
      { mes: 'Fev', aprovados: 149, negados: 29 },
      { mes: 'Mar', aprovados: _aprovados, negados: _negados },
    ],
    topMotivosNegativa: [
      { motivo: 'Fora do rol ANS', count: 8, color: '#d4183d' },
      { motivo: 'Prestador não credenciado', count: 5, color: '#f59e0b' },
      { motivo: 'Documentação clínica insuficiente', count: 4, color: '#b45309' },
      { motivo: 'Carência contratual', count: 3, color: '#7c3aed' },
      { motivo: 'Procedimento não indicado', count: 2, color: '#0891b2' },
    ],
    porCategoria,
    ultimasSolicitacoes: pedidos.slice(0, 5),
    retornosRecebidos: _retornosRecebidos,
    alertasAtivos: [
      { tipo: 'Liminar Judicial', count: 3, color: '#d4183d' },             // jurídico — maior risco
      { tipo: 'NIP Ativa', count: 2, color: '#b45309' },                    // notificação regulatória
      { tipo: 'SLA Violado', count: _slaViolados, color: '#d4183d' },       // prazo vencido
      { tipo: 'Retornos recebidos', count: _retornosRecebidos, color: '#7c3aed' }, // retomada imediata
    ],
  }
})()
