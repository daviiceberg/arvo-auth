'use client';

import { useState, useEffect, useCallback } from 'react';

import { type Adjustment } from '@/types/pedido';

import { ADJUSTMENT_REASONS, OPME_VALUE_REASONS } from '../constants/adjustment-reasons';
import { USER_PROFILE } from '../types';

// ---- Types ----
type AdjustmentField = 'quantidade' | 'prestador' | 'codigo' | 'fabricante' | 'valorUnitario' | '';

interface ProcedureInfo {
  codigo: string;
  descricao: string;
  qty: number;
  prestador: string;
  fabricante?: string;
  valorUnitario?: number;
}

interface UseAdjustmentFormParams {
  proc: ProcedureInfo | null;
  existingAdjustments: Adjustment[];
  open: boolean;
  onClose: () => void;
  onConfirm: (adjustment: Omit<Adjustment, 'id'>) => void;
}

interface FormState {
  field: AdjustmentField;
  newQty: string;
  newProvider: string;
  newCNES: string;
  newCode: string;
  newDesc: string;
  newManufacturer: string;
  newValue: string;
  reason: string;
  justification: string;
  errors: Record<string, string>;
}

function validateQuantityField(
  form: FormState,
  qtyNum: number,
  qtyStatus: string | null,
): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!form.newQty || isNaN(qtyNum) || qtyNum < 1)
    errs.newQty = 'Informe uma quantidade válida (mín. 1)';
  if (qtyStatus === 'above') errs.newQty = 'Não é possível autorizar mais que o solicitado';
  return errs;
}

function validateProviderField(form: FormState): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!form.newProvider.trim()) errs.newProvider = 'Informe o novo prestador';
  return errs;
}

function validateCodeField(form: FormState): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!form.newCode.trim()) errs.newCode = 'Informe o novo código';
  if (!form.newDesc.trim()) errs.newDesc = 'Informe a nova descrição';
  return errs;
}

function validateManufacturerField(form: FormState): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!form.newManufacturer.trim()) errs.newManufacturer = 'Informe o novo fabricante';
  return errs;
}

function validateValueField(form: FormState): Record<string, string> {
  const errs: Record<string, string> = {};
  const v = parseFloat(form.newValue);
  if (!form.newValue || isNaN(v) || v <= 0) errs.newValue = 'Informe um valor válido (> 0)';
  return errs;
}

const FIELD_VALIDATORS: Record<
  AdjustmentField,
  (form: FormState, qtyNum: number, qtyStatus: string | null) => Record<string, string>
> = {
  quantidade: validateQuantityField,
  prestador: (form) => validateProviderField(form),
  codigo: (form) => validateCodeField(form),
  fabricante: (form) => validateManufacturerField(form),
  valorUnitario: (form) => validateValueField(form),
  '': () => ({}),
};

const EMPTY_FORM: FormState = {
  field: '',
  newQty: '',
  newProvider: '',
  newCNES: '',
  newCode: '',
  newDesc: '',
  newManufacturer: '',
  newValue: '',
  reason: '',
  justification: '',
  errors: {},
};

function buildInitialForm(
  proc: ProcedureInfo | null,
  existingAdjustments: Adjustment[],
): FormState {
  const lastQtyAdj = existingAdjustments
    .filter((a) => a.procedureCode === proc?.codigo && a.field === 'quantidade')
    .slice(-1)[0];
  const lastProviderAdj = existingAdjustments
    .filter((a) => a.procedureCode === proc?.codigo && a.field === 'prestador')
    .slice(-1)[0];
  const lastCodeAdj = existingAdjustments
    .filter((a) => a.procedureCode === proc?.codigo && a.field === 'codigo')
    .slice(-1)[0];

  if (lastQtyAdj) {
    return { ...EMPTY_FORM, field: 'quantidade', newQty: lastQtyAdj.newValue };
  }
  if (lastProviderAdj) {
    const cnesMatch = /CNES: (.+)\)$/.exec(lastProviderAdj.newValue);
    return {
      ...EMPTY_FORM,
      field: 'prestador',
      newProvider: lastProviderAdj.newValue.replace(/ \(CNES: .+\)$/, ''),
      newCNES: cnesMatch?.[1] ?? '',
    };
  }
  if (lastCodeAdj) {
    return {
      ...EMPTY_FORM,
      field: 'codigo',
      newCode: lastCodeAdj.newValue.split(' — ')[0] ?? '',
      newDesc: lastCodeAdj.newValue.split(' — ')[1] ?? '',
    };
  }
  return EMPTY_FORM;
}

export function useAdjustmentForm({
  proc,
  existingAdjustments,
  open,
  onClose,
  onConfirm,
}: UseAdjustmentFormParams) {
  const [form, setForm] = useState(() => buildInitialForm(proc, existingAdjustments));

  const isOpme = proc?.fabricante !== undefined;

  const fieldsBase =
    USER_PROFILE === 'Gestor'
      ? [
          { value: 'quantidade', label: 'Quantidade autorizada' },
          { value: 'prestador', label: 'Prestador executante' },
          { value: 'codigo', label: 'Código do procedimento' },
        ]
      : [{ value: 'quantidade', label: 'Quantidade autorizada' }];

  const availableFields = isOpme
    ? [
        ...fieldsBase,
        { value: 'fabricante', label: 'Fabricante' },
        { value: 'valorUnitario', label: 'Valor unitário' },
      ]
    : fieldsBase;

  const availableReasons =
    form.field === 'valorUnitario'
      ? [...ADJUSTMENT_REASONS, ...OPME_VALUE_REASONS]
      : ADJUSTMENT_REASONS;

  const qtyNum = parseInt(form.newQty, 10);
  const qtyStatus =
    !form.newQty || isNaN(qtyNum)
      ? null
      : qtyNum < (proc?.qty ?? 0)
        ? 'below'
        : qtyNum === (proc?.qty ?? 0)
          ? 'equal'
          : 'above';

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [open, onClose]);

  const setField = useCallback((value: AdjustmentField) => {
    setForm((prev) => ({ ...prev, field: value }));
  }, []);
  const setNewQty = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, newQty: value }));
  }, []);
  const setNewProvider = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, newProvider: value }));
  }, []);
  const setNewCNES = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, newCNES: value }));
  }, []);
  const setNewCode = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, newCode: value }));
  }, []);
  const setNewDesc = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, newDesc: value }));
  }, []);
  const setNewManufacturer = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, newManufacturer: value }));
  }, []);
  const setNewValue = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, newValue: value }));
  }, []);
  const setReason = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, reason: value }));
  }, []);
  const setJustification = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, justification: value }));
  }, []);
  const setErrors = useCallback((value: Record<string, string>) => {
    setForm((prev) => ({ ...prev, errors: value }));
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.field) errs.field = 'Selecione o campo a ajustar';
    Object.assign(errs, FIELD_VALIDATORS[form.field](form, qtyNum, qtyStatus));
    if (!form.reason) errs.motivo = 'Selecione o motivo';
    if (form.reason === 'Outro (descrever na fundamentação)' && !form.justification.trim()) {
      errs.justification = 'Fundamentação obrigatória quando motivo é "Outro"';
    }
    return errs;
  };

  const handleConfirm = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!proc || !form.field) return;

    let prevValue = '';
    let newVal = '';
    if (form.field === 'quantidade') {
      prevValue = String(proc.qty);
      newVal = form.newQty;
    }
    if (form.field === 'prestador') {
      prevValue = proc.prestador;
      newVal = form.newCNES ? `${form.newProvider} (CNES: ${form.newCNES})` : form.newProvider;
    }
    if (form.field === 'codigo') {
      prevValue = proc.codigo;
      newVal = `${form.newCode} — ${form.newDesc}`;
    }
    if (form.field === 'fabricante') {
      prevValue = proc.fabricante ?? '';
      newVal = form.newManufacturer;
    }
    if (form.field === 'valorUnitario') {
      prevValue = proc.valorUnitario
        ? proc.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : '—';
      newVal = parseFloat(form.newValue).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    }

    onConfirm({
      procedureCode: proc.codigo,
      procedureDescription: proc.descricao,
      field: form.field,
      previousValue: prevValue,
      newValue: newVal,
      reason: form.reason,
      justification: form.justification.trim() || undefined,
      operator: 'Ana Paula Santos',
      profile: USER_PROFILE,
      timestamp: new Date().toISOString(),
    });
  };

  return {
    field: form.field,
    setField,
    newQty: form.newQty,
    setNewQty,
    newProvider: form.newProvider,
    setNewProvider,
    newCNES: form.newCNES,
    setNewCNES,
    newCode: form.newCode,
    setNewCode,
    newDesc: form.newDesc,
    setNewDesc,
    newManufacturer: form.newManufacturer,
    setNewManufacturer,
    newValue: form.newValue,
    setNewValue,
    reason: form.reason,
    setReason,
    justification: form.justification,
    setJustification,
    errors: form.errors,
    setErrors,
    isOpme,
    availableFields,
    availableReasons,
    qtyNum,
    qtyStatus,
    validate,
    handleConfirm,
  };
}

export type UseAdjustmentFormReturn = ReturnType<typeof useAdjustmentForm>;
