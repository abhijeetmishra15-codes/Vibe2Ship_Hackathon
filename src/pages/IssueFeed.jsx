import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/locales/LanguageContext';
import { useGetIssues } from '@/hooks/useIssues';
import DashboardLayout from '@/components/layout/DashboardLayout';
import IssueCard from '@/components/issues/IssueCard';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export default function IssueFeed() {
  const { t } = useTranslation();
  const { data: issues = [], isLoading, isRefetching, refetch } = useGetIssues();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "upvotes" | "severity"
  
  const [showFilters, setShowFilters] = useState(false);

  // Infinite scroll simulation states
  const [displayCount, setDisplayCount] = useState(3);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef(null);

  // Intersection observer for mock infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loadingMore) {
        // Only load more if there are remaining issues to display
        setLoadingMore(true);
        setTimeout(() => {
          setDisplayCount(prev => prev + 2);
          setLoadingMore(false);
        }, 1000);
      }
    }, { threshold: 1.0 });

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loadingMore]);

  // Client-side filtering logic
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? issue.category === selectedCategory : true;
    const matchesStatus = selectedStatus 
      ? (selectedStatus === 'pending' ? (issue.status === 'pending' || issue.status === 'open')
        : selectedStatus === 'verified' ? (issue.status === 'verified' || issue.status === 'verifying')
        : issue.status === selectedStatus)
      : true;
    const matchesSeverity = selectedSeverity ? issue.severity === selectedSeverity : true;
    return matchesSearch && matchesCategory && matchesStatus && matchesSeverity;
  });

  // Client-side sorting logic
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
    }
    if (sortBy === 'upvotes') {
      return (b.issue_votes || []).length - (a.issue_votes || []).length;
    }
    if (sortBy === 'severity') {
      const severityWeight = { low: 1, medium: 2, high: 3, critical: 4 };
      return severityWeight[b.severity] - severityWeight[a.severity];
    }
    return 0;
  });

  const visibleIssues = sortedIssues.slice(0, displayCount);
  const hasMore = displayCount < sortedIssues.length;

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
    setSelectedSeverity("");
    setSortBy("newest");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-0.5">
            <h1 className="font-display font-black text-2xl text-foreground">Community Issues Feed</h1>
            <p className="text-xs text-muted-foreground">Browse, upvote, and track status updates on local community grievances.</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => refetch()}
            loading={isRefetching}
            className="flex items-center space-x-1.5 px-3.5 py-2 h-auto text-xxs font-bold"
          >
            {!isRefetching && <RefreshCw className="h-3.5 w-3.5 mr-1" />}
            <span>Reload Feed</span>
          </Button>
        </div>

        {/* Filter Toolbar */}
        <Card className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search issues, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
                className="!bg-secondary/60 !border-border/60 focus:!border-primary/50"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground h-auto bg-transparent hover:bg-transparent"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {/* Filter Toggle Trigger */}
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center space-x-2 px-4 py-2.5 h-auto text-xs font-bold transition-all ${
                showFilters || selectedCategory || selectedStatus || selectedSeverity
                  ? 'border-primary bg-primary/10 text-primary hover:bg-primary/15'
                  : ''
              }`}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <span>Filters</span>
            </Button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center bg-card rounded-xl border border-border/80 px-3 py-2.5">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-0 outline-none text-xs text-foreground cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="upvotes">Most Upvoted</option>
                <option value="severity">Highest Severity</option>
              </select>
            </div>
          </div>

          {/* Expanded Filter Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border/50 animate-fade-in text-xs">
              {/* Category Filter */}
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase text-[10px]">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-secondary/80 rounded-xl border border-border px-3 py-2 text-xs text-foreground outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="Pothole">{t('catPothole')}</option>
                  <option value="Garbage">{t('catGarbage')}</option>
                  <option value="Water Leakage">{t('catWaterLeak')}</option>
                  <option value="Streetlight">{t('catStreetlight')}</option>
                  <option value="Sewer">{t('catSewer')}</option>
                  <option value="Public Infrastructure">{t('catPublicInfra')}</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase text-[10px]">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-secondary/80 rounded-xl border border-border px-3 py-2 text-xs text-foreground outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">{t('statOpen')}</option>
                  <option value="verified">{t('statVerifying')}</option>
                  <option value="resolved">{t('statResolved')}</option>
                  <option value="rejected">{t('statRejected')}</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground uppercase text-[10px]">Severity</label>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="w-full bg-secondary/80 rounded-xl border border-border px-3 py-2 text-xs text-foreground outline-none"
                >
                  <option value="">All Severities</option>
                  <option value="low">{t('sevLow')}</option>
                  <option value="medium">{t('sevMedium')}</option>
                  <option value="high">{t('sevHigh')}</option>
                  <option value="critical">{t('sevCritical')}</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex justify-end">
                <Button
                  variant="ghost"
                  onClick={handleResetFilters}
                  className="text-xxs font-bold text-muted-foreground hover:text-destructive transition-colors py-1 px-3 border border-dashed border-border rounded-lg h-auto"
                >
                  Reset Active Filters
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Issues List Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <Card key={n} className="p-5 h-[340px] animate-pulse space-y-4">
                <div className="h-44 bg-muted rounded-xl" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </Card>
            ))}
          </div>
        ) : visibleIssues.length === 0 ? (
          <Card className="p-16 text-center space-y-3 shadow-premium">
            <h3 className="font-display font-bold text-base text-foreground">No matching issues found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">Try checking your search keyword spelling or resetting active filters.</p>
            <Button
              variant="primary"
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleIssues.map((issue) => (
              <div key={issue.id} className="animate-fade-in-up">
                <IssueCard issue={issue} />
              </div>
            ))}
          </div>
        )}

        {/* Infinite Scroll Trigger & Skeleton */}
        {hasMore && !isLoading && (
          <div ref={loaderRef} className="py-10 flex justify-center">
            {loadingMore ? (
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Simulating loading more reports...</span>
              </div>
            ) : (
              <div className="h-4" />
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
