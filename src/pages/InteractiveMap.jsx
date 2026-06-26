import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import { useTranslation } from '@/locales/LanguageContext';
import { useGetIssues } from '@/hooks/useIssues';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { StatusBadge, SeverityBadge } from '@/components/ui/Badge';
import { SlidersHorizontal, RefreshCw, Layers } from 'lucide-react';
import L from 'leaflet';
import { Card } from '@/components/ui/Card';

export default function InteractiveMap() {
  const { t } = useTranslation();
  const { data: issues = [], isLoading } = useGetIssues();

  // Map Filter states
  const [categoryFilter, setCategoryFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const normalizedIssues = issues.map(issue => {
    if (!issue) return issue;

    let category = issue.category;
    if (!category) {
      const text = `${issue.title || ""} ${issue.description || ""}`.toLowerCase();
      if (text.includes("pothole") || text.includes("road") || text.includes("street")) {
        category = "Pothole";
      } else if (text.includes("garbage") || text.includes("trash") || text.includes("waste") || text.includes("dump") || text.includes("clean")) {
        category = "Garbage";
      } else if (text.includes("leak") || text.includes("pipe") || text.includes("water") || text.includes("flow")) {
        category = "Water Leakage";
      } else if (text.includes("light") || text.includes("lamp") || text.includes("dark")) {
        category = "Streetlight";
      } else if (text.includes("sewer") || text.includes("drain") || text.includes("gutter")) {
        category = "Sewer";
      } else {
        category = "Public Infrastructure";
      }
    }

    let severity = issue.severity;
    if (!severity) {
      const text = `${issue.title || ""} ${issue.description || ""}`.toLowerCase();
      if (text.includes("critical") || text.includes("danger") || text.includes("severe") || text.includes("immediate")) {
        severity = "critical";
      } else if (text.includes("high") || text.includes("pothole") || text.includes("sewer") || text.includes("flood")) {
        severity = "high";
      } else if (text.includes("leak") || text.includes("garbage") || text.includes("medium")) {
        severity = "medium";
      } else {
        severity = "low";
      }
    }

    return {
      ...issue,
      category,
      severity
    };
  });

  const filteredIssues = normalizedIssues.filter(issue => {
    const matchesCategory = categoryFilter ? issue.category === categoryFilter : true;
    const matchesSeverity = severityFilter ? issue.severity === severityFilter : true;
    const matchesStatus = statusFilter
      ? (statusFilter === 'pending' ? (issue.status === 'pending' || issue.status === 'open')
        : statusFilter === 'verified' ? (issue.status === 'verified' || issue.status === 'verifying')
          : issue.status === statusFilter)
      : true;
    return matchesCategory && matchesSeverity && matchesStatus && issue.status !== 'rejected';
  });

  // Custom Heatmap-style marker generator
  const getMarkerIcon = (severity) => {
    let baseColor = 'rgba(16, 185, 129, 0.9)'; // green (low)
    let glowColor = 'rgba(16, 185, 129, 0.4)';
    let pulseClass = '';
    let glowSize = 'w-[30px] h-[30px] blur-[4px]';

    if (severity === 'medium') {
      baseColor = 'rgba(245, 158, 11, 0.9)'; // amber
      glowColor = 'rgba(245, 158, 11, 0.5)';
      glowSize = 'w-[40px] h-[40px] blur-[6px]';
    }
    if (severity === 'high') {
      baseColor = 'rgba(249, 115, 22, 0.95)'; // orange
      glowColor = 'rgba(249, 115, 22, 0.6)';
      glowSize = 'w-[50px] h-[50px] blur-[8px]';
      pulseClass = 'animate-pulse';
    }
    if (severity === 'critical') {
      baseColor = 'rgba(225, 29, 72, 1)'; // rose
      glowColor = 'rgba(225, 29, 72, 0.7)';
      glowSize = 'w-[60px] h-[60px] blur-[12px]';
      pulseClass = 'animate-pulse';
    }

    const htmlString = `
      <div class="relative flex items-center justify-center w-full h-full pointer-events-none">
        <!-- Glow Layer (Heatmap effect) -->
        <div class="absolute ${glowSize} rounded-full ${pulseClass} transition-all duration-1000" style="background-color: ${glowColor}; pointer-events: none;"></div>
        <!-- Core Marker -->
        <div class="relative w-[14px] h-[14px] rounded-full border-2 border-white/90 shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10 pointer-events-auto" style="background-color: ${baseColor};"></div>
      </div>
    `;

    return new L.DivIcon({
      className: 'bg-transparent border-0',
      html: htmlString,
      iconSize: [60, 60],
      iconAnchor: [30, 30],
      popupAnchor: [0, -15],
      tooltipAnchor: [0, -15]
    });
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)] flex flex-col space-y-4 animate-fade-in pb-4">
        {/* Floating Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div className="space-y-1">
            <h1 className="font-display font-black text-2xl text-foreground flex items-center space-x-2">
              <div className="bg-primary/10 p-1.5 rounded-lg">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <span>City Intelligence Map</span>
            </h1>
            <p className="text-xs text-muted-foreground">Real-time geospatial density and severity visualization for municipal monitoring.</p>
          </div>
        </div>

        {/* Map Workspace Grid */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          
          {/* Sidebar Panels */}
          <div className="w-full lg:w-[320px] flex flex-col gap-6 overflow-y-auto shrink-0 pb-2 custom-scrollbar">
            
            {/* Filter Panel */}
            <Card className="bg-card/60 backdrop-blur-xl border border-primary/20 shadow-premium rounded-2xl p-5 space-y-4 shrink-0">
              <div className="flex items-center space-x-2 border-b border-border/40 pb-3">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-foreground">Map Filters</h3>
              </div>

              {/* Filter: Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-secondary/70 backdrop-blur-sm rounded-xl border border-border/50 px-3 py-2 text-xs text-foreground outline-none focus:border-primary/50 transition-colors"
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

              {/* Filter: Severity */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Severity</label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full bg-secondary/70 backdrop-blur-sm rounded-xl border border-border/50 px-3 py-2 text-xs text-foreground outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="">All Severities</option>
                  <option value="low">{t('sevLow')}</option>
                  <option value="medium">{t('sevMedium')}</option>
                  <option value="high">{t('sevHigh')}</option>
                  <option value="critical">{t('sevCritical')}</option>
                </select>
              </div>

              {/* Filter: Status */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-secondary/70 backdrop-blur-sm rounded-xl border border-border/50 px-3 py-2 text-xs text-foreground outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">{t('statOpen')}</option>
                  <option value="verified">{t('statVerifying')}</option>
                  <option value="resolved">{t('statResolved')}</option>
                </select>
              </div>
            </Card>

            {/* Map Legend Panel */}
            <Card className="bg-card/60 backdrop-blur-xl border border-border/50 shadow-premium rounded-2xl p-5 space-y-4 shrink-0">
              <span className="font-bold text-[10px] text-foreground uppercase tracking-widest block border-b border-border/50 pb-3 mb-1">Heatmap Legend</span>
              <div className="flex flex-col space-y-3.5 text-xs text-foreground font-medium">
                <div className="flex items-center space-x-3">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <div className="absolute w-full h-full bg-rose-500/40 rounded-full blur-[2px] animate-pulse"></div>
                    <div className="relative w-3 h-3 bg-rose-500 rounded-full border border-white/50"></div>
                  </div>
                  <span>Critical Zone</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <div className="absolute w-full h-full bg-orange-500/40 rounded-full blur-[2px]"></div>
                    <div className="relative w-3 h-3 bg-orange-500 rounded-full border border-white/50"></div>
                  </div>
                  <span>High Impact</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <div className="absolute w-full h-full bg-amber-500/40 rounded-full blur-[2px]"></div>
                    <div className="relative w-3 h-3 bg-amber-500 rounded-full border border-white/50"></div>
                  </div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <div className="absolute w-full h-full bg-emerald-500/40 rounded-full blur-[2px]"></div>
                    <div className="relative w-3 h-3 bg-emerald-500 rounded-full border border-white/50"></div>
                  </div>
                  <span>Low Level</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Full Map Canvas Container */}
          <Card className="flex-1 w-full relative z-0 rounded-3xl overflow-hidden shadow-premium border border-border/50 min-h-[500px]">
            {isLoading ? (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-[2000] flex flex-col justify-center items-center space-y-3">
                <div className="bg-primary/20 p-3 rounded-full">
                  <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                </div>
                <span className="text-xs text-foreground font-medium uppercase tracking-wider">Plotting geospatial data...</span>
              </div>
            ) : null}

            {/* In a dark theme context, standard OSM tiles can be bright. Adding a CSS filter directly to TileLayer wrapper */}
            <div className="w-full h-full [&_.leaflet-layer]:dark:brightness-75 [&_.leaflet-layer]:dark:contrast-125 [&_.leaflet-layer]:dark:hue-rotate-[180deg] [&_.leaflet-layer]:dark:invert">
              <MapContainer
                center={[28.5355, 77.3910]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {filteredIssues.map((issue) => {
                  if (!issue || issue.latitude === undefined || issue.latitude === null || issue.longitude === undefined || issue.longitude === null) {
                    return null;
                  }

                  const lat = Number(issue.latitude);
                  const lng = Number(issue.longitude);

                  if (isNaN(lat) || isNaN(lng) || !isFinite(lat) || !isFinite(lng)) {
                    return null;
                  }

                  return (
                    <Marker
                      key={issue.id}
                      position={[lat, lng]}
                      icon={getMarkerIcon(issue.severity)}
                    >
                      {/* Tooltip for quick hover insight */}
                      <Tooltip 
                        direction="top" 
                        offset={[0, -15]} 
                        opacity={1} 
                        className="!bg-card/90 !backdrop-blur-md !border !border-border/50 !text-foreground !rounded-xl !p-2 !shadow-premium !pointer-events-none"
                      >
                        <div className="font-bold text-xs">{issue.title}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center space-x-1 mt-0.5">
                          <span className="uppercase text-primary font-semibold">{issue.severity}</span>
                          <span>•</span>
                          <span>{issue.category}</span>
                        </div>
                      </Tooltip>

                      {/* Popup for detailed click insight */}
                      <Popup className="[&_.leaflet-popup-content-wrapper]:!bg-card/90 [&_.leaflet-popup-content-wrapper]:!backdrop-blur-xl [&_.leaflet-popup-content-wrapper]:!border [&_.leaflet-popup-content-wrapper]:!border-border/50 [&_.leaflet-popup-content-wrapper]:!shadow-premium [&_.leaflet-popup-tip]:!bg-card/90">
                        <div className="p-1.5 space-y-2.5 max-w-[220px] text-xs font-sans text-foreground">
                          <div className="flex justify-between items-center gap-2 border-b border-border/40 pb-2">
                            <span className="font-bold text-[9px] uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full truncate">
                              {issue.category}
                            </span>
                            <StatusBadge status={issue.status} />
                          </div>

                          <div>
                            <h4 className="font-extrabold text-sm text-foreground leading-tight line-clamp-2">
                              {issue.title}
                            </h4>
                            <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2 mt-1">
                              {issue.location || "Location unavailable"}
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-2 mt-2 border-t border-border/40">
                            <SeverityBadge severity={issue.severity} />
                            <Link
                              to={`/issues/${issue.id}`}
                              className="text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg font-bold transition-colors text-[10px] text-center"
                            >
                              Open Profile
                            </Link>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

