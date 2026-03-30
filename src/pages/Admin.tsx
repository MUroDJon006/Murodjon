import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Briefcase, GraduationCap, School, Save, X } from 'lucide-react';
import { Job, Course, University } from '../types';
import { useLanguage } from '../LanguageContext';

export default function Admin() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'jobs' | 'courses' | 'universities'>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);

  // Form states
  const [newJob, setNewJob] = useState<Partial<Job>>({ title: '', salary: '', location: '', type: 'Full-time', experience: 'Entry-level', description: '', requirements: [], isBeginner: false, isMilitary: false });

  useEffect(() => {
    fetch('/api/jobs').then(res => res.json()).then(data => Array.isArray(data) && setJobs(data)).catch(() => setJobs([]));
    fetch('/api/courses').then(res => res.json()).then(data => Array.isArray(data) && setCourses(data)).catch(() => setCourses([]));
    fetch('/api/universities').then(res => res.json()).then(data => Array.isArray(data) && setUniversities(data)).catch(() => setUniversities([]));
  }, []);

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      });
      if (res.ok) {
        const data = await res.json();
        setJobs([...jobs, data]);
        setNewJob({ title: '', salary: '', location: '', type: 'Full-time', experience: 'Entry-level', description: '', requirements: [], isBeginner: false, isMilitary: false });
      }
    } catch (error) {
      console.error("Failed to add job:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-3xl font-bold text-gray-900">{t.nav.admin}</h1>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'jobs' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            {t.nav.jobs}
          </button>
          <button 
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}
          >
            {t.nav.courses}
          </button>
          <button 
            onClick={() => setActiveTab('universities')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'universities' ? 'bg-white shadow-sm text-teal-600' : 'text-gray-500'}`}
          >
            {t.nav.universities}
          </button>
        </div>
      </div>

      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-blue-600" /> {language === 'en' ? 'Add New Job' : language === 'ru' ? 'Добавить вакансию' : 'Yangi ish qo‘shish'}
              </h2>
              <form onSubmit={handleAddJob} className="space-y-4">
                <input 
                  type="text" placeholder={t.jobDetail.fullName} required
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                  value={newJob.title || ''} onChange={e => setNewJob({...newJob, title: e.target.value})}
                />
                <input 
                  type="text" placeholder={t.jobDetail.salary} required
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                  value={newJob.salary || ''} onChange={e => setNewJob({...newJob, salary: e.target.value})}
                />
                <input 
                  type="text" placeholder={t.jobDetail.location} required
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                  value={newJob.location || ''} onChange={e => setNewJob({...newJob, location: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none"
                    value={newJob.type || 'Full-time'} onChange={e => setNewJob({...newJob, type: e.target.value})}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                  <select 
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none"
                    value={newJob.experience || 'Entry-level'} onChange={e => setNewJob({...newJob, experience: e.target.value})}
                  >
                    <option value="Entry-level">{t.jobs.entry}</option>
                    <option value="Mid-level">{t.jobs.mid}</option>
                    <option value="Senior">{t.jobs.senior}</option>
                  </select>
                </div>
                <textarea 
                  placeholder={t.jobDetail.description} rows={3} required
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                  value={newJob.description || ''} onChange={e => setNewJob({...newJob, description: e.target.value})}
                />
                <div className="flex flex-col gap-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={newJob.isBeginner || false} onChange={e => setNewJob({...newJob, isBeginner: e.target.checked})} />
                    <span className="text-sm">{t.jobs.beginnerFriendly}</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={newJob.isMilitary || false} onChange={e => setNewJob({...newJob, isMilitary: e.target.checked})} />
                    <span className="text-sm">{t.jobs.militaryReturnees}</span>
                  </label>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                  {t.jobDetail.save}
                </button>
              </form>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2 space-y-4">
            {Array.isArray(jobs) && jobs.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.location} • {job.salary}</p>
                </div>
                <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab !== 'jobs' && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">{language === 'en' ? `Management for ${activeTab} coming soon...` : language === 'ru' ? `Управление для ${activeTab} скоро будет доступно...` : `${activeTab} boshqaruvi tez orada qo‘shiladi...`}</p>
        </div>
      )}
    </div>
  );
}
