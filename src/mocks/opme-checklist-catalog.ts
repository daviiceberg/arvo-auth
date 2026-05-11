import { type ChecklistItem } from '@/types/pedido';

import {
  type BaseScenario,
  pushBeneficiaryEligibility,
  pushPrestador,
  pushSolicitante,
} from './checklist-base';

export interface OpmeChecklistScenario extends BaseScenario {
  cid?: string;
  anvisaAllValid?: boolean;
  anvisaExpiredCount?: number;
  anvisaNotFoundCount?: number;
  quotationsComplete?: boolean;
  quotationsMissing?: number;
  cheapestQuotationChosen?: boolean;
  justificationProvided?: boolean;
  manufacturerRecognized?: boolean;
  totalValueAboveTable?: boolean;
  surgeryLinked?: boolean;
  oncologyLinked?: boolean;
}

function add(items: ChecklistItem[], item: ChecklistItem & { id: string }): void {
  items.push(item);
}

function pushAnvisaItems(items: ChecklistItem[], s: OpmeChecklistScenario): void {
  const expired = s.anvisaExpiredCount ?? 0;
  const notFound = s.anvisaNotFoundCount ?? 0;
  const allValid = s.anvisaAllValid !== false && expired === 0 && notFound === 0;

  if (notFound > 0) {
    add(items, {
      id: 'OPME_ANVISA_NOT_FOUND',
      texto: `${String(notFound)} material(is) sem registro ANVISA localizado`,
      sub: 'Bloqueio administrativo — verificar número antes de aprovar',
      status: 'error',
      origin: 'dados',
      severity: 95,
      showWhenOk: true,
    });
  }
  if (expired > 0) {
    add(items, {
      id: 'OPME_ANVISA_EXPIRED',
      texto: `${String(expired)} material(is) com registro ANVISA expirado`,
      sub: 'Alerta — analista decide se aceita prosseguir (RN 566/2022)',
      status: 'warning',
      origin: 'dados',
      severity: 70,
      showWhenOk: true,
    });
  }
  if (allValid) {
    add(items, {
      id: 'OPME_ANVISA_OK',
      texto: 'Registros ANVISA válidos para todos os materiais',
      status: 'ok',
      origin: 'dados',
      showWhenOk: true,
    });
  }
}

function pushQuotationsItems(items: ChecklistItem[], s: OpmeChecklistScenario): void {
  const missing = s.quotationsMissing ?? 0;
  if (missing > 0) {
    add(items, {
      id: 'OPME_QUOTATIONS_MISSING',
      texto: `${String(missing)} material(is) com menos de 3 cotações`,
      sub: 'TISS 19 exige mínimo de 3 cotações distintas por material',
      status: 'error',
      origin: 'dados',
      severity: 85,
      showWhenOk: true,
    });
    return;
  }
  if (s.quotationsComplete !== false) {
    add(items, {
      id: 'OPME_QUOTATIONS_OK',
      texto: 'Cotações completas — 3 fornecedores distintos por material',
      status: 'ok',
      origin: 'dados',
      showWhenOk: true,
    });
  }
}

function pushChoiceItems(items: ChecklistItem[], s: OpmeChecklistScenario): void {
  if (s.cheapestQuotationChosen === false) {
    if (s.justificationProvided === true) {
      add(items, {
        id: 'OPME_NON_CHEAPEST_JUSTIFIED',
        texto: 'Cotação acima da mais barata — justificativa estruturada apresentada',
        sub: 'Audit log carrega motivo + observação',
        status: 'warning',
        origin: 'dados',
        severity: 40,
        showWhenOk: true,
      });
    } else {
      add(items, {
        id: 'OPME_NON_CHEAPEST_UNJUSTIFIED',
        texto: 'Cotação acima da mais barata sem justificativa',
        sub: 'Solicitar justificativa estruturada antes de aprovar',
        status: 'error',
        origin: 'dados',
        severity: 80,
        showWhenOk: true,
      });
    }
    return;
  }
  add(items, {
    id: 'OPME_CHEAPEST_CHOSEN',
    texto: 'Cotação mais econômica selecionada para todos os materiais',
    status: 'ok',
    origin: 'dados',
    showWhenOk: true,
  });
}

function pushValueItems(items: ChecklistItem[], s: OpmeChecklistScenario): void {
  if (s.totalValueAboveTable === true) {
    add(items, {
      id: 'OPME_VALUE_ABOVE_TABLE',
      texto: 'Valor total acima do parâmetro de tabela da operadora',
      sub: 'Considerar ajuste por motivo VALOR_ACIMA_TABELA',
      status: 'warning',
      origin: 'dados',
      severity: 55,
      showWhenOk: true,
    });
  }
}

function pushManufacturerItem(items: ChecklistItem[], s: OpmeChecklistScenario): void {
  if (s.manufacturerRecognized === false) {
    add(items, {
      id: 'OPME_MANUFACTURER_UNKNOWN',
      texto: 'Fabricante não reconhecido na base de fornecedores credenciados',
      sub: 'Validar credenciamento manualmente',
      status: 'warning',
      origin: 'dados',
      severity: 50,
      showWhenOk: true,
    });
  }
}

function pushLinkItems(items: ChecklistItem[], s: OpmeChecklistScenario): void {
  if (s.surgeryLinked === true) {
    add(items, {
      id: 'OPME_SURGERY_LINKED',
      texto: 'OPME vinculado a cirurgia eletiva',
      status: 'ok',
      origin: 'engenharia',
      showWhenOk: true,
    });
  }
  if (s.oncologyLinked === true) {
    add(items, {
      id: 'OPME_ONCOLOGY_LINKED',
      texto: 'OPME vinculado a protocolo oncológico ativo',
      sub: 'Material complementa estadiamento/cirurgia oncológica',
      status: 'ok',
      origin: 'engenharia',
      showWhenOk: true,
    });
  }
}

export function buildOpmeChecklist(scenario: OpmeChecklistScenario = {}): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  pushAnvisaItems(items, scenario);
  pushQuotationsItems(items, scenario);
  pushChoiceItems(items, scenario);
  pushValueItems(items, scenario);
  pushManufacturerItem(items, scenario);
  pushLinkItems(items, scenario);
  pushBeneficiaryEligibility(items, scenario);
  pushSolicitante(items, scenario);
  pushPrestador(items, scenario);
  return items;
}
