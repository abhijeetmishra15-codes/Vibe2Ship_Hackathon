import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/locales/LanguageContext';
import { useGetIssues } from '@/hooks/useIssues';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/ui/Badge';
import { 
  Award, Settings, ListFilter, Calendar, MapPin, 
  Mail, Shield, ShieldCheck, Heart, User, Check 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { t, language, setLanguage } = useTranslation();
  const { user, role } = useAuthStore();
  const { data: issues = [] } = useGetIssues();

  const [activeTab, setActiveTab] = useState("contributions");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Filter issues reported by current user
  const userContributions = issues.filter(i => i.reporter.id === user.id);

  // Mock list of all achievements
  const allAchievements = [
    { title: "First Responder", desc: "Report your first community issue", unlocked: true, icon: Shield },
    { title: "Pothole Buster", desc: "Report 5 pothole issues in a single month", unlocked: user.points >= 200, icon: ShieldCheck },
    { title: "Green Guardian", desc: "Flag 3 garbage piles that get cleaned up", unlocked: user.points >= 150, icon: Heart },
    { title: "Civic Star", desc: "Accumulate 100 total community XP points", unlocked: user.points >= 100, icon: Award },
    { title: "Elite Verifier", desc: "Perform 10 community audits on-site", unlocked: user.points >= 300, icon: User },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
        {/* Profile Banner */}
        <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-premium flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/10" 
          />

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-1">
              <h1 className="font-display font-black text-2xl text-foreground">{user.name}</h1>
              <p className="text-xs text-muted-foreground capitalize flex items-center justify-center md:justify-start">
                <Shield className="h-4 w-4 mr-1 text-primary" />
                <span>Certified {role} contributor</span>
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs">
              <div className="bg-primary/5 border border-primary/10 rounded-xl px-4 py-2 text-center min-w-[100px]">
                <p className="text-xxs text-muted-foreground uppercase font-bold">XP Score</p>
                <p className="text-sm font-extrabold text-primary mt-0.5">{user.points} XP</p>
              </div>
              <div className="bg-secondary/40 border border-border rounded-xl px-4 py-2 text-center min-w-[100px]">
                <p className="text-xxs text-muted-foreground uppercase font-bold">Reports</p>
                <p className="text-sm font-extrabold text-foreground mt-0.5">{userContributions.length}</p>
              </div>
              <div className="bg-secondary/40 border border-border rounded-xl px-4 py-2 text-center min-w-[100px]">
                <p className="text-xxs text-muted-foreground uppercase font-bold">Rank</p>
                <p className="text-sm font-extrabold text-foreground mt-0.5">#{user.points >= 200 ? '1' : user.points >= 150 ? '2' : '4'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-border/60 text-xs">
          <button
            onClick={() => setActiveTab("contributions")}
            className={`px-4 py-2.5 font-bold transition-all border-b-2 ${
              activeTab === "contributions" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Contributions ({userContributions.length})
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`px-4 py-2.5 font-bold transition-all border-b-2 ${
              activeTab === "achievements" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2.5 font-bold transition-all border-b-2 ${
              activeTab === "settings" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Preferences
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-4">
          
          {/* Contributions Tab */}
          {activeTab === "contributions" && (
            <div className="space-y-4">
              {userContributions.length === 0 ? (
                <div className="bg-card border border-border/80 rounded-2xl p-12 text-center shadow-premium space-y-3">
                  <p className="text-xs text-muted-foreground">You haven't reported any issues yet.</p>
                  <Link to="/report" className="inline-block bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl">
                    Report an Issue
                  </Link>
                </div>
              ) : (
                userContributions.map((issue) => (
                  <div key={issue.id} className="bg-card border border-border/80 rounded-2xl p-5 shadow-premium flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="text-xxs font-bold bg-secondary px-2 py-0.5 rounded border border-border text-muted-foreground">
                          {issue.category}
                        </span>
                        <StatusBadge status={issue.status} />
                      </div>
                      <Link to={`/issues/${issue.id}`} className="block hover:text-primary transition-colors font-bold text-sm text-foreground">
                        {issue.title}
                      </Link>
                      <div className="flex items-center text-xxs text-muted-foreground space-x-3">
                        <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-0.5 text-primary/70 shrink-0" />{issue.location.address.split(',')[0]}</span>
                        <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-0.5 text-primary/70 shrink-0" />{new Date(issue.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/40 shrink-0">
                      <Link to={`/issues/${issue.id}`} className="text-xs font-bold text-primary hover:underline">
                        Track Progress
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allAchievements.map((ach, idx) => {
                const Icon = ach.icon;
                return (
                  <div 
                    key={idx} 
                    className={`bg-card border rounded-2xl p-5 shadow-premium flex items-start space-x-4 transition-all ${
                      ach.unlocked ? 'border-border/80' : 'border-border/40 opacity-50 bg-secondary/10'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl border shrink-0 ${
                      ach.unlocked ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-secondary border-border text-muted-foreground'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-bold text-sm text-foreground flex items-center">
                        <span>{ach.title}</span>
                        {ach.unlocked && <Check className="h-4 w-4 text-emerald-500 ml-1.5 shrink-0" />}
                      </h4>
                      <p className="text-xxs text-muted-foreground leading-normal">{ach.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-premium space-y-6 text-xs text-foreground">
              {/* Language Preferences */}
              <div className="space-y-3">
                <h3 className="font-display font-bold text-sm">Language Default</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-4 py-2 border rounded-xl font-bold transition-all ${
                      language === 'en' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card hover:bg-secondary'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`px-4 py-2 border rounded-xl font-bold transition-all ${
                      language === 'hi' ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card hover:bg-secondary'
                    }`}
                  >
                    Hindi (हिंदी)
                  </button>
                </div>
              </div>

              {/* Alert preferences */}
              <div className="space-y-3 pt-4 border-t border-border/60">
                <h3 className="font-display font-bold text-sm">Real-time Alert Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={emailAlerts} 
                      onChange={() => setEmailAlerts(!emailAlerts)}
                      className="rounded border-border text-primary focus:ring-primary/20 h-4.5 w-4.5"
                    />
                    <div>
                      <p className="font-bold text-foreground">Email Notifications</p>
                      <p className="text-xxs text-muted-foreground mt-0.5">Receive updates when reported issues are verified or resolved.</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={smsAlerts} 
                      onChange={() => setSmsAlerts(!smsAlerts)}
                      className="rounded border-border text-primary focus:ring-primary/20 h-4.5 w-4.5"
                    />
                    <div>
                      <p className="font-bold text-foreground">SMS alerts / WhatsApp Notifications</p>
                      <p className="text-xxs text-muted-foreground mt-0.5">Receive mobile alerts when verification sweeps are requested nearby.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Save Settings confirmation */}
              <div className="pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => alert("Settings saved locally! (Simulation)")}
                  className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-premium"
                >
                  Save Profile Settings
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
