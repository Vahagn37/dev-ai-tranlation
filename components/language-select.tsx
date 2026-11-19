import { AUTO, LANGUAGES } from "@/lib/languages";

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (code: string) => void;
  allowAuto?: boolean;
}

export function LanguageSelect({ id, label, value, onChange, allowAuto }: Props) {
  return (
    <div className="field language-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {allowAuto && <option value={AUTO}>Detect language</option>}
        {LANGUAGES.map((language) => (
          <option key={language.code} value={language.code}>{language.name}</option>
        ))}
      </select>
    </div>
  );
}
