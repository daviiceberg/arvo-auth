import { type SLAStatus } from '@/types/pedido';

function parseQueueTimeToHours(queueTime: string): number {
  const match = /(\d+)/.exec(queueTime);
  return match ? Number(match[1]) : 0;
}

function formatHours(hours: number): string {
  if (hours >= 48) {
    const days = Math.round(hours / 24);
    return `${String(days)} dias`;
  }
  return `${String(hours)}h`;
}

export function formatSlaDisplay(
  slaStatus: SLAStatus,
  _slaText: string,
  queueTime: string,
  slaDeadlineHours: number,
): { text: string; color: string } {
  const elapsedHours = parseQueueTimeToHours(queueTime);
  const elapsedText = formatHours(elapsedHours);
  const deadlineText = formatHours(slaDeadlineHours);

  if (slaStatus === 'violated') {
    const overHours = elapsedHours - slaDeadlineHours;
    const overText = formatHours(Math.max(0, overHours));
    return {
      text: `SLA: ${elapsedText} de ${deadlineText} (Violado há ${overText})`,
      color: 'error.main',
    };
  }

  const remainingHours = slaDeadlineHours - elapsedHours;
  const remainingText = formatHours(Math.max(0, remainingHours));

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
