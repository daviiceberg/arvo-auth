export interface DenialReason {
  label: string
  texto: string
}

export const DENIAL_REASONS: DenialReason[] = [
  { label: 'Carência contratual', texto: 'Solicitação negada em razão de período de carência contratual não cumprido para o procedimento solicitado, conforme contrato do plano do beneficiário.' },
  { label: 'Fora do Rol ANS', texto: 'O procedimento solicitado não consta no Rol de Procedimentos e Eventos em Saúde da ANS (RN 465/2021 e atualizações), não sendo de cobertura obrigatória.' },
  { label: 'Documentação clínica incompleta', texto: 'Negativa por ausência ou incompletude da documentação clínica exigida para análise. O beneficiário poderá reapresentar o pedido com documentação completa.' },
  { label: 'Método/procedimento não coberto', texto: 'O método ou procedimento solicitado não está contemplado na cobertura contratual vigente e/ou no Rol de Procedimentos da ANS.' },
  { label: 'Prestador não credenciado para o procedimento', texto: 'O prestador indicado não possui credenciamento junto à operadora para a realização do procedimento solicitado na especialidade requerida.' },
  { label: 'Quantidade acima do protocolo clínico', texto: 'A quantidade solicitada excede o limite estabelecido pelo protocolo clínico e/ou pelas Diretrizes de Utilização (DUT) aplicáveis para este procedimento.' },
  { label: 'CID incompatível com o procedimento solicitado', texto: 'Há incompatibilidade clínica entre o CID informado e o procedimento solicitado, não havendo indicação reconhecida nos protocolos técnicos vigentes.' },
  { label: 'Outro motivo', texto: '' },
]
