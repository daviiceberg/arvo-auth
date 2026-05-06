import { type Request } from '@/types/pedido';

export type RequestStage =
  | 'Aguardando análise'
  | 'IA Reprocessando'
  | 'Pendência aberta'
  | 'Aguardando junta'
  | 'Aguardando reanálise';

export function getRequestStage(request: Request): RequestStage {
  // IA is reprocessing
  if (request.iaReprocessing) {
    return 'IA Reprocessando';
  }

  // Junta Médica scenarios
  if (request.juntaMedicaContext) {
    if (request.juntaMedicaContext.status === 'aguardando') {
      return 'Aguardando junta';
    }
    // Junta returned (parecer_recebido)
    if (request.juntaMedicaContext.status === 'parecer_recebido') {
      return 'Aguardando reanálise';
    }
  }

  // Pendency scenarios
  if (request.pendencyContext) {
    if (request.subStatus === 'PENDENTE_AGUARDANDO') {
      return 'Pendência aberta';
    }
    // Devolutiva received
    if (request.subStatus === 'PENDENTE_RETORNO_RECEBIDO') {
      return 'Aguardando reanálise';
    }
  }

  // Default: awaiting analysis
  return 'Aguardando análise';
}
