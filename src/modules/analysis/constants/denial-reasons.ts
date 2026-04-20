export interface DenialReason {
  label: string;
  texto: string;
}

export const DENIAL_REASONS: DenialReason[] = [
  {
    label: 'CID F84 ausente ou não confirmado',
    texto:
      'Solicitação negada por ausência ou não confirmação do diagnóstico CID F84.x (Transtornos Globais do Desenvolvimento). A cobertura obrigatória de terapias especiais depende da confirmação diagnóstica em laudo neuropsicológico.',
  },
  {
    label: 'Laudo médico ausente, ilegível ou vencido',
    texto:
      'Laudo neuropsicológico não anexado, ilegível ou com data superior a 12 meses. Conforme protocolo, é exigido laudo vigente emitido por profissional habilitado para análise da solicitação.',
  },
  {
    label: 'Assinatura ou carimbo do médico ausente',
    texto:
      'Pedido médico apresentado sem assinatura ou carimbo do profissional responsável, descumprindo requisitos formais para validação da solicitação.',
  },
  {
    label: 'CRM inválido ou não encontrado',
    texto:
      'CRM do médico solicitante inválido, inativo ou não localizado em consulta ao Conselho Regional de Medicina competente.',
  },
  {
    label: 'Beneficiário em período de carência',
    texto:
      'Solicitação negada em razão de período de carência contratual não cumprido para o procedimento solicitado, conforme contrato do plano do beneficiário.',
  },
  {
    label: 'Beneficiário inadimplente',
    texto:
      'Contrato do beneficiário encontra-se em situação de inadimplência, com cobertura suspensa até regularização conforme cláusulas contratuais.',
  },
  {
    label: 'Prestador não credenciado',
    texto:
      'O prestador indicado não possui credenciamento junto à operadora para a realização de terapias especiais na modalidade solicitada.',
  },
  { label: 'Outro motivo', texto: '' },
];
