import { formatDurationFromHours } from '@/shared/utils/formatDuration';
import { type SLAStatus } from '@/types/pedido';

export function formatSlaDisplay(
  slaStatus: SLAStatus,
  _slaText: string,
  queueTimeHours: number,
  slaDeadlineHours: number,
): { text: string; color: string } {
  const elapsedText = formatDurationFromHours(queueTimeHours);
  const deadlineText = formatDurationFromHours(slaDeadlineHours);

  if (slaStatus === 'violated') {
    const overHours = queueTimeHours - slaDeadlineHours;
    const overText = formatDurationFromHours(Math.max(0, overHours));
    return {
      text: `SLA: ${elapsedText} de ${deadlineText} (Violado há ${overText})`,
      color: 'error.main',
    };
  }

  const remainingHours = slaDeadlineHours - queueTimeHours;
  const remainingText = formatDurationFromHours(Math.max(0, remainingHours));

  if (slaStatus === 'warning') {
    return {
      text: `SLA: ${elapsedText} de ${deadlineText} (${remainingText} restantes)`,
      color: 'warning.main',
    };
  }

  return {
    text: `SLA: ${elapsedText} de ${deadlineText}`,
    color: 'text.secondary',
  };
}
