import Link from "next/link";
import { TranslatorApp } from "@/components/translator-app";

export default function Home() {
  return (
    <main className="page-shell">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Lingo home"><span className="brand-mark">L</span><span>lingo<span className="brand-period">.</span></span></Link>
        <span className="privacy-label"><span className="privacy-dot" /> Private by design</span>
      </header>
      <section className="hero">
        <p className="eyebrow"><span className="eyebrow-line" /> ON-DEVICE TRANSLATION</p>
        <h1>Words travel.<br /><span>Privacy stays.</span></h1>
        <p className="hero-copy">Translate naturally in your browser. Powered by Chrome’s built-in AI, your words never leave your device.</p>
      </section>
      <section className="translator-card" aria-label="Translator">
        <TranslatorApp />
      </section>
      <footer className="page-footer"><span>Translation powered by Chrome AI</span><span className="footer-separator">·</span><span>Nothing sent. Nothing stored.</span></footer>
    </main>
  );
}
