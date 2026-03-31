import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, GraduationCap, Bell, Settings, 
  User, Star, Clock, Heart, BookOpen, FileText, ChevronRight,
  Search, Filter, MapPin, DollarSign, Calendar, CheckCircle2,
  AlertCircle, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

type Role = 'seeker' | 'student' | 'recruiter';
type TabType = 'overview' | 'jobs' | 'courses' | 'applications' | 'notifications' | 'saved';

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('seeker');
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/saved-jobs') setActiveTab('saved');
    else if (path === '/my-courses') setActiveTab('courses');
    else if (path === '/applications') setActiveTab('applications');
    else setActiveTab('overview');
  }, [location]);

  const [notifications] = useState([
    { id: 1, text: 'New job match: Frontend Developer at TechCorp', textRu: 'Новое совпадение вакансии: Frontend разработчик в TechCorp', textUz: 'Yangi ish mosligi: TechCorp-da Frontend dasturchi', time: '2h ago', timeRu: '2ч назад', timeUz: '2s oldin' },
    { id: 2, text: 'Course update: React Masterclass lesson 5 added', textRu: 'Обновление курса: добавлен 5-й урок React Masterclass', textUz: 'Kurs yangilanishi: React Masterclass 5-dars qo\'shildi', time: '5h ago', timeRu: '5ч назад', timeUz: '5s oldin' },
  ]);

  const getNotificationText = (n: any) => {
    if (language === 'ru') return n.textRu;
    if (language === 'uz') return n.textUz;
    return n.text;
  };

  const getNotificationTime = (n: any) => {
    if (language === 'ru') return n.timeRu;
    if (language === 'uz') return n.timeUz;
    return n.time;
  };

  const sidebarLinks = [
    { id: 'overview', name: t.dashboard.overview, icon: LayoutDashboard, path: '/dashboard' },
    { id: 'jobs', name: t.nav.jobs, icon: Briefcase, path: '/jobs' },
    { id: 'saved', name: 'Saved Jobs', icon: Heart, path: '/saved-jobs' },
    { id: 'courses', name: 'My Courses', icon: BookOpen, path: '/my-courses' },
    { id: 'applications', name: 'Applications', icon: FileText, path: '/applications' },
    { id: 'notifications', name: t.dashboard.notifications, icon: Bell, path: '/dashboard' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden lg:flex flex-col transition-colors sticky top-16 h-[calc(100vh-64px)]">
        <div className="p-6 flex-grow">
          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id as TabType);
                  if (link.path !== '/dashboard' || link.id !== 'overview') {
                    navigate(link.path);
                  }
                }}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all group",
                  activeTab === link.id 
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                <link.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", activeTab === link.id && "scale-110")} />
                <span>{link.name}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-3 p-2 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm">
              <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-tighter font-bold">{user?.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
              {activeTab === 'overview' ? t.dashboard.title : activeTab.replace('-', ' ')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {activeTab === 'overview' ? `${t.dashboard.welcome} ${user?.name || 'User'}` : `Manage your ${activeTab} here`}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {activeTab === 'overview' && (
              <div className="bg-white dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-800 flex transition-colors shadow-sm">
                {(['seeker', 'student', 'recruiter'] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                      role === r ? "bg-indigo-600 text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    )}
                  >
                    {t.dashboard[r]}
                  </button>
                ))}
              </div>
            )}
            <button className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 relative transition-colors shadow-sm">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stats */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors group hover:border-indigo-500/50">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">{t.dashboard.applications}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
                      <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-bold flex items-center">
                        <ArrowRight className="w-3 h-3 mr-1" /> +2 this week
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors group hover:border-blue-500/50">
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">{t.dashboard.interviews}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
                      <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-bold">Next: Tomorrow</div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors group hover:border-orange-500/50">
                      <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">{t.dashboard.courseProgress}</p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">65%</p>
                      <div className="mt-4 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 w-[65%]" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
                    <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                      <h3 className="font-bold text-gray-900 dark:text-white">{t.dashboard.recentActivity}</h3>
                      <button className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">{t.dashboard.viewAll}</button>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 transition-colors">
                              <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">Applied to Senior Designer</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Creative Agency • 2 days ago</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full text-[10px] font-bold uppercase">Pending</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-8">
                  {/* Notifications */}
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <Bell className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" /> {t.dashboard.notifications}
                    </h3>
                    <div className="space-y-6">
                      {notifications.map((n) => (
                        <div key={n.id} className="flex space-x-3">
                          <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-800 dark:text-gray-200 leading-tight">{getNotificationText(n)}</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{getNotificationTime(n)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended for you */}
                  <div className="bg-indigo-900 dark:bg-indigo-950 p-6 rounded-3xl text-white transition-colors relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <h3 className="font-bold mb-4 flex items-center relative z-10">
                      <Star className="w-4 h-4 mr-2 text-yellow-400" /> {t.dashboard.recommended}
                    </h3>
                    <p className="text-sm opacity-80 mb-6 relative z-10">
                      {language === 'en' ? 'Based on your profile, we found 3 new courses you might like.' : language === 'ru' ? 'На основе вашего профиля мы нашли 3 новых курса, которые могут вам понравиться.' : 'Profilingizga asoslanib, biz sizga yoqishi mumkin bo\'lgan 3 ta yangi kursni topdik.'}
                    </p>
                    <button className="w-full py-2.5 bg-white text-indigo-900 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all relative z-10">
                      {t.common.learnMore}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-12 text-center">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-6">
                  <Heart className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Saved Jobs Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Start exploring job opportunities and save the ones that catch your eye.
                </p>
                <button 
                  onClick={() => navigate('/jobs')}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                >
                  Browse Jobs
                </button>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden group hover:shadow-xl transition-all">
                    <div className="h-40 bg-gray-200 dark:bg-gray-800 relative">
                      <img src={`https://picsum.photos/seed/course${i}/800/600`} alt="Course" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-indigo-600 uppercase">In Progress</div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">React Masterclass: From Zero to Hero</h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <Clock className="w-3 h-3" />
                        <span>12h 30m left</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-gray-500">Progress</span>
                          <span className="text-indigo-600">65%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 w-[65%]" />
                        </div>
                      </div>
                      <button className="w-full mt-6 py-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all">
                        Continue Learning
                      </button>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => navigate('/courses')}
                  className="bg-gray-50 dark:bg-gray-900/50 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center p-8 hover:border-indigo-500 transition-all group"
                >
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors mb-4 shadow-sm">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-gray-600 dark:text-gray-400">Explore More Courses</p>
                </button>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Position</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {[
                        { company: 'TechCorp', pos: 'Frontend Developer', date: 'Mar 28, 2026', status: 'In Review', color: 'text-blue-600 bg-blue-50' },
                        { company: 'Global Solutions', pos: 'UI Designer', date: 'Mar 25, 2026', status: 'Interview', color: 'text-purple-600 bg-purple-50' },
                        { company: 'Creative Agency', pos: 'Senior Designer', date: 'Mar 20, 2026', status: 'Pending', color: 'text-yellow-600 bg-yellow-50' },
                      ].map((app, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center font-bold text-xs">{app.company[0]}</div>
                              <span className="font-bold text-gray-900 dark:text-white">{app.company}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{app.pos}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{app.date}</td>
                          <td className="px-6 py-4">
                            <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase", app.color.replace('bg-', 'dark:bg-opacity-20 bg-'))}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
