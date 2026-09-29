import React, { useState, useEffect } from 'react';
import { ArrowRight, Mic, MicOff, Volume2, Sparkles, Languages, CheckCircle2 } from 'lucide-react';
import { Language } from '../../types';
import { TRANSLATIONS } from '../../data/mockData';
import { aiApi } from '../../services/api';

interface Step2VoiceDescriptionProps {
  onContinue: (transcript: string, englishStory: string) => void;
  onSkip: () => void;
  lang: Language;
}

export const Step2VoiceDescription: React.FC<Step2VoiceDescriptionProps> = ({
  onContinue,
  onSkip,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState(
    "यह एक हस्तशिल्प मिट्टी का मटका है, जिसे मैंने अपने हाथों से बनाया है। इसकी खास बात यह है कि यह पानी को प्राकृतिक रूप से ठंडा रखता है।"
  );
  const [storyEn, setStoryEn] = useState(
    "This handcrafted earthen clay pot is shaped entirely on the potter's wheel using organic riverbed clay. The porous terracotta naturally cools stored water through natural evaporative cooling, keeping it sweet and mineral-rich."
  );

  const sampleTranscripts = [
    {
      hi: "यह एक हस्तशिल्प मिट्टी का मटका है, जिसे मैंने अपने हाथों से बनाया है। इसकी खास बात यह है कि यह पानी को प्राकृतिक रूप से ठंडा रखता है।",
      en: "This handcrafted terracotta pot is shaped using natural riverbed clay, naturally cooling water through organic evaporative cooling.",
    },
    {
      hi: "यह शुद्ध कातन सिल्क की बनारसी साड़ी है, जिसमें हमने असली सोने की ज़री का काम और कड़वा बुनाई की है।",
      en: "This pure Katan silk Banarasi saree features traditional Kadwa gold zari motifs inspired by Mughal floral vines.",
    },
    {
      hi: "यह कच्छ की पारंपरिक डाबू और इंडिगो डाई वाली सूती चादर है, जो सात बार प्राकृतिक नील के कुंड में रंगी गई है।",
      en: "This artisan Dabu mud-resist indigo cotton bedcover is immersed seven times in desert-fermented natural dye vats.",
    },
  ];

  const [activeSampleIndex, setActiveSampleIndex] = useState(0);

  // Audio wave heights animation
  const [waveHeights, setWaveHeights] = useState([12, 24, 38, 20, 32, 16, 28, 44, 22, 14]);

  useEffect(() => {
    let interval: any;
    if (isListening) {
      interval = setInterval(() => {
        setWaveHeights(waveHeights.map(() => Math.floor(Math.random() * 36) + 10));
      }, 180);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const handleSelectSample = (idx: number) => {
    setActiveSampleIndex(idx);
    setTranscript(sampleTranscripts[idx].hi);
    setStoryEn(sampleTranscripts[idx].en);
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-5 py-4 pb-8 max-w-md mx-auto w-full bg-[#fef8f2]">
      {/* Header Info */}
      <div className="text-center pt-1 pb-3">
        <p className="text-[11px] font-bold tracking-widest text-[#8e4e14] uppercase mb-1">
          {t.step2Of4}
        </p>
        <h1 className="font-literata text-2xl sm:text-3xl font-bold text-[#94442e] mb-2">
          {t.voiceTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#55433e] leading-relaxed max-w-xs mx-auto">
          {t.voiceSub}
        </p>
      </div>

      {/* Concentric Terracotta Ripple Visualizer */}
      <div className="flex-1 flex flex-col items-center justify-center my-4 relative">
        <div className="relative flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72">
          {/* Outer Ripple 3 */}
          <div
            className={`absolute inset-0 rounded-full bg-[#ffdbd1]/40 transition-all duration-700 ${
              isListening ? 'animate-pulse-ring scale-100 opacity-60' : 'opacity-20'
            }`}
          ></div>

          {/* Middle Ripple 2 */}
          <div
            className={`absolute inset-6 rounded-full bg-[#ffdcc4]/70 transition-all duration-500 ${
              isListening ? 'scale-100' : 'opacity-40'
            }`}
          ></div>

          {/* Inner Ripple 1 */}
          <div
            className={`absolute inset-12 rounded-full bg-[#ffab69] transition-all duration-300 ${
              isListening ? 'scale-100 shadow-md' : 'opacity-60'
            }`}
          ></div>

          {/* Center Mic Button */}
          <button
            onClick={toggleListening}
            className={`w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-xl z-20 transition-transform active:scale-95 ${
              isListening
                ? 'bg-[#94442e] text-white ring-4 ring-white/80'
                : 'bg-[#6e5847] text-white ring-2 ring-white/50'
            }`}
          >
            {isListening ? (
              <Mic className="w-10 h-10 stroke-[2.2] animate-bounce" />
            ) : (
              <MicOff className="w-10 h-10 stroke-[2]" />
            )}
            <span className="text-[10px] font-bold tracking-wider uppercase mt-1">
              {isListening ? 'Listening' : 'Tap to Speak'}
            </span>
          </button>
        </div>

        {/* Audio Wave Bars */}
        <div className="flex items-center gap-1.5 h-10 mt-3">
          {waveHeights.map((h, i) => (
            <div
              key={i}
              className="w-1 bg-[#94442e] rounded-full transition-all duration-150"
              style={{ height: isListening ? `${h}px` : '6px', opacity: isListening ? 0.9 : 0.3 }}
            ></div>
          ))}
        </div>
      </div>

      {/* Real-time Transcription & Translation Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#ebdcd3] shadow-[0_6px_20px_rgba(74,55,40,0.06)] space-y-3 mb-4">
        <div className="flex items-center justify-between pb-1 border-b border-[#ebdcd3]/60">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isListening ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isListening ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-xs font-semibold text-[#88705e]">
              {isListening ? t.aiListening : 'Speech Captured'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#94442e] font-bold">
            <Sparkles className="w-3 h-3 text-[#ffab69]" />
            <span>AI Translation Active</span>
          </div>
        </div>

        {/* Hindi Speech Transcript */}
        <div className="bg-[#f8f3ed] p-3.5 rounded-2xl border border-[#dbc1ba]/50">
          <p className="font-hindi-body text-sm sm:text-base text-[#1d1b18] font-medium leading-relaxed">
            "{transcript}"
          </p>
        </div>

        {/* Quick Sample Selector for user */}
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] text-[#88705e] font-bold uppercase whitespace-nowrap">Voice Prompts:</span>
          {['Pottery', 'Silk Saree', 'Indigo'].map((p, idx) => (
            <button
              key={p}
              onClick={() => handleSelectSample(idx)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors ${
                activeSampleIndex === idx
                  ? 'bg-[#94442e] text-white'
                  : 'bg-[#f8f3ed] text-[#55433e] hover:bg-[#ebdcd3]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={async () => {
            try {
              const res = await aiApi.transcribe({ transcript, language: 'hi' });
              onContinue(res.transcript || transcript, res.english_description || storyEn);
            } catch {
              onContinue(transcript, storyEn);
            }
          }}
          className="w-full min-h-[54px] bg-[#94442e] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#b35c44] active:scale-95 transition-all shadow-[0_4px_16px_rgba(148,68,46,0.22)]"
        >
          <span>{t.continueToCatalog}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center">
          <button
            onClick={onSkip}
            className="text-xs font-semibold text-[#88705e] hover:text-[#94442e] transition-colors"
          >
            {t.skipForNow}
          </button>
        </div>
      </div>
    </div>
  );
};
