import { type ChecklistItem } from '@/types/pedido';

export const CHECKLIST_VISIBLE_LIMIT = 6;

export interface RankedChecklist {
  visible: ChecklistItem[];
  hidden: ChecklistItem[];
  totalCount: number;
  negativeCount: number;
  positiveCount: number;
  warningCount: number;
}

const bySeverityDesc = (a: ChecklistItem, b: ChecklistItem): number =>
  (b.severity ?? 0) - (a.severity ?? 0);

export function rankChecklistItems(items: ChecklistItem[]): RankedChecklist {
  const errors = items.filter((i) => i.status === 'error').sort(bySeverityDesc);
  const warnings = items.filter((i) => i.status === 'warning').sort(bySeverityDesc);
  const okRelevant = items.filter((i) => i.status === 'ok' && i.showWhenOk === true);
  const okHidden = items.filter((i) => i.status === 'ok' && i.showWhenOk !== true);

  const prioritized = [...errors, ...warnings, ...okRelevant];
  const visible = prioritized.slice(0, CHECKLIST_VISIBLE_LIMIT);
  const overflow = prioritized.slice(CHECKLIST_VISIBLE_LIMIT);

  return {
    visible,
    hidden: [...overflow, ...okHidden],
    totalCount: items.length,
    negativeCount: errors.length,
    warningCount: warnings.length,
    positiveCount: items.filter((i) => i.status === 'ok').length,
  };
}
