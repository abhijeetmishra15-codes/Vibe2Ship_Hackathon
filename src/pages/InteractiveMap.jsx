import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useTranslation } from '@/locales/LanguageContext';
import { useGetIssues } from '@/hooks/useIssues';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { StatusBadge, SeverityBadge } from '@/components/ui/Badge';
import { MapPin, SlidersHorizontal, Layers, Shield, RefreshCw } from 'lucide-react';
import L from 'leaflet';

export default function InteractiveMap() {
  const { t } = useTranslation();
  const { data: issues = [], isLoading } = useGetIssues();

  // Map Filter states
  const [categoryFilter, setCategoryFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredIssues = issues.filter(issue => {
    const matchesCategory = categoryFilter ? issue.category === categoryFilter : true;
    const matchesSeverity = severityFilter ? issue.severity === severityFilter : true;
    const matchesStatus = statusFilter ? issue.status === statusFilter : true;
    return matchesCategory && matchesSeverity && matchesStatus && issue.status !== 'rejected';
  });

  // Custom marker generator depending on severity
  const getMarkerIcon = (severity) => {
    let pinColor = '#22c55e'; // low (Green)
    if (severity === 'medium') pinColor = '#f59e0b'; // Orange
    if (severity === 'high') pinColor = '#f97316'; // Red-orange
    if (severity === 'critical') pinColor = '#e11d48'; // Rose/Red

    const svgTemplate = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${pinColor}" width="34" height="34">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `;

    return new L.DivIcon({
      className: 'custom-leaflet-marker',
      html: svgTemplate,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -30]
    });
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-140px)] flex flex-col space-y-4 animate-fade-in">
        {/* Floating Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div className="space-y-0.5">
            <h1 className="font-display font-black text-2xl text-foreground">Interactive Hotspot Map</h1>
            <p className="text-xs text-muted-foreground">Visualize and filter reported issues across your municipality in real-time.</p>
          </div>
        </div>

        {/* Map Workspace Grid */}
        <div className="flex-1 relative rounded-3xl overflow-hidden border border-border shadow-premium flex flex-col md:flex-row z-10">
          
          {/* Map Controls Sidebar (Left) */}
          <div className="w-full md:w-80 bg-card border-b md:border-b-0 md:border-r border-border p-5 space-y-5 overflow-y-auto shrink-0 z-20">
            <div className="flex items-center space-x-2 border-b border-border/60 pb-3">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-foreground">Filter Map View</h3>
            </div>

            {/* Filter: Category */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-secondary/70 rounded-xl border border-border px-3 py-2 text-xs text-foreground outline-none focus:border-primary/50"
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
                className="w-full bg-secondary/70 rounded-xl border border-border px-3 py-2 text-xs text-foreground outline-none focus:border-primary/50"
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
                className="w-full bg-secondary/70 rounded-xl border border-border px-3 py-2 text-xs text-foreground outline-none focus:border-primary/50"
              >
                <option value="">All Statuses</option>
                <option value="open">{t('statOpen')}</option>
                <option value="verifying">{t('statVerifying')}</option>
                <option value="resolved">{t('statResolved')}</option>
              </select>
            </div>

            {/* Legend Panel */}
            <div className="pt-4 border-t border-border/60 space-y-2 text-xxs">
              <span className="font-bold text-[10px] text-muted-foreground uppercase block">Map Severity Legend</span>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Low Severity</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span>Medium</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                  <span>High</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  <span>Critical</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Map Canvas Container (Right) */}
          <div className="flex-1 h-full relative">
            {isLoading ? (
              <div className="absolute inset-0 bg-secondary/30 backdrop-blur-sm z-30 flex flex-col justify-center items-center space-y-2">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Plotting coordinates...</span>
              </div>
            ) : null}

            <MapContainer 
              center={[28.5355, 77.3910]} 
              zoom={14} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              
              {filteredIssues.map((issue) => (
                <Marker 
                  key={issue.id} 
                  position={[issue.location.lat, issue.location.lng]} 
                  icon={getMarkerIcon(issue.severity)}
                >
                  <Popup>
                    <div className="p-1 space-y-2 max-w-[200px] text-xs font-sans text-foreground">
                      <div className="flex justify-between items-center gap-1.5">
                        <span className="font-bold text-xxs uppercase bg-secondary px-1.5 py-0.2 rounded border border-border/80 text-muted-foreground truncate">
                          {issue.category}
                        </span>
                        <StatusBadge status={issue.status} />
                      </div>
                      
                      <h4 className="font-extrabold text-foreground leading-tight line-clamp-2 mt-1">
                        {issue.title}
                      </h4>
                      
                      <p className="text-[10px] text-muted-foreground leading-snug line-clamp-2 mt-0.5">
                        {issue.location.address}
                      </p>

                      <div className="flex justify-between items-center pt-2 border-t border-border/50">
                        <SeverityBadge severity={issue.severity} />
                        <Link 
                          to={`/issues/${issue.id}`}
                          className="text-primary font-bold hover:underline text-[10px]"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
