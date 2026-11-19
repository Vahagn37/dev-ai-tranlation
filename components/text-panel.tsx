"use client";

import { useState } from "react";

interface Props {
  id: string;
  label: string;
  value: string;
  lang?: string;
  rtl?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export function TextPanel({ id, label, value, lang, rtl, readOnly, placeholder, onChange }: Props) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopyError(true);
      window.setTimeout(() => setCopyError(false), 2000);
    }
  }

  function speak() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(value);
    if (lang) utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="text-panel">
      <label htmlFor={id} className="visually-hidden">{label}</label>
      <textarea
        id={id}
        rows={8}
        value={value}
        lang={lang}
        dir={readOnly ? (rtl ? "rtl" : "ltr") : "auto"}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        spellCheck={!readOnly}
      />
      <div className="panel-footer">
        <span className="character-count">{value.length.toLocaleString()} characters</span>
        <div className="panel-actions">
          {copyError && <span className="copy-error" role="status">Clipboard unavailable</span>}
          <button type="button" className="icon-button" onClick={copy} disabled={!value} aria-label={`Copy ${label.toLowerCase()}`} title="Copy">
            {copied ? "Copied" : "Copy"}
          </button>
          <button type="button" className="icon-button" onClick={speak} disabled={!value || !(typeof window !== "undefined" && "speechSynthesis" in window)} aria-label={`Read ${label.toLowerCase()} aloud`} title="Read aloud">
            Read aloud
          </button>
        </div>
      </div>
    </div>
  );
}
