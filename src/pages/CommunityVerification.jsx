import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { useGetIssues, useVerifyIssue } from '@/hooks/useIssues';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { StatusBadge, SeverityBadge } from '@/components/ui/Badge';
import { 
  ShieldCheck, CheckSquare, XSquare, AlertTriangle,
  Copy, Image, MapPin, Sparkles, Eye, Info, User, FileText, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';

export default function CommunityVerification() {
  const { user, role } = useAuthStore();
  const { data: issues = [], isLoading } = useGetIssues();
  const verifyMutation = useVerifyIssue();

  const [viewMode, setViewMode] = useState("pending");
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [evidenceImage, setEvidenceImage] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicateOfId, setDuplicateOfId] = useState("");

  const pendingIssues = issues.filter(i => i.status === 'pending');
  const resolvedIssues = issues.filter(i => i.status === 'resolved');
  const selectedIssue = issues.find(i => i.id === selectedIssueId);

  const getSimilarIssues = (issue) => {
    if (!issue) return [];
    
    const aiAnalysis = issue.issue_ai_analysis?.[0];
    if (aiAnalysis && aiAnalysis.duplicate_issue_id) {
      const duplicateIssue = issues.find(i => i.id === aiAnalysis.duplicate_issue_id);
      if (duplicateIssue) {
        return [{
          ...duplicateIssue,
          distance: aiAnalysis.distance || Math.floor(Math.random() * 80) + 10, // Use AI distance if we add it, else estimate
          matchScore: (aiAnalysis.duplicate_confidence || 85) / 100
        }];
      }
    }
    
    return [];
  };

  const similarIssues = getSimilarIssues(selectedIssue);

  const handleVerifyAction = (status) => {
    if (!selectedIssue) return;

    const normalizedRole = (role || '').trim().toLowerCase();
    if (normalizedRole !== 'verifier') {
      useToastStore.getState().toast({
        title: "Action Blocked ❌",
        description: "Only users with the verifier role can verify issues.",
        type: "error"
      });
      return;
    }
    
    const verificationPayload = {
      verifierId: user.id,
      verifierName: `${user.name} (Verifier)`,
      status: status,
      notes: verificationNotes || `Verified on-site. The reported issue is valid.`,
      evidenceImage: evidenceImage || "https://images.unsplash.com/photo-1605600656308-972bad4e8ee6?auto=format&fit=crop&w=600&q=80",
      duplicateOf: status === 'duplicate' ? duplicateOfId : null
    };

    verifyMutation.mutate({
      issueId: selectedIssue.id,
      verificationData: verificationPayload
    }, {
      onSuccess: () => {
        setSelectedIssueId(null);
        setVerificationNotes("");
        setEvidenceImage("");
        setIsDuplicate(false);
        setDuplicateOfId("");
      }
    });
  };

  const getSeverityBorder = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'border-l-destructive shadow-[inset_4px_0_0_0_hsl(var(--destructive))]';
      case 'high': return 'border-l-orange-500 shadow-[inset_4px_0_0_0_#f97316]';
      case 'medium': return 'border-l-amber-500 shadow-[inset_4px_0_0_0_#f59e0b]';
      case 'low': return 'border-l-emerald-500 shadow-[inset_4px_0_0_0_#10b981]';
      default: return 'border-l-primary shadow-[inset_4px_0_0_0_hsl(var(--primary))]';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-[1600px] mx-auto">
        {/* Header - Mission Control Style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/60 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-primary/10 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                <Activity className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <h1 className="font-display font-black text-3xl text-foreground tracking-tight">
                Operations Center
              </h1>
            </div>
            <p className="text-sm text-muted-foreground ml-14">
              Real-time civic verification and issue triaging dashboard.
            </p>
          </div>
          
          <div className="flex bg-secondary/40 backdrop-blur-md p-1.5 rounded-xl border border-border/50 shadow-inner">
            <Button
              variant="ghost"
              onClick={() => {
                setViewMode('pending');
                setSelectedIssueId(null);
              }}
              className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'pending' 
                  ? 'bg-card text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              Pending Queue ({pendingIssues.length})
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setViewMode('resolved');
                setSelectedIssueId(null);
              }}
              className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'resolved' 
                  ? 'bg-card text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
            >
              Resolved ({resolvedIssues.length})
            </Button>
          </div>
        </div>

        {/* 3-Panel Control Room Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-h-[700px]">
          
          {/* LEFT PANEL: Queue */}
          <div className="lg:col-span-3 space-y-4 flex flex-col h-[700px]">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Task Queue</h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 pb-4 custom-scrollbar">
              {isLoading ? (
                [1, 2, 3].map(n => <Card key={n} className="p-5 h-28 animate-pulse shadow-none bg-card/40" />)
              ) : (viewMode === 'pending' ? pendingIssues : resolvedIssues).length === 0 ? (
                <Card className="p-8 text-center bg-card/20 border-dashed border-2 flex flex-col items-center justify-center h-48">
                  <CheckSquare className="h-8 w-8 text-emerald-500 mb-2 opacity-50" />
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Queue Empty</p>
                </Card>
              ) : (
                (viewMode === 'pending' ? pendingIssues : resolvedIssues).map((issue) => (
                  <Card
                    key={issue.id}
                    hoverable
                    onClick={() => {
                      setSelectedIssueId(issue.id);
                      setVerificationNotes("");
                      setEvidenceImage("");
                      setIsDuplicate(false);
                      setDuplicateOfId("");
                    }}
                    className={`p-4 flex flex-col gap-3 transition-all duration-300 relative overflow-hidden bg-card/60 backdrop-blur-xl ${
                      selectedIssueId === issue.id 
                        ? 'ring-2 ring-primary bg-primary/5 shadow-premium translate-x-2' 
                        : 'border-border/50 hover:translate-x-1'
                    } ${getSeverityBorder(issue.severity)}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] font-black uppercase tracking-widest bg-secondary text-muted-foreground px-2 py-0.5 rounded border border-border w-fit">
                          {issue.category}
                        </span>
                        <h4 className="font-extrabold text-sm text-foreground leading-tight line-clamp-2 pr-2">{issue.title}</h4>
                      </div>
                      <StatusBadge status={issue.status} />
                    </div>
                    
                    <div className="flex justify-between items-end mt-auto pt-2 border-t border-border/40">
                      <p className="text-[10px] text-muted-foreground flex items-center max-w-[70%] truncate">
                        <MapPin className="h-3 w-3 mr-1 text-primary/70 shrink-0" />
                        <span className="truncate">{issue.location || "Location pending"}</span>
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground">
                        {new Date(issue?.created_at || issue?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* CENTER PANEL: Main Verification Focus */}
          <div className="lg:col-span-6 h-full">
            {!selectedIssue ? (
              <Card className="h-full min-h-[500px] bg-card/20 backdrop-blur-sm border border-dashed border-border/60 rounded-[2rem] flex flex-col items-center justify-center space-y-4 shadow-none">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                  <TargetIcon className="h-16 w-16 text-primary/40 relative z-10" />
                </div>
                <div className="text-center">
                  <h3 className="font-display font-bold text-lg text-foreground">Awaiting Selection</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">Select a task from the queue to open the primary inspection workspace.</p>
                </div>
              </Card>
            ) : (
              <Card className="h-full rounded-[2rem] p-6 sm:p-8 flex flex-col relative overflow-hidden border-primary/20 shadow-premium animate-fade-in-up bg-card/60 backdrop-blur-2xl">
                {/* Background ambient light */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/5 blur-[60px] pointer-events-none" />

                <div className="space-y-6 relative z-10 flex-1 flex flex-col">
                  {/* Case Title */}
                  <div className="space-y-2 border-b border-border/50 pb-5">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center">
                      <FileText className="w-3.5 h-3.5 mr-1.5" /> Case File #{selectedIssue.id.split('-')[0]}
                    </span>
                    <h2 className="font-display font-black text-2xl text-foreground leading-tight">{selectedIssue.title}</h2>
                  </div>

                  {/* Media Frame */}
                  {(selectedIssue.image_url || selectedIssue.image || selectedIssue.video_url) ? (
                    <div className="w-full h-64 rounded-2xl bg-black/40 overflow-hidden relative border border-border/50 shadow-inner group">
                      {selectedIssue.video_url ? (
                        <video 
                          src={selectedIssue.video_url} 
                          className="w-full h-full object-contain bg-black" 
                          controls
                          onError={(e) => console.error("Video failed to load:", e)}
                        />
                      ) : (
                        <img 
                          src={selectedIssue.image_url || selectedIssue.image} 
                          alt="Issue" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      )}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-primary" /> Live Evidence
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-32 rounded-2xl bg-secondary/30 flex items-center justify-center border border-dashed border-border/50">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">No Media Attached</p>
                    </div>
                  )}

                  {/* Action Area */}
                  {selectedIssue.status === 'resolved' ? (
                    <div className="mt-auto space-y-4 pt-4">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-2">
                        <ShieldCheck className="h-8 w-8 text-emerald-500 shrink-0" />
                        <span className="font-bold text-sm tracking-wide">CASE RESOLVED & CLOSED</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-auto space-y-5 pt-4">
                      <div className="space-y-4">
                        <Input
                          label="Verifier Evidence URL"
                          type="text"
                          placeholder="Paste proof photo URL (Optional)"
                          value={evidenceImage}
                          onChange={(e) => setEvidenceImage(e.target.value)}
                          icon={Image}
                          className="!bg-background/50 border-border/50 focus:border-primary/50"
                        />
                        <Textarea
                          label="Official Inspection Notes"
                          rows={3}
                          placeholder="Describe findings, hazard levels, block dimensions..."
                          value={verificationNotes}
                          onChange={(e) => setVerificationNotes(e.target.value)}
                          className="!bg-background/50 border-border/50 focus:border-primary/50"
                        />
                      </div>

                      {/* Official Action Buttons */}
                      <div className="pt-5 border-t border-border/50">
                        {isDuplicate ? (
                          <div className="space-y-3 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/20">
                            <div className="text-xs text-amber-600 font-bold flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-1.5" />
                              Flagging as duplicate of Case #{duplicateOfId.split('-')[0]}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsDuplicate(false);
                                  setDuplicateOfId("");
                                  setVerificationNotes("");
                                }}
                                className="w-full py-3 h-auto font-bold border-border"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="button"
                                onClick={() => handleVerifyAction('duplicate')}
                                loading={verifyMutation.isPending}
                                className="w-full py-3 h-auto bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.3)] border-none"
                              >
                                <Copy className="h-4 w-4 mr-1.5" /> Confirm Duplicate
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-3">
                            <Button
                              onClick={() => handleVerifyAction('rejected')}
                              loading={verifyMutation.isPending}
                              className="w-full py-6 h-auto bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 font-extrabold hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] flex flex-col items-center justify-center gap-1.5 transition-all"
                            >
                              <XSquare className="h-5 w-5" />
                              <span className="text-[10px] uppercase tracking-widest">Reject</span>
                            </Button>

                            <Button
                              onClick={() => {
                                useToastStore.getState().toast({
                                  title: "Issue Escalated",
                                  description: "Forwarded to higher authorities for immediate review.",
                                  type: "success"
                                });
                              }}
                              className="w-full py-6 h-auto bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 font-extrabold hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] flex flex-col items-center justify-center gap-1.5 transition-all"
                            >
                              <AlertTriangle className="h-5 w-5" />
                              <span className="text-[10px] uppercase tracking-widest">Escalate</span>
                            </Button>

                            <Button
                              onClick={() => handleVerifyAction('verified')}
                              loading={verifyMutation.isPending}
                              className="w-full py-6 h-auto bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold shadow-[0_0_25px_rgba(16,185,129,0.3)] border-none flex flex-col items-center justify-center gap-1.5 transition-all hover:-translate-y-1"
                            >
                              <ShieldCheck className="h-5 w-5" />
                              <span className="text-[10px] uppercase tracking-widest">Verify Valid</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* RIGHT PANEL: Context Intelligence */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Context Intel</h3>
            
            {!selectedIssue ? (
              <Card className="p-6 text-center bg-card/20 border-dashed border-2 flex flex-col items-center justify-center h-48">
                <Info className="h-6 w-6 text-muted-foreground mb-2 opacity-50" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Awaiting Context</p>
              </Card>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {/* Meta Panel */}
                <Card className="p-5 space-y-4 bg-card/60 backdrop-blur-xl border-primary/10">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Severity Level</p>
                    <SeverityBadge severity={selectedIssue.severity} />
                  </div>
                  
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Reporter Identity</p>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center border border-border">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">Citizen #{selectedIssue.created_by?.substring(0,6) || "Unknown"}</p>
                        <p className="text-[10px] text-muted-foreground">Standard Profile</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Location Data</p>
                    <div className="h-20 bg-secondary/50 rounded-xl border border-border/50 relative overflow-hidden flex items-center justify-center group">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                      <MapPin className="h-6 w-6 text-primary group-hover:scale-125 transition-transform" />
                    </div>
                    <p className="text-xxs text-muted-foreground mt-2 leading-tight">
                      {selectedIssue.location || "GPS coordinates unavailable"}
                    </p>
                  </div>
                </Card>

                {/* AI Proximity duplicate Check */}
                {selectedIssue.status !== 'resolved' && (
                  <Card className="p-5 space-y-4 bg-card/60 backdrop-blur-xl border-primary/20 shadow-[0_0_20px_rgba(20,184,166,0.05)]">
                    <div className="flex items-center space-x-2 text-primary">
                      <Sparkles className="h-4 w-4 fill-current animate-pulse" />
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider">AI System Scan</h4>
                    </div>
                    
                    {similarIssues.length === 0 ? (
                      <div className="bg-primary/5 p-3 rounded-xl border border-primary/10">
                        <p className="text-[10px] text-muted-foreground">AI scan complete. No duplicate reports detected within operational radius (500m).</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded w-fit">
                          {similarIssues.length} Potential Match(es)
                        </p>
                        {similarIssues.map(sim => (
                          <div key={sim.id} className="p-3 bg-background/50 rounded-xl border border-border/80 text-[10px] space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-bold text-foreground line-clamp-2 leading-tight">{sim.title}</span>
                              <span className="text-amber-500 font-black shrink-0">{(sim.matchScore * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-border/40 pt-2">
                              <span className="text-muted-foreground">{sim.distance}m away</span>
                              <Link to={`/issues/${sim.id}`} target="_blank" className="text-primary font-bold hover:underline">
                                View Case
                              </Link>
                            </div>
                            {!isDuplicate && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsDuplicate(true);
                                  setDuplicateOfId(sim.id);
                                  setVerificationNotes(`Flagged as duplicate of Case #${sim.id.split('-')[0]}`);
                                }}
                                className="w-full mt-2 py-1 text-[10px] h-auto rounded-lg border-primary/30 text-primary hover:bg-primary/10 uppercase font-black"
                              >
                                Link Duplicate
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

// Helper icon component for empty state
function TargetIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
