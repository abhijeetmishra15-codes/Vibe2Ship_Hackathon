import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/locales/LanguageContext';
import { useGetIssues } from '@/hooks/useIssues';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/ui/Badge';
import { 
  Award, Calendar, MapPin, Shield, ShieldCheck, 
  Heart, User, Check 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToastStore } from '@/store/useToastStore';

export default function Profile() {
  const { language, setLanguage } = useTranslation();
  const { user, role } = useAuthStore();
  const { data: issues = [] } = useGetIssues();
  const toast = useToastStore((state) => state.toast);

  const normalizedRole = (role || 'citizen').trim().toLowerCase();

  const [activeTab, setActiveTab] = useState("contributions");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Filter issues reported by current user
  const userContributions = issues.filter(i => i?.created_by === user?.id);

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
        <Card className="flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden p-6 rounded-3xl">
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
                <span>Certified {normalizedRole} contributor</span>
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
        </Card>

        {/* Tab Selection */}
        <div className="flex border-b border-border/60 text-xs gap-1.5">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("contributions")}
            className={`px-4 py-2.5 font-bold transition-all rounded-none border-b-2 active:scale-100 bg-transparent hover:bg-transparent ${
              activeTab === "contributions" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Contributions ({userContributions.length})
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("achievements")}
            className={`px-4 py-2.5 font-bold transition-all rounded-none border-b-2 active:scale-100 bg-transparent hover:bg-transparent ${
              activeTab === "achievements" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Achievements
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2.5 font-bold transition-all rounded-none border-b-2 active:scale-100 bg-transparent hover:bg-transparent ${
              activeTab === "settings" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Preferences
          </Button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-4">
          
          {/* Contributions Tab */}
          {activeTab === "contributions" && (
            <div className="space-y-4">
              {userContributions.length === 0 ? (
                <Card className="p-12 text-center space-y-3">
                  <p className="text-xs text-muted-foreground">You haven't reported any issues yet.</p>
                  <Link to="/report" className="inline-block">
                    <Button variant="primary" size="sm">
                      Report an Issue
                    </Button>
                  </Link>
                </Card>
              ) : (
                userContributions.map((issue) => (
                  <Card key={issue.id} className="p-5 flex flex-col sm:flex-row justify-between gap-4">
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
                        <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-0.5 text-primary/70 shrink-0" />{issue?.location?.split(',')[0] || "Unknown location"}</span>
                        <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-0.5 text-primary/70 shrink-0" />{new Date(issue?.created_at || issue?.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/40 shrink-0">
                      <Link to={`/issues/${issue.id}`} className="text-xs font-bold text-primary hover:underline">
                        Track Progress
                      </Link>
                    </div>
                  </Card>
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
                  <Card 
                    key={idx} 
                    className={`p-5 flex items-start space-x-4 transition-all ${
                      ach.unlocked ? '' : 'opacity-50 !bg-secondary/10 border-border/40'
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
                  </Card>
                );
              })}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <Card className="p-6 space-y-6 text-xs text-foreground rounded-3xl">
              {/* Language Preferences */}
              <div className="space-y-3">
                <h3 className="font-display font-bold text-sm">Language Default</h3>
                <div className="flex space-x-3">
                  <Button
                    variant={language === 'en' ? 'primary' : 'secondary'}
                    onClick={() => setLanguage('en')}
                  >
                    English
                  </Button>
                  <Button
                    variant={language === 'hi' ? 'primary' : 'secondary'}
                    onClick={() => setLanguage('hi')}
                  >
                    Hindi (हिंदी)
                  </Button>
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
                <Button
                  type="button"
                  onClick={() => {
                    toast({
                      title: "Settings Saved",
                      description: "Your preferences have been saved locally.",
                      type: "success"
                    });
                  }}
                >
                  Save Profile Settings
                </Button>
              </div>
            </Card>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
