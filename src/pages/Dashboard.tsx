import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Briefcase, GraduationCap, Bell, Settings, User, Star, Clock } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { cn } from '../lib/utils';

type Role = 'seeker' | 'student' | 'recruiter';

export default function Dashboard() {
  const { t } = useLanguage();
  const [role, setRole] = useState<Role>('seeker');
  const [notifications] = useState([
    { id: 1, text: 'New job match: Frontend Developer at TechCorp', time: '2h ago' },
    { id: 2, text: 'Course update: React Masterclass lesson 5 added', time: '5h ago' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">CF</div>
            <span className="font-bold text-gray-900">{t.nav.dashboard}</span>
          </div>
          
          <nav className="space-y-1">
            <button className="w-full flex items-center space-x-3 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-medium">
              <LayoutDashboard className="w-5 h-5" />
              <span>{t.dashboard.overview}</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              <Briefcase className="w-5 h-5" />
              <span>{t.nav.jobs}</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              <GraduationCap className="w-5 h-5" />
              <span>{t.nav.courses}</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              <Bell className="w-5 h-5" />
              <span>{t.dashboard.notifications}</span>
            </button>
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500 capitalize">{t.dashboard[role]}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.dashboard.title}</h1>
            <p className="text-gray-500">{t.dashboard.welcome} John</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white p-1 rounded-xl border border-gray-200 flex">
              {(['seeker', 'student', 'recruiter'] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                    role === r ? "bg-indigo-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {t.dashboard[r]}
                </button>
              ))}
            </div>
            <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.dashboard.applications}</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
                <div className="mt-2 text-xs text-green-600 font-bold">+2 this week</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.dashboard.interviews}</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
                <div className="mt-2 text-xs text-blue-600 font-bold">Next: Tomorrow</div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.dashboard.courseProgress}</p>
                <p className="text-3xl font-bold text-gray-900">65%</p>
                <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[65%]" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">{t.dashboard.recentActivity}</h3>
                <button className="text-xs text-indigo-600 font-bold hover:underline">{t.dashboard.viewAll}</button>
              </div>
              <div className="divide-y divide-gray-50">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Applied to Senior Designer</p>
                        <p className="text-xs text-gray-500">Creative Agency • 2 days ago</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-[10px] font-bold uppercase">Pending</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-8">
            {/* Notifications */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center">
                <Bell className="w-4 h-4 mr-2 text-indigo-600" /> {t.dashboard.notifications}
              </h3>
              <div className="space-y-6">
                {notifications.map((n) => (
                  <div key={n.id} className="flex space-x-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-800 leading-tight">{n.text}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended for you */}
            <div className="bg-indigo-900 p-6 rounded-3xl text-white">
              <h3 className="font-bold mb-4 flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-400" /> {t.dashboard.recommended}
              </h3>
              <p className="text-sm opacity-80 mb-6">Based on your profile, we found 3 new courses you might like.</p>
              <button className="w-full py-2.5 bg-white text-indigo-900 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all">
                {t.common.learnMore}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
