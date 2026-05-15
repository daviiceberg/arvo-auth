import { historicoEntries, pedidos } from '@/data/pedidos';

import { type FormData } from '../types';

export function buildPrefilledFromParent(parentId: string): Partial<FormData> {
  const queueHit = pedidos.find((p) => p.id === parentId);
  if (queueHit) {
    return {
      category: queueHit.category,
      cidPrincipal: queueHit.procedures[0]?.cid ?? '',
      profissionalSolicitante: queueHit.requestingProvider.professional,
      conselhoTipo: queueHit.requestingProvider.councilType,
      conselhoNumero: queueHit.requestingProvider.councilNumber,
      conselhoUF: queueHit.requestingProvider.councilUF,
      cboCodigo: queueHit.requestingProvider.cboCode ?? '',
      nomeContratadoSolicitante: queueHit.requestingProvider.name,
      nomeContratadoExecutante: queueHit.executingProvider.name,
      cnesExecutante: queueHit.executingProvider.cnesCode ?? '',
    };
  }

  const historyHit = historicoEntries.find((h) => h.id === parentId);
  if (historyHit) {
    return {
      category: historyHit.category,
      cidPrincipal: historyHit.cid,
      nomeContratadoSolicitante: historyHit.requestingProviderName,
      nomeContratadoExecutante: historyHit.executingProviderName,
    };
  }

  return {};
}
