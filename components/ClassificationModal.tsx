
import React, { useEffect, useState } from 'react';
import { ClassificationResult, DisposalType, Language } from '../types';

interface Props {
  result: ClassificationResult;
  lang: Language;
  onClose: () => void;
}

const TYPE_THEME = {
  [DisposalType.HAZARD]: { color: 'text-red-500', border: 'border-red-500/30', bg: 'bg-red-500/5', icon: '☣️' },
  [DisposalType.COMPOST]: { color: 'text-yellow-500', border: 'border-yellow-500/30', bg: 'bg-yellow-500/5', icon: '♻️' },
  [DisposalType.RECYCLE]: { color: 'text-emerald-500', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', icon: '💎' },
  [DisposalType.TRASH]: { color: 'text-slate-400', border: 'border-slate-400/30', bg: 'bg-slate-400/5', icon: '📦' }
};

const ClassificationModal: React.FC<Props> = ({ result, lang, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = TYPE_THEME[result.type];
  const isHazard = result.type === DisposalType.HAZARD;

  const TEXTS = {
    en: { header: "ANALYSIS COMPLETE", label: "Material Class", confirm: "ACKNOWLEDGE", rtl: false },
    ur: { header: "تجزیہ مکمل ہو گیا", label: "مٹیریل کی قسم", confirm: "تصدیق کریں", rtl: true },
    ar: { header: "اكتمل التحليل", label: "فئة المواد", confirm: "تأكيد", rtl: true }
  };

  const t = TEXTS[lang];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose} />

      <div className={`relative w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] transform transition-all duration-500 
        ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        {/* Header Bar */}
        <div className="px-8 py-5 border-b border-white/5 flex justify-between items-center">
          <span className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase">{t.header}</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-700"></div>
            <div className={`w-2 h-2 rounded-full ${isHazard ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
          </div>
        </div>

        <div className="p-10">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Visual Indicator */}
            <div className={`w-32 h-32 rounded-xl flex-shrink-0 flex items-center justify-center text-5xl border ${theme.border} ${theme.bg} ${isHazard ? 'hazard-pulse' : ''}`}>
              {theme.icon}
            </div>

            <div className={`flex-1 space-y-4 ${t.rtl ? 'text-right' : 'text-left'}`}>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.label}</span>
                <h2 className={`text-4xl font-bold tracking-tight ${theme.color} mt-1`}>{result.type}</h2>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                <p className="text-xs font-bold text-emerald-500 uppercase mb-2 tracking-tighter">IDENTIFIED AS: {result.itemName}</p>
                <p className={`text-sm leading-relaxed text-slate-300 ${t.rtl ? 'urdu-text text-lg' : ''}`}>
                  {lang === 'en' ? result.englishExplanation : lang === 'ur' ? result.urduExplanation : result.arabicExplanation}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4">
             <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Confidence</span>
                <span className="text-xl font-bold text-white">{(result.confidence * 100).toFixed(1)}%</span>
             </div>
             <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Protocol</span>
                <span className="text-xl font-bold text-white">V1.0.4</span>
             </div>
          </div>

          <button
            onClick={onClose}
            className="mt-8 w-full py-4 bg-white text-slate-950 text-xs font-black tracking-[0.2em] rounded-lg hover:bg-emerald-500 hover:text-white transition-all uppercase"
          >
            {t.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassificationModal;
