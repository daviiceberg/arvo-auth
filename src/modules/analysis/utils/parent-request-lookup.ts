import { historicoEntries, pedidos } from '@/data/pedidos';
import { logger } from '@/shared/utils/logger';
import { type Category, type DecisionAction } from '@/types/pedido';

export interface ParentRequestLookupResult {
  source: 'queue' | 'history' | 'not_found';
  category?: Category;
  status?: string;
  decisao?: DecisionAction;
  decisionDate?: string;
  protocolDate?: string;
}

export function findParentRequest(parentId: string): ParentRequestLookupResult {
  const queueHit = pedidos.find((p) => p.id === parentId);
  if (queueHit) {
    return {
      source: 'queue',
      category: queueHit.category,
      status: queueHit.status,
      protocolDate: queueHit.protocolDate,
    };
  }

  const historyHit = historicoEntries.find((h) => h.id === parentId);
  if (historyHit) {
    return {
      source: 'history',
      category: historyHit.category,
      status: historyHit.action,
      decisao: historyHit.action,
      decisionDate: historyHit.decisionDate,
      protocolDate: historyHit.protocolDate,
    };
  }

  logger.warn(
    `Pedido com parentRequestId=${parentId} não foi encontrado nem em pedidos nem em historicoEntries.`,
  );
  return { source: 'not_found' };
}
