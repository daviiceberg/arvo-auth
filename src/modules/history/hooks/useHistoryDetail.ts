'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { historicoEntries } from '@/data/pedidos';

import { type NotifyChannel } from '../types';

/** Sorted entries — same default order as the list page (newest first). */
function getSortedEntries() {
  return [...historicoEntries].sort((a, b) => {
    const parse = (d: string) => new Date(d.split('/').reverse().join('-')).getTime();
    return parse(b.dataDecisao) - parse(a.dataDecisao);
  });
}

export default function useHistoryDetail() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const sortedEntries = useMemo(() => getSortedEntries(), []);

  const entry = useMemo(
    () => historicoEntries.find((e) => e.id === id) ?? null,
    [id],
  );

  const currentIndex = useMemo(
    () => sortedEntries.findIndex((e) => e.id === id),
    [sortedEntries, id],
  );

  const total = sortedEntries.length;

  // -- Navigation ----------------------------------------------------------
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      router.push('/historico/' + sortedEntries[currentIndex - 1]!.id);
    }
  }, [currentIndex, sortedEntries, router]);

  const handleNext = useCallback(() => {
    if (currentIndex < total - 1) {
      router.push('/historico/' + sortedEntries[currentIndex + 1]!.id);
    }
  }, [currentIndex, total, sortedEntries, router]);

  // -- Keyboard navigation -------------------------------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) {
        return;
      }
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); };
  }, [handlePrev, handleNext]);

  // -- Notify dialog state -------------------------------------------------
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyChannel, setNotifyChannel] = useState<NotifyChannel>('app');

  // -- Snackbar state ------------------------------------------------------
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleNotify = () => {
    setNotifyOpen(false);
    const labels: Record<NotifyChannel, string> = {
      app: 'App',
      whatsapp: 'WhatsApp',
      email: 'E-mail',
    };
    setSnackbar({
      open: true,
      message: `Decisão informada ao beneficiário via ${labels[notifyChannel]}.`,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((s) => ({ ...s, open: false }));
  };

  const handleDownloadPDF = () => {
    const a = document.createElement('a');
    a.href = '/exemplo-pedido.png';
    a.download = `autorizacao-${id}.pdf`;
    a.click();
  };

  return {
    // Entry data
    entry,
    id,
    currentIndex,
    total,

    // Navigation
    handlePrev,
    handleNext,

    // Notify dialog
    notifyOpen,
    setNotifyOpen,
    notifyChannel,
    setNotifyChannel,
    handleNotify,

    // Snackbar
    snackbar,
    closeSnackbar,

    // Actions
    handleDownloadPDF,

    // Router (for sub-components that need navigation)
    router,
  };
}
