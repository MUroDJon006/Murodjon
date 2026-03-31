import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Briefcase, GraduationCap, School, ChevronRight, ArrowRight, Star, Users, MapPin, DollarSign, Clock, Award, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Job, Course, Career, University } from '../types';
import { useLanguage } from '../LanguageContext';
import { cn } from '../lib/utils';

type SectionType = 'jobs' | 'courses' | 'universities';

export default function Home() {
  const { t, language, formatCurrency, formatNumber } = useLanguage();
  const [activeSection, setActiveSection] = useState<SectionType>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  useEffect(() => {
    fetch('/api/jobs').then(res => res.json()).then(data => Array.isArray(data) && setJobs(data)).catch(() => setJobs([]));
    fetch('/api/courses').then(res => res.json()).then(data => Array.isArray(data) && setCourses(data)).catch(() => setCourses([]));
    fetch('/api/careers').then(res => res.json()).then(data => Array.isArray(data) && setCareers(data)).catch(() => setCareers([]));
    fetch('/api/universities').then(res => res.json()).then(data => Array.isArray(data) && setUniversities(data)).catch(() => setUniversities([]));
  }, []);

  const sections = [
    { id: 'jobs' as SectionType, label: t.nav.jobs, icon: Briefcase, color: 'from-blue-600 to-indigo-600', lightColor: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-600 dark:text-blue-400' },
    { id: 'courses' as SectionType, label: t.nav.courses, icon: GraduationCap, color: 'from-purple-600 to-pink-600', lightColor: 'bg-purple-50 dark:bg-purple-900/20', textColor: 'text-purple-600 dark:text-purple-400' },
    { id: 'universities' as SectionType, label: t.nav.universities, icon: School, color: 'from-teal-600 to-emerald-600', lightColor: 'bg-teal-50 dark:bg-teal-900/20', textColor: 'text-teal-600 dark:text-teal-400' },
  ];

  // Helper to parse salary string like "$50k - $80k" or "5,000,000 UZS"
  const parseAndFormatSalary = (salary: string) => {
    if (!salary) return salary;
    // Simple heuristic for demo: if it contains UZS, it's Uzbek currency
    if (salary.includes('UZS')) {
      const num = parseInt(salary.replace(/[^0-9]/g, ''));
      return isNaN(num) ? salary : formatCurrency(num);
    }
    if (salary.includes('$')) {
      const num = parseInt(salary.replace(/[^0-9]/g, '')) * 1000; // Assuming 'k'
      return isNaN(num) ? salary : formatCurrency(num);
    }
    return salary;
  };

  return (
    <div className="space-y-20 pb-20 transition-colors">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(99,102,241,0.1)_0%,transparent_100%)] dark:bg-[radial-gradient(45%_45%_at_50%_50%,rgba(99,102,241,0.05)_0%,transparent_100%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-bold mb-8"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'en' ? 'The Future of Career Planning' : language === 'ru' ? 'Будущее планирования карьеры' : 'Karyera rejalashtirish kelajagi'}</span>
            </motion.div>

            <h1 className="text-5xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tight mb-8 leading-[1.1]">
              {t.home.heroTitle.split(',').map((part: string, i: number) => (
                <span key={i} className="block">
                  {i === 1 ? (
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                      {part}
                    </span>
                  ) : part}
                </span>
              ))}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              {t.home.heroSubtitle}
            </p>

            {/* Interactive Section Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "relative flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-sm",
                    activeSection === section.id 
                      ? `bg-gradient-to-r ${section.color} text-white shadow-lg shadow-indigo-200 dark:shadow-none scale-105`
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700"
                  )}
                >
                  <section.icon className="w-5 h-5" />
                  <span>{section.label}</span>
                  {activeSection === section.id && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-2xl border-2 border-white/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Search Bar */}
            <motion.div 
              layout
              className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-2 rounded-3xl shadow-2xl shadow-indigo-100 dark:shadow-none border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-2"
            >
              <div className="flex-1 flex items-center px-6 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 py-3">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder={t.home.searchPlaceholder}
                  className="w-full focus:outline-none text-gray-900 dark:text-white bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex-1 flex items-center px-6 py-3">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder={t.home.locationPlaceholder}
                  className="w-full focus:outline-none text-gray-900 dark:text-white bg-transparent"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
              </div>
              <Link 
                to={`/${activeSection}?q=${searchQuery}&l=${locationQuery}`}
                className={cn(
                  "px-10 py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center whitespace-nowrap bg-gradient-to-r",
                  sections.find(s => s.id === activeSection)?.color
                )}
              >
                {t.home.searchButton}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                  {activeSection === 'jobs' ? t.home.latestJobs : activeSection === 'courses' ? t.home.recommendedCourses : t.nav.universities}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {activeSection === 'jobs' ? 'Fresh opportunities updated daily' : activeSection === 'courses' ? 'Upskill and land your dream job' : 'Top academic institutions for your future'}
                </p>
              </div>
              <Link 
                to={`/${activeSection}`} 
                className={cn(
                  "font-bold flex items-center hover:underline transition-colors",
                  sections.find(s => s.id === activeSection)?.textColor
                )}
              >
                {t.home.viewAll} <ChevronRight className="w-5 h-5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {activeSection === 'jobs' && Array.isArray(jobs) && jobs.slice(0, 3).map((job) => (
                <Link 
                  key={job.id} 
                  to={`/jobs/${job.id}`}
                  className="group bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Briefcase className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
                      {job.type}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                    <MapPin className="w-4 h-4 mr-2" /> {job.location}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-700">
                    <span className="font-black text-gray-900 dark:text-white text-lg">{parseAndFormatSalary(job.salary)}</span>
                    <span className="text-sm font-medium text-gray-400 dark:text-gray-500">{job.experience}</span>
                  </div>
                </Link>
              ))}

              {activeSection === 'courses' && Array.isArray(courses) && courses.slice(0, 3).map((course) => (
                <div key={course.id} className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 overflow-hidden flex flex-col">
                  <div className="h-48 bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center relative">
                    <GraduationCap className="w-20 h-20 text-purple-600 dark:text-purple-400" />
                    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-bold text-purple-600 dark:text-purple-400 shadow-sm">
                      {course.price === 'Free' ? (language === 'en' ? 'Free' : language === 'ru' ? 'Бесплатно' : 'Bepul') : parseAndFormatSalary(course.price)}
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{course.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">{course.outcome}</p>
                    <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 space-x-4">
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {course.duration}</span>
                        <span className="flex items-center"><Users className="w-4 h-4 mr-1.5" /> {formatNumber(1200)}</span>
                      </div>
                      <button className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {activeSection === 'universities' && Array.isArray(universities) && universities.slice(0, 3).map((uni) => (
                <div key={uni.id} className="group bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
                  <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6">
                    <School className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{uni.name}</h3>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                    <MapPin className="w-4 h-4 mr-2" /> {uni.location}
                  </div>
                  <div className="space-y-3">
                    {uni.faculties?.slice(0, 2).map((fac, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mr-3" />
                        {fac}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">{uni.exams}</span>
                    <Link to="/universities" className="text-teal-600 dark:text-teal-400 font-bold text-sm hover:underline">Details</Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Popular Careers */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-24 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">{t.home.popularCareers}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Discover where your interests can take you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.isArray(careers) && careers.slice(0, 4).map((career) => (
              <Link 
                key={career.id} 
                to="/careers"
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{career.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 leading-relaxed">{career.description}</p>
                <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center group">
                  Explore Path <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Special Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden group"
          >
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-4">{t.home.beginnerJobs}</h3>
              <p className="text-lg opacity-90 mb-8 max-w-sm leading-relaxed">{t.home.beginnerDesc}</p>
              <Link to="/jobs?beginner=true" className="inline-flex items-center bg-white text-green-600 px-8 py-4 rounded-2xl font-black hover:bg-opacity-90 transition-all shadow-lg">
                {t.home.viewAll} <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            <Briefcase className="absolute -bottom-8 -right-8 w-48 h-48 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group"
          >
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-4">{t.home.militaryJobs}</h3>
              <p className="text-lg opacity-90 mb-8 max-w-sm leading-relaxed">{t.home.militaryDesc}</p>
              <Link to="/jobs?military=true" className="inline-flex items-center bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black hover:bg-opacity-90 transition-all shadow-lg">
                {t.home.viewAll} <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            <Award className="absolute -bottom-8 -right-8 w-48 h-48 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
