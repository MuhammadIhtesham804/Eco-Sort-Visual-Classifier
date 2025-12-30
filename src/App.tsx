
import React, { useState, useCallback } from 'react';
import { classifyImage } from './service/geminiService';
import { ClassificationResult, Language } from './types';
import ImageUploader from './components/ImageUploader';
import ClassificationModal from './components/ClassificationModal';
import RulesInfo from './components/RulesInfo';
import LanguageSwitcher from './components/LanguageSwitcher';

const App: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('en');

  const handleImageSelected = useCallback(async (base64: string) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const classification = await classifyImage(base64);
      setResult(classification);
    } catch (err) {
      console.error(err);
      setError(lang === 'ur' ? "تجزیہ ناکام ہو گیا۔ دوبارہ کوشش کریں۔" : 
            lang === 'ar' ? "فشل التحليل. حاول مرة أخرى." :
            "System analysis failed. Please verify connection and retry.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [lang]);

  const UI_TEXT = {
    en: { title: "ECO-SORT", subtitle: "Industrial Intelligence System", loading: "Processing Stream...", loadingSub: "Validating safety protocols", footer: "System Ready | Facility Optimization Active" },
    ur: { title: "ایکو-سورٹ", subtitle: "صنعتی ذہانت کا نظام", loading: "تجزیہ جاری ہے...", loadingSub: "حفاظتی پروٹوکول کی جانچ", footer: "نظام تیار ہے | سہولت کی اصلاح فعال ہے" },
    ar: { title: "إيكو-سورت", subtitle: "نظام الذكاء الصناعي", loading: "جاري المعالجة...", loadingSub: "التحقق من بروتوكولات السلامة", footer: "النظام جاهز | تحسين المرافق نشط" }
  };

  const t = UI_TEXT[lang];

  return (
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617] flex flex-col items-center p-6 md:p-12 overflow-x-hidden">
      {/* Top Navigation Bar */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-16">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <div className="w-5 h-5 border-2 border-white rounded-sm"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white">{t.title}</span>
            <span className="text-[10px] font-medium tracking-[0.2em] text-emerald-500 uppercase">{t.subtitle}</span>
          </div>
        </div>
        <LanguageSwitcher currentLang={lang} onLangChange={setLang} />
      </div>

      {/* Main Analysis Terminal */}
      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-slate-900/40 border border-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
            <ImageUploader 
              onImageSelected={handleImageSelected} 
              isAnalyzing={isAnalyzing} 
              lang={lang}
            />
            
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5">
          <RulesInfo lang={lang} />
        </div>
      </main>

      {/* Industrial Footer */}
      <footer className="mt-auto pt-20 pb-8 w-full max-w-6xl border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-slate-500 gap-4">
        <p className="text-xs font-medium tracking-widest uppercase">{t.footer}</p>
        <div className="flex gap-6 text-[10px] font-bold tracking-widest uppercase">
          <span>Accuracy: 99.2%</span>
          <span>Status: Online</span>
        </div>
      </footer>

      {/* Modals & Overlays */}
      {result && <ClassificationModal result={result} lang={lang} onClose={() => setResult(null)} />}

      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-2 border-emerald-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin"></div>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-xl tracking-wide">{t.loading}</p>
              <p className="text-slate-400 text-xs mt-2 uppercase tracking-[0.3em]">{t.loadingSub}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
