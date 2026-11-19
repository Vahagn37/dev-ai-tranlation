/**
 * Thin helpers around Chrome's built-in Translator and Language Detector APIs.
 * Everything here runs in the browser only. Import it from Client Components.
 */
import { languageName } from "@/lib/languages";

export const CONFIDENCE_THRESHOLD = 0.6;

export type DownloadProgress = (fraction: number) => void;

export interface Detection {
  language: string;
  confidence: number;
}

export class LowConfidenceError extends Error {
  constructor() {
    super("We couldn't confidently detect the language. Choose it manually and try again.");
  }
}

export class UnsupportedPairError extends Error {
  constructor(source: string, target: string) {
    super(`Chrome’s on-device translator doesn’t currently support ${languageName(source)} to ${languageName(target)}. Choose a supported source language or another target. The language detector can recognize more languages than the translator can translate.`);
  }
}

export function isBuiltInAISupported(): boolean {
  return typeof self !== "undefined" && "Translator" in self && "LanguageDetector" in self;
}

let detectorPromise: Promise<LanguageDetector> | null = null;
const translators = new Map<string, Translator>();
const translatorPromises = new Map<string, Promise<Translator>>();

function getDetector(onProgress?: DownloadProgress): Promise<LanguageDetector> {
  if (!detectorPromise) {
    detectorPromise = LanguageDetector.create({
      monitor(monitor) {
        monitor.addEventListener("downloadprogress", (event) => onProgress?.(event.loaded));
      },
    });
    detectorPromise.catch(() => {
      detectorPromise = null;
    });
  }
  return detectorPromise;
}

export async function detectLanguage(
  text: string,
  onProgress?: DownloadProgress,
  signal?: AbortSignal,
): Promise<Detection | null> {
  const detector = await getDetector(onProgress);
  const [top] = await detector.detect(text, { signal });
  if (!top?.detectedLanguage || top.detectedLanguage === "und") return null;
  return { language: top.detectedLanguage, confidence: top.confidence ?? 0 };
}

export async function getTranslator(
  sourceLanguage: string,
  targetLanguage: string,
  onProgress?: DownloadProgress,
  signal?: AbortSignal,
): Promise<Translator> {
  const key = `${sourceLanguage}>${targetLanguage}`;
  const cached = translators.get(key);
  if (cached) return cached;
  const pending = translatorPromises.get(key);
  if (pending) return pending;

  const creation = (async () => {
    const availability = await Translator.availability({ sourceLanguage, targetLanguage });
    if (availability === "unavailable") {
      throw new UnsupportedPairError(sourceLanguage, targetLanguage);
    }
    const translator = await Translator.create({
      sourceLanguage,
      targetLanguage,
      signal,
      monitor(monitor) {
        monitor.addEventListener("downloadprogress", (event) => onProgress?.(event.loaded));
      },
    });
    translators.set(key, translator);
    return translator;
  })();
  translatorPromises.set(key, creation);
  try {
    return await creation;
  } finally {
    translatorPromises.delete(key);
  }
}

export async function destroyAll(): Promise<void> {
  for (const translator of translators.values()) translator.destroy();
  translators.clear();
  const pending = detectorPromise;
  detectorPromise = null;
  (await pending?.catch(() => null))?.destroy();
}

export function describeError(error: unknown): string {
  if (error instanceof DOMException) {
    switch (error.name) {
      case "AbortError":
        return "Translation cancelled.";
      case "NotAllowedError":
        return "Chrome needs a fresh click to start the download. Press Translate again.";
      case "NotSupportedError":
        return "Chrome couldn't prepare this translation. Wait a moment and try again, or choose another language.";
      case "QuotaExceededError":
        return "That text is too long. Try translating a shorter passage.";
      case "NetworkError":
        return "The language pack couldn't be downloaded. Check your connection and try again.";
    }
  }
  return error instanceof Error ? error.message : "Something went wrong.";
}
