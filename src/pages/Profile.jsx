import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/locales/LanguageContext';
import { useGetIssues, useGetLeaderboard } from '@/hooks/useIssues';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/ui/Badge';
import { 
  Award, Calendar, MapPin, Shield, ShieldCheck, 
  Heart, User, Check, Zap, Target, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToastStore } from '@/store/useToastStore';

export default function Profile() {
  const { language, setLanguage } = useTranslation();
  const { user, role } = useAuthStore();
  const { data: issues = [] } = useGetIssues();
  const { data: leaderboard = [], isLoading: isLeaderboardLoading } = useGetLeaderboard();
  const toast = useToastStore((state) => state.toast);

  // Calculate actual rank based on leaderboard standings
  const userRankIndex = leaderboard.findIndex(member => member.id === user?.id);
  const userRank = userRankIndex !== -1 ? `#${userRankIndex + 1}` : (isLeaderboardLoading ? '#...' : '#-');

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
      <div className="space-y-8 max-w-5xl mx-auto animate-fade-in pb-12 relative">
        {/* Background Ambient Glow */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 blur-[100px] pointer-events-none rounded-[100%]" />

        {/* Hero Profile Header (Identity Card) */}
        <Card className="relative overflow-hidden p-8 sm:p-10 rounded-[2.5rem] border-primary/30 bg-gradient-to-br from-card/80 via-primary/5 to-card/60 shadow-premium">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[80px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="relative w-32 h-32 rounded-full object-cover ring-4 ring-primary/40 shadow-[0_0_30px_rgba(20,184,166,0.3)] bg-card" 
              />
              <div className="absolute bottom-0 right-2 bg-background rounded-full p-1 border border-border shadow-sm">
                <Check className="w-5 h-5 text-emerald-500" />
              </div>
            </div>

            <div className="flex-1 space-y-5 text-center md:text-left pt-2">
              <div className="space-y-2">
                <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3">
                  <h1 className="font-display font-black text-3xl sm:text-4xl text-foreground tracking-tight">{user.name}</h1>
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                    {normalizedRole}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start">
                  <MapPin className="h-4 w-4 mr-1.5 text-primary/70" />
                  <span>Sector 15, City District</span>
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <Card hoverable className="p-4 flex flex-col items-center sm:items-start gap-2 bg-card/40 border-border/50">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">XP Score</p>
                    <p className="text-lg font-black text-foreground">{user.points}</p>
                  </div>
                </Card>
                
                <Card hoverable className="p-4 flex flex-col items-center sm:items-start gap-2 bg-card/40 border-border/50">
                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Reports</p>
                    <p className="text-lg font-black text-foreground">{userContributions.length}</p>
                  </div>
                </Card>

                <Card hoverable className="p-4 flex flex-col items-center sm:items-start gap-2 bg-card/40 border-border/50">
                  <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Rank</p>
                    <p className="text-lg font-black text-foreground">{userRank}</p>
                  </div>
                </Card>

                <Card hoverable className="p-4 flex flex-col items-center sm:items-start gap-2 bg-card/40 border-border/50">
                  <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Achievements</p>
                    <p className="text-lg font-black text-foreground">{allAchievements.filter(a => a.unlocked).length}</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Card>

        {/* Tab Selection (Pill Style) */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 p-1.5 bg-secondary/30 backdrop-blur-md rounded-2xl w-fit border border-border/50 shadow-sm mx-auto sm:mx-0">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("contributions")}
            className={`px-6 py-2.5 text-xs font-bold transition-all duration-300 rounded-xl ${
              activeTab === "contributions" 
                ? "bg-primary text-primary-foreground shadow-[0_4px_15px_rgba(20,184,166,0.3)] scale-100 hover:bg-primary" 
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            Activity Timeline
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("achievements")}
            className={`px-6 py-2.5 text-xs font-bold transition-all duration-300 rounded-xl ${
              activeTab === "achievements" 
                ? "bg-primary text-primary-foreground shadow-[0_4px_15px_rgba(20,184,166,0.3)] scale-100 hover:bg-primary" 
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            Achievements
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-2.5 text-xs font-bold transition-all duration-300 rounded-xl ${
              activeTab === "settings" 
                ? "bg-primary text-primary-foreground shadow-[0_4px_15px_rgba(20,184,166,0.3)] scale-100 hover:bg-primary" 
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            Preferences
          </Button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-6 pt-2">
          
          {/* Activity Timeline Tab */}
          {activeTab === "contributions" && (
            <div className="space-y-6 relative">
              {userContributions.length === 0 ? (
                <Card className="p-16 text-center space-y-4 border-dashed border-2 bg-secondary/10">
                  <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <Activity className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">No Activity Yet</h3>
                    <p className="text-xs text-muted-foreground mt-1">Start contributing to your community to build your identity.</p>
                  </div>
                  <Link to="/report" className="inline-block mt-4">
                    <Button variant="primary" className="shadow-premium">
                      Report First Issue
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:inset-0 before:ml-6 sm:before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:via-primary/20 before:to-transparent">
                  {userContributions.map((issue, index) => (
                    <div key={issue.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      {/* Timeline Dot */}
                      <div className="absolute left-0 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-4 h-4 rounded-full bg-background border-2 border-primary shadow-[0_0_10px_rgba(20,184,166,0.4)] group-hover:scale-125 transition-transform duration-300 z-10" />
                      
                      {/* Card Content */}
                      <Card hoverable className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2.5rem)] p-6 relative">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
                              {issue.category}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(issue?.created_at || issue?.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Link to={`/issues/${issue.id}`} className="block">
                            <h4 className="font-extrabold text-base text-foreground leading-tight group-hover:text-primary transition-colors">
                              {issue.title}
                            </h4>
                          </Link>
                          <div className="flex items-center justify-between pt-4 border-t border-border/40">
                            <StatusBadge status={issue.status} />
                            <Link to={`/issues/${issue.id}`} className="text-[10px] font-bold text-primary hover:underline flex items-center">
                              View Details
                            </Link>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {allAchievements.map((ach, idx) => {
                const Icon = ach.icon;
                return (
                  <Card 
                    key={idx} 
                    hoverable={ach.unlocked}
                    className={`p-6 flex flex-col justify-between space-y-4 ${
                      ach.unlocked ? 'bg-card/40' : 'opacity-60 bg-secondary/10 border-dashed hover:-translate-y-0 shadow-none hover:shadow-none'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className={`p-3 rounded-2xl border shrink-0 ${
                        ach.unlocked ? 'bg-primary/10 border-primary/20 text-primary shadow-inner' : 'bg-secondary border-border/50 text-muted-foreground'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      {ach.unlocked && (
                        <div className="bg-emerald-500/10 text-emerald-500 p-1.5 rounded-full">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-extrabold text-base text-foreground">
                        {ach.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{ach.desc}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-8 space-y-6">
                <div className="space-y-1">
                  <h3 className="font-display font-black text-lg text-foreground">Language & Region</h3>
                  <p className="text-xs text-muted-foreground">Select your primary communication language.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant={language === 'en' ? 'primary' : 'outline'}
                    onClick={() => setLanguage('en')}
                    className="flex-1 py-6"
                  >
                    English (US)
                  </Button>
                  <Button
                    variant={language === 'hi' ? 'primary' : 'outline'}
                    onClick={() => setLanguage('hi')}
                    className="flex-1 py-6"
                  >
                    Hindi (हिंदी)
                  </Button>
                </div>
              </Card>

              <Card className="p-8 space-y-6">
                <div className="space-y-1">
                  <h3 className="font-display font-black text-lg text-foreground">Notification Preferences</h3>
                  <p className="text-xs text-muted-foreground">Manage how you receive real-time updates.</p>
                </div>
                
                <div className="space-y-5">
                  <label className="flex items-start space-x-4 cursor-pointer group">
                    <div className="mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={emailAlerts} 
                        onChange={() => setEmailAlerts(!emailAlerts)}
                        className="rounded-md border-border/50 text-primary focus:ring-primary/40 h-5 w-5 bg-card"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">Email Summaries</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">Receive daily updates when reported issues change status.</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-4 cursor-pointer group">
                    <div className="mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={smsAlerts} 
                        onChange={() => setSmsAlerts(!smsAlerts)}
                        className="rounded-md border-border/50 text-primary focus:ring-primary/40 h-5 w-5 bg-card"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">Instant SMS Alerts</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">Get real-time mobile notifications for critical issues.</p>
                    </div>
                  </label>
                </div>
              </Card>

              <div className="md:col-span-2 flex justify-end pt-4">
                <Button
                  onClick={() => {
                    toast({
                      title: "Preferences Saved",
                      description: "Your local identity settings have been updated.",
                      type: "success"
                    });
                  }}
                  className="px-8 py-6 text-sm"
                >
                  Save Profile Settings
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
