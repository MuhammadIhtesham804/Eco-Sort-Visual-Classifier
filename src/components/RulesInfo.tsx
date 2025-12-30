import { Language } from "../types";

const RulesInfo = ({ lang }: { lang: Language }) => {
  const rules = {
    en: [
      { title: "📷 Upload Image", desc: "Take or select a clear photo of the waste item" },
      { title: "🔍 AI Analysis", desc: "System analyzes using advanced computer vision" },
      { title: "♻️ Get Result", desc: "Receive instant classification and instructions" },
      { title: "🌍 Eco Impact", desc: "Contribute to environmental sustainability" }
    ],
    ur: [
      { title: "📷 تصویر اپ لوڈ کریں", desc: "فضلہ کی چیز کی واضح تصویر لیں" },
      { title: "🔍 مصنوعی ذہانت کا تجزیہ", desc: "نظام جدید ویژن استعمال کرتے ہوئے تجزیہ کرتا ہے" },
      { title: "♻️ نتیجہ حاصل کریں", desc: "فوری درجہ بندی اور ہدایات حاصل کریں" },
      { title: "🌍 ماحولیاتی اثر", desc: "ماحول کی حفاظت میں حصہ ڈالیں" }
    ],
    ar: [
      { title: "📷 تحميل الصورة", desc: "التقط صورة واضحة لعنصر النفايات" },
      { title: "🔍 تحليل الذكاء الاصطناعي", desc: "يحلل النظام باستخدام الرؤية الحاسوبية" },
      { title: "♻️ الحصول على النتيجة", desc: "احصل على التصنيف الفوري والتعليمات" },
      { title: "🌍 التأثير البيئي", desc: "ساهم في الاستدامة البيئية" }
    ]
  };

  const currentRules = rules[lang];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-emerald-400 uppercase tracking-wide mb-6">
        {lang === 'ur' ? 'کیسے کام کرتا ہے' : lang === 'ar' ? 'كيفية العمل' : 'How It Works'}
      </h3>
      <div className="space-y-3">
        {currentRules.map((rule, idx) => (
          <div key={idx} className="bg-slate-900/60 border border-white/5 rounded-lg p-4 hover:border-emerald-500/30 transition-colors">
            <p className="text-white font-semibold mb-1">{rule.title}</p>
            <p className="text-slate-400 text-sm">{rule.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RulesInfo;
