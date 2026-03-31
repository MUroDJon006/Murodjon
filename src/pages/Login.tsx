import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Lock, ArrowRight, ChevronDown, CheckCircle2, RefreshCw, AlertCircle, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

const countries = [
  { code: 'UZ', name: 'Uzbekistan', dialCode: '+998', flag: '🇺🇿' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'US', name: 'USA', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'UK', dialCode: '+44', flag: '🇬🇧' },
  { code: 'KZ', name: 'Kazakhstan', dialCode: '+7', flag: '🇰🇿' },
];

export default function Login() {
  const { t, language } = useLanguage();
  const { login, status, user } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && !isSuccess) {
      navigate('/');
    }
  }, [status, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 7) {
      toast.error(t.auth.errorInvalidPhone);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    login(phone, password);
    setIsLoading(false);
    setIsSuccess(true);
    
    toast.success('Authentication successful!');
    
    // Smooth transition to dashboard/home
    setTimeout(() => {
      const savedUser = JSON.parse(localStorage.getItem('careerflow_user') || '{}');
      if (savedUser.role && savedUser.role !== 'user') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back!</h2>
          <p className="text-gray-500 dark:text-gray-400">Redirecting you to your workspace...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-white dark:bg-gray-950 transition-colors px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-gradient" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-[100px] floating" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[120px] floating" style={{ animationDelay: '-2s' }} />
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="glass p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/20 dark:border-gray-800/50">
          <div className="text-center mb-12">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-8 shadow-2xl shadow-indigo-500/40"
            >
              CF
            </motion.div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              Smart Authentication
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
              Enter your credentials to access your professional dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              {/* Phone Input */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-2 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative flex items-center bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all overflow-hidden">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCountryOpen(!isCountryOpen)}
                      className="flex items-center space-x-2 px-4 h-16 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-r border-gray-200 dark:border-gray-800"
                    >
                      <span className="text-xl">{selectedCountry.flag}</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300">{selectedCountry.dialCode}</span>
                      <ChevronDown className={cn("w-3 h-3 text-gray-400 transition-transform", isCountryOpen && "rotate-180")} />
                    </button>
                    
                    <AnimatePresence>
                      {isCountryOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-3 w-64 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {countries.map(c => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => { setSelectedCountry(c); setIsCountryOpen(false); }}
                                className="w-full flex items-center justify-between px-5 py-4 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                              >
                                <div className="flex items-center space-x-4">
                                  <span className="text-2xl">{c.flag}</span>
                                  <span className="font-bold text-gray-700 dark:text-gray-200">{c.name}</span>
                                </div>
                                <span className="text-indigo-600 dark:text-indigo-400 font-black">{c.dialCode}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative flex-grow">
                    <input 
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="00 000 00 00"
                      className="w-full h-16 px-6 bg-transparent outline-none text-lg font-bold dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button type="button" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input 
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-16 pl-14 pr-6 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-lg font-bold dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center px-2">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" defaultChecked className="peer sr-only" />
                    <div className="w-6 h-6 border-2 border-gray-200 dark:border-gray-800 rounded-lg peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all" />
                    <CheckCircle2 className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Keep me signed in for 30 days
                  </span>
                </label>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-16 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-500/40 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center space-x-3 group"
            >
              {isLoading ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <span>Sign In to CareerFlow</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Don't have an account? {' '}
                <button type="button" className="text-indigo-600 dark:text-indigo-400 font-black hover:underline">
                  Create Account
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">Secure AES-256</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">GDPR Compliant</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
