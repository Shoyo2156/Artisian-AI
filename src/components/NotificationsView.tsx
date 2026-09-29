import React, { useState } from 'react';
import { Bell, ShoppingBag, Sparkles, ShieldCheck, Truck, CheckCheck, ChevronLeft, ArrowRight } from 'lucide-react';
import { NotificationItem, Language, AppScreen } from '../types';
import { TRANSLATIONS } from '../data/mockData';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onNavigateScreen: (screen: AppScreen) => void;
  onBack: () => void;
  lang: Language;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllAsRead,
  onNavigateScreen,
  onBack,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'buyer_request':
        return <ShoppingBag className="w-5 h-5 text-[#8e4e14]" />;
      case 'product_published':
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
      case 'price_updated':
        return <Sparkles className="w-5 h-5 text-[#94442e]" />;
      case 'verification':
        return <ShieldCheck className="w-5 h-5 text-[#8e4e14]" />;
      case 'order_dispatched':
        return <Truck className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-[#94442e]" />;
    }
  };

  const getBadgeColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'buyer_request':
        return 'bg-[#ffdcc4]/70 border-[#ffab69]/50';
      case 'product_published':
        return 'bg-emerald-50 border-emerald-200';
      case 'price_updated':
        return 'bg-[#ffdbd1]/60 border-[#dbc1ba]';
      case 'verification':
        return 'bg-[#ffdcc4]/70 border-[#ffab69]/50';
      case 'order_dispatched':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-white border-[#ebdcd3]';
    }
  };

  return (
    <div className="flex-1 px-4 sm:px-5 py-4 pb-24 space-y-4 max-w-md mx-auto w-full bg-[#fef8f2]">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#dbc1ba]/60 flex items-center justify-center text-[#55433e] hover:bg-[#f8f3ed] active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 text-[#94442e]" />
          </button>
          <div>
            <h1 className="font-literata text-xl font-bold text-[#1d1b18]">
              {t.notificationsTitle}
            </h1>
            <p className="text-[11px] text-[#88705e]">
              Stay updated on buyers, catalog & orders
            </p>
          </div>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="text-xs font-bold text-[#8e4e14] hover:text-[#94442e] flex items-center gap-1 cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-[#f3ede7] p-1 rounded-2xl border border-[#dbc1ba]/60">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'all' ? 'bg-[#94442e] text-white shadow-2xs' : 'text-[#55433e]'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'unread' ? 'bg-[#94442e] text-white shadow-2xs' : 'text-[#55433e]'
          }`}
        >
          Unread ({notifications.filter((n) => !n.read).length})
        </button>
      </div>

      {/* Notification Cards */}
      <div className="space-y-3 pt-1">
        {filteredNotifs.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#ebdcd3] text-center space-y-2">
            <Bell className="w-8 h-8 text-[#88705e] mx-auto opacity-50" />
            <h3 className="font-literata text-base font-bold text-[#1d1b18]">All caught up!</h3>
            <p className="text-xs text-[#88705e]">No new notifications at this time.</p>
          </div>
        ) : (
          filteredNotifs.map((item) => (
            <div
              key={item.id}
              onClick={() => item.actionTarget && onNavigateScreen(item.actionTarget)}
              className={`p-4 rounded-2xl border shadow-xs transition-all cursor-pointer hover:border-[#94442e]/50 ${
                item.read ? 'bg-white border-[#ebdcd3]' : `${getBadgeColor(item.type)} border-2`
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center shrink-0 border border-[#dbc1ba]/50">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-literata text-sm font-bold text-[#1d1b18] truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-[#88705e] shrink-0">{item.time}</span>
                  </div>

                  <p className="text-xs text-[#55433e] leading-relaxed mt-1">
                    {item.message}
                  </p>

                  {item.actionTarget && (
                    <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-[#94442e]">
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
