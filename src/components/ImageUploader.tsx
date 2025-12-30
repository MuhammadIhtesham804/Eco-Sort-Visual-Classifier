import { Language } from "../types";
import { useRef, useState } from "react";

interface Props {
  onImageSelected: (base64: string) => void;
  isAnalyzing: boolean;
  lang: Language;
}

const ImageUploader = ({ onImageSelected, isAnalyzing, lang }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const getErrorMessage = (key: string): string => {
    const messages: Record<string, Record<Language, string>> = {
      invalidFile: {
        en: 'Please select a valid image file',
        ur: 'براہ کرم ایک درست تصویر منتخب کریں',
        ar: 'يرجى تحديد ملف صورة صحيح'
      },
      fileTooLarge: {
        en: 'Image must be less than 5MB',
        ur: 'تصویر 5MB سے کم ہونی چاہیے',
        ar: 'يجب أن تكون الصورة أقل من 5 ميجابايت'
      },
      unsupportedFormat: {
        en: 'Image format not supported. Use JPG, PNG, GIF, or WebP',
        ur: 'تصویر کی شکل معاون نہیں۔ JPG، PNG، GIF یا WebP استعمال کریں',
        ar: 'تنسيق الصورة غير مدعوم. استخدم JPG أو PNG أو GIF أو WebP'
      },
      loadError: {
        en: 'Failed to load image. Please try again',
        ur: 'تصویر لوڈ کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں',
        ar: 'فشل تحميل الصورة. حاول مرة أخرى'
      }
    };
    return messages[key]?.[lang] || messages[key]?.en || 'Error';
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const supportedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!supportedFormats.includes(file.type)) {
      alert(getErrorMessage('unsupportedFormat'));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(getErrorMessage('fileTooLarge'));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate file is actually an image by checking magic bytes
    const validateImageFile = new Promise<boolean>((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arr = new Uint8Array((event.target?.result as ArrayBuffer).slice(0, 4));
        const header = arr.reduce((a, b) => a + b.toString(16), '');
        // Check for JPEG, PNG, GIF, WebP magic bytes
        const validMagicBytes = /^ffd8ff|^89504e47|^47494638|^52494646/;
        resolve(validMagicBytes.test(header));
      };
      reader.readAsArrayBuffer(file.slice(0, 4));
    });

    const isValidImage = await validateImageFile;
    if (!isValidImage) {
      alert(getErrorMessage('invalidFile'));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const base64 = event.target?.result as string;
        setImagePreview(base64);
        onImageSelected(base64);
      } catch (error) {
        alert(getErrorMessage('loadError'));
      }
    };
    reader.onerror = () => {
      alert(getErrorMessage('loadError'));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      {/* Image Preview */}
      {imagePreview && !isAnalyzing && (
        <div className="w-full max-w-sm">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-full h-auto rounded-lg border border-emerald-500/30 shadow-lg"
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
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
