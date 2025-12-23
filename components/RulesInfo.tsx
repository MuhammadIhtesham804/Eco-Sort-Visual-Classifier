
import React from 'react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

const RulesInfo: React.FC<Props> = ({ lang }) => {
  const HEADER_TEXT = {
    en: "CLASSIFICATION LEGEND",
    ur: "درجہ بندی کی گائیڈ",
    ar: "دليل التصنيف"
  };

  const RULES = [
    { p: "01", title: { en: "Hazard", ur: "خطرہ", ar: "نفايات خطرة" }, color: "bg-red-500", desc: { en: "Batteries, Chemicals, Tech.", ur: "بیٹریاں، کیمیکلز، ٹیکنالوجی", ar: "بطاريات، كيمياويات، تقنية" } },
    { p: "02", title: { en: "Compost", ur: "کھاد", ar: "سماد" }, color: "bg-yellow-500", desc: { en: "Grease-soiled paper/card.", ur: "چکنائی والے کاغذات", ar: "ورق ملوث بالدهون" } },
    { p: "03", title: { en: "Recycle", ur: "ری سائیکل", ar: "إعادة تدوير" }, color: "bg-emerald-500", desc: { en: "Clean plastics, metals.", ur: "صاف پلاسٹک، دھاتیں", ar: "بلاستيك، معادن نظيفة" } },
    { p: "04", title: { en: "Trash", ur: "ٹریش", ar: "نفايات" }, color: "bg-slate-500", desc: { en: "Soft film, unknown residue.", ur: "نرم پلاسٹک، نامعلوم باقیات", ar: "بلاستيك مرن، بقايا غير معروفة" } }
  ];

  return (
    <section className="bg-slate-900/20 border border-white/5 rounded-2xl p-8 backdrop-blur-md">
      <h3 className={`text-[10px] font-black tracking-[0.3em] text-slate-500 mb-8 border-b border-white/5 pb-4 ${lang !== 'en' ? 'urdu-text text-right' : 'text-left'}`}>
        {HEADER_TEXT[lang]}
      </h3>
      
      <div className="space-y-6">
        {RULES.map((rule) => (
          <div key={rule.p} className={`flex items-start gap-4 ${lang !== 'en' ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <span className="text-[10px] font-mono text-slate-600 mt-1">{rule.p}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 justify-inherit">
                <div className={`w-1.5 h-1.5 rounded-full ${rule.color}`}></div>
                <h4 className={`text-xs font-bold text-white tracking-wide ${lang !== 'en' ? 'urdu-text' : ''}`}>{rule.title[lang]}</h4>
              </div>
              <p className={`text-[10px] text-slate-500 font-medium leading-tight ${lang !== 'en' ? 'urdu-text' : ''}`}>{rule.desc[lang]}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/5">
        <div className="bg-emerald-500/5 p-4 rounded-lg border border-emerald-500/10">
          <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest leading-relaxed">
            Note: Priority 01 overrides all subsequent classifications. Manual override required for oversized logistics.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RulesInfo;
