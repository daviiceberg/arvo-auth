'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

import { useMutation } from '@tanstack/react-query';

import { extractionsService } from '@/services/extractions/extractions.service';
import { type Unsubscribe } from '@/services/extractions/extractions.types';
import { logger } from '@/shared/utils/logger';

/**
 * Upload lifecycle states.
 *
 * - `idle`        — initial, drop zone accepts a file
 * - `uploading`   — file bytes being sent to the backend (determinate progress)
 * - `waiting`     — backend returned 202; analysis is running in the background
 * - `processed`   — backend signalled the analysis finished; user can advance
 *
 * A failure in any step resets the state to `idle` and surfaces the error via
 * the `onFailed` callback supplied by the caller.
 */
type UploadState = 'idle' | 'uploading' | 'waiting' | 'processed';

/**
 * Callbacks the page provides to receive side-effect signals. They decouple
 * the ViewModel from UI concerns (snackbars, navigation) and run after the
 * hook has already updated its internal state.
 */
export interface UploadCallbacks {
  /** Called once the backend finished the extraction. Receives the id so the
   * caller can persist it for later (e.g. creating a solicitation). */
  onProcessed?: (extractionId: string) => void;
  /** Called on any terminal failure (upload or processing). */
  onFailed: (message: string) => void;
}

export interface UseUploadStepResult {
  uploadState: UploadState;
  uploadProgress: number;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
  zoom: number;
  rotation: number;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleFileSelected: (file: File, callbacks: UploadCallbacks) => void;
  resetUpload: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  rotate: () => void;
}

export function useUploadStep(): UseUploadStepResult {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  // Release any pending watch subscription when the component unmounts so we
  // don't leak timers (fake) or listeners (real, once Firebase is wired).
  useEffect(() => {
    return () => {
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
  }, []);

  const mutation = useMutation({
    mutationFn: (file: File) =>
      extractionsService.upload({
        file,
        onProgress: (pct) => {
          setUploadProgress(pct);
        },
      }),
  });

  const handleFileSelected = useCallback(
    (file: File, callbacks: UploadCallbacks) => {
      // Cancel any previous in-flight watch before starting a new upload.
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;

      setUploadState('uploading');
      setUploadProgress(0);

      mutation.mutate(file, {
        onSuccess: (response) => {
          logger.info('Extraction accepted by backend', {
            extractionId: response.extractionId,
            status: response.status,
          });
          setUploadProgress(100);
          setUploadState('waiting');

          unsubscribeRef.current = extractionsService.watchStatus(response.extractionId, {
            onProcessed: () => {
              logger.info('Extraction processed', {
                extractionId: response.extractionId,
              });
              setUploadState('processed');
              callbacks.onProcessed?.(response.extractionId);
            },
            onFailed: (message) => {
              logger.error('Extraction processing failed', {
                extractionId: response.extractionId,
                message,
              });
              setUploadState('idle');
              setUploadProgress(0);
              callbacks.onFailed(message);
            },
          });
        },
        onError: (err) => {
          const message =
            err instanceof Error ? err.message : 'Erro desconhecido ao enviar o arquivo';
          logger.error('Extraction upload failed', { message });
          setUploadState('idle');
          setUploadProgress(0);
          callbacks.onFailed(message);
        },
      });
    },
    [mutation],
  );

  const resetUpload = useCallback(() => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    setUploadState('idle');
    setUploadProgress(0);
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(200, z + 10));
  }, []);
  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(50, z - 10));
  }, []);
  const rotate = useCallback(() => {
    setRotation((r) => (r + 90) % 360);
  }, []);

  return {
    uploadState,
    uploadProgress,
    dragOver,
    setDragOver,
    zoom,
    rotation,
    fileInputRef,
    handleFileSelected,
    resetUpload,
    zoomIn,
    zoomOut,
    rotate,
  };
}
