/** Sentinel value for "detect the source language for me". */
export const AUTO = "auto";

export interface Language {
  code: string;
  name: string;
  rtl?: boolean;
}

export const LANGUAGES: Language[] = [
  { code: "ar", name: "Arabic", rtl: true },
  { code: "bg", name: "Bulgarian" },
  { code: "bn", name: "Bengali" },
  { code: "cs", name: "Czech" },
  { code: "da", name: "Danish" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French" },
  { code: "he", name: "Hebrew", rtl: true },
  { code: "hi", name: "Hindi" },
  { code: "hr", name: "Croatian" },
  { code: "hu", name: "Hungarian" },
  { code: "id", name: "Indonesian" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "kn", name: "Kannada" },
  { code: "ko", name: "Korean" },
  { code: "lt", name: "Lithuanian" },
  { code: "mr", name: "Marathi" },
  { code: "nl", name: "Dutch" },
  { code: "no", name: "Norwegian" },
  { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "sv", name: "Swedish" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "th", name: "Thai" },
  { code: "tr", name: "Turkish" },
  { code: "uk", name: "Ukrainian" },
  { code: "vi", name: "Vietnamese" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "zh-Hant", name: "Chinese (Traditional)" },
];

export function languageName(code: string): string {
  if (code === "hy") return "Armenian";
  return LANGUAGES.find((language) => language.code === code)?.name ?? code;
}

export function isRtl(code: string): boolean {
  return LANGUAGES.find((language) => language.code === code)?.rtl ?? false;
}
