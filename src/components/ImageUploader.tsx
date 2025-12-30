import { Language } from "../types";
import { useRef } from "react";

interface Props {
  onImageSelected: (base64: string) => void;
  isAnalyzing: boolean;
  lang: Language;
}

const ImageUploader = ({ onImageSelected, isAnalyzing, lang }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(lang === 'ur' ? 'براہ کرم ایک تصویر منتخب کریں' : lang === 'ar' ? 'يرجى تحديد صورة' : 'Please select an image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(lang === 'ur' ? 'تصویر 5MB سے کم ہونی چاہیے' : lang === 'ar' ? 'يجب أن تكون الصورة أقل من 5 ميجابايت' : 'Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onImageSelected(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isAnalyzing}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isAnalyzing}
        className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-emerald-500/50"
      >
        <span className="text-xl">📷</span>
        <span>
          {isAnalyzing
            ? lang === 'ur'
              ? 'تجزیہ جاری ہے...'
              : lang === 'ar'
              ? 'جاري المعالجة...'
              : 'Analyzing...'
            : lang === 'ur'
            ? 'تصویر اپ لوڈ کریں'
            : lang === 'ar'
            ? 'تحميل الصورة'
            : 'Upload Image'}
        </span>
      </button>
    </div>
  );
};

export default ImageUploader;
