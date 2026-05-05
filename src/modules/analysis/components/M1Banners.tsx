'use client';

import { type UserPermissionsM1 } from '@/shared/hooks/useUserPermissions';
import { pushDynamicNotification } from '@/shared/notifications/notification-store';
import { type Request } from '@/types/pedido';

import { type UseM1RequestStateResult } from '../hooks/useM1RequestState';

import JuntaMedicaCard from './JuntaMedicaCard';
import OperatorLockBanner from './OperatorLockBanner';
import PendencyBanner from './PendencyBanner';

interface M1BannersProps {
  request: Request;
  m1: UseM1RequestStateResult;
  permissions: UserPermissionsM1 & { profile: string };
  showSnackbar: (msg: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const PARECER_MOCK_TEXT =
  'Após análise dos documentos e do plano terapêutico, a junta entende que o protocolo solicitado é tecnicamente justificado e respaldado por evidência. Recomenda-se aprovação integral, com reavaliação ao final do ciclo.';

export default function M1Banners({ request, m1, permissions, showSnackbar }: M1BannersProps) {
  return (
    <>
      {request.operatorLock ? (
        <OperatorLockBanner
          lock={request.operatorLock}
          canForceUnlock={permissions.canForceUnlock}
          onForceUnlock={() => {
            m1.forceUnlock(permissions.profile);
            showSnackbar('Lock destravado com sucesso.', 'success');
          }}
        />
      ) : null}
      {request.pendencyContext && request.subStatus?.startsWith('PENDENTE') ? (
        <PendencyBanner
          subStatus={request.subStatus}
          context={request.pendencyContext}
          onSimulateReturn={
            request.subStatus === 'PENDENTE_AGUARDANDO'
              ? () => {
                  m1.simulateProviderReturn(permissions.profile, () => {
                    showSnackbar('Análise reprocessada — recomendação atualizada.', 'success');
                    pushDynamicNotification({
                      id: `notif-dyn-dev-${request.id}-${String(Date.now())}`,
                      type: 'devolutiva_recebida',
                      title: 'Retorno do prestador recebido',
                      message: `${request.id} · ${request.beneficiary.name} · Documentação atualizada — pronto para análise`,
                      time: 'agora',
                      read: false,
                      href: `/analise?id=${request.id}`,
                    });
                  });
                  showSnackbar('Retorno do prestador recebido — IA reprocessando.', 'info');
                }
              : undefined
          }
        />
      ) : null}
      {request.juntaMedicaContext && request.subStatus?.startsWith('JUNTA') ? (
        <JuntaMedicaCard
          subStatus={request.subStatus}
          context={request.juntaMedicaContext}
          slaAlreadySuspended={Boolean(request.slaSuspension)}
          onSimulateParecer={
            request.subStatus === 'JUNTA_AGUARDANDO'
              ? () => {
                  m1.simulateJuntaParecer(
                    {
                      suggestedDecision: 'aprovado',
                      text: PARECER_MOCK_TEXT,
                      actor: permissions.profile,
                    },
                    () => {
                      showSnackbar('Análise reprocessada — recomendação atualizada.', 'success');
                      pushDynamicNotification({
                        id: `notif-dyn-junta-${request.id}-${String(Date.now())}`,
                        type: 'junta_parecer_recebido',
                        title: 'Parecer da Junta Médica disponível',
                        message: `${request.id} · ${request.beneficiary.name} · Parecer técnico recebido — aguardando sua decisão`,
                        time: 'agora',
                        read: false,
                        href: `/analise?id=${request.id}`,
                      });
                    },
                  );
                  showSnackbar('Parecer da junta recebido — IA reprocessando.', 'info');
                }
              : undefined
          }
          onSuspendSla={
            request.subStatus === 'JUNTA_AGUARDANDO'
              ? () => {
                  const ok = m1.suspendSla({
                    reason: 'EXAME_COMPLEMENTAR',
                    actor: permissions.profile,
                  });
                  showSnackbar(
                    ok
                      ? 'SLA suspenso por 3 dias úteis.'
                      : 'SLA já foi suspenso uma vez neste pedido (idempotência).',
                    ok ? 'success' : 'warning',
                  );
                }
              : undefined
          }
        />
      ) : null}
    </>
  );
}
