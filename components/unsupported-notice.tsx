export function UnsupportedNotice() {
  return (
    <div className="notice" role="alert">
      <div className="notice-icon" aria-hidden="true">◎</div>
      <h2>This browser doesn’t support built-in translation</h2>
      <p>The Translator and Language Detector APIs require desktop Chrome 138 or later. They aren’t available on mobile, Firefox, or Safari.</p>
      <a href="https://developer.chrome.com/docs/ai/translator-api" target="_blank" rel="noreferrer">Learn about Chrome’s Translator API <span aria-hidden="true">↗</span></a>
    </div>
  );
}
