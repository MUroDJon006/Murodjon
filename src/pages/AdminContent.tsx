import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Briefcase, 
  GraduationCap, 
  School, 
  Award, 
  Bell, 
  PhoneCall, 
  Save, 
  X,
  Image as ImageIcon,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type ContentType = 'jobs' | 'courses' | 'universities' | 'scholarships' | 'announcements' | 'support';

export default function AdminContent() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const allTabs = [
    { id: 'jobs', label: 'Jobs', icon: Briefcase, roles: ['super_admin', 'job_admin'] },
    { id: 'courses', label: 'Courses', icon: GraduationCap, roles: ['super_admin', 'course_admin'] },
    { id: 'universities', label: 'Universities', icon: School, roles: ['super_admin', 'university_admin'] },
    { id: 'scholarships', label: 'Scholarships', icon: Award, roles: ['super_admin'] },
    { id: 'announcements', label: 'Announcements', icon: Bell, roles: ['super_admin'] },
    { id: 'support', label: 'Support', icon: PhoneCall, roles: ['super_admin'] },
  ];

  const allowedTabs = allTabs.filter(tab => tab.roles.includes(user?.role || ''));
  
  const [activeTab, setActiveTab] = useState<ContentType>((allowedTabs[0]?.id as ContentType) || 'jobs');
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (allowedTabs.length > 0 && !allowedTabs.find(t => t.id === activeTab)) {
      setActiveTab(allowedTabs[0].id as ContentType);
    }
  }, [user?.role, allowedTabs, activeTab]);

  const roleName = user?.role.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') || 'Admin';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Content saved successfully!');
    setIsAdding(false);
  };

  if (allowedTabs.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Content Management</h1>
            <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>{roleName}</span>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Create, edit, and manage all platform content in one place.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-5 h-5" />
          <span>Add New {activeTab.slice(0, -1)}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-8 no-scrollbar gap-2">
        {allowedTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ContentType)}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full h-14 pl-12 pr-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white shadow-sm"
        />
      </div>

      {/* Content List */}
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3, 4, 5].map(i => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Sample {activeTab.slice(0, -1)} Title {i}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: 2 hours ago • Published</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <Edit2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New {activeTab.slice(0, -1)}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details below to publish new content.</p>
                </div>
                <button onClick={() => setIsAdding(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Title</label>
                    <input 
                      type="text" 
                      className="w-full h-14 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                      placeholder="Enter title..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Category</label>
                    <select className="w-full h-14 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white">
                      <option>Technology</option>
                      <option>Finance</option>
                      <option>Education</option>
                      <option>Healthcare</option>
                    </select>
                  </div>
                </div>

                {activeTab === 'jobs' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Salary Range</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" placeholder="e.g. $5k - $8k" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Location</label>
                      <input type="text" className="w-full h-14 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" placeholder="City, Country" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Job Type</label>
                      <select className="w-full h-14 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white">
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Remote</option>
                        <option>Contract</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'courses' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Price</label>
                      <input type="text" className="w-full h-14 px-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" placeholder="e.g. $299" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Duration</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white" placeholder="e.g. 3 Months" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Description</label>
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                    <ReactQuill 
                      theme="snow" 
                      value={description} 
                      onChange={setDescription}
                      className="dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Thumbnail Image</label>
                    <div className="w-full h-32 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-all cursor-pointer">
                      <Plus className="w-8 h-8 mb-2" />
                      <span className="text-sm font-bold">Upload Image</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Publishing Options</label>
                    <div className="flex items-center space-x-4 h-14">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="status" defaultChecked className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium dark:text-white">Publish Now</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="status" className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium dark:text-white">Draft</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex items-center justify-end space-x-4">
                  <button 
                    type="button" 
                    onClick={() => setIsAdding(false)}
                    className="px-8 py-3 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Content</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
