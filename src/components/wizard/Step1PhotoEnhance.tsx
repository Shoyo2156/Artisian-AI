import React, { useState, useRef } from 'react';
import { ArrowRight, Sparkles, MoveHorizontal, Camera, Upload, RefreshCw } from 'lucide-react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/mockData';
import { uploadsApi, aiApi } from '../../services/api';

interface Step1PhotoEnhanceProps {
  onContinue: (originalImg: string, enhancedImg: string) => void;
  onBack: () => void;
  lang: Language;
}

export const Step1PhotoEnhance: React.FC<Step1PhotoEnhanceProps> = ({
  onContinue,
  onBack,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [presetIndex, setPresetIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Background presets for AI Enhancement
  const presets = [
    {
      name: 'Studio Pure White',
      original: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      enhanced: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Artisan Wood Podium',
      original: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
      enhanced: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Vedic Warm Earth',
      original: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      enhanced: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const currentPreset = presets[presetIndex];

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const cycleEnhance = () => {
    setIsEnhancing(true);
    setTimeout(() => {
      setPresetIndex((prev) => (prev + 1) % presets.length);
      setIsEnhancing(false);
    }, 600);
  };

  const handleCustomUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      presets[0].original = localUrl;
      presets[0].enhanced = localUrl;
      setPresetIndex(0);
      try {
        const uploaded = await uploadsApi.productImage(file);
        if (uploaded?.url) {
          presets[0].original = uploaded.url;
          const enhanced = await aiApi.enhanceImage(uploaded.url);
          presets[0].enhanced = enhanced?.enhanced_image || uploaded.url;
          setPresetIndex(0);
        }
      } catch {
        /* keep local preview if upload is unavailable */
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-5 py-4 pb-8 max-w-md mx-auto w-full bg-[#fef8f2]">
      {/* Header Info */}
      <div className="text-center pt-1 pb-4">
        <p className="text-[11px] font-bold tracking-widest text-[#8e4e14] uppercase mb-1">
          {t.step1Of4}
        </p>
        <h1 className="font-literata text-2xl sm:text-3xl font-bold text-[#1d1b18] mb-2">
          {t.appName}
        </h1>
        <p className="text-xs sm:text-sm text-[#55433e] leading-relaxed max-w-xs mx-auto">
          {t.photoSub}
        </p>
      </div>

      {/* Main Interactive Split Comparison Card */}
      <div className="bg-white rounded-[28px] p-3.5 border border-[#ebdcd3] shadow-[0_8px_24px_rgba(74,55,40,0.06)] mb-4">
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden cursor-ew-resize select-none bg-[#1d1b18]"
        >
          {/* Enhanced Image (Base Right layer) */}
          <img
            src={currentPreset.enhanced}
            alt="AI Enhanced Product"
            className={`absolute inset-0 w-full h-full object-cover filter contrast-[1.05] brightness-[1.02] ${
              isEnhancing ? 'blur-xs scale-105' : ''
            } transition-all duration-300`}
          />

          {/* AI Enhanced Tag (Right) */}
          <div className="absolute top-3.5 right-3.5 z-10 bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
            {t.aiEnhanced}
          </div>

          {/* Original Image (Clipped Left Layer) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={currentPreset.original}
              alt="Original Workshop Photo"
              className="absolute top-0 left-0 max-w-none h-full object-cover filter brightness-90 saturate-[0.85]"
              style={{ width: containerRef.current?.offsetWidth || '100%' }}
            />
            {/* Original Tag (Left) */}
            <div className="absolute top-3.5 left-3.5 z-10 bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
              <Camera className="w-3 h-3" />
              <span>{t.original}</span>
            </div>
          </div>

          {/* Draggable Divider Line and Center Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-md z-20"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-[#94442e] shadow-lg flex items-center justify-center border-2 border-[#94442e] active:scale-110 transition-transform">
              <MoveHorizontal className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Footer controls under comparison */}
        <div className="pt-3.5 px-1 flex items-center justify-between">
          <div>
            <h4 className="font-literata text-sm font-bold text-[#1d1b18]">
              {t.bgMagic}
            </h4>
            <p className="text-[11px] text-[#88705e]">
              {t.slideToPreview} • {currentPreset.name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="p-2.5 rounded-full bg-[#f8f3ed] text-[#8e4e14] hover:bg-[#ebdcd3] cursor-pointer transition-colors" title="Upload custom photo">
              <Upload className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />
            </label>

            <button
              onClick={cycleEnhance}
              disabled={isEnhancing}
              className="px-3.5 py-2 rounded-full bg-[#94442e] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#b35c44] active:scale-95 transition-all shadow-xs"
            >
              <Sparkles className={`w-3.5 h-3.5 text-[#ffab69] ${isEnhancing ? 'animate-spin' : ''}`} />
              <span>{isEnhancing ? 'Enhancing...' : t.reEnhance}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 min-h-[52px] bg-transparent border-2 border-[#dbc1ba] text-[#55433e] rounded-full font-bold text-sm hover:bg-white active:scale-95 transition-all"
        >
          {t.back}
        </button>

        <button
          onClick={() => onContinue(currentPreset.original, currentPreset.enhanced)}
          className="flex-[1.5] min-h-[52px] bg-[#94442e] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#b35c44] active:scale-95 transition-all shadow-[0_4px_16px_rgba(148,68,46,0.22)]"
        >
          <span>{t.continue}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
