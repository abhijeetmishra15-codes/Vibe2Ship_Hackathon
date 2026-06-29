import { useState } from 'react';
import { useGetIssues, useResolveIssue } from '@/hooks/useIssues';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { getDefaultIssueImage } from '@/lib/utils';
import { StatusBadge, SeverityBadge } from '@/components/ui/Badge';
import { 
  Building2, Hammer, ShieldAlert, CheckCircle2, 
  MapPin, Clock, UserCheck, Bot, Sparkles, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { useToastStore } from '@/store/useToastStore';

export default function AdminDashboard() {
  const { data: issues = [], isLoading } = useGetIssues();
  const resolveMutation = useResolveIssue();
  const toast = useToastStore((state) => state.toast);

  // Active inspector states
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [department, setDepartment] = useState("");
  const [resolutionContent, setResolutionContent] = useState("");
  const [resolutionPhoto, setResolutionPhoto] = useState("");
  const [resolutionFile, setResolutionFile] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [activeFilter, setActiveFilter] = useState("actionable");

  const displayIssues = (issues || []).filter(issue => {
    const status = (issue?.status || '').trim().toLowerCase();
    
    if (activeFilter === "unassigned") {
      return status === 'pending' || status === 'open';
    }
    if (activeFilter === "verifying") {
      return status === 'verified' || status === 'verifying';
    }
    if (activeFilter === "resolved") {
      return status === 'resolved';
    }
    
    // Default actionable filter
    if (status === 'rejected' || status === 'resolved') {
      return false;
    }
    return status === 'open' || status === 'pending' || status === 'verifying' || status === 'verified';
  });

  const selectedIssue = displayIssues.find(i => i.id === selectedIssueId);

  // Stats calculation
  const totalOpen = (issues || []).filter(i => i.status === 'pending' || i.status === 'open').length;
  const totalVerifying = (issues || []).filter(i => i.status === 'verified' || i.status === 'verifying').length;
  const totalResolved = (issues || []).filter(i => i.status === 'resolved').length;

  let totalFake = 0;
  let totalDuplicates = 0;
  
  (issues || []).forEach(issue => {
    const aiDataArray = issue.issue_ai_analysis;
    const aiData = Array.isArray(aiDataArray) ? aiDataArray[0] : aiDataArray;
    if (aiData) {
      if (aiData.fake_report_score > 50) totalFake++;
      if (aiData.duplicate_issue_id) totalDuplicates++;
    }
  });

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    if (!selectedIssue || !resolutionContent.trim()) return;

    resolveMutation.mutate({
      issueId: selectedIssue.id,
      adminName: `Officer Amit (PWD Noida)`,
      resolutionFile: resolutionFile,
      resolutionData: {
        content: resolutionContent,
        image: resolutionPhoto || getDefaultIssueImage(selectedIssue.category)
      }
    }, {
      onSuccess: () => {
        setSelectedIssueId(null);
        setResolutionContent("");
        setResolutionPhoto("");
        setResolutionFile(null);
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
          <Card 
            hoverable 
            onClick={() => setActiveFilter(activeFilter === 'unassigned' ? 'actionable' : 'unassigned')}
            className={`p-5 flex flex-row justify-between items-center cursor-pointer transition-all ${activeFilter === 'unassigned' ? 'ring-2 ring-primary bg-primary/5' : ''}`}
          >
            <div className="space-y-1">
              <p className="text-xxs font-bold text-muted-foreground uppercase">Unassigned Reports</p>
              <h3 className="text-xl font-extrabold text-foreground">{isLoading ? "..." : totalOpen}</h3>
            </div>
            <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-500">
              <Clock className="h-5 w-5" />
            </div>
          </Card>
          <Card 
            hoverable 
            onClick={() => setActiveFilter(activeFilter === 'verifying' ? 'actionable' : 'verifying')}
            className={`p-5 flex flex-row justify-between items-center cursor-pointer transition-all ${activeFilter === 'verifying' ? 'ring-2 ring-purple-500 bg-purple-500/5' : ''}`}
          >
            <div className="space-y-1">
              <p className="text-xxs font-bold text-muted-foreground uppercase">Verifying Sweeps</p>
              <h3 className="text-xl font-extrabold text-foreground">{isLoading ? "..." : totalVerifying}</h3>
            </div>
            <div className="bg-purple-500/10 p-2.5 rounded-xl text-purple-500">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </Card>
          <Card 
            hoverable 
            onClick={() => setActiveFilter(activeFilter === 'resolved' ? 'actionable' : 'resolved')}
            className={`p-5 flex flex-row justify-between items-center cursor-pointer transition-all ${activeFilter === 'resolved' ? 'ring-2 ring-emerald-500 bg-emerald-500/5' : ''}`}
          >
            <div className="space-y-1">
              <p className="text-xxs font-bold text-muted-foreground uppercase">Resolved / Closed</p>
              <h3 className="text-xl font-extrabold text-foreground">{isLoading ? "..." : totalResolved}</h3>
            </div>
            <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </Card>
        </div>

        {/* AI Insights Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="p-5 bg-rose-500/5 border border-rose-500/20 flex flex-row justify-between items-center relative overflow-hidden">
             <div className="space-y-1 relative z-10">
               <p className="text-xxs font-bold text-rose-500 uppercase flex items-center gap-1">
                 <AlertTriangle className="h-3 w-3" /> Suspicious Reports Blocked
               </p>
               <h3 className="text-xl font-extrabold text-foreground">{isLoading ? "..." : totalFake}</h3>
             </div>
             <div className="bg-rose-500/10 p-2.5 rounded-xl text-rose-500 relative z-10">
               <ShieldAlert className="h-5 w-5" />
             </div>
             <Bot className="absolute -bottom-4 -right-2 h-20 w-20 text-rose-500/5" />
          </Card>
          
          <Card className="p-5 bg-amber-500/5 border border-amber-500/20 flex flex-row justify-between items-center relative overflow-hidden">
             <div className="space-y-1 relative z-10">
               <p className="text-xxs font-bold text-amber-500 uppercase flex items-center gap-1">
                 <Sparkles className="h-3 w-3" /> Identified Duplicates
               </p>
               <h3 className="text-xl font-extrabold text-foreground">{isLoading ? "..." : totalDuplicates}</h3>
             </div>
             <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-500 relative z-10">
               <Building2 className="h-5 w-5" />
             </div>
             <Bot className="absolute -bottom-4 -right-2 h-20 w-20 text-amber-500/5" />
          </Card>
        </div>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left list of issues (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground">Municipal Registry Feed</h3>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map(n => (
                  <Card key={n} className="h-24 animate-pulse shadow-none" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {displayIssues.map(issue => (
                  <Card
                    key={issue.id}
                    hoverable
                    onClick={() => {
                      setSelectedIssueId(issue.id);
                      setDepartment("");
                      setResolutionContent("");
                      setResolutionPhoto("");
                      setIsResolving(false);
                    }}
                    className={`p-5 flex flex-row justify-between items-center gap-4 ${
                      selectedIssueId === issue.id ? 'ring-2 ring-primary border-transparent shadow-premium' : ''
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
                        <span className="truncate">{issue.location?.split(',')[0] || "Unknown"}</span>
                      </p>
                    </div>

                    <div className="shrink-0 text-right space-y-1">
                      <p className="text-xxs font-semibold text-primary">{(issue.issue_votes || []).length} upvotes</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(issue.created_at || issue.createdAt).toLocaleDateString()}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right Action panel (2 cols) */}
          <div className="lg:col-span-2">
            {!selectedIssue ? (
              <Card className="bg-card/50 border border-dashed border-border rounded-3xl p-12 text-center text-muted-foreground h-72 flex flex-col items-center justify-center space-y-2 shadow-none">
                <Building2 className="h-8 w-8 text-primary/50" />
                <p className="text-xs">Select an issue from the registry to open dispatch and resolution workflows.</p>
              </Card>
            ) : (
              <Card className="rounded-3xl p-6 space-y-6 animate-fade-in-up">
                
                {/* Header info */}
                <div className="space-y-1.5 border-b border-border/60 pb-3">
                  <span className="text-xxs font-extrabold text-primary uppercase tracking-widest">DISPATCH & RESOLUTION CONSOLE</span>
                  <h3 className="font-display font-black text-sm text-foreground leading-snug">{selectedIssue.title}</h3>
                  <div className="flex justify-between items-center text-xxs text-muted-foreground">
                    <span>Address: {selectedIssue.location?.split(',')[0] || "Unknown"}</span>
                    <span>Status: <strong>{selectedIssue.status?.toUpperCase()}</strong></span>
                  </div>
                </div>

                {/* Details view */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Reporter Details</span>
                  <div className="bg-secondary/40 rounded-xl p-3 border border-border/40 text-xxs leading-relaxed">
                    <p><strong>Reporter</strong>: {selectedIssue.profiles?.full_name || "Unknown User"}</p>
                    <p><strong>Description</strong>: {selectedIssue.description}</p>
                    {(selectedIssue.issue_verifications || []).length > 0 && (
                      <p className="text-primary font-bold mt-1.5 flex items-center">
                        <UserCheck className="h-3.5 w-3.5 mr-0.5 shrink-0" />
                        <span>Verifier: {selectedIssue.issue_verifications[0].profiles?.full_name || "Unknown User"}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Resolving Toggle Form */}
                {selectedIssue.status === 'resolved' ? (
                  <div className="space-y-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl p-4 text-xs font-semibold text-center flex flex-col items-center justify-center space-y-1">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                      <span>Ticket Closed & Resolved</span>
                      <p className="text-xxs text-muted-foreground font-normal mt-1">Resolution description has been dispatched to citizen.</p>
                    </div>
                    {selectedIssue.resolution_reports && selectedIssue.resolution_reports[0] && (
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl space-y-2 text-xs text-foreground">
                        <p className="font-bold text-[10px] text-emerald-600 uppercase tracking-wide">Resolution Report</p>
                        <p className="text-[10px] text-muted-foreground">
                          Resolved by: <strong>{selectedIssue.resolution_reports[0].profiles?.full_name || "Official Resolver"}</strong>
                        </p>
                        <p className="leading-relaxed bg-card/40 p-2.5 rounded-xl border border-border/40 text-xxs text-muted-foreground">
                          {selectedIssue.resolution_reports[0].resolution_message}
                        </p>
                        {selectedIssue.resolution_reports[0].proof_image_url && (
                          <div className="mt-2 rounded-lg overflow-hidden border border-border/40 max-h-32">
                            <img 
                              src={selectedIssue.resolution_reports[0].proof_image_url} 
                              alt="Proof" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        )}
                        <p className="text-[9px] text-muted-foreground text-right mt-1">
                          Date: {new Date(selectedIssue.resolution_reports[0].created_at).toLocaleString()}
                        </p>
                      </div>
                    )}
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
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        if (!department) {
                          toast({
                            title: "Select Department",
                            description: "Please choose a department first.",
                            type: "warning"
                          });
                          return;
                        }
                        toast({
                          title: "Crew Dispatched",
                          description: `Dispatched crew from ${department}! (Simulation)`,
                          type: "success"
                        });
                      }}
                      className="w-full py-2.5 h-auto space-x-1"
                    >
                      <Hammer className="h-4 w-4 shrink-0 mr-1.5" />
                      <span>Dispatch Field Crew</span>
                    </Button>

                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => setIsResolving(true)}
                      className="w-full py-2.5 h-auto space-x-1.5"
                    >
                      <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mr-1.5" />
                      <span>Resolve Complaint</span>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleResolveSubmit} className="space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Submit Resolution Proof</span>
                      <Button 
                        type="button" 
                        variant="ghost"
                        onClick={() => setIsResolving(false)}
                        className="text-xxs text-muted-foreground hover:text-foreground hover:underline p-0 h-auto bg-transparent hover:bg-transparent"
                      >
                        Cancel
                      </Button>
                    </div>

                    {/* Resolution Notes */}
                    <Textarea
                      label="Resolution Notes"
                      rows={3}
                      required
                      placeholder="Detail the work done: e.g. pothole filled using hot asphalt mix..."
                      value={resolutionContent}
                      onChange={(e) => setResolutionContent(e.target.value)}
                      className="!bg-secondary/60"
                    />

                    {/* Resolution Photo Upload */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Upload Proof Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setResolutionFile(e.target.files[0])}
                        className="w-full bg-secondary/60 rounded-xl border border-border px-3 py-2 text-xs text-foreground outline-none focus:border-primary/50"
                      />
                    </div>

                    {/* Resolution Photo URL */}
                    <Input
                      label="Proof Image URL (Optional - if not uploading)"
                      type="text"
                      placeholder="Paste repair photo URL"
                      value={resolutionPhoto}
                      onChange={(e) => setResolutionPhoto(e.target.value)}
                      className="!bg-secondary/60"
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      loading={resolveMutation.isPending}
                      className="w-full py-2.5 h-auto !bg-emerald-500 hover:!bg-emerald-600 border-transparent space-x-1"
                    >
                      {!resolveMutation.isPending && <CheckCircle2 className="h-4 w-4 mr-1.5" />}
                      <span>Complete Resolution Certificate</span>
                    </Button>
                  </form>
                )}

              </Card>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
