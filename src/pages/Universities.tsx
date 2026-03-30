import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { School, GraduationCap, DollarSign, Briefcase, MapPin, Search, Filter, Sparkles } from 'lucide-react';
import { University } from '../types';
import { useLanguage } from '../LanguageContext';
import { cn } from '../lib/utils';

export default function Universities() {
  const { t, language } = useLanguage();
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetch('/api/universities')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUniversities(data);
        } else {
          setUniversities([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setUniversities([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!Array.isArray(universities)) return;
    let result = [...universities];

    if (searchQuery) {
      result = result.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (u.faculties && u.faculties.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (u.majors && u.majors.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    if (locationFilter) {
      result = result.filter(u => u.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }

    setFilteredUniversities(result);
  }, [universities, searchQuery, locationFilter]);

  return (
    <div className="bg-teal-50/30 dark:bg-gray-950 min-h-screen pb-20 transition-colors">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 pt-16 pb-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-6">{t.universities.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            {t.universities.subtitle}
          </p>

          <div className="max-w-4xl mx-auto mt-12 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'en' ? 'Search by name or faculty...' : language === 'ru' ? 'Поиск по названию или факультету...' : 'Nomi yoki fakultet bo‘yicha qidirish...'}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.jobs.locationPlaceholder}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {loading ? (
            [1, 2].map(i => <div key={i} className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-[2.5rem]" />)
          ) : filteredUniversities.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredUniversities.map((uni) => (
                <motion.div
                  key={uni.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-teal-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col hover:shadow-2xl transition-all group"
                >
                  <div className="p-10 border-b border-gray-50 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-teal-50 dark:bg-teal-900/30 rounded-3xl flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                        <School className="w-10 h-10" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{uni.name}</h3>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 mt-1">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">{uni.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-2xl text-center md:text-right">
                      <p className="text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-[0.2em] mb-1">{t.universities.salaryExpectations}</p>
                      <p className="text-2xl font-black text-teal-700 dark:text-teal-300">{uni.salaryExpectations}</p>
                    </div>
                  </div>

                  <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 flex items-center">
                        <GraduationCap className="w-4 h-4 mr-2 text-teal-500" /> {t.universities.majors}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {uni.majors.map((major, i) => (
                          <span key={i} className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-xl">
                            {major}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-teal-500" /> {t.universities.outcomes}
                      </h4>
                      <div className="space-y-3">
                        {uni.careerOutcomes.map((outcome, i) => (
                          <div key={i} className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                            <div className="w-2 h-2 bg-teal-400 rounded-full mr-3 flex-shrink-0" />
                            {outcome}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-10 pt-0 mt-auto flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-black hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 dark:shadow-none active:scale-95">
                      {t.common.learnMore}
                    </button>
                    <button className="px-8 py-4 border-2 border-teal-100 dark:border-gray-700 text-teal-600 dark:text-teal-400 rounded-2xl font-bold hover:bg-teal-50 dark:hover:bg-gray-700 transition-all">
                      <Sparkles className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="col-span-full bg-white dark:bg-gray-800 p-20 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-700 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t.common.noResults}</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Try searching for a different name or faculty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
