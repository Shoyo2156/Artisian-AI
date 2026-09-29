import React from 'react';
import { ChevronLeft, Globe, Bell, Sparkles } from 'lucide-react';
import { Language, ArtisanProfile } from '../types';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  artisan?: ArtisanProfile;
  showArtisanAvatar?: boolean;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack,
  onBack,
  lang,
  onLanguageChange,
  artisan,
  showArtisanAvatar = false,
  onOpenNotifications,
  unreadNotificationsCount = 0,
}) => {
  const [showLangMenu, setShowLangMenu] = React.useState(false);

  const langLabels: Record<Language, { code: string; label: string; native: string }> = {
    en: { code: 'EN', label: 'English', native: 'English' },
    hi: { code: 'HI', label: 'Hindi', native: 'हिन्दी' },
    mr: { code: 'MR', label: 'Marathi', native: 'मराठी' },
    gu: { code: 'GU', label: 'Gujarati', native: 'ગુજરાતી' },
  };

  return (
    <header className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 bg-[#fef8f2] border-b border-[#ebdcd3]/70 sticky top-0 z-30 select-none backdrop-blur-md bg-[#fef8f2]/95">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#dbc1ba]/50 flex items-center justify-center text-[#55433e] hover:bg-[#f8f3ed] active:scale-95 transition-all cursor-pointer"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-[#94442e]" />
          </button>
        ) : showArtisanAvatar && artisan ? (
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={artisan.avatar}
                alt={artisan.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#ffab69] shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#88705e] tracking-wider uppercase flex items-center gap-1">
                <span>Namaste</span>
                <span className="w-1 h-1 rounded-full bg-[#94442e]"></span>
              </div>
              <p className="text-sm font-semibold text-[#1d1b18] leading-tight font-literata">{artisan.name}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#94442e] flex items-center justify-center shadow-xs text-white">
              <Sparkles className="w-4 h-4 text-[#ffab69]" />
            </div>
            <span className="font-literata text-lg font-bold text-[#94442e] tracking-tight">ARTISAN AI</span>
          </div>
        )}

        {title && showBack && (
          <h2 className="font-literata text-base sm:text-lg font-bold text-[#94442e] tracking-tight truncate max-w-[180px] sm:max-w-xs">{title}</h2>
        )}
      </div>

      <div className="flex items-center gap-2 relative">
        {/* Notification Bell */}
        {onOpenNotifications && (
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-full bg-white border border-[#dbc1ba]/60 flex items-center justify-center text-[#55433e] hover:border-[#94442e] transition-all active:scale-95 cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-[#94442e]" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ffab69] text-[#783d01] text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-2xs">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        )}

        {/* Language Toggle Button */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#dbc1ba]/60 text-xs font-bold text-[#55433e] shadow-xs hover:border-[#94442e] transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#94442e]" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-[#dbc1ba]/50 py-1.5 z-50 animate-in fade-in zoom-in-95">
              {(Object.keys(langLabels) as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    onLanguageChange(l);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    lang === l ? 'bg-[#ffdbd1]/50 text-[#94442e] font-bold' : 'text-[#55433e] hover:bg-[#f8f3ed]'
                  }`}
                >
                  <span className="font-medium">{langLabels[l].native}</span>
                  <span className="text-[10px] text-[#88705e] uppercase tracking-wider">{langLabels[l].code}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
