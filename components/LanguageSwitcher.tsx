
import React from 'react';
import { Language } from '../types';

interface Props {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<Props> = ({ currentLang, onLangChange }) => {
  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'ur', label: 'UR' },
    { code: 'ar', label: 'AR' },
  ];

  return (
    <div className="flex bg-slate-900 border border-white/5 p-1 rounded-lg">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLangChange(lang.code)}
          className={`px-4 py-1.5 rounded-md text-[10px] font-black tracking-widest transition-all duration-300
            ${currentLang === lang.code 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
