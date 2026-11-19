import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lingo — Private, on-device translation",
  description: "Translate text privately on your device with Chrome’s built-in Translator and Language Detector APIs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
