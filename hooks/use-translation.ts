"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AUTO } from "@/lib/languages";
import {
  CONFIDENCE_THRESHOLD,
  LowConfidenceError,
  describeError,
  destroyAll,
  detectLanguage,
  getTranslator,
  type Detection,
} from "@/lib/chrome-ai";

export type Phase = "idle" | "detecting" | "preparing" | "translating";

export function useTranslation() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [output, setOutput] = useState("");
  const [detected, setDetected] = useState<Detection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const generationRef = useRef(0);

  useEffect(() => () => {
    controllerRef.current?.abort();
    void destroyAll();
  }, []);

  const translate = useCallback(async (text: string, source: string, target: string) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const generation = ++generationRef.current;
    const isCurrent = () => generationRef.current === generation;
    const { signal } = controller;

    setError(null);
    setOutput("");
    setDetected(null);
    setDownloadProgress(null);

    try {
      let from = source;
      if (source === AUTO) {
        setPhase("detecting");
        const result = await detectLanguage(text, setDownloadProgress, signal);
        if (!isCurrent()) return;
        if (!result || result.confidence < CONFIDENCE_THRESHOLD) throw new LowConfidenceError();
        setDetected(result);
        from = result.language;
      }
      if (from === target) throw new Error("The source and target languages are the same.");

      setPhase("preparing");
      setDownloadProgress(null);
      const translator = await getTranslator(from, target, setDownloadProgress, signal);
      if (!isCurrent()) return;

      setPhase("translating");
      setDownloadProgress(null);
      const reader = translator.translateStreaming(text, { signal }).getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (!isCurrent() || done) break;
        setOutput((current) => current + value);
      }
    } catch (caught) {
      if (!signal.aborted && isCurrent()) setError(describeError(caught));
    } finally {
      if (isCurrent()) {
        controllerRef.current = null;
        setPhase("idle");
        setDownloadProgress(null);
      }
    }
  }, []);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    generationRef.current += 1;
    setPhase("idle");
    setDownloadProgress(null);
  }, []);

  const reset = useCallback(() => {
    setOutput("");
    setDetected(null);
    setError(null);
  }, []);

  return { phase, downloadProgress, output, detected, error, translate, cancel, reset };
}
