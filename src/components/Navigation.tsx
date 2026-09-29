import React from 'react';
import { Home, Package, Store, TrendingUp, User } from 'lucide-react';
import { BottomTab, Language } from '../types';
import { TRANSLATIONS } from '../data/mockData';

interface NavigationProps {
  currentTab: BottomTab;
  onSelectTab: (tab: BottomTab) => void;
  lang: Language;
  unreadCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  lang,
  unreadCount = 0,
}) => {
  const t = TRANSLATIONS[lang];

  const navItems: Array<{ id: BottomTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'my_products', label: t.navProducts, icon: Package },
    { id: 'market', label: t.navMarket, icon: Store },
    { id: 'insights', label: t.navInsights, icon: TrendingUp },
    { id: 'profile', label: t.navProfile, icon: User },
  ];

  return (
    <nav className="w-full bg-[#fef8f2] border-t border-[#ebdcd3] py-2 px-3 flex items-center justify-around sticky bottom-0 z-40 shadow-[0_-4px_16px_rgba(74,55,40,0.04)]">
      {navItems.map((item) => {
        const isActive = currentTab === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-200 relative cursor-pointer ${
              isActive
                ? 'text-white'
                : 'text-[#6e5847] hover:text-[#94442e] active:scale-95'
            }`}
          >
            <div
              className={`flex items-center justify-center w-11 h-8 rounded-full transition-all duration-300 ${
                isActive ? 'bg-[#94442e] shadow-sm text-white' : 'bg-transparent text-[#6e5847]'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>

            {/* Notification badge on insights if unread */}
            {item.id === 'insights' && unreadCount > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 bg-[#ffab69] text-[#783d01] text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#fef8f2]">
                {unreadCount}
              </span>
            )}

            <span
              className={`text-[11px] mt-0.5 tracking-tight font-medium transition-colors ${
                isActive ? 'text-[#94442e] font-bold' : 'text-[#6e5847]'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
