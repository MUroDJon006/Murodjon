import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  GraduationCap, 
  School, 
  TrendingUp, 
  Activity, 
  MessageSquare, 
  Globe, 
  Moon, 
  Sun,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

const data = [
  { name: 'Mon', users: 400, apps: 240 },
  { name: 'Tue', users: 300, apps: 139 },
  { name: 'Wed', users: 200, apps: 980 },
  { name: 'Thu', users: 278, apps: 390 },
  { name: 'Fri', users: 189, apps: 480 },
  { name: 'Sat', users: 239, apps: 380 },
  { name: 'Sun', users: 349, apps: 430 },
];

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div className={`flex items-center space-x-1 text-sm font-bold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        <span>{change >= 0 ? '+' : ''}{change}%</span>
        {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
      </div>
    </div>
    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
  </motion.div>
);

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const roleName = user?.role.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') || 'Admin';

  const showUsers = user?.role === 'super_admin';
  const showJobs = user?.role === 'super_admin' || user?.role === 'job_admin';
  const showCourses = user?.role === 'super_admin' || user?.role === 'course_admin';
  const showUnis = user?.role === 'super_admin' || user?.role === 'university_admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Analytics</h1>
            <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>{roleName}</span>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Real-time platform performance and user engagement.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-sm font-bold">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>124 Active Now</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {showUsers && <StatCard title="Total Users" value="12,482" change={12} icon={Users} color="bg-blue-500" />}
        {showJobs && <StatCard title="Job Applications" value="3,842" change={8} icon={Briefcase} color="bg-purple-500" />}
        {showCourses && <StatCard title="Course Enrolled" value="1,205" change={-3} icon={GraduationCap} color="bg-orange-500" />}
        {showUnis && <StatCard title="Uni Applications" value="452" change={24} icon={School} color="bg-teal-500" />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Chart */}
        {user?.role === 'super_admin' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Traffic Overview</h3>
              <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2 text-sm font-bold outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Usage Stats */}
        <div className={cn("space-y-6", user?.role !== 'super_admin' && "lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 space-y-0")}>
          {user?.role === 'super_admin' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">AI Assistant Usage</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-indigo-500" />
                    <span className="text-sm font-medium">Total Queries</span>
                  </div>
                  <span className="font-bold">45,281</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[85%]" />
                </div>
              </div>
            </motion.div>
          )}

          {user?.role === 'super_admin' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Language Usage</h3>
              <div className="space-y-4">
                {[
                  { lang: 'English', val: 45, color: 'bg-blue-500' },
                  { lang: 'Russian', val: 35, color: 'bg-red-500' },
                  { lang: 'Uzbek', val: 20, color: 'bg-green-500' },
                ].map(l => (
                  <div key={l.lang} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>{l.lang}</span>
                      <span>{l.val}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className={`${l.color} h-full`} style={{ width: `${l.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {user?.role === 'super_admin' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Theme Preference</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Sun className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-bold">Light (62%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold">Dark (38%)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
