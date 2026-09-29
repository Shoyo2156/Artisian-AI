import React, { useState } from 'react';
import { X, Mic, MicOff, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { Language, AppScreen } from '../types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActionTrigger: (action: 'add_product' | 'my_products' | 'insights' | 'market') => void;
  lang: Language;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onActionTrigger,
  lang,
}) => {
  if (!isOpen) return null;

  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState("नया प्रोडक्ट जोड़ो (Add new craft)");
  const [aiResponse, setAiResponse] = useState("कारीगर AI: नया उत्पाद जोड़ने के लिए कैमरा स्टूडियो खोल रहा हूँ...");

  const prompts = [
    {
      hi: "नया प्रोडक्ट जोड़ो",
      en: "Add new product",
      actionType: 'add_product' as const,
      reply: "Opening AI Photo Studio and Voice Catalog wizard...",
    },
    {
      hi: "मेरे प्रोडक्ट्स दिखाओ",
      en: "Show my products",
      actionType: 'my_products' as const,
      reply: "Navigating to your published artisanal catalog...",
    },
    {
      hi: "खरीदार अनुरोध और कमाई दिखाओ",
      en: "Show buyer enquiries & analytics",
      actionType: 'insights' as const,
      reply: "Opening buyer orders and weekly view trends...",
    },
    {
      hi: "बाज़ार में अन्य उत्पाद देखो",
      en: "Explore artisan marketplace",
      actionType: 'market' as const,
      reply: "Opening live marketplace collection...",
    },
  ];

  const handleCommand = (p: typeof prompts[0]) => {
    setTranscript(`${p.hi} • ${p.en}`);
    setAiResponse(p.reply);
    setTimeout(() => {
      onClose();
      onActionTrigger(p.actionType);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-[#fef8f2] rounded-t-[32px] sm:rounded-[32px] p-6 text-center shadow-2xl flex flex-col items-center space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ffab69]" />
            <span className="font-literata text-base font-bold text-[#94442e]">Artisan AI Voice</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-[#55433e] flex items-center justify-center shadow-xs cursor-pointer hover:bg-[#f8f3ed]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Concentric Animated Voice Orb */}
        <div className="relative my-2 flex items-center justify-center w-36 h-36">
          <div className="absolute inset-0 rounded-full bg-[#ffdbd1] animate-pulse-ring opacity-60"></div>
          <div className="absolute inset-3 rounded-full bg-[#ffdcc4] opacity-80"></div>
          <button
            onClick={() => setIsListening(!isListening)}
            className="w-20 h-20 rounded-full bg-[#94442e] text-white flex items-center justify-center shadow-lg relative z-10 active:scale-95 cursor-pointer"
          >
            {isListening ? (
              <Mic className="w-8 h-8 animate-bounce text-white" />
            ) : (
              <MicOff className="w-8 h-8 text-white/80" />
            )}
          </button>
        </div>

        {/* Live Speech Recognition Box */}
        <div className="w-full bg-white p-4 rounded-2xl border border-[#ebdcd3] shadow-xs text-left space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#88705e]">
            <span className="font-bold uppercase tracking-wider">Voice Recognized:</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Hindi / English
            </span>
          </div>
          <p className="font-literata text-sm font-semibold text-[#1d1b18]">"{transcript}"</p>
          <div className="pt-2 border-t border-[#ebdcd3]/60 text-xs text-[#94442e] flex items-center gap-1.5 font-medium">
            <Volume2 className="w-3.5 h-3.5 shrink-0" />
            <span>{aiResponse}</span>
          </div>
        </div>

        {/* Quick Voice Actions */}
        <div className="w-full space-y-2 pt-1">
          <p className="text-[11px] font-bold text-[#88705e] uppercase tracking-wider text-left px-1">
            Tap a demo voice command:
          </p>
          {prompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleCommand(p)}
              className="w-full bg-white hover:bg-[#f8f3ed] border border-[#dbc1ba]/70 rounded-2xl py-2.5 px-4 text-xs font-semibold text-[#1d1b18] text-left transition-colors flex items-center justify-between shadow-2xs cursor-pointer group"
            >
              <div>
                <p className="text-xs font-bold text-[#1d1b18] font-hindi-body">{p.hi}</p>
                <span className="text-[10px] text-[#88705e]">{p.en}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#94442e] group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
