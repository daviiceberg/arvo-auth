/**
 * Module-specific types for the history module.
 *
 * Domain types (HistoryEntry, DecisionAction, DecisionOrigin, Adjustment, etc.)
 * live in @/types/pedido and are re-exported here for convenience.
 */

import { type DecisionAction } from '@/types/pedido';

// -- Re-exports from the canonical source --------------------------------
export type {
  HistoryEntry,
  DecisionAction,
  DecisionOrigin,
  Adjustment,
  Category,
  IASuggestion,
} from '@/types/pedido';

// -- Module-specific types -----------------------------------------------

export interface HistoricoConsolidado {
  completeness: 'complete' | 'partial' | 'limited';
  linhaDoTempo: {
    ultimaSolicitacaoSimilar: string | null;
    padrao: 'first_time' | 'recurrent' | 'frequent';
  };
  leituraAssistida: string;
  consultasRecentes: {
    count: number;
    periodo: string;
    especialidades: string[];
  };
  procedimentosRelacionados: string;
  internacoes: {
    count: number;
    periodo: string;
    detalhes?: string;
  };
  cidRecorrente: {
    cid: string;
    count: number;
    descricao: string;
  } | null;
  autorizacoesAnteriores: AutorizacaoAnterior[];
  sinaisAtencao: SinalAtencao[];
  elegibilidade: Elegibilidade;
}

export interface AutorizacaoAnterior {
  id: string;
  procedimento: string;
  codigo: string;
  cid: string;
  data: string;
  decisao: 'aprovado' | 'negado' | 'ajustado';
  motivo: string;
  destaque?: boolean;
}

export interface SinalAtencao {
  id: string;
  mensagem: string;
  detalhes?: string;
  severidade: 'low' | 'medium' | 'high';
}

export interface Elegibilidade {
  status: 'ativo' | 'suspenso' | 'carencia';
  carencias: boolean;
  detalhesCarencia?: string;
  limitesContratuais: string;
  dutRelevantes: string[];
}

export type SortDirection = 'asc' | 'desc';

export type OriginFilter = 'Todas' | 'ia_automatica' | 'analista';

export type ActionFilter = 'Todas' | DecisionAction | 'NegadoPendenciaTimeout';

export type DivergenceFilter = 'Todas' | 'divergiu';

export type PassedThroughFilter = 'Todos' | 'pendencia' | 'junta_medica' | 'direto';

export type NotifyChannel = 'app' | 'whatsapp' | 'email';
