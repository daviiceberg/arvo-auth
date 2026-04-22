/**
 * Real extractions service — hits `POST /api/solicitations/analyze` and polls
 * `GET /api/solicitations/extractions/:id` on the backend. Selected in
 * `extractions.service.ts` when `NEXT_PUBLIC_USE_FAKE_EXTRACTIONS=false`.
 */

import axios from 'axios';

import { apiClient } from '@/core/api/client';

import {
  type ExtractionsService,
  type Unsubscribe,
  type UploadExtractionInput,
  type UploadExtractionResponse,
  type WatchStatusHandlers,
} from './extractions.types';

/**
 * Wire shape of the analyze response. Field names are snake_case to match the
 * backend; `upload()` below maps them to the camelCase `UploadExtractionResponse`
 * that the rest of the front consumes.
 */
interface AnalyzeResponseWire {
  extraction_id: string;
  status: UploadExtractionResponse['status'];
}

interface AnalyzeResponseEnvelope {
  data: AnalyzeResponseWire;
}

/**
 * Wire shape of the extraction snapshot returned by `GET /extractions/:id`.
 * The field names are snake_case to match the backend response directly;
 * downstream consumers don't see this type — only the hook-friendly signals
 * emitted through `WatchStatusHandlers`.
 */
interface ExtractionSnapshotResponse {
  extraction_id: string;
  status: 'processed';
  patient_name?: string;
  physician_name?: string;
  procedures_count: number;
}

interface SnapshotEnvelope {
  data: ExtractionSnapshotResponse;
}

/** Interval (ms) between status polls while the extraction is in `waiting`. */
const POLL_INTERVAL_MS = 5_000;

/**
 * Maximum total time (ms) the client waits for the backend to finish processing
 * the extraction before giving up and reporting a timeout to the caller.
 *
 * Chosen as 3 minutes to match the backend HTTP client timeout against the
 * extractor (`externalclient/client.go`) plus a small margin for persistence.
 * Beyond this, either the extractor hung or the background goroutine died
 * without persisting — in both cases the user deserves feedback rather than a
 * spinner forever.
 */
const POLL_MAX_DURATION_MS = 180_000;

async function upload(input: UploadExtractionInput): Promise<UploadExtractionResponse> {
  const form = new FormData();
  form.append('file', input.file);
  if (input.extractionId !== undefined && input.extractionId.length > 0) {
    form.append('extraction_id', input.extractionId);
  }

  const { data } = await apiClient.post<AnalyzeResponseEnvelope>(
    '/api/solicitations/analyze',
    form,
    {
      signal: input.signal,
      onUploadProgress: (event) => {
        if (!input.onProgress) return;
        const total = event.total ?? input.file.size;
        if (total <= 0) return;
        const percent = Math.min(100, Math.round((event.loaded / total) * 100));
        input.onProgress(percent);
      },
    },
  );

  return {
    extractionId: data.data.extraction_id,
    status: data.data.status,
  };
}

/**
 * Polls `GET /api/solicitations/extractions/:id` every POLL_INTERVAL_MS until
 * the backend answers 200 (extraction persisted → `onProcessed`). A 404 is
 * treated as "still processing" and the polling continues. Any other HTTP or
 * network error is terminal and surfaces via `onFailed`.
 *
 * When Firebase lands, this implementation is replaced by a Firestore
 * listener; the handler contract and consumer-side code don't change.
 */
function watchStatus(extractionId: string, handlers: WatchStatusHandlers): Unsubscribe {
  // AbortController doubles as cancellation signal (propagated into axios so
  // an in-flight request is aborted when the caller unsubscribes) and as a
  // sentinel the poll loop checks between iterations.
  const controller = new AbortController();
  let pollTimer: ReturnType<typeof setTimeout> | null = null;
  let timeoutTimer: ReturnType<typeof setTimeout> | null = null;

  const cleanup = () => {
    controller.abort();
    if (pollTimer !== null) clearTimeout(pollTimer);
    if (timeoutTimer !== null) clearTimeout(timeoutTimer);
  };

  // Hard upper bound: if the backend did not persist the extraction within
  // POLL_MAX_DURATION_MS, stop polling and surface a timeout so the UI can
  // recover. Without this, a crashed background goroutine (or a stuck
  // external extractor) would keep the UI in `waiting` forever.
  timeoutTimer = setTimeout(() => {
    cleanup();
    handlers.onFailed(
      'Tempo limite excedido: a análise não foi concluída no tempo esperado. Tente novamente.',
    );
  }, POLL_MAX_DURATION_MS);

  const poll = async (): Promise<void> => {
    if (controller.signal.aborted) return;
    try {
      await apiClient.get<SnapshotEnvelope>(`/api/solicitations/extractions/${extractionId}`, {
        signal: controller.signal,
      });
      // A 200 means the extraction row is persisted → finished processing.
      // The backend only returns 200 with status="processed" today; richer
      // states would arrive as distinct HTTP semantics.
      cleanup();
      handlers.onProcessed();
      return;
    } catch (err) {
      if (axios.isCancel(err)) return;
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        // Not ready yet — continue polling.
      } else {
        cleanup();
        const message =
          err instanceof Error ? err.message : 'Erro ao consultar o status da extração';
        handlers.onFailed(message);
        return;
      }
    }
    pollTimer = setTimeout(() => {
      void poll();
    }, POLL_INTERVAL_MS);
  };

  void poll();

  return cleanup;
}

export const extractionsApi: ExtractionsService = { upload, watchStatus };
