import React from 'react';
import { useTranslation } from '@/locales/LanguageContext';
import { useGetIssues } from '@/hooks/useIssues';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, 
  Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { BarChart3, TrendingUp, ShieldAlert, Award, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';

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
    const open = issues.filter(i => i.status === 'open').length;
    const verifying = issues.filter(i => i.status === 'verifying').length;
    const rejected = issues.filter(i => i.status === 'rejected').length;

    return [
      { name: t('statOpen'), value: open, color: '#3b82f6' },
      { name: t('statVerifying'), value: verifying, color: '#a855f7' },
      { name: t('statResolved'), value: resolved, color: '#22c55e' },
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
  const COLORS = ['#0d9488', '#10b981', '#f59e0b', '#f97316', '#3b82f6', '#ec4899'];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in pb-12">
        {/* Header */}
        <div className="space-y-1 border-b border-border/60 pb-4">
          <h1 className="font-display font-black text-2xl text-foreground flex items-center space-x-2">
            <BarChart3 className="h-7 w-7 text-primary" />
            <span>Smart City Analytics Dashboard</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Statistical analysis of community complaints, resolution speeds, hotspots, and active participation.
          </p>
        </div>

        {isLoading ? (
          <div className="h-64 flex flex-col justify-center items-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">Generating graphical analysis...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 1: Category Distribution */}
            <Card className="rounded-3xl p-6 space-y-4">
              <h3 className="font-display font-bold text-sm text-foreground flex items-center space-x-1.5">
                <ShieldAlert className="h-4.5 w-4.5 text-primary" />
                <span>Complaints Category Distribution</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Chart 2: Resolution Status Ratio */}
            <Card className="rounded-3xl p-6 space-y-4">
              <h3 className="font-display font-bold text-sm text-foreground flex items-center space-x-1.5">
                <TrendingUp className="h-4.5 w-4.5 text-primary" />
                <span>Issue Resolution Status Share</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Chart 3: Monthly Trends Area Chart */}
            <Card className="rounded-3xl p-6 space-y-4 lg:col-span-2">
              <h3 className="font-display font-bold text-sm text-foreground flex items-center space-x-1.5">
                <Award className="h-4.5 w-4.5 text-primary" />
                <span>Reporting & Resolution Performance Curve (Monthly)</span>
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trendData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.15)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Area type="monotone" dataKey="reports" stroke="#0d9488" fillOpacity={1} fill="url(#colorReports)" name="Total Reports File" />
                    <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" name="Total Resolved" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Chart 4: Hotspots Bar Chart */}
            <Card className="rounded-3xl p-6 space-y-4 lg:col-span-2">
              <h3 className="font-display font-bold text-sm text-foreground flex items-center space-x-1.5">
                <MapPin className="h-4.5 w-4.5 text-primary" />
                <span>Sector Hotspots & Resolution Distribution</span>
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={hotspotData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.15)" />
                    <XAxis dataKey="area" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="reports" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Reports Registered" />
                    <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} name="Reports Fixed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
