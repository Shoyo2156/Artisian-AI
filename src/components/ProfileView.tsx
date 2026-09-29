import React, { useState } from 'react';
import { Hourglass, Package, MapPin, Sparkles, PlusCircle, IndianRupee, MessageSquare, Mic, MicOff, Send, Volume2, UserCheck } from 'lucide-react';
import { ArtisanProfile, Language } from '../types';
import { TRANSLATIONS } from '../data/mockData';

interface ProfileViewProps {
  artisan: ArtisanProfile;
  onAddNewProduct: () => void;
  onViewEarnings: () => void;
  onViewMessages: () => void;
  lang: Language;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  artisan,
  onAddNewProduct,
  onViewEarnings,
  onViewMessages,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: t.aiGreeting,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg = promptText;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputText('');

    // Generate intelligent AI response
    setTimeout(() => {
      let reply = "I can definitely help you with that!";
      const lower = userMsg.toLowerCase();
      if (lower.includes('earning') || lower.includes('कमाई') || lower.includes('पैसे')) {
        reply = `You have earned ₹${artisan.monthlyEarnings.toLocaleString('en-IN')} this month across 12 active listings, which is 24% higher than last month.`;
      } else if (lower.includes('message') || lower.includes('buyer') || lower.includes('संदेश') || lower.includes('order')) {
        reply = "You have 1 pending bulk order enquiry from FabIndia for 50 Terracotta Vases (Expected by Oct 15). Would you like to review the quotation?";
      } else if (lower.includes('product') || lower.includes('उत्पाद') || lower.includes('add') || lower.includes('नया')) {
        reply = "Opening the AI Product Camera. Place your craft under good light and I'll enhance the background automatically!";
        setTimeout(() => onAddNewProduct(), 1200);
      } else if (lower.includes('price') || lower.includes('कीमत')) {
        reply = "Artisan AI Smart Pricing calculates your raw materials, labor hours, and local market trends to ensure a healthy 35-45% profit margin.";
      } else {
        reply = `Namaste ${artisan.name}! Your shop is performing well. You have 142 total crafts cataloged and 5 active buyer discussions.`;
      }

      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  const handleMicToggle = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice capture
      setTimeout(() => {
        setIsListening(false);
        handleSendPrompt("Show my earnings this month");
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="flex-1 px-4 sm:px-5 py-4 pb-24 space-y-5 max-w-md mx-auto w-full bg-[#fef8f2]">
      {/* Top Profile Card */}
      <div className="bg-white rounded-[32px] p-6 border border-[#ebdcd3] shadow-[0_8px_24px_rgba(74,55,40,0.06)] text-center relative overflow-hidden flex flex-col items-center">
        {/* Decorative subtle background aura */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#ffdcc4]/50 to-transparent pointer-events-none"></div>

        {/* Profile Avatar */}
        <div className="relative mb-3 mt-1">
          <img
            src={artisan.avatar}
            alt={artisan.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="absolute bottom-0 right-0 bg-[#94442e] text-white p-1.5 rounded-full border-2 border-white">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Name & Title */}
        <h1 className="font-literata text-2xl font-bold text-[#1d1b18] mb-1">
          {artisan.name}
        </h1>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8e4e14] mb-1">
          <span>🎨</span>
          <span>{artisan.role}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-[#88705e]">
          <MapPin className="w-3.5 h-3.5 text-[#94442e]" />
          <span>{artisan.location}</span>
        </div>
      </div>

      {/* Two Stat Cards: Experience & Total Products */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Experience Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#ebdcd3] shadow-xs">
          <div className="flex items-center gap-1.5 text-[#88705e] mb-2">
            <Hourglass className="w-4 h-4 text-[#8e4e14]" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#55433e]">
              {t.experience}
            </span>
          </div>
          <p className="font-literata text-2xl sm:text-3xl font-bold text-[#1d1b18]">
            {artisan.experienceYears} <span className="text-base font-normal text-[#88705e]">Yrs</span>
          </p>
        </div>

        {/* Total Products Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#ebdcd3] shadow-xs">
          <div className="flex items-center gap-1.5 text-[#88705e] mb-2">
            <Package className="w-4 h-4 text-[#8e4e14]" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#55433e]">
              {t.totalProd}
            </span>
          </div>
          <p className="font-literata text-2xl sm:text-3xl font-bold text-[#1d1b18]">
            {artisan.totalProducts}
          </p>
        </div>
      </div>

      {/* Voice Assistant - Ask Me Anything Section */}
      <div className="space-y-3 pt-1">
        <h2 className="font-literata text-xl font-bold text-[#1d1b18] px-1">
          {t.voiceAssistantTitle}
        </h2>

        {/* Interactive Assistant Container */}
        <div className="bg-[#fcf4ec] rounded-3xl p-5 border border-[#ffdbd1] shadow-xs space-y-4">
          {/* Chat Messages Log */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#94442e] text-white font-medium rounded-br-none shadow-xs'
                      : 'bg-white text-[#1d1b18] border border-[#ebdcd3] rounded-bl-none shadow-xs font-literata'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isListening && (
              <div className="flex justify-start">
                <div className="p-3 bg-white rounded-2xl text-xs text-[#94442e] flex items-center gap-2 border border-[#ffdbd1] animate-pulse">
                  <Mic className="w-3.5 h-3.5 text-[#94442e] animate-bounce" />
                  <span>Artisan AI is listening to your voice...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Suggestion Pills */}
          <div className="space-y-2 pt-1">
            <button
              onClick={onAddNewProduct}
              className="w-full bg-white hover:bg-[#f8f3ed] border border-[#dbc1ba]/80 rounded-full py-2.5 px-4 flex items-center gap-3 text-xs font-semibold text-[#1d1b18] shadow-xs transition-all text-left active:scale-[0.99]"
            >
              <PlusCircle className="w-4 h-4 text-[#94442e] shrink-0" />
              <span>{t.askAddProduct}</span>
            </button>

            <button
              onClick={() => handleSendPrompt("Show my earnings")}
              className="w-full bg-white hover:bg-[#f8f3ed] border border-[#dbc1ba]/80 rounded-full py-2.5 px-4 flex items-center gap-3 text-xs font-semibold text-[#1d1b18] shadow-xs transition-all text-left active:scale-[0.99]"
            >
              <IndianRupee className="w-4 h-4 text-[#8e4e14] shrink-0" />
              <span>{t.askEarnings}</span>
            </button>

            <button
              onClick={() => handleSendPrompt("Check messages from buyers")}
              className="w-full bg-white hover:bg-[#f8f3ed] border border-[#dbc1ba]/80 rounded-full py-2.5 px-4 flex items-center gap-3 text-xs font-semibold text-[#1d1b18] shadow-xs transition-all text-left active:scale-[0.99]"
            >
              <MessageSquare className="w-4 h-4 text-[#8e4e14] shrink-0" />
              <span>{t.askOrders}</span>
            </button>
          </div>

          {/* Chat / Voice Input Bar */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#ebdcd3]/70">
            <button
              onClick={handleMicToggle}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                isListening ? 'bg-[#94442e] text-white ring-4 ring-[#ffdbd1]' : 'bg-[#ffab69] text-[#783d01]'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt(inputText)}
              placeholder="Type or speak in Hindi/English..."
              className="flex-1 bg-white border border-[#dbc1ba] rounded-full py-2 px-4 text-xs text-[#1d1b18] focus:outline-none focus:ring-2 focus:ring-[#94442e]"
            />

            <button
              onClick={() => handleSendPrompt(inputText)}
              className="w-10 h-10 rounded-full bg-[#94442e] text-white flex items-center justify-center shrink-0 shadow-xs hover:bg-[#b35c44]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
