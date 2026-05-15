'use client';

import { useMemo } from 'react';

import { pedidos } from '@/data/pedidos';
import { type GuideStatus, type Request } from '@/types/pedido';

/**
 * Predictive SLA score for the queue — gives the manager a one-glance read on
 * whether the current backlog can be cleared within the remaining shift, and
 * whether reinforcement is needed.
 *
 * Parameters are mocked here until backend exposes them via operator config.
 */
const TEMPO_MEDIO_ANALISE_MIN = 30;
const AUTORIZADORES_ATIVOS = 6;
const HORAS_TURNO_RESTANTES = 4;

const ACTIVE_QUEUE_STATUSES: readonly GuideStatus[] = ['Em Análise', 'Pendente', 'Devolutiva'];

type StatusGeral = 'ok' | 'atencao' | 'critico';

export interface SlaPredictiveScore {
  totalFila: number;
  emRiscoCritico: number;
  jaViolados: number;
  percentualRisco: number;
  trabalhoRestanteHoras: number;
  capacidadeHoras: number;
  statusGeral: StatusGeral;
  tempoMedioAnaliseMin: number;
  autorizadoresAtivos: number;
  horasTurnoRestantes: number;
}

function isActive(request: Request): boolean {
  return ACTIVE_QUEUE_STATUSES.includes(request.status);
}

function computeStatusGeral(trabalhoRestanteHoras: number, capacidadeHoras: number): StatusGeral {
  if (capacidadeHoras === 0) return 'critico';
  const ratio = trabalhoRestanteHoras / capacidadeHoras;
  if (ratio <= 0.7) return 'ok';
  if (ratio <= 1.0) return 'atencao';
  return 'critico';
}

function slaRestanteHoras(request: Request): number {
  return request.slaDeadlineHours - request.queueTimeHours;
}

export default function useSlaPredictiveScore(): SlaPredictiveScore {
  return useMemo(() => {
    const queue = pedidos
      .filter(isActive)
      .slice()
      .sort((a, b) => slaRestanteHoras(a) - slaRestanteHoras(b));

    const totalFila = queue.length;
    let emRiscoCritico = 0;
    let jaViolados = 0;

    queue.forEach((request, index) => {
      const restante = slaRestanteHoras(request);
      if (restante <= 0) {
        jaViolados += 1;
        return;
      }
      const tempoAteProcessarHoras =
        (TEMPO_MEDIO_ANALISE_MIN / 60) * (index / AUTORIZADORES_ATIVOS);
      if (restante < tempoAteProcessarHoras) {
        emRiscoCritico += 1;
      }
    });

    const percentualRisco =
      totalFila === 0 ? 0 : Math.round(((emRiscoCritico + jaViolados) / totalFila) * 100);
    const trabalhoRestanteHoras = Math.round((totalFila * TEMPO_MEDIO_ANALISE_MIN) / 6) / 10;
    const capacidadeHoras = AUTORIZADORES_ATIVOS * HORAS_TURNO_RESTANTES;
    const statusGeral = computeStatusGeral(trabalhoRestanteHoras, capacidadeHoras);

    return {
      totalFila,
      emRiscoCritico,
      jaViolados,
      percentualRisco,
      trabalhoRestanteHoras,
      capacidadeHoras,
      statusGeral,
      tempoMedioAnaliseMin: TEMPO_MEDIO_ANALISE_MIN,
      autorizadoresAtivos: AUTORIZADORES_ATIVOS,
      horasTurnoRestantes: HORAS_TURNO_RESTANTES,
    };
  }, []);
}
