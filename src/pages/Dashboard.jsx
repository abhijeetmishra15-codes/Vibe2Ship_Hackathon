import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/locales/LanguageContext';
import { useGetIssues } from '@/hooks/useIssues';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  FileText, Activity, AlertCircle, CheckCircle2, 
  Award, ArrowUpRight, Plus, MapPin, ExternalLink 
} from 'lucide-react';
import { StatusBadge, SeverityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { data: issues = [], isLoading } = useGetIssues();

  // Dynamically calculate statistics from local issues db
  const citizenIssues = issues.filter(i => i.reporter.id === user.id);
  const totalReports = citizenIssues.length;
  const openIssues = citizenIssues.filter(i => i.status === 'open' || i.status === 'verifying').length;
  const resolvedIssues = citizenIssues.filter(i => i.status === 'resolved').length;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header Widget */}
        <Card variant="primary" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
          <div className="space-y-1">
            <h1 className="font-display font-black text-2xl md:text-3xl text-foreground">
              {t('dashTitle')}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t('dashSubtitle')}
            </p>
          </div>
          <Link to="/report" className="shrink-0">
            <Button variant="primary" className="flex items-center space-x-2 px-5 py-3 h-auto">
              <Plus className="h-4 w-4" />
              <span>{t('reportCTA')}</span>
            </Button>
          </Link>
        </Card>

        {/* Stats Grid Widget */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Card: Total Reports */}
          <Card hoverable className="p-5 relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xxs font-bold uppercase tracking-wider text-muted-foreground">{t('totalReports')}</p>
                <h3 className="text-2xl font-extrabold text-foreground">{isLoading ? '...' : totalReports}</h3>
              </div>
              <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-primary w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </Card>

          {/* Card: Open Issues */}
          <Card hoverable className="p-5 relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xxs font-bold uppercase tracking-wider text-muted-foreground">{t('openIssues')}</p>
                <h3 className="text-2xl font-extrabold text-foreground">{isLoading ? '...' : openIssues}</h3>
              </div>
              <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-500">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-blue-500 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </Card>

          {/* Card: Resolved Issues */}
          <Card hoverable className="p-5 relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xxs font-bold uppercase tracking-wider text-muted-foreground">{t('resolvedIssues')}</p>
                <h3 className="text-2xl font-extrabold text-foreground">{isLoading ? '...' : resolvedIssues}</h3>
              </div>
              <div className="bg-green-500/10 p-2.5 rounded-xl text-green-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-green-500 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </Card>

          {/* Card: Community XP */}
          <Card hoverable className="p-5 relative overflow-hidden group col-span-2 lg:col-span-1">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xxs font-bold uppercase tracking-wider text-muted-foreground">{t('communityPoints')}</p>
                <h3 className="text-2xl font-extrabold text-foreground">{user.points} XP</h3>
              </div>
              <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-500">
                <Award className="h-5 w-5" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-amber-500 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </Card>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel: Your Reports List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-display font-bold text-lg text-foreground">My Civic Reports</h2>
              <Link to="/issues" className="text-xs text-primary font-semibold hover:underline flex items-center">
                <span>View all feed</span>
                <ArrowUpRight className="h-4.5 w-4.5 ml-0.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map(n => (
                  <div key={n} className="bg-card border border-border rounded-2xl p-5 h-28 animate-pulse flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-2/3" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                    <div className="h-10 w-20 bg-muted rounded-xl" />
                  </div>
                ))}
              </div>
            ) : citizenIssues.length === 0 ? (
              <Card className="p-8 text-center space-y-4 shadow-premium">
                <p className="text-sm text-muted-foreground">You haven't reported any issues yet.</p>
                <Link to="/report">
                  <Button
                    variant="primary"
                    size="sm"
                    className="inline-flex items-center space-x-2 h-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Report First Issue</span>
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {citizenIssues.map((issue) => (
                  <Card 
                    key={issue.id} 
                    hoverable
                    className="p-5 flex flex-col sm:flex-row justify-between gap-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap gap-2 items-center">
                        <StatusBadge status={issue.status} />
                        <SeverityBadge severity={issue.severity} />
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Link to={`/issues/${issue.id}`} className="block hover:text-primary transition-colors">
                        <h3 className="font-bold text-sm text-foreground">{issue.title}</h3>
                      </Link>
                      <p className="text-xxs text-muted-foreground flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-0.5 text-muted-foreground/60 shrink-0" />
                        <span className="truncate max-w-sm">{issue.location.address}</span>
                      </p>
                    </div>
                    <div className="flex sm:flex-col justify-between sm:justify-center items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/40 shrink-0">
                      <div className="text-xxs text-muted-foreground">
                        <strong>{issue.upvotes.length}</strong> upvotes • <strong>{issue.comments.length}</strong> comments
                      </div>
                      <Link
                        to={`/issues/${issue.id}`}
                        className="text-xs font-bold text-primary flex items-center space-x-1 hover:underline"
                      >
                        <span>View Details</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right panel: Recent Activity Timeline */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-lg text-foreground">{t('recentActivity')}</h2>
            
            <Card className="p-5 shadow-premium space-y-6">
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="flex space-x-3 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-muted shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3 bg-muted rounded w-3/4" />
                        <div className="h-2 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {issues.slice(0, 4).map((issue, idx) => (
                      <li key={issue.id}>
                        <div className="relative pb-8">
                          {idx !== 3 && (
                            <span 
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border/60" 
                              aria-hidden="true" 
                            />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                                <Activity className="h-4 w-4" />
                              </span>
                            </div>
                            <div className="flex-1 min-w-0 pt-1.5">
                              <p className="text-xs text-foreground">
                                <strong className="font-bold">{issue.reporter.name}</strong> reported a{' '}
                                <span className="text-primary font-semibold">{issue.category.toLowerCase()}</span>
                              </p>
                              <div className="text-[10px] text-muted-foreground mt-0.5 flex justify-between">
                                <span>{issue.location.address.split(',')[0]}</span>
                                <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
