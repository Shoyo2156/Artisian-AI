import React, { useState } from 'react';
import { Globe, User, Bell, Mic, Eye, HelpCircle, LogOut, ChevronLeft, ChevronRight, Check, Phone, ShieldCheck } from 'lucide-react';
import { Language, ArtisanProfile } from '../types';
import { TRANSLATIONS } from '../data/mockData';

interface SettingsViewProps {
  artisan: ArtisanProfile;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onUpdateProfile: (updated: Partial<ArtisanProfile>) => void;
  onLogout: () => void;
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  artisan,
  lang,
  onLanguageChange,
  onUpdateProfile,
  onLogout,
  onBack,
}) => {
  const t = TRANSLATIONS[lang];

  // Settings states
  const [buyerAlerts, setBuyerAlerts] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [autoListenVoice, setAutoListenVoice] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  // Edit profile inline state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(artisan.name);
  const [location, setLocation] = useState(artisan.location);
  const [role, setRole] = useState(artisan.role);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, location, role });
    setIsEditingProfile(false);
  };

  const languages: Array<{ code: Language; label: string; native: string }> = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  ];

  return (
    <div className="flex-1 px-4 sm:px-5 py-4 pb-24 space-y-4 max-w-md mx-auto w-full bg-[#fef8f2]">
      {/* Header */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#dbc1ba]/60 flex items-center justify-center text-[#55433e] hover:bg-[#f8f3ed] active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 text-[#94442e]" />
        </button>
        <div>
          <h1 className="font-literata text-xl font-bold text-[#1d1b18]">
            {t.settingsTitle}
          </h1>
          <p className="text-xs text-[#88705e]">
            Preferences, voice tools & artisan account
          </p>
        </div>
      </div>

      {/* 1. Language Preference Section */}
      <div className="bg-white rounded-3xl p-5 border border-[#ebdcd3] shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-[#94442e] pb-1 border-b border-[#ebdcd3]/70">
          <Globe className="w-4 h-4 text-[#94442e]" />
          <h3 className="font-literata text-sm font-bold text-[#1d1b18]">Language / भाषा</h3>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => onLanguageChange(l.code)}
              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                lang === l.code
                  ? 'bg-[#ffdbd1]/60 border-[#94442e] text-[#94442e] font-bold shadow-2xs'
                  : 'bg-[#f8f3ed] border-[#ebdcd3] text-[#55433e] hover:border-[#dbc1ba]'
              }`}
            >
              <div>
                <p className="text-xs font-semibold">{l.native}</p>
                <span className="text-[10px] text-[#88705e]">{l.label}</span>
              </div>
              {lang === l.code && <Check className="w-4 h-4 text-[#94442e]" />}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Artisan Profile Section */}
      <div className="bg-white rounded-3xl p-5 border border-[#ebdcd3] shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#ebdcd3]/70">
          <div className="flex items-center gap-2 text-[#94442e]">
            <User className="w-4 h-4 text-[#94442e]" />
            <h3 className="font-literata text-sm font-bold text-[#1d1b18]">Artisan Identity</h3>
          </div>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="text-xs font-bold text-[#8e4e14] hover:text-[#94442e] cursor-pointer"
          >
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleSaveProfile} className="space-y-3 text-xs pt-1">
            <div>
              <label className="text-[10px] font-bold uppercase text-[#88705e] block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#dbc1ba] bg-[#fffbf8] font-semibold text-[#1d1b18]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-[#88705e] block mb-1">Location / Cluster</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#dbc1ba] bg-[#fffbf8] font-semibold text-[#1d1b18]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-[#88705e] block mb-1">Craft Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#dbc1ba] bg-[#fffbf8] font-semibold text-[#1d1b18]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#94442e] text-white font-bold rounded-xl shadow-xs"
            >
              Save Profile
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-3 pt-1">
            <img
              src={artisan.avatar}
              alt={artisan.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#ffab69]"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="font-literata text-sm font-bold text-[#1d1b18]">{artisan.name}</h4>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-xs text-[#88705e]">{artisan.role} • {artisan.location}</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Verified Artisan Master</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Voice & Accessibility */}
      <div className="bg-white rounded-3xl p-5 border border-[#ebdcd3] shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-[#94442e] pb-1 border-b border-[#ebdcd3]/70">
          <Mic className="w-4 h-4 text-[#94442e]" />
          <h3 className="font-literata text-sm font-bold text-[#1d1b18]">Voice & Speech Guidance</h3>
        </div>

        <div className="space-y-3 text-xs pt-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[#1d1b18]">Auto-Listen in Voice Assistant</p>
              <p className="text-[11px] text-[#88705e]">Opens microphone automatically upon tap</p>
            </div>
            <button
              onClick={() => setAutoListenVoice(!autoListenVoice)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoListenVoice ? 'bg-[#94442e]' : 'bg-[#dbc1ba]'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  autoListenVoice ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#ebdcd3]/60">
            <div>
              <p className="font-bold text-[#1d1b18]">Instant Voice Translation</p>
              <p className="text-[11px] text-[#88705e]">Converts regional dialects to English catalog narratives</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Enabled
            </span>
          </div>
        </div>
      </div>

      {/* 4. Notifications Preferences */}
      <div className="bg-white rounded-3xl p-5 border border-[#ebdcd3] shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-[#94442e] pb-1 border-b border-[#ebdcd3]/70">
          <Bell className="w-4 h-4 text-[#94442e]" />
          <h3 className="font-literata text-sm font-bold text-[#1d1b18]">Notification Alerts</h3>
        </div>

        <div className="space-y-3 text-xs pt-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[#1d1b18]">Direct Buyer Enquiries</p>
              <p className="text-[11px] text-[#88705e]">Instant alerts for bulk purchase requests</p>
            </div>
            <button
              onClick={() => setBuyerAlerts(!buyerAlerts)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                buyerAlerts ? 'bg-[#94442e]' : 'bg-[#dbc1ba]'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  buyerAlerts ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#ebdcd3]/60">
            <div>
              <p className="font-bold text-[#1d1b18]">Smart Pricing Recommendations</p>
              <p className="text-[11px] text-[#88705e]">Alerts when market demand for your craft peaks</p>
            </div>
            <button
              onClick={() => setPriceAlerts(!priceAlerts)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                priceAlerts ? 'bg-[#94442e]' : 'bg-[#dbc1ba]'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  priceAlerts ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Artisan Helpline & Support */}
      <div className="bg-[#fcf4ec] rounded-3xl p-5 border border-[#ffdbd1] shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-[#94442e]">
          <HelpCircle className="w-4 h-4 text-[#94442e]" />
          <h3 className="font-literata text-sm font-bold text-[#1d1b18]">Artisan Support Helpline</h3>
        </div>

        <p className="text-xs text-[#55433e] leading-relaxed">
          Need help digitizing your craft or resolving order questions? Our craft coordinators are here in multiple languages.
        </p>

        <div className="p-3 bg-white rounded-2xl border border-[#dbc1ba] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Phone className="w-4 h-4 text-[#94442e]" />
            <span className="font-bold text-[#1d1b18]">Toll-Free: 1800-ARTISAN (278-4726)</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
            Toll Free
          </span>
        </div>
      </div>

      {/* 6. Logout */}
      <div className="pt-2">
        <button
          onClick={onLogout}
          className="w-full py-3.5 rounded-full border-2 border-[#dbc1ba] bg-white text-[#94442e] font-bold text-xs hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out of Artisan AI</span>
        </button>
      </div>
    </div>
  );
};
