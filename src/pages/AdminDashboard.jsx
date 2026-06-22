import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/locales/LanguageContext';
import { useGetIssues, useResolveIssue } from '@/hooks/useIssues';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { StatusBadge, SeverityBadge } from '@/components/ui/Badge';
import { 
  Building2, Hammer, ShieldAlert, CheckCircle2, 
  MapPin, Clock, Edit, FileText, UserCheck, AlertTriangle 
} from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { data: issues = [], isLoading } = useGetIssues();
  const resolveMutation = useResolveIssue();

  // Active inspector states
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [department, setDepartment] = useState("");
  const [resolutionContent, setResolutionContent] = useState("");
  const [resolutionPhoto, setResolutionPhoto] = useState("");
  const [isResolving, setIsResolving] = useState(false);

  const selectedIssue = issues.find(i => i.id === selectedIssueId);

  // Stats calculation
  const totalOpen = issues.filter(i => i.status === 'open').length;
  const totalVerifying = issues.filter(i => i.status === 'verifying').length;
  const totalResolved = issues.filter(i => i.status === 'resolved').length;

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    if (!selectedIssue || !resolutionContent.trim()) return;

    resolveMutation.mutate({
      issueId: selectedIssue.id,
      adminName: `Officer Amit (PWD Noida)`,
      resolutionData: {
        content: resolutionContent,
        image: resolutionPhoto || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80"
      }
    }, {
      onSuccess: () => {
        setSelectedIssueId(null);
        setResolutionContent("");
        setResolutionPhoto("");
        setIsResolving(false);
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in pb-12">
        {/* Header */}
        <div className="space-y-1 border-b border-border/60 pb-4">
          <h1 className="font-display font-black text-2xl text-foreground flex items-center space-x-2">
            <Building2 className="h-7 w-7 text-primary animate-pulse" />
            <span>Municipal Dispatch Control Room</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Review community issues, coordinate local work departments (PWD, Sanitation, Water board), and upload resolution certificates.
          </p>
        </div>

        {/* Admin Quick Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card border border-border p-5 rounded-2xl shadow-premium flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-xxs font-bold text-muted-foreground uppercase">Unassigned Reports</p>
              <h3 className="text-xl font-extrabold text-foreground">{isLoading ? "..." : totalOpen}</h3>
            </div>
            <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-500">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="bg-card border border-border p-5 rounded-2xl shadow-premium flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-xxs font-bold text-muted-foreground uppercase">Verifying Sweeps</p>
              <h3 className="text-xl font-extrabold text-foreground">{isLoading ? "..." : totalVerifying}</h3>
            </div>
            <div className="bg-purple-500/10 p-2.5 rounded-xl text-purple-500">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="bg-card border border-border p-5 rounded-2xl shadow-premium flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-xxs font-bold text-muted-foreground uppercase">Resolved / Closed</p>
              <h3 className="text-xl font-extrabold text-foreground">{isLoading ? "..." : totalResolved}</h3>
            </div>
            <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left list of issues (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground">Municipal Registry Feed</h3>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map(n => (
                  <div key={n} className="bg-card border border-border rounded-2xl h-24 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {issues.map(issue => (
                  <div
                    key={issue.id}
                    onClick={() => {
                      setSelectedIssueId(issue.id);
                      setDepartment("");
                      setResolutionContent("");
                      setResolutionPhoto("");
                      setIsResolving(false);
                    }}
                    className={`bg-card border rounded-2xl p-5 shadow-premium hover:border-primary/50 cursor-pointer transition-all flex justify-between items-center gap-4 ${
                      selectedIssueId === issue.id ? 'ring-2 ring-primary border-transparent' : 'border-border/80'
                    }`}
                  >
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="text-xxs font-bold bg-secondary px-2 py-0.5 rounded border border-border text-muted-foreground">
                          {issue.category}
                        </span>
                        <SeverityBadge severity={issue.severity} />
                        <StatusBadge status={issue.status} />
                      </div>
                      <h4 className="font-bold text-sm text-foreground truncate">{issue.title}</h4>
                      <p className="text-xxs text-muted-foreground flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-0.5 text-primary/70 shrink-0" />
                        <span className="truncate">{issue.location.address.split(',')[0]}</span>
                      </p>
                    </div>

                    <div className="shrink-0 text-right space-y-1">
                      <p className="text-xxs font-semibold text-primary">{issue.upvotes.length} upvotes</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(issue.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Action panel (2 cols) */}
          <div className="lg:col-span-2">
            {!selectedIssue ? (
              <div className="bg-card/50 border border-dashed border-border rounded-3xl p-12 text-center text-muted-foreground h-72 flex flex-col items-center justify-center space-y-2 shadow-premium">
                <Building2 className="h-8 w-8 text-primary/50" />
                <p className="text-xs">Select an issue from the registry to open dispatch and resolution workflows.</p>
              </div>
            ) : (
              <div className="bg-card border border-border/80 rounded-3xl p-6 shadow-premium space-y-6 animate-fade-in-up">
                
                {/* Header info */}
                <div className="space-y-1.5 border-b border-border/60 pb-3">
                  <span className="text-xxs font-extrabold text-primary uppercase tracking-widest">DISPATCH & RESOLUTION CONSOLE</span>
                  <h3 className="font-display font-black text-sm text-foreground leading-snug">{selectedIssue.title}</h3>
                  <div className="flex justify-between items-center text-xxs text-muted-foreground">
                    <span>Address: {selectedIssue.location.address.split(',')[0]}</span>
                    <span>Status: <strong>{selectedIssue.status.toUpperCase()}</strong></span>
                  </div>
                </div>

                {/* Details view */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Reporter Details</span>
                  <div className="bg-secondary/40 rounded-xl p-3 border border-border/40 text-xxs leading-relaxed">
                    <p><strong>Name</strong>: {selectedIssue.reporter.name}</p>
                    <p><strong>Description</strong>: {selectedIssue.description}</p>
                    {selectedIssue.verifications.length > 0 && (
                      <p className="text-primary font-bold mt-1.5 flex items-center">
                        <UserCheck className="h-3.5 w-3.5 mr-0.5 shrink-0" />
                        <span>Verified by {selectedIssue.verifications[0].verifierName}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Resolving Toggle Form */}
                {selectedIssue.status === 'resolved' ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl p-4 text-xs font-semibold text-center flex flex-col items-center justify-center space-y-1">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                    <span>Ticket Closed & Resolved</span>
                    <p className="text-xxs text-muted-foreground font-normal mt-1">Resolution description has been dispatched to citizen.</p>
                  </div>
                ) : !isResolving ? (
                  <div className="space-y-4">
                    {/* Department allocation selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Assign Dispatch Crew</label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full bg-secondary/60 rounded-xl border border-border px-3 py-2 text-xs text-foreground outline-none focus:border-primary/50"
                      >
                        <option value="">Choose Department</option>
                        <option value="PWD">Noida PWD (Road repairs)</option>
                        <option value="Jal Board">Noida Jal Board (Water pipes)</option>
                        <option value="Electricity">Noida Power Corp (Streetlights)</option>
                        <option value="Sanitation">Noida Waste Disposal (Garbage)</option>
                      </select>
                    </div>

                    {/* Quick Assign confirmation */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!department) return alert("Select department first!");
                        alert(`Dispatched crew from ${department}! (Simulation)`);
                      }}
                      className="w-full bg-secondary text-foreground text-xs font-bold py-2.5 rounded-xl border border-border hover:bg-secondary/80 flex items-center justify-center space-x-1"
                    >
                      <Hammer className="h-4 w-4 shrink-0" />
                      <span>Dispatch Field Crew</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsResolving(true)}
                      className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 rounded-xl shadow-premium flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                      <span>Resolve Complaint</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResolveSubmit} className="space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Submit Resolution Proof</span>
                      <button 
                        type="button" 
                        onClick={() => setIsResolving(false)}
                        className="text-xxs text-muted-foreground hover:text-foreground hover:underline"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Resolution Content */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Resolution Notes</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Detail the work done: e.g. pothole filled using hot asphalt mix..."
                        value={resolutionContent}
                        onChange={(e) => setResolutionContent(e.target.value)}
                        className="w-full bg-secondary/60 rounded-xl border border-border px-3.5 py-2 text-xs text-foreground outline-none resize-none focus:border-primary/50"
                      />
                    </div>

                    {/* Resolution Photo URL */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Proof Image URL (Optional)</label>
                      <input
                        type="text"
                        placeholder="Paste repair photo URL"
                        value={resolutionPhoto}
                        onChange={(e) => setResolutionPhoto(e.target.value)}
                        className="w-full bg-secondary/60 rounded-xl border border-border px-3.5 py-2 text-xs text-foreground outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={resolveMutation.isPending}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl shadow-premium flex items-center justify-center space-x-1"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Complete Resolution Certificate</span>
                    </button>
                  </form>
                )}

              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
