import React from 'react';
import { motion } from 'motion/react';
import { 
  User, Bell, Shield, Globe, Moon, CreditCard, 
  ChevronRight, LogOut, Save 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../ThemeContext';

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const sections = [
    {
      title: 'Account Settings',
      items: [
        { icon: User, label: 'Profile Information', desc: 'Update your name, email and phone', color: 'text-blue-600' },
        { icon: Shield, label: 'Security & Password', desc: 'Change your password and security settings', color: 'text-teal-600' },
        { icon: Bell, label: 'Notifications', desc: 'Manage your email and push notifications', color: 'text-orange-600' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Globe, label: 'Language', desc: 'Choose your preferred language', color: 'text-purple-600' },
        { icon: Moon, label: 'Dark Mode', desc: 'Toggle between light and dark themes', color: 'text-gray-600', action: toggleTheme },
        { icon: CreditCard, label: 'Billing', desc: 'Manage your subscription and payments', color: 'text-pink-600' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account settings and preferences.</p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-4">{section.title}</h2>
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {section.items.map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg bg-opacity-10 ${item.color.replace('text-', 'bg-')}`}>
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{item.label}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <button
              onClick={logout}
              className="w-full p-4 flex items-center justify-center space-x-2 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-2xl font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-all border border-red-100 dark:border-red-900/20"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out of All Devices</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
