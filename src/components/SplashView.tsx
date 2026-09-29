import React from 'react';
import { ArrowRight, Sparkles, Feather } from 'lucide-react';
import { TRANSLATIONS } from '../data/mockData';
import { Language } from '../types';

interface SplashViewProps {
  onContinue: () => void;
  lang: Language;
}

export const SplashView: React.FC<SplashViewProps> = ({ onContinue, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-between px-6 py-8 text-center overflow-hidden bg-[#fef8f2]">
      {/* Subtle organic background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#ffdbd1]/60 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute bottom-1/3 right-4 w-56 h-56 bg-[#ffdcc4]/50 rounded-full blur-2xl pointer-events-none -z-0"></div>

      {/* Top subtle badge */}
      <div className="pt-4 z-10 flex items-center justify-center">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#ffdbd1]/70 border border-[#dbc1ba]/60 text-[#79301b] text-xs font-semibold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#94442e]" />
          <span>Made for Artisans • Powered by AI</span>
        </div>
      </div>

      {/* Center Logo & Branding */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto z-10 my-auto py-6">
        <div className="relative mb-6 group cursor-pointer" onClick={onContinue}>
          <div className="absolute -inset-4 bg-[#94442e]/10 rounded-full blur-xl group-hover:bg-[#94442e]/20 transition-all duration-700"></div>
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-white/80 backdrop-blur-xs p-5 flex flex-col items-center justify-center border border-[#dbc1ba]/50 shadow-[0_8px_24px_rgba(74,55,40,0.08)] relative z-10 text-[#94442e]">
            <div className="w-16 h-16 rounded-2xl bg-[#94442e] flex items-center justify-center text-white shadow-md mb-2">
              <Feather className="w-9 h-9 text-[#ffab69]" />
            </div>
            <span className="font-literata text-xs font-bold tracking-widest text-[#94442e] uppercase">ARTISAN AI</span>
          </div>
        </div>

        <h1 className="font-literata text-3xl sm:text-4xl md:text-5xl font-bold text-[#94442e] tracking-tight mb-2.5">
          {t.appName}
        </h1>
        <p className="font-inter text-base sm:text-lg text-[#55433e] font-normal max-w-xs leading-relaxed">
          {t.tagline}
        </p>
      </div>

      {/* Bottom Action Button */}
      <div className="w-full max-w-md mx-auto z-10 pb-4">
        <button
          onClick={onContinue}
          className="w-full min-h-[56px] bg-[#94442e] text-white rounded-full font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#b35c44] active:scale-[0.98] transition-all shadow-[0_6px_20px_rgba(148,68,46,0.25)] cursor-pointer"
        >
          <span>{t.continue}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
