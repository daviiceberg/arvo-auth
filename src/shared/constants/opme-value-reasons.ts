import { type OpmeValueReasonCode } from '@/types/pedido';

export interface OpmeValueReasonConfig {
  label: string;
  description: string;
  requiresFreeText: boolean;
}

export const opmeValueReasons: Record<OpmeValueReasonCode, OpmeValueReasonConfig> = {
  VALOR_ACIMA_TABELA: {
    label: 'Valor acima da tabela',
    description: 'Item escolhido não é o mais barato, mas está dentro da tabela da operadora.',
    requiresFreeText: false,
  },
  DIVERGENCIA_COTACOES: {
    label: 'Divergência entre cotações',
    description: 'Diferença significativa entre os valores cotados sugere inconsistência.',
    requiresFreeText: true,
  },
  MATERIAL_SUBSTITUTO_ACEITO: {
    label: 'Material substituto aceito',
    description: 'Marca/modelo diferente foi aceito pelo médico solicitante.',
    requiresFreeText: false,
  },
  QUALIDADE_SUPERIOR: {
    label: 'Qualidade clínica superior',
    description: 'Marca de maior qualidade clínica justificada para o caso.',
    requiresFreeText: true,
  },
  DISPONIBILIDADE: {
    label: 'Indisponibilidade do fornecedor',
    description: 'Fornecedor com menor preço não tem o material em estoque.',
    requiresFreeText: false,
  },
  OUTRO: {
    label: 'Outro',
    description: 'Outro motivo (descrever).',
    requiresFreeText: true,
  },
};

export const OPME_VALUE_REASON_CODES = Object.keys(opmeValueReasons) as OpmeValueReasonCode[];
