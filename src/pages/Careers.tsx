import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, BookOpen, School, DollarSign, Briefcase, ChevronRight, ArrowRight } from 'lucide-react';
import { Career, Course, University, Job } from '../types';
import { useLanguage } from '../LanguageContext';

export default function Careers() {
  const { t, language, formatCurrency } = useLanguage();
  const [careers, setCareers] = useState<Career[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/careers').then(res => res.json()),
      fetch('/api/courses').then(res => res.json()),
      fetch('/api/universities').then(res => res.json()),
      fetch('/api/jobs').then(res => res.json()),
    ])
      .then(([careersData, coursesData, unisData, jobsData]) => {
        setCareers(Array.isArray(careersData) ? careersData : []);
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setUniversities(Array.isArray(unisData) ? unisData : []);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
        setLoading(false);
      })
      .catch(() => {
        setCareers([]);
        setCourses([]);
        setUniversities([]);
        setJobs([]);
        setLoading(false);
      });
  }, []);

  // Helper to parse salary range string
  const parseAndFormatSalaryRange = (salaryRange: string) => {
    if (!salaryRange) return salaryRange;
    if (salaryRange.includes('UZS')) {
      const parts = salaryRange.split('-').map(p => parseInt(p.replace(/[^0-9]/g, '')));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return `${formatCurrency(parts[0])} - ${formatCurrency(parts[1])}`;
      }
    }
    if (salaryRange.includes('$')) {
      const parts = salaryRange.split('-').map(p => parseInt(p.replace(/[^0-9]/g, '')));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return `${formatCurrency(parts[0])} - ${formatCurrency(parts[1])}`;
      }
    }
    return salaryRange;
  };

  // Helper to parse price string
  const parseAndFormatPrice = (price: string) => {
    if (!price) return price;
    if (price.toLowerCase().includes('free')) return language === 'en' ? 'Free' : language === 'ru' ? 'Бесплатно' : 'Bepul';
    if (price.includes('UZS')) {
      const num = parseInt(price.replace(/[^0-9]/g, ''));
      return isNaN(num) ? price : formatCurrency(num);
    }
    if (price.includes('$')) {
      const num = parseInt(price.replace(/[^0-9]/g, ''));
      return isNaN(num) ? price : formatCurrency(num);
    }
    return price;
  };

  if (loading) return <div className="p-8 dark:text-white">{t.common.loading}</div>;

  return (
    <div className="bg-purple-50/30 dark:bg-gray-950 min-h-screen pb-20 transition-colors">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 pt-16 pb-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t.careers.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.careers.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {Array.isArray(careers) && careers.map((career) => (
          <motion.div 
            key={career.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900 rounded-3xl border border-purple-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors"
          >
            <div className="p-8 md:p-12">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Left Side: Info */}
                <div className="lg:w-1/2 space-y-8">
                  <div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 transition-colors">
                      <Award className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{career.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{career.description}</p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-6 transition-colors">
                    <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-4 flex items-center">
                      <ArrowRight className="w-4 h-4 mr-2" /> {t.careers.learningPath}
                    </h3>
                    <p className="text-purple-800 dark:text-purple-400 text-sm">{career.learningPath}</p>
                  </div>

                  <div className="flex items-center space-x-8">
                    <div>
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{t.jobDetail.salary}</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{parseAndFormatSalaryRange(career.salaryRange)}</p>
                    </div>
                    <div className="h-10 w-px bg-gray-100 dark:bg-gray-800 transition-colors" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                        {language === 'en' ? 'Job Demand' : language === 'ru' ? 'Спрос на работу' : 'Ishga bo\'lgan talab'}
                      </p>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        {language === 'en' ? 'High' : language === 'ru' ? 'Высокий' : 'Yuqori'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Connections */}
                <div className="lg:w-1/2 space-y-8">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">{t.careers.topCourses}</h3>
                    <div className="space-y-3">
                      {Array.isArray(courses) && Array.isArray(career.relatedCourses) && courses.filter(c => career.relatedCourses.includes(c.id)).map(course => (
                        <div key={course.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
                          <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-3 text-orange-500 dark:text-orange-400" />
                            <span className="font-medium text-gray-900 dark:text-white">{course.name}</span>
                          </div>
                          <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{parseAndFormatPrice(course.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">{t.careers.recommendedUnis}</h3>
                    <div className="space-y-3">
                      {Array.isArray(universities) && Array.isArray(career.universities) && universities.filter(u => career.universities.includes(u.id)).map(uni => (
                        <div key={uni.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-teal-200 dark:hover:border-teal-800 transition-colors">
                          <div className="flex items-center">
                            <School className="w-4 h-4 mr-3 text-teal-500 dark:text-teal-400" />
                            <span className="font-medium text-gray-900 dark:text-white">{uni.name}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">{t.careers.activeJobs}</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(jobs) && Array.isArray(career.relatedJobs) && jobs.filter(j => career.relatedJobs.includes(j.id)).map(job => (
                        <span key={job.id} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium border border-blue-100 dark:border-blue-900 transition-colors">
                          {job.title}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
