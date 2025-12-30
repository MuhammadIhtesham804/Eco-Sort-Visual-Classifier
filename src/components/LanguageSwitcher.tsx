import { Language } from "../types";

interface Props {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
}

const LanguageSwitcher = ({ currentLang, onLangChange }: Props) => {
  return (
    <select
      value={currentLang}
      onChange={(e) => onLangChange(e.target.value as Language)}
      className="bg-slate-800 border border-white/10 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors text-sm font-medium"
    >
      <option value="en">English</option>
      <option value="ur">اردو</option>
      <option value="ar">العربية</option>
    </select>
  );
};

export default LanguageSwitcher;
