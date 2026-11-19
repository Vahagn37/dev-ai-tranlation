"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { isBuiltInAISupported } from "@/lib/chrome-ai";
import { AUTO, isRtl, languageName } from "@/lib/languages";
import { LanguageSelect } from "./language-select";
import { TextPanel } from "./text-panel";
import { UnsupportedNotice } from "./unsupported-notice";

const noopSubscribe = () => () => {};

export function TranslatorApp() {
  const supported = useSyncExternalStore<boolean | null>(noopSubscribe, isBuiltInAISupported, () => null);
  const { phase, downloadProgress, output, detected, error, translate, cancel, reset } = useTranslation();
  const [source, setSource] = useState(AUTO);
  const [target, setTarget] = useState("es");
  const [text, setText] = useState("");

  if (supported === null) return <p className="checking-status" role="status">Checking browser support<span className="loading-dots">…</span></p>;
  if (!supported) return <UnsupportedNotice />;

  const busy = phase !== "idle";
  const sourceLang = source === AUTO ? detected?.language : source;
  const statusMessage = error ?? (phase === "detecting" ? "Detecting language…"
    : phase === "preparing" ? "Preparing the translator…"
      : phase === "translating" ? "Translating on your device…"
        : detected && source === AUTO ? `Detected ${languageName(detected.language)} (${Math.round(detected.confidence * 100)}% confidence).`
          : "Your text stays on this device." );

  function swap() {
    if (!sourceLang) return;
    setSource(target);
    setTarget(sourceLang);
    setText(output);
    reset();
  }

  return (
    <form className="translator-form" onSubmit={(event) => {
      event.preventDefault();
      void translate(text.trim(), source, target);
    }}>
      <div className="language-bar">
        <LanguageSelect id="source-language" label="Translate from" value={source} onChange={(code) => { setSource(code); reset(); }} allowAuto />
        <button type="button" className="swap-button" onClick={swap} disabled={busy || !sourceLang} aria-label="Swap languages" title="Swap languages">⇄</button>
        <LanguageSelect id="target-language" label="Translate to" value={target} onChange={(code) => { setTarget(code); reset(); }} />
      </div>

      <div className="translation-grid">
        <section className="translation-column" aria-label="Text to translate">
          <div className="column-heading"><span>Original text</span><span className="column-hint">{source === AUTO ? "Language detected automatically" : languageName(source)}</span></div>
          <TextPanel id="source-text" label="Source text" value={text} lang={sourceLang} placeholder="Enter text to translate…" onChange={(value) => { setText(value); reset(); }} />
        </section>
        <section className="translation-column" aria-label="Translated text">
          <div className="column-heading"><span>Translation</span><span className="column-hint">{languageName(target)}</span></div>
          <TextPanel id="translation" label="Translation" value={output} lang={target} rtl={isRtl(target)} readOnly placeholder="Your translation will appear here…" />
        </section>
      </div>

      <div className="form-bottom">
        <div className="translation-status" role="status" aria-live="polite" data-error={Boolean(error)}>
          <span className={busy ? "status-indicator active" : "status-indicator"} aria-hidden="true" />
          <span>{statusMessage}</span>
        </div>
        {downloadProgress !== null && (
          <label className="progress-wrap">
            <span>Downloading language model <strong>{Math.round(downloadProgress * 100)}%</strong></span>
            <progress max={1} value={downloadProgress} aria-label="Language model download progress" />
          </label>
        )}
        <div className="primary-actions">
          {busy ? <button type="button" className="translate-button cancel-button" onClick={cancel}>Cancel</button> : (
            <button type="submit" className="translate-button" disabled={!text.trim()}>
              <span>{output || error ? "Translate again" : "Translate"}</span><span className="button-arrow" aria-hidden="true">↗</span>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
