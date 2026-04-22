/**
 * Contracts for the extractions service layer.
 *
 * The shapes here mirror the back contract of `POST /api/solicitations/analyze`
 * as defined in the regenerated Swagger (NEW-897). The service layer follows
 * the Prototyping pattern documented in AGENTS.mode.prototype.md: consumers
 * import only from `extractions.service.ts` and never reference the fake or
 * api modules directly.
 */

/** Status returned by the back on the 202 response of `POST /analyze`. */
export type UploadStatus = 'processing';

export interface UploadExtractionInput {
  /** The multipart file picked by the user (PDF, JPG, PNG, up to 10 MB). */
  file: File;
  /**
   * Client-generated UUID v4 used as idempotency key. When omitted, the service
   * generates one and includes it in the request; the back also regenerates if
   * the field is missing or malformed.
   */
  extractionId?: string;
  /** Receives upload progress from 0 to 100. */
  onProgress?: (percent: number) => void;
  /** Allows aborting the upload when the caller unmounts or cancels. */
  signal?: AbortSignal;
}

export interface UploadExtractionResponse {
  extractionId: string;
  status: UploadStatus;
}

/** Callbacks notified asynchronously by `watchStatus`. */
export interface WatchStatusHandlers {
  /** Called when the backend finished processing the extraction. */
  onProcessed: () => void;
  /** Called when the backend reports a terminal failure. */
  onFailed: (message: string) => void;
}

/** Returned by `watchStatus`; must be called to release the subscription. */
export type Unsubscribe = () => void;

export interface ExtractionsService {
  upload(input: UploadExtractionInput): Promise<UploadExtractionResponse>;
  /**
   * Subscribes to status updates for an already-accepted extraction.
   *
   * In the fake implementation, resolves `onProcessed` after a simulated delay.
   * In the real implementation (without Firebase yet), this is a no-op
   * placeholder and the upload UI remains in the "waiting" state until the
   * Firebase listener is wired in a separate task.
   */
  watchStatus(extractionId: string, handlers: WatchStatusHandlers): Unsubscribe;
}
