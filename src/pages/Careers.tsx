import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, BookOpen, School, DollarSign, Briefcase, ChevronRight, ArrowRight } from 'lucide-react';
import { Career, Course, University, Job } from '../types';
import { useLanguage } from '../LanguageContext';

export default function Careers() {
  const { t } = useLanguage();
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

  if (loading) return <div className="p-8">{t.common.loading}</div>;

  return (
    <div className="bg-purple-50/30 min-h-screen pb-20">
      <div className="bg-white border-b border-gray-100 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.careers.title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
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
            className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Left Side: Info */}
                <div className="lg:w-1/2 space-y-8">
                  <div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                      <Award className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{career.name}</h2>
                    <p className="text-gray-600 leading-relaxed">{career.description}</p>
                  </div>

                  <div className="bg-purple-50 rounded-2xl p-6">
                    <h3 className="font-bold text-purple-900 mb-4 flex items-center">
                      <ArrowRight className="w-4 h-4 mr-2" /> {t.careers.learningPath}
                    </h3>
                    <p className="text-purple-800 text-sm">{career.learningPath}</p>
                  </div>

                  <div className="flex items-center space-x-8">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{t.jobDetail.salary}</p>
                      <p className="text-xl font-bold text-gray-900">{career.salaryRange}</p>
                    </div>
                    <div className="h-10 w-px bg-gray-100" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Job Demand</p>
                      <p className="text-xl font-bold text-green-600">High</p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Connections */}
                <div className="lg:w-1/2 space-y-8">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t.careers.topCourses}</h3>
                    <div className="space-y-3">
                      {Array.isArray(courses) && Array.isArray(career.relatedCourses) && courses.filter(c => career.relatedCourses.includes(c.id)).map(course => (
                        <div key={course.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-200 transition-colors">
                          <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-3 text-orange-500" />
                            <span className="font-medium text-gray-900">{course.name}</span>
                          </div>
                          <span className="text-xs font-bold text-orange-600">{course.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t.careers.recommendedUnis}</h3>
                    <div className="space-y-3">
                      {Array.isArray(universities) && Array.isArray(career.universities) && universities.filter(u => career.universities.includes(u.id)).map(uni => (
                        <div key={uni.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-teal-200 transition-colors">
                          <div className="flex items-center">
                            <School className="w-4 h-4 mr-3 text-teal-500" />
                            <span className="font-medium text-gray-900">{uni.name}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t.careers.activeJobs}</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(jobs) && Array.isArray(career.relatedJobs) && jobs.filter(j => career.relatedJobs.includes(j.id)).map(job => (
                        <span key={job.id} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
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
