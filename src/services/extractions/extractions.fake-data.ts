/**
 * @prototype
 * @status FAKE — awaiting real backend endpoint wired via NEXT_PUBLIC_USE_FAKE_EXTRACTIONS=false
 * @planned-endpoint POST /api/solicitations/analyze (multipart)
 */

/**
 * Total duration the fake upload takes, in milliseconds. Split across several
 * progress ticks so the UI exercises `onProgress` realistically.
 */
export const FAKE_TOTAL_UPLOAD_MS = 1_200;

/** Progress checkpoints (in percent) emitted during the fake upload. */
export const FAKE_PROGRESS_TICKS: readonly number[] = [8, 22, 40, 58, 74, 88, 96, 100];

/**
 * Simulated delay between the fake 202 and the fake "processed" callback.
 * A uniform random value is picked in this range so the UI feels non-scripted.
 */
export const FAKE_PROCESSING_DELAY_MIN_MS = 2_000;
export const FAKE_PROCESSING_DELAY_MAX_MS = 4_000;
