import { useTranslation } from '@/locales/LanguageContext';
import { useGetIssues } from '@/hooks/useIssues';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, 
  Pie, Cell, AreaChart, Area 
} from 'recharts';
import { BarChart3, TrendingUp, ShieldAlert, Award, Loader2, MapPin, Activity, CheckCircle2, Clock, Zap } from 'lucide-react';

export default function Analytics() {
  const { t } = useTranslation();
  const { data: issues = [], isLoading } = useGetIssues();

  // 1. Calculate Category Distributions
  const getCategoryData = () => {
    const counts = {};
    issues.forEach(issue => {
      counts[issue.category] = (counts[issue.category] || 0) + 1;
    });
    return Object.keys(counts).map(cat => ({
      name: cat,
      value: counts[cat]
    }));
  };

  // 2. Calculate Status Distribution
  const getStatusData = () => {
    const resolved = issues.filter(i => i.status === 'resolved').length;
    const open = issues.filter(i => i.status === 'pending' || i.status === 'open').length;
    const verifying = issues.filter(i => i.status === 'verified' || i.status === 'verifying').length;
    const rejected = issues.filter(i => i.status === 'rejected').length;

    return [
      { name: t('statOpen'), value: open, color: '#3b82f6' },
      { name: t('statVerifying'), value: verifying, color: '#a855f7' },
      { name: t('statResolved'), value: resolved, color: '#10b981' },
      { name: t('statRejected'), value: rejected, color: '#6b7280' }
    ];
  };

  // 3. Hotspot Areas Map Mock
  const hotspotData = [
    { area: "Sector 15", reports: 8, resolved: 6 },
    { area: "Sector 22", reports: 5, resolved: 5 },
    { area: "Sector 30", reports: 9, resolved: 4 },
    { area: "Sector 62", reports: 12, resolved: 8 },
    { area: "City Park", reports: 4, resolved: 3 },
  ];

  // 4. Monthly reporting trends mock
  const trendData = [
    { month: "Jan", reports: 22, resolved: 18 },
    { month: "Feb", reports: 34, resolved: 28 },
    { month: "Mar", reports: 45, resolved: 38 },
    { month: "Apr", reports: 38, resolved: 30 },
    { month: "May", reports: 52, resolved: 42 },
    { month: "Jun", reports: issues.length + 55, resolved: issues.filter(i => i.status === 'resolved').length + 42 }
  ];

  const categoryData = getCategoryData();
  const statusData = getStatusData();

  // Color constants
  const COLORS = ['#10b981', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6'];

  // Stats for Glass Cards
  const totalOpen = issues.filter(i => i.status === 'pending' || i.status === 'open').length;
  const totalVerifying = issues.filter(i => i.status === 'verified' || i.status === 'verifying').length;
  const totalResolved = issues.filter(i => i.status === 'resolved').length;
  const totalReports = issues.length;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in pb-12">
        {/* Header */}
        <div className="space-y-2 border-b border-border/40 pb-5">
          <h1 className="font-display font-black text-3xl text-foreground flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-xl">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <span>Admin Analytics Control Center</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Real-time statistical analysis of community complaints, resolution speeds, hotspots, and active participation.
          </p>
        </div>

        {isLoading ? (
          <div className="h-64 flex flex-col justify-center items-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">Generating graphical analysis...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Glassmorphism Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="relative group rounded-2xl bg-card/40 backdrop-blur-xl border border-primary/20 shadow-premium p-6 overflow-hidden transition-all hover:shadow-premium-hover hover:border-primary/40">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                <div className="relative z-10 flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" /> +12%
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold text-foreground tracking-tight">{totalReports}</h3>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Total Reports</p>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="relative group rounded-2xl bg-card/40 backdrop-blur-xl border border-blue-500/20 shadow-premium p-6 overflow-hidden transition-all hover:shadow-premium-hover hover:border-blue-500/40">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                <div className="relative z-10 flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                      <Clock className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold text-foreground tracking-tight">{totalOpen}</h3>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Open Issues</p>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="relative group rounded-2xl bg-card/40 backdrop-blur-xl border border-purple-500/20 shadow-premium p-6 overflow-hidden transition-all hover:shadow-premium-hover hover:border-purple-500/40">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                <div className="relative z-10 flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
                      <ShieldAlert className="h-5 w-5 text-purple-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold text-foreground tracking-tight">{totalVerifying}</h3>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">In Verification</p>
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="relative group rounded-2xl bg-card/40 backdrop-blur-xl border border-emerald-500/20 shadow-premium p-6 overflow-hidden transition-all hover:shadow-premium-hover hover:border-emerald-500/40">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                <div className="relative z-10 flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" /> +8%
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold text-foreground tracking-tight">{totalResolved}</h3>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Resolved Cases</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Insight Strip */}
            <div className="relative overflow-hidden rounded-xl bg-card/30 backdrop-blur-md border border-border/50 p-4 flex items-center space-x-4 shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-blue-500" />
              <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                <Zap className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="animate-fade-in">
                  <p className="text-sm text-foreground font-medium flex items-center">
                    <span className="text-blue-500 mr-2">🔵</span> 
                    Pothole reports increased 12% in Sector 15 this week. Deploying PWD units is highly recommended.
                  </p>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Chart 1: Category Distribution */}
              <div className="rounded-3xl bg-card/20 backdrop-blur-xl border border-border/40 shadow-premium p-6 space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="font-display font-bold text-base text-foreground flex items-center space-x-2">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                    <span>Complaints Category Distribution</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 ml-7">AI-categorized breakdown of civic issues.</p>
                </div>
                <div className="h-64 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, background: 'rgba(20, 20, 20, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                      <Legend wrapperStyle={{ fontSize: 11, paddingTop: '20px' }} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Resolution Status Ratio */}
              <div className="rounded-3xl bg-card/20 backdrop-blur-xl border border-border/40 shadow-premium p-6 space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="font-display font-bold text-base text-foreground flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    <span>Issue Resolution Status Share</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 ml-7">Current pipeline of reports from open to resolved.</p>
                </div>
                <div className="h-64 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, background: 'rgba(20, 20, 20, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: Monthly Trends Area Chart */}
              <div className="rounded-3xl bg-card/20 backdrop-blur-xl border border-border/40 shadow-premium p-6 space-y-6 lg:col-span-2 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h3 className="font-display font-bold text-base text-foreground flex items-center space-x-2">
                      <Award className="h-5 w-5 text-primary" />
                      <span>Reporting & Resolution Performance Curve</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 ml-7">Monthly civic engagement and municipal resolution tracking.</p>
                  </div>
                </div>
                <div className="h-80 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trendData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.1)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} dx={-10} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, background: 'rgba(20, 20, 20, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: '20px' }} iconType="circle" />
                      <Area type="monotone" dataKey="reports" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorReports)" name="Reports Registered" />
                      <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorResolved)" name="Reports Fixed" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 4: Hotspots Bar Chart */}
              <div className="rounded-3xl bg-card/20 backdrop-blur-xl border border-border/40 shadow-premium p-6 space-y-6 lg:col-span-2 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h3 className="font-display font-bold text-base text-foreground flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      <span>Sector Hotspots & Resolution Distribution</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 ml-7">Geographic breakdown of incident volume vs resolution count.</p>
                  </div>
                </div>
                <div className="h-80 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={hotspotData}
                      margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                      barSize={24}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.1)" />
                      <XAxis dataKey="area" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} dx={-10} />
                      <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ fontSize: 12, borderRadius: 12, background: 'rgba(20, 20, 20, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: '20px' }} iconType="circle" />
                      <Bar dataKey="reports" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Reports Registered" />
                      <Bar dataKey="resolved" fill="#10b981" radius={[6, 6, 0, 0]} name="Reports Fixed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
