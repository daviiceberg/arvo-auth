import { type ChecklistItem } from '@/types/pedido';

/**
 * Quantidade fixa de itens exibidos na lista visível do checklist.
 * Regra de UX (não-violar): SEMPRE 5 análises visíveis. Se houver menos
 * itens prioritários (errors/warnings/okRelevant), completar com okHidden
 * para garantir o mínimo. Excedentes vão para o modal "Ver todas".
 */
export const CHECKLIST_VISIBLE_LIMIT = 5;

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
  // Garantir SEMPRE 5 itens visíveis: completar com okHidden quando faltar
  const filled =
    prioritized.length >= CHECKLIST_VISIBLE_LIMIT
      ? prioritized
      : [...prioritized, ...okHidden.slice(0, CHECKLIST_VISIBLE_LIMIT - prioritized.length)];
  const visible = filled.slice(0, CHECKLIST_VISIBLE_LIMIT);
  const visibleSet = new Set(visible);
  const hidden = items.filter((i) => !visibleSet.has(i));

  return {
    visible,
    hidden,
    totalCount: items.length,
    negativeCount: errors.length,
    warningCount: warnings.length,
    positiveCount: items.filter((i) => i.status === 'ok').length,
  };
}
