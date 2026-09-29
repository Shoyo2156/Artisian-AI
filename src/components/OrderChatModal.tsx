import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCheck, IndianRupee, Truck } from 'lucide-react';
import { OrderRequest, Language } from '../types';

interface OrderChatModalProps {
  order: OrderRequest | null;
  onClose: () => void;
  onSendMessage: (orderId: string, text: string) => void;
  lang: Language;
}

export const OrderChatModal: React.FC<OrderChatModalProps> = ({
  order,
  onClose,
  onSendMessage,
  lang,
}) => {
  if (!order) return null;

  const [inputMessage, setInputMessage] = useState('');

  const quickReplies = [
    'Yes, we can deliver by the requested date.',
    'All items are 100% handmade and kiln-cured.',
    'I will prepare the sample batch tomorrow.',
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    onSendMessage(order.id, text);
    setInputMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-[#fef8f2] rounded-t-[32px] sm:rounded-[32px] p-5 max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ebdcd3]">
          <div className="flex items-center gap-3">
            <img
              src={order.productImage}
              alt={order.title}
              className="w-11 h-11 rounded-xl object-cover border border-[#ebdcd3]"
            />
            <div>
              <h3 className="font-literata text-sm sm:text-base font-bold text-[#1d1b18] leading-tight">
                {order.buyerName}
              </h3>
              <p className="text-[11px] text-[#8e4e14] font-semibold">
                {order.buyerCompany} • Qty: {order.quantity} pcs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-[#55433e] flex items-center justify-center shadow-xs hover:bg-[#f8f3ed]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Banner Info */}
        <div className="bg-[#ffdcc4]/60 p-3 rounded-2xl my-2.5 flex items-center justify-between text-xs border border-[#ffab69]/50">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#8e4e14]" />
            <span className="font-medium text-[#55433e]">Delivery: {order.expectedDelivery}</span>
          </div>
          <span className="font-literata font-bold text-[#94442e]">
            ₹{order.totalValue.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto py-2 space-y-3 min-h-[220px]">
          {order.messages.map((msg, index) => {
            const isArtisan = msg.sender === 'artisan';
            return (
              <div
                key={index}
                className={`flex flex-col ${isArtisan ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm max-w-[85%] leading-relaxed ${
                    isArtisan
                      ? 'bg-[#94442e] text-white rounded-br-none shadow-xs'
                      : 'bg-white text-[#1d1b18] border border-[#ebdcd3] rounded-bl-none shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`text-[9px] mt-1 flex items-center gap-1 justify-end ${
                      isArtisan ? 'text-[#ffdbd1]' : 'text-[#88705e]'
                    }`}
                  >
                    <span>{msg.time}</span>
                    {isArtisan && <CheckCheck className="w-3 h-3 text-[#ffab69]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Suggested Quick Replies */}
        <div className="pt-2 pb-1">
          <div className="flex items-center gap-1 text-[10px] font-bold text-[#8e4e14] uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3 h-3 text-[#ffab69]" />
            <span>AI Suggested Quick Replies</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleSend(reply)}
                className="bg-white hover:bg-[#f8f3ed] border border-[#dbc1ba] px-3 py-1.5 rounded-full text-[11px] font-medium text-[#55433e] whitespace-nowrap shadow-2xs transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#ebdcd3]">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputMessage)}
            placeholder="Type response in Hindi/English..."
            className="flex-1 bg-white border border-[#dbc1ba] rounded-full py-2.5 px-4 text-xs text-[#1d1b18] focus:outline-none focus:ring-2 focus:ring-[#94442e]"
          />
          <button
            onClick={() => handleSend(inputMessage)}
            className="w-10 h-10 rounded-full bg-[#94442e] hover:bg-[#b35c44] text-white flex items-center justify-center shrink-0 shadow-xs transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
