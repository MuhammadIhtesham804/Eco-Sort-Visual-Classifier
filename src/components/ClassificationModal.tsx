import { ClassificationResult, Language } from "../types";
import { CLASSIFICATION_UI_CONFIG } from "../constants";

interface Props {
  result: ClassificationResult;
  lang: Language;
  onClose: () => void;
}

const ClassificationModal = ({ result, lang, onClose }: Props) => {
  const config = CLASSIFICATION_UI_CONFIG[result.type];
  
  const explanation = 
    lang === 'ur' ? result.urduExplanation :
    lang === 'ar' ? result.arabicExplanation :
    result.englishExplanation;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className={`${config.color} p-6 text-white`}>
          <h2 className="text-2xl font-bold text-center">{config.icon} {result.itemName}</h2>
        </div>

        <div className="p-8 space-y-6">
          <div className="text-center">
            <p className="text-slate-300 text-sm uppercase tracking-widest mb-2">Classification Type</p>
            <p className="text-3xl font-bold text-emerald-400">{result.type}</p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Confidence</p>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-emerald-500 h-3 rounded-full transition-all"
                style={{ width: `${result.confidence * 100}%` }}
              ></div>
            </div>
            <p className="text-emerald-400 font-bold mt-2 text-lg">{(result.confidence * 100).toFixed(1)}%</p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-300 leading-relaxed">{explanation}</p>
          </div>
        </div>

        <div className="bg-slate-800/50 px-8 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
          >
            {lang === 'ur' ? 'بند کریں' : lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassificationModal;
