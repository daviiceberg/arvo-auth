/**
 * OPME context derivation.
 *
 * A request can carry OPME materials either as its primary category (`category === 'OPME'`)
 * or embedded within a surgical request (Cirurgias Eletivas + opmeMaterials).
 *
 * The unified-guide model (see fluxos/fluxo-OPME) intentionally collapses what the MV
 * pattern fragments into "guia principal + guia filho APME". On the analyst surface this
 * is signaled by rendering a secondary `CategoryChip` for OPME alongside the primary
 * surgical category — keeping both categories first-class instead of inventing a
 * hybrid qualifier.
 */

import { type HistoryEntry, type Request } from '@/types/pedido';

export function hasOpmeContext(item: Pick<Request, 'surgery' | 'opmeMaterials'>): boolean {
  if (item.surgery?.hasOpme === true) return true;
  return (item.opmeMaterials?.length ?? 0) > 0;
}

export function hasOpmeContextInHistory(entry: Pick<HistoryEntry, 'opmeMaterials'>): boolean {
  return (entry.opmeMaterials?.length ?? 0) > 0;
}
