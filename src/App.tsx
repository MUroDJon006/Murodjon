import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Briefcase, GraduationCap, School, User, Menu, X, ChevronRight, MapPin, DollarSign, Clock, Award, Globe, LayoutDashboard, Sun, Moon, PhoneCall } from 'lucide-react';
import { cn } from './lib/utils';
import { Job, Course, University, Career } from './types';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { ThemeProvider, useTheme } from './ThemeContext';
import { Toaster, toast } from 'sonner';
import AIAssistant from './components/AIAssistant';

// Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Careers from './pages/Careers';
import Courses from './pages/Courses';
import Universities from './pages/Universities';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();
  const { t, setLanguage, language } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: t.nav.jobs, path: '/jobs', icon: Briefcase, color: 'text-blue-600 dark:text-blue-400' },
    { name: t.nav.courses, path: '/courses', icon: GraduationCap, color: 'text-orange-600 dark:text-orange-400' },
    { name: t.nav.universities, path: '/universities', icon: School, color: 'text-teal-600 dark:text-teal-400' },
    { name: t.nav.careers, path: '/careers', icon: Award, color: 'text-purple-600 dark:text-purple-400' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' },
    { code: 'uz', name: 'O\'zbek' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">CF</div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">CareerFlow</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center space-x-1 text-sm font-medium transition-colors hover:opacity-80",
                  location.pathname.startsWith(link.path) ? link.color : "text-gray-600 dark:text-gray-400"
                )}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            ))}
            
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              <Link to="/dashboard" className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <LayoutDashboard className="w-5 h-5" />
              </Link>

              {/* Language Switcher */}
              <div className="relative">
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center space-x-1 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase">{language}</span>
                </button>
                
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code as any);
                            setIsLangOpen(false);
                            toast.success(`Language changed to ${lang.name}`);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-3 text-sm transition-colors",
                            language === lang.code ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                          )}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <Globe className="w-5 h-5" />
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 dark:text-gray-400">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg text-base font-medium",
                    location.pathname.startsWith(link.path) ? "bg-gray-50 dark:bg-gray-800 " + link.color : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              ))}
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>{t.nav.dashboard}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Language Menu */}
      <AnimatePresence>
        {isLangOpen && (
          <div className="fixed inset-0 z-[60] md:hidden">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsLangOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-xl p-6"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-gray-900 dark:text-white">{t.common.selectLanguage || 'Select Language'}</h3>
                <button onClick={() => setIsLangOpen(false)} className="dark:text-gray-400"><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as any);
                      setIsLangOpen(false);
                      toast.success(`Language changed to ${lang.name}`);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-4 rounded-xl text-base transition-colors",
                      language === lang.code ? "bg-indigo-600 text-white font-bold" : "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800"
                    )}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const { t, language } = useLanguage();
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">CF</div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">CareerFlow</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs">
              {language === 'en' ? 'Connecting education, careers, and employment in one seamless platform for the next generation of talent.' : language === 'ru' ? 'Объединение образования, карьеры и трудоустройства на одной платформе для нового поколения талантов.' : 'Keyingi avlod iste’dodlari uchun ta’lim, karyera va bandlikni bir platformada birlashtirish.'}
            </p>
            <div className="mt-6">
              <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                This platform is created by Murodjon Nasimjonov.
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{language === 'en' ? 'Platform' : language === 'ru' ? 'Платформа' : 'Platforma'}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t.nav.jobs}</Link></li>
              <li><Link to="/courses" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t.nav.courses}</Link></li>
              <li><Link to="/universities" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t.nav.universities}</Link></li>
              <li><Link to="/careers" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t.nav.careers}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{language === 'en' ? 'Support' : language === 'ru' ? 'Поддержка' : 'Yordam'}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <button 
                  onClick={() => toast.info("Support chat coming soon!")}
                  className="flex items-center space-x-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{language === 'en' ? 'Call Center' : language === 'ru' ? 'Колл-центр' : 'Call-markaz'}</span>
                </button>
              </li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{language === 'en' ? 'Help Center' : language === 'ru' ? 'Справочный центр' : 'Yordam markazi'}</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{language === 'en' ? 'Privacy Policy' : language === 'ru' ? 'Политика конфиденциальности' : 'Maxfiylik siyosati'}</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{language === 'en' ? 'Terms of Service' : language === 'ru' ? 'Условия использования' : 'Foydalanish shartlari'}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} CareerFlow. {language === 'en' ? 'All rights reserved.' : language === 'ru' ? 'Все права защищены.' : 'Barcha huquqlar himoyalangan.'}
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors">
            <Toaster position="top-right" richColors />
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/universities" element={<Universities />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </main>
            <AIAssistant />
            <Footer />
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}
