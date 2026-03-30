import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, DollarSign, Briefcase, Filter, X, ChevronRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Job } from '../types';
import { useLanguage } from '../LanguageContext';

export default function Jobs() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [locationFilter, setLocationFilter] = useState(searchParams.get('l') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [isBeginner, setIsBeginner] = useState(searchParams.get('beginner') === 'true');
  const [isMilitary, setIsMilitary] = useState(searchParams.get('military') === 'true');

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          setJobs([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setJobs([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!Array.isArray(jobs)) return;
    let result = [...jobs];

    if (searchQuery) {
      result = result.filter(j => 
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        j.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (locationFilter) {
      result = result.filter(j => j.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }

    if (experienceFilter) {
      result = result.filter(j => j.experience === experienceFilter);
    }

    if (isBeginner) {
      result = result.filter(j => j.isBeginner);
    }

    if (isMilitary) {
      result = result.filter(j => j.isMilitary);
    }

    setFilteredJobs(result);
  }, [jobs, searchQuery, locationFilter, experienceFilter, isBeginner, isMilitary]);

  return (
    <div className="bg-blue-50/30 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{t.jobs.title}</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.jobs.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.jobs.locationPlaceholder}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center">
                <Filter className="w-4 h-4 mr-2" /> {t.common.filters}
              </h3>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setLocationFilter('');
                  setExperienceFilter('');
                  setIsBeginner(false);
                  setIsMilitary(false);
                }}
                className="text-xs text-blue-600 hover:underline"
              >
                {t.common.clearAll}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">{t.jobs.experience}</label>
                <select 
                  className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                >
                  <option value="">{t.common.all}</option>
                  <option value="Entry-level">Entry-level</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">{t.common.filters}</label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600 focus:ring-blue-500"
                    checked={isBeginner}
                    onChange={(e) => setIsBeginner(e.target.checked)}
                  />
                  <span className="text-sm text-gray-600">{t.home.beginnerJobs}</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded text-blue-600 focus:ring-blue-500"
                    checked={isMilitary}
                    onChange={(e) => setIsMilitary(e.target.checked)}
                  />
                  <span className="text-sm text-gray-600">{t.home.militaryJobs}</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Job List */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-500">{t.common.available}: <span className="font-bold text-gray-900">{filteredJobs.length}</span></p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={job.id}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {job.type}
                      </span>
                      {job.isBeginner && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-2 py-0.5 rounded">
                          {t.home.beginnerJobs}
                        </span>
                      )}
                      {job.isMilitary && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {t.home.militaryJobs}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {job.location}</span>
                      <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1" /> {job.salary}</span>
                    </div>
                  </div>
                  <Link 
                    to={`/jobs/${job.id}`}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors text-center"
                  >
                    {t.jobs.apply}
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{t.common.noResults}</h3>
              <p className="text-gray-500">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
