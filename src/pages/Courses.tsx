import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GraduationCap, Clock, DollarSign, Briefcase, Star, PlayCircle, Search, Filter, X } from 'lucide-react';
import { Course } from '../types';
import { useLanguage } from '../LanguageContext';
import { cn } from '../lib/utils';

export default function Courses() {
  const { t, language } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          setCourses([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setCourses([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!Array.isArray(courses)) return;
    let result = [...courses];

    if (searchQuery) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.outcome.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter) {
      result = result.filter(c => c.outcome.toLowerCase().includes(categoryFilter.toLowerCase()));
    }

    if (priceFilter === 'free') {
      result = result.filter(c => c.price.toLowerCase().includes('free') || c.price === '$0');
    } else if (priceFilter === 'paid') {
      result = result.filter(c => !c.price.toLowerCase().includes('free') && c.price !== '$0');
    }

    setFilteredCourses(result);
  }, [courses, searchQuery, categoryFilter, priceFilter]);

  return (
    <div className="bg-purple-50/30 dark:bg-gray-950 min-h-screen pb-20 transition-colors">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 pt-16 pb-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-6">{t.courses.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            {t.courses.subtitle}
          </p>
          
          <div className="max-w-3xl mx-auto mt-10 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search courses...' : language === 'ru' ? 'Поиск курсов...' : 'Kurslarni qidirish...'}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none text-lg transition-all dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                <Filter className="w-4 h-4 mr-2" /> {t.jobs.filters}
              </h3>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('');
                  setPriceFilter('');
                }}
                className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline"
              >
                {t.jobs.reset}
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 block">Price</label>
                <div className="space-y-2">
                  {['all', 'free', 'paid'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriceFilter(p === 'all' ? '' : p)}
                      className={cn(
                        "w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all",
                        (priceFilter === p || (p === 'all' && !priceFilter))
                          ? "bg-purple-600 text-white"
                          : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                      )}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Course List */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-3xl" />)
            ) : filteredCourses.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white dark:bg-gray-800 rounded-[2rem] border border-purple-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-2xl transition-all group flex flex-col"
                  >
                    <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center relative overflow-hidden">
                      <GraduationCap className="w-24 h-24 text-white opacity-20 absolute -bottom-4 -right-4 rotate-12" />
                      <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
                        <PlayCircle className="w-16 h-16 text-white opacity-90" />
                      </motion.div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{course.name}</h3>
                        <span className="text-purple-600 dark:text-purple-400 font-black text-xl">{course.price}</span>
                      </div>
                      
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-5 h-5 mr-3 text-purple-500" />
                          <span>{t.courses.duration}: <span className="font-bold text-gray-900 dark:text-white">{course.duration}</span></span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Briefcase className="w-5 h-5 mr-3 text-purple-500" />
                          <span>{t.courses.outcome}: <span className="font-bold text-gray-900 dark:text-white">{course.outcome}</span></span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Star className="w-5 h-5 mr-3 text-yellow-500 fill-yellow-500" />
                          <span>4.8/5 Rating (200+ reviews)</span>
                        </div>
                      </div>

                      <button className="mt-auto w-full py-4 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 dark:shadow-none active:scale-95">
                        {t.courses.enroll}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="col-span-full bg-white dark:bg-gray-800 p-16 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-gray-700 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.common.noResults}</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
