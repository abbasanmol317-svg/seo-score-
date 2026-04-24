import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { 
  User, 
  Settings, 
  History as HistoryIcon, 
  Target, 
  Trash2, 
  Save, 
  UserCircle,
  Mail,
  Building2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Shield,
  Cloud,
  FileText
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Icon } from '../components/ui/Icon';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { signInWithGoogle, logout } from '../lib/firebase';

export default function Profile() {
  const { user, loading, preferences, history, updatePreferences, clearHistory } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(preferences);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Update form data when preferences change (sync from cloud)
  useEffect(() => {
    setFormData(preferences);
  }, [preferences]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    updatePreferences(formData);
    setTimeout(() => {
      setSaveStatus('saved');
      setIsEditing(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const categories = [
    { id: 'profile', name: 'Profile Details', icon: UserCircle, color: 'bg-indigo-500' },
    { id: 'activity', name: 'Search Activity', icon: HistoryIcon, color: 'bg-emerald-500' },
    { id: 'preferences', name: 'Goals & Preferences', icon: Target, color: 'bg-orange-500' },
    { id: 'security', name: 'Data & Privacy', icon: Shield, color: 'bg-rose-500' },
  ];

  const [activeTab, setActiveTab] = useState('profile');

  const isDirty = JSON.stringify(formData) !== JSON.stringify(preferences);

  const goalsList = [
    { id: 'traffic', label: 'Increase Website Traffic' },
    { id: 'technical', label: 'Improve Technical SEO' },
    { id: 'content', label: 'Enhance Content Quality' },
    { id: 'backlinks', label: 'Build Quality Backlinks' },
    { id: 'youtube', label: 'Optimize YouTube Channel' },
    { id: 'local', label: 'Boost Local Search Ranking' },
  ];

  const toggleGoal = (goalId: string) => {
    const newGoals = formData.goals.includes(goalId)
      ? formData.goals.filter(g => g !== goalId)
      : [...formData.goals, goalId];
    setFormData({ ...formData, goals: newGoals });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <Helmet>
        <title>User Profile | SEO Score Intelligence Suite</title>
        <meta name="description" content="Manage your SEO goals, preferences, and search intelligence history." />
      </Helmet>

      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-200 dark:shadow-none border-4 border-white dark:border-slate-800">
              <User size={48} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {user?.displayName || preferences.name || 'Your Profile'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 mt-1">
                {user?.email || preferences.email || 'Complete your profile to sync across devices'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <button 
                onClick={() => logout()}
                className="px-4 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all active:scale-95 border border-rose-500/20"
              >
                Sign Out
              </button>
            )}
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                "px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all active:scale-95",
                isEditing 
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 underline-offset-4"
              )}
            >
              {isEditing ? 'Cancel Edit' : (
                <> <Settings size={14} /> Edit Profile </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-left",
                activeTab === cat.id
                  ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm border border-slate-100 dark:border-slate-800"
                  : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all",
                activeTab === cat.id ? cat.color + " text-white scale-110" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              )}>
                <cat.icon size={18} />
              </div>
              <span className="text-sm">{cat.name}</span>
            </button>
          ))}
          
          <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:scale-125 transition-transform duration-700">
              <Cloud size={80} />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-2 relative z-10">Cloud Sync</h4>
            {user ? (
              <>
                <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Synced to Account
                </div>
                <p className="text-[10px] text-slate-400 mb-4 relative z-10">Your SEO intelligence is securely backed up and available on all your devices.</p>
              </>
            ) : (
              <>
                <p className="text-[10px] text-slate-400 mb-4 relative z-10">Sign in to access your SEO intelligence on any device and backup your history.</p>
                <button 
                  onClick={() => signInWithGoogle()}
                  className="w-full py-2 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors relative z-10"
                >
                  Sign In with Google
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all overflow-hidden min-h-[500px]">
            {activeTab === 'profile' && (
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Account Details</h2>
                  {saveStatus === 'saved' && (
                    <span className="flex items-center gap-2 text-emerald-500 text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                      <CheckCircle2 size={14} /> Changes Saved
                    </span>
                  )}
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                      <div className="relative group">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input 
                          type="text"
                          disabled={!isEditing}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input 
                          type="email"
                          disabled={!isEditing}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Company / Website</label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                      <input 
                        type="text"
                        disabled={!isEditing}
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60"
                        placeholder="Organization Name"
                      />
                    </div>
                  </div>

                  {isEditing && isDirty && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-4"
                    >
                      <button 
                        type="submit"
                        disabled={saveStatus === 'saving'}
                        className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 flex items-center justify-center gap-3 transition-all active:scale-95 border-2 border-transparent focus:border-white/20"
                      >
                        {saveStatus === 'saving' ? (
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Save size={16} />
                        )}
                        Save Changes
                      </button>
                    </motion.div>
                  )}
                </form>

                {!isEditing && (
                  <div className="mt-12 p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-800/50">
                    <div className="flex gap-4">
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl text-indigo-600 h-fit shadow-sm">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">Profile Strength: High</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Your profile details help us tailor recommendations for your organization.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Recent Scans</h2>
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to clear your entire analysis history?')) {
                        clearHistory();
                      }
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={14} /> Clear All
                  </button>
                </div>

                {history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((item, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={`${item.id}-${item.timestamp}`}
                        className="p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl group hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl text-indigo-600 shadow-sm">
                            <FileText size={18} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                              <span className="truncate">{item.url || 'General Analysis'}</span>
                              <span>•</span>
                              <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Link 
                          to={`/tools/${item.slug}${item.url ? `?url=${encodeURIComponent(item.url)}` : ''}`}
                          className="p-2 sm:px-4 sm:py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-indigo-600 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all"
                        >
                          <span className="hidden sm:inline">View Results</span>
                          <ChevronRight size={14} />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-4">
                      <HistoryIcon size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No activity yet</h3>
                    <p className="text-sm text-slate-500 max-w-xs">Start using our intelligence tools to build your audit roadmap here.</p>
                    <Link to="/" className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all">Go to Dashboard</Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="p-8 sm:p-10">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Growth Goals</h2>
                  <p className="text-sm text-slate-500 mt-2">Select the areas you want to prioritize for personalized tool recommendations.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {goalsList.map((goal) => {
                    const isSelected = formData.goals.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={cn(
                          "p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-4",
                          isSelected
                            ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-900 dark:text-indigo-100"
                            : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-200"
                        )}
                      >
                        <span className="text-sm font-bold">{goal.label}</span>
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                          isSelected ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-200"
                        )}>
                          {isSelected && <CheckCircle2 size={12} />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {isDirty && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-10"
                  >
                    <button 
                      onClick={handleSave}
                      className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all active:scale-95 flex items-center gap-2"
                    >
                      <Save size={16} /> Save Preferences
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-8 sm:p-10">
                <div className="mb-10">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Data Management</h2>
                  <p className="text-sm text-slate-500 mt-2">Control how your search intelligence data is handled.</p>
                </div>

                <div className="space-y-8">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-start gap-4">
                      <div className="bg-rose-50 dark:bg-rose-500/10 p-3 rounded-2xl text-rose-500">
                        <Trash2 size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">Delete All Data</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">This will permanently remove your preferences, goals, and analysis history from this browser.</p>
                        <button 
                          onClick={() => {
                            if (confirm('DANGER: This will delete everything. Proceed?')) {
                              localStorage.removeItem('seo_user_preferences');
                              localStorage.removeItem('seo_tool_history');
                              localStorage.removeItem('seo_score_user_goals');
                              window.location.reload();
                            }
                          }}
                          className="px-6 py-2 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                        >
                          Reset Account
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-2xl text-indigo-500">
                        <FileText size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">Export Data</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Download a copy of your stored preferences and activity history in JSON format.</p>
                        <button 
                          onClick={() => {
                            const data = {
                              preferences,
                              history,
                              exportedAt: new Date().toISOString(),
                              platform: 'SEO Score Suite'
                            };
                            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `seo-score-data-${new Date().getTime()}.json`;
                            a.click();
                          }}
                          className="px-6 py-2 bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all"
                        >
                          Export JSON
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                    <Shield size={18} />
                    <span className="text-xs font-bold">Your data is stored locally in your browser. No data is sent to our servers unless Cloud Sync is enabled.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
