import React, { useState } from 'react';
import { ArrowRight, Phone, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/mockData';

interface LoginViewProps {
  onLoginSuccess: (mobile: string, password: string) => void;
  onCreateAccount: () => void;
  lang: Language;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onCreateAccount,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [mobile, setMobile] = useState('9876543210');
  const [password, setPassword] = useState('artisan123');
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(mobile, password);
  };

  const handleOtpLogin = () => {
    if (!otpSent) {
      setOtpSent(true);
      setIsOtpMode(true);
      setOtp('7489');
    } else {
      onLoginSuccess(mobile, password);
    }
  };

  return (
    <div className="min-h-screen bg-[#fef8f2] flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Outer Card Container */}
      <div className="w-full max-w-md bg-white rounded-[28px] shadow-[0_8px_30px_rgba(74,55,40,0.08)] border border-[#ebdcd3] overflow-hidden flex flex-col">
        {/* Top Artisan Image Hero */}
        <div className="w-full p-4 pb-0">
          <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-[#f8f3ed]">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
              alt="Indian Artisan Potter"
              className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            
            {/* Tag badge */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-bold text-[#94442e] shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#ffab69]" />
              <span>Digital Workshop</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 sm:p-8 flex flex-col text-center">
          <h1 className="font-literata text-2xl sm:text-3xl font-bold text-[#94442e] mb-1.5">
            {t.welcomeBack}
          </h1>
          <p className="text-sm sm:text-base text-[#55433e] mb-6">
            {t.welcomeSub}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Mobile Number Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold tracking-wider text-[#55433e] uppercase">
                {t.mobileNumber}
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-[#88705e] pointer-events-none">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder={t.enterMobile}
                  required
                  className="w-full bg-[#f8f3ed] border border-[#dbc1ba] rounded-lg py-3.5 pl-10 pr-4 text-sm text-[#1d1b18] placeholder-[#88705e]/60 focus:outline-none focus:ring-2 focus:ring-[#94442e] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password or OTP Input */}
            {!isOtpMode ? (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold tracking-wider text-[#55433e] uppercase">
                  {t.password}
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-[#88705e] pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.enterPassword}
                    required
                    className="w-full bg-[#f8f3ed] border border-[#dbc1ba] rounded-lg py-3.5 pl-10 pr-11 text-sm text-[#1d1b18] placeholder-[#88705e]/60 focus:outline-none focus:ring-2 focus:ring-[#94442e] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#88705e] hover:text-[#94442e]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 animate-in fade-in">
                <label className="block text-[11px] font-bold tracking-wider text-[#55433e] uppercase">
                  ENTER 4-DIGIT OTP
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="7489"
                  className="w-full bg-[#f8f3ed] border border-[#dbc1ba] rounded-lg py-3.5 px-4 text-center tracking-widest font-mono text-lg text-[#1d1b18] focus:outline-none focus:ring-2 focus:ring-[#94442e]"
                />
                <p className="text-[11px] text-emerald-600 font-medium text-center">
                  ✓ OTP auto-filled for quick demo: 7489
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                className="w-full min-h-[52px] bg-[#94442e] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#b35c44] active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(148,68,46,0.22)]"
              >
                <span>{t.login}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleOtpLogin}
                className="w-full min-h-[52px] bg-transparent border-2 border-[#ffab69] text-[#8e4e14] rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#ffdcc4]/30 active:scale-[0.98] transition-all"
              >
                <span>{otpSent ? 'Verify OTP & Enter' : t.loginOtp}</span>
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-6 pt-4 border-t border-[#ebdcd3]/70">
            <button
              onClick={onCreateAccount}
              className="text-xs sm:text-sm font-bold text-[#94442e] underline hover:text-[#b35c44] transition-colors"
            >
              {t.createAccount}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
