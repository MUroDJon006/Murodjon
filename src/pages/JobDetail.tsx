import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, DollarSign, Briefcase, Clock, ChevronLeft, Send, CheckCircle, Upload, X } from 'lucide-react';
import { Job } from '../types';
import { useLanguage } from '../LanguageContext';

export default function JobDetail() {
  const { t, language, formatCurrency } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        const found = data.find((j: Job) => String(j.id) === id);
        setJob(found || null);
        setLoading(false);
      });
  }, [id]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setTimeout(() => {
        setShowApplyForm(false);
        setIsSubmitted(false);
      }, 3000);
    }, 1000);
  };

  // Helper to parse salary string
  const parseAndFormatSalary = (salary: string) => {
    if (!salary) return salary;
    if (salary.includes('UZS')) {
      const num = parseInt(salary.replace(/[^0-9]/g, ''));
      return isNaN(num) ? salary : formatCurrency(num);
    }
    if (salary.includes('$')) {
      const num = parseInt(salary.replace(/[^0-9]/g, ''));
      return isNaN(num) ? salary : formatCurrency(num);
    }
    return salary;
  };

  if (loading) return <div className="max-w-7xl mx-auto p-8 animate-pulse dark:text-white">{t.common.loading}</div>;
  if (!job) return <div className="max-w-7xl mx-auto p-8 dark:text-white">{t.common.noResults}</div>;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-20 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> {t.jobDetail.back}
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
          {/* Header */}
          <div className="p-8 md:p-12 border-b border-gray-50 dark:border-gray-800">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                {job.type}
              </span>
              {job.isBeginner && (
                <span className="text-xs font-bold uppercase tracking-widest text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                  {t.home.beginnerJobs}
                </span>
              )}
              {job.isMilitary && (
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full">
                  {t.home.militaryJobs}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">{job.title}</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">{t.jobDetail.location}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{job.location}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <DollarSign className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">{t.jobDetail.salary}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{parseAndFormatSalary(job.salary)}</p>
                </div>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">{t.jobDetail.experience}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{job.experience}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 space-y-10">
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.jobDetail.description}</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{job.description}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.jobDetail.requirements}</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-center text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl transition-colors">
                    <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                    {req}
                  </li>
                ))}
              </ul>
            </section>

            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setShowApplyForm(true)}
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
              >
                {t.jobDetail.apply}
              </button>
              <button className="px-8 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                {t.jobDetail.save}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyForm(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden transition-colors"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t.jobDetail.applyTitle}</h3>
                  <button onClick={() => setShowApplyForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                {isSubmitted ? (
                  <div className="py-12 text-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.jobDetail.success}</h4>
                    <p className="text-gray-500 dark:text-gray-400">{t.jobDetail.successDesc}</p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t.jobDetail.fullName}</label>
                      <input required type="text" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t.jobDetail.phone}</label>
                      <input required type="tel" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t.jobDetail.message}</label>
                      <textarea rows={3} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors" placeholder="Tell us why you're a good fit..."></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t.jobDetail.uploadCV}</label>
                      <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Click or drag to upload PDF</p>
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center">
                      <Send className="w-5 h-5 mr-2" /> {t.jobDetail.submit}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
