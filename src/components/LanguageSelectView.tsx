import React from 'react';
import { Globe, Languages, Check, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface LanguageSelectViewProps {
  currentLang: Language;
  onSelectLanguage: (lang: Language) => void;
  onContinue: () => void;
}

export const LanguageSelectView: React.FC<LanguageSelectViewProps> = ({
  currentLang,
  onSelectLanguage,
  onContinue,
}) => {
  const languages: Array<{
    id: Language;
    name: string;
    subLabel: string;
    scriptSample: string;
  }> = [
    {
      id: 'en',
      name: 'English',
      subLabel: 'English',
      scriptSample: 'Welcome',
    },
    {
      id: 'hi',
      name: 'हिंदी',
      subLabel: 'Hindi',
      scriptSample: 'नमस्ते',
    },
    {
      id: 'mr',
      name: 'मराठी',
      subLabel: 'Marathi',
      scriptSample: 'नमस्कार',
    },
    {
      id: 'gu',
      name: 'ગુજરાતી',
      subLabel: 'Gujarati',
      scriptSample: 'નમસ્તે',
    },
  ];

  return (
    <div className="min-h-[92vh] flex flex-col justify-between px-6 py-8 bg-[#fef8f2]">
      {/* Header text */}
      <div className="text-center pt-2 pb-6 max-w-md mx-auto space-y-2">
        <h1 className="font-literata text-2xl sm:text-3xl font-bold text-[#94442e] leading-snug">
          In which language do you want to use the app?
        </h1>
        <p className="font-hindi-body text-lg sm:text-xl text-[#55433e] font-medium leading-relaxed">
          आप किस भाषा में ऐप का उपयोग करना चाहते हैं?
        </p>
      </div>

      {/* Language Selection Cards Grid */}
      <div className="flex-1 max-w-md w-full mx-auto flex flex-col justify-center gap-4 py-2">
        {languages.map((lang) => {
          const isSelected = currentLang === lang.id;
          return (
            <button
              key={lang.id}
              onClick={() => {
                onSelectLanguage(lang.id);
              }}
              className={`w-full py-4 px-6 rounded-2xl flex flex-col items-center justify-center relative transition-all duration-200 border text-center ${
                isSelected
                  ? 'bg-white border-[#94442e] shadow-[0_6px_20px_rgba(148,68,46,0.12)] ring-2 ring-[#94442e]/30 scale-[1.01]'
                  : 'bg-white/80 border-[#dbc1ba]/50 shadow-xs hover:bg-white hover:border-[#88726d]/40'
              }`}
            >
              {/* Top icon */}
              <div className="mb-1 text-[#94442e]">
                {lang.id === 'en' ? (
                  <Globe className="w-6 h-6 stroke-[1.8]" />
                ) : (
                  <Languages className="w-6 h-6 stroke-[1.8]" />
                )}
              </div>

              {/* Native title */}
              <span className="font-literata text-xl font-bold text-[#1d1b18] mb-0.5 tracking-tight">
                {lang.name}
              </span>

              {/* Sub-label */}
              <span className="text-xs text-[#88705e] font-medium uppercase tracking-wider">
                {lang.subLabel}
              </span>

              {/* Selected badge */}
              {isSelected && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#94442e] text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="w-full max-w-md mx-auto pt-6">
        <button
          onClick={onContinue}
          className="w-full min-h-[56px] bg-[#94442e] text-white rounded-full font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#b35c44] active:scale-[0.98] transition-all shadow-[0_6px_20px_rgba(148,68,46,0.25)]"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
