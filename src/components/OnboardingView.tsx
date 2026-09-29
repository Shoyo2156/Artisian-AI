import React, { useState } from 'react';
import { ArrowRight, MapPin, ChevronLeft, Sparkles, Gem, Shirt, Paintbrush } from 'lucide-react';
import { Language, ArtisanProfile } from '../types';
import { TRANSLATIONS } from '../data/mockData';

interface OnboardingViewProps {
  onComplete: (data: Partial<ArtisanProfile>) => void;
  onBack: () => void;
  lang: Language;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onComplete,
  onBack,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [name, setName] = useState('Radha Devi');
  const [location, setLocation] = useState('Bhuj, Gujarat');
  const [selectedCraft, setSelectedCraft] = useState<'Pottery' | 'Textiles' | 'Jewelry'>('Pottery');

  const craftOptions = [
    {
      id: 'Pottery' as const,
      label: 'Pottery',
      icon: (
        <svg className="w-7 h-7 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h12l1 6c0 5-3 9-7 9s-7-4-7-9l1-6z" />
          <path d="M5 9h14" />
          <path d="M9 18v3h6v-3" />
        </svg>
      ),
    },
    {
      id: 'Textiles' as const,
      label: 'Textiles',
      icon: <Shirt className="w-7 h-7 stroke-[1.8]" />,
    },
    {
      id: 'Jewelry' as const,
      label: 'Jewelry',
      icon: <Gem className="w-7 h-7 stroke-[1.8]" />,
    },
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      name: name || 'Radha Devi',
      location: location || 'Bhuj, Gujarat',
      primaryCraft: selectedCraft,
    });
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center p-3 sm:p-6">
      {/* Top Bar for dark canvas */}
      <div className="w-full max-w-md flex items-center justify-between px-2 mb-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <span className="font-literata text-base font-bold text-[#e7b299]">Namaste</span>
        <div className="w-10"></div>
      </div>

      {/* Main Form Card Container */}
      <div className="w-full max-w-md bg-[#fef8f2] rounded-[32px] p-6 sm:p-8 shadow-2xl flex flex-col">
        {/* Progress Bar (Step 1 of 3) */}
        <div className="w-full mb-6">
          <div className="w-full h-1.5 bg-[#dbc1ba]/40 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-[#94442e] w-1/3 rounded-full"></div>
          </div>
          <p className="text-[11px] font-bold tracking-widest text-[#88705e] uppercase text-center">
            {t.step1Of3}
          </p>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="font-literata text-2xl sm:text-3xl font-bold text-[#1d1b18] mb-2 leading-tight">
            {t.welcomeArtisan}
          </h1>
          <p className="text-sm sm:text-base text-[#55433e] leading-relaxed">
            {t.getToknow}
          </p>
        </div>

        <form onSubmit={handleNext} className="space-y-5">
          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold tracking-wider text-[#55433e] uppercase">
              {t.whatIsName}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.enterName}
              required
              className="w-full bg-[#f8f3ed] border border-[#dbc1ba] rounded-2xl py-3.5 px-4 text-sm text-[#1d1b18] placeholder-[#88705e]/60 focus:outline-none focus:ring-2 focus:ring-[#94442e] focus:border-transparent transition-all"
            />
          </div>

          {/* Location Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold tracking-wider text-[#55433e] uppercase">
              {t.whereFrom}
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-[#88705e] pointer-events-none">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t.enterLocation}
                required
                className="w-full bg-[#f8f3ed] border border-[#dbc1ba] rounded-2xl py-3.5 pl-11 pr-4 text-sm text-[#1d1b18] placeholder-[#88705e]/60 focus:outline-none focus:ring-2 focus:ring-[#94442e] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Craft Selection */}
          <div className="space-y-2 pt-1">
            <label className="block text-[11px] font-bold tracking-wider text-[#55433e] uppercase">
              {t.whatMake}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {craftOptions.map((craft) => {
                const isSelected = selectedCraft === craft.id;
                return (
                  <button
                    key={craft.id}
                    type="button"
                    onClick={() => setSelectedCraft(craft.id)}
                    className={`py-4 px-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 border ${
                      isSelected
                        ? 'bg-white border-[#94442e] text-[#94442e] shadow-md ring-2 ring-[#94442e]/30 scale-[1.02]'
                        : 'bg-[#f8f3ed] border-[#dbc1ba]/60 text-[#88705e] hover:bg-white'
                    }`}
                  >
                    <div className="mb-2">{craft.icon}</div>
                    <span className="text-xs font-bold tracking-tight">{craft.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full min-h-[54px] bg-[#94442e] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#b35c44] active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(148,68,46,0.25)]"
            >
              <span>{t.nextStep}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
