
import React, { useRef, useState } from 'react';
import { Language } from '../types';

interface Props {
  onImageSelected: (base64: string) => void;
  isAnalyzing: boolean;
  lang: Language;
}

const ImageUploader: React.FC<Props> = ({ onImageSelected, isAnalyzing, lang }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const TEXT = {
    en: { 
      tap: "Initialize Visual Scan", 
      sub: "Place item on reference surface", 
      start: "START ANALYSIS", 
      again: "ANALYZE NEW ITEM" 
    },
    ur: { 
      tap: "اسکین شروع کریں", 
      sub: "آئٹم کو مخصوص جگہ پر رکھیں", 
      start: "تجزیہ شروع کریں", 
      again: "نئے آئٹم کا تجزیہ کریں" 
    },
    ar: { 
      tap: "بدء المسح البصري", 
      sub: "ضع العنصر في مكان المسح", 
      start: "بدء التحليل", 
      again: "تحليل عنصر جديد" 
    }
  };

  const t = TEXT[lang];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageSelected(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    if (!isAnalyzing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col">
      <div 
        onClick={handleClick}
        className={`relative group w-full aspect-video rounded-xl border border-white/10 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center bg-slate-950
          ${preview ? 'border-emerald-500/50' : 'hover:border-emerald-500/30'}`}
      >
        {/* Decorative Technical Elements */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20"></div>
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-right border-white/20"></div>
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20"></div>
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-right border-white/20"></div>

        {preview ? (
          <img src={preview} alt="Scan Preview" className="w-full h-full object-cover opacity-80" />
        ) : (
          <div className="flex flex-col items-center p-6 text-center">
            <div className="w-16 h-16 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-white tracking-tight">{t.tap}</p>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-medium mt-1">{t.sub}</p>
          </div>
        )}

        {isAnalyzing && <div className="absolute inset-0 scan-line"></div>}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" capture="environment" className="hidden" />

      <button
        disabled={isAnalyzing}
        onClick={handleClick}
        className={`mt-10 w-full py-4 rounded-lg text-sm font-bold tracking-[0.2em] text-white uppercase transition-all transform active:scale-[0.98] flex items-center justify-center gap-3
          ${isAnalyzing ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.2)]'}`}
      >
        {!isAnalyzing && (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        )}
        <span>{preview ? t.again : t.start}</span>
      </button>
    </div>
  );
};

export default ImageUploader;
