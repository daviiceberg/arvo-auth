/**
 * @prototype
 * @status FAKE — awaiting real backend endpoint wired via NEXT_PUBLIC_USE_FAKE_EXTRACTIONS=false
 * @planned-endpoint POST /api/solicitations/analyze (multipart)
 *
 * Fake implementation of the extractions service. Used while the back endpoint
 * is not deployed to sandbox. Swapping this out for the real `extractions.api`
 * happens transparently in `extractions.service.ts` via the
 * `NEXT_PUBLIC_USE_FAKE_EXTRACTIONS` flag — consumers are untouched.
 */

import {
  FAKE_PROCESSING_DELAY_MAX_MS,
  FAKE_PROCESSING_DELAY_MIN_MS,
  FAKE_PROGRESS_TICKS,
  FAKE_TOTAL_UPLOAD_MS,
} from './extractions.fake-data';
import {
  type ExtractionsService,
  type Unsubscribe,
  type UploadExtractionInput,
  type UploadExtractionResponse,
  type WatchStatusHandlers,
} from './extractions.types';

async function upload(input: UploadExtractionInput): Promise<UploadExtractionResponse> {
  const tickDelay = Math.max(1, Math.floor(FAKE_TOTAL_UPLOAD_MS / FAKE_PROGRESS_TICKS.length));

  for (const pct of FAKE_PROGRESS_TICKS) {
    await delay(tickDelay);
    if (input.signal?.aborted) {
      throw new DOMException('Upload aborted', 'AbortError');
    }
    input.onProgress?.(pct);
  }

  return {
    extractionId: input.extractionId ?? generateUuid(),
    status: 'processing',
  };
}

function watchStatus(_extractionId: string, handlers: WatchStatusHandlers): Unsubscribe {
  const range = FAKE_PROCESSING_DELAY_MAX_MS - FAKE_PROCESSING_DELAY_MIN_MS;
  const delayMs = FAKE_PROCESSING_DELAY_MIN_MS + Math.random() * range;

  const handle = setTimeout(() => {
    handlers.onProcessed();
  }, delayMs);

  return () => {
    clearTimeout(handle);
  };
}

export const extractionsFake: ExtractionsService = { upload, watchStatus };

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function generateUuid(): string {
  return globalThis.crypto.randomUUID();
}
