import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useGetIssues, useVerifyIssue } from '@/hooks/useIssues';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { StatusBadge, SeverityBadge } from '@/components/ui/Badge';
import { 
  ShieldCheck, CheckSquare, XSquare, 
  Copy, Image, MapPin, Sparkles, Eye, Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';

export default function CommunityVerification() {
  const { user } = useAuthStore();
  const { data: issues = [], isLoading } = useGetIssues();
  const verifyMutation = useVerifyIssue();

  // Selected issue to review
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [evidenceImage, setEvidenceImage] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [duplicateOfId, setDuplicateOfId] = useState("");

  const pendingIssues = issues.filter(i => i.status === 'open' || i.status === 'verifying');
  const selectedIssue = issues.find(i => i.id === selectedIssueId);

  // Find similar issues for the duplicate detection UI simulation
  const getSimilarIssues = (issue) => {
    if (!issue) return [];
    return issues.filter(i => 
      i.id !== issue.id && 
      i.status !== 'rejected' &&
      (i.category === issue.category || i.title.toLowerCase().includes(issue.category.toLowerCase()))
    ).map(i => ({
      ...i,
      distance: Math.floor(Math.random() * 80) + 10, // Simulated distance 10-90 meters
      matchScore: issue.category === i.category ? 0.94 : 0.75
    }));
  };

  const similarIssues = getSimilarIssues(selectedIssue);

  const handleVerifyAction = (status) => {
    if (!selectedIssue) return;
    
    const verificationPayload = {
      verifierId: user.id,
      verifierName: `${user.name} (Verifier)`,
      status: status, // "verified", "rejected", "duplicate"
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

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="space-y-1 border-b border-border/60 pb-4">
          <h1 className="font-display font-black text-2xl text-foreground flex items-center space-x-2">
            <ShieldCheck className="h-7 w-7 text-primary" />
            <span>Community Verification Workspace</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Verify nearby issues, flag duplicate complaints using AI proximity matching, and upload inspection evidence.
          </p>
        </div>

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left: Pending Issues List (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Pending Reports ({pendingIssues.length})
            </h3>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map(n => (
                  <Card key={n} className="p-5 h-28 animate-pulse shadow-none" />
                ))}
              </div>
            ) : pendingIssues.length === 0 ? (
              <Card className="p-12 text-center shadow-premium">
                <CheckSquare className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                <h4 className="font-bold text-sm">All Clear!</h4>
                <p className="text-xs text-muted-foreground">There are no pending reports awaiting verification in your area.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingIssues.map((issue) => (
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
                    className={`p-5 flex justify-between items-start gap-4 ${
                      selectedIssueId === issue.id ? 'ring-2 ring-primary border-transparent shadow-premium' : ''
                    }`}
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="text-xxs font-bold bg-secondary px-2 py-0.5 rounded-md border border-border text-muted-foreground">
                          {issue.category}
                        </span>
                        <SeverityBadge severity={issue.severity} />
                        <StatusBadge status={issue.status} />
                      </div>
                      <h4 className="font-bold text-sm text-foreground truncate">{issue.title}</h4>
                      <p className="text-xxs text-muted-foreground flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-0.5 text-primary/70 shrink-0" />
                        <span className="truncate">{issue.location || "Unknown location"}</span>
                      </p>
                    </div>
                    {(issue.image_url || issue.image) && (
                      <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden shrink-0">
                        <img src={issue.image_url || issue.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right: Inspection Card (2 cols) */}
          <div className="lg:col-span-2">
            {!selectedIssue ? (
              <Card className="bg-card/50 border border-dashed border-border rounded-3xl p-12 text-center text-muted-foreground h-72 flex flex-col items-center justify-center space-y-2 shadow-none">
                <Info className="h-8 w-8 text-primary/50" />
                <p className="text-xs">Select an issue from the list to start verification details check.</p>
              </Card>
            ) : (
              <Card className="rounded-3xl p-6 space-y-6 animate-fade-in-up">
                
                {/* Header */}
                <div className="space-y-1">
                  <span className="text-xxs font-extrabold text-primary uppercase tracking-widest">INSPECTION WORKSPACE</span>
                  <h3 className="font-display font-black text-base text-foreground leading-tight">{selectedIssue.title}</h3>
                  <p className="text-xxs text-muted-foreground">Reporter ID: {selectedIssue.created_by || "Unknown"}</p>
                </div>

                {/* AI Proximity Duplicate Checker */}
                <Card variant="primary" className="p-4 space-y-3 rounded-2xl shadow-none">
                  <div className="flex items-center space-x-2 text-primary">
                    <Sparkles className="h-4.5 w-4.5 fill-current animate-pulse" />
                    <h4 className="font-display font-bold text-xs">AI Duplicate Detection</h4>
                  </div>
                  {similarIssues.length === 0 ? (
                    <p className="text-xxs text-muted-foreground">AI scan complete. No duplicate reports found within 500 meters.</p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xxs text-muted-foreground">
                        AI identified <strong>{similarIssues.length}</strong> similar report nearby:
                      </p>
                      {similarIssues.map(sim => (
                        <Card key={sim.id} className="p-3 rounded-xl border border-border/80 text-[10px] space-y-1.5 shadow-none">
                          <div className="flex justify-between items-center font-bold">
                            <span className="truncate max-w-[120px] text-foreground">{sim.title}</span>
                            <span className="text-rose-500">{(sim.matchScore * 100).toFixed(0)}% Match</span>
                          </div>
                          <div className="flex justify-between text-muted-foreground text-xxs">
                            <span>Distance: {sim.distance} meters</span>
                            <Link to={`/issues/${sim.id}`} target="_blank" className="text-primary font-bold flex items-center">
                              View <Eye className="h-3 w-3 ml-0.5" />
                            </Link>
                          </div>
                          {!isDuplicate && (
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => {
                                setIsDuplicate(true);
                                setDuplicateOfId(sim.id);
                                setVerificationNotes(`Flagged as duplicate of reported issue: ${sim.id}`);
                              }}
                              className="w-full mt-1 py-1 text-xxs h-auto rounded-md"
                            >
                              Link as Duplicate
                            </Button>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Evidence Photo URL Simulation */}
                <Input
                  label="Verifier Evidence Image URL"
                  type="text"
                  placeholder="Paste inspect proof photo URL (Optional)"
                  value={evidenceImage}
                  onChange={(e) => setEvidenceImage(e.target.value)}
                  icon={Image}
                  className="!bg-secondary/60"
                />

                {/* Notes */}
                <Textarea
                  label="Verification Notes"
                  rows={3}
                  placeholder="Describe findings, sidewalk status, street dimensions, block hazards..."
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="!bg-secondary/60"
                />

                {/* Action CTA Buttons */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  {isDuplicate ? (
                    <div className="space-y-2">
                      <div className="text-xxs text-amber-500 font-bold bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                        This issue is linked to Duplicate: <strong>{duplicateOfId}</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            setIsDuplicate(false);
                            setDuplicateOfId("");
                            setVerificationNotes("");
                          }}
                          className="w-full py-2.5 h-auto"
                        >
                          Cancel Link
                        </Button>
                        <Button
                          type="button"
                          variant="primary"
                          onClick={() => handleVerifyAction('duplicate')}
                          loading={verifyMutation.isPending}
                          className="w-full py-2.5 h-auto !bg-amber-500 hover:!bg-amber-600 border-transparent"
                        >
                          <Copy className="h-4 w-4 mr-1.5" />
                          <span>Flag Duplicate</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => handleVerifyAction('rejected')}
                        loading={verifyMutation.isPending}
                        variant="danger"
                        className="w-full py-2.5 h-auto !bg-rose-500/10 hover:!bg-rose-500/20 !text-rose-500 border border-rose-500/20 shadow-none animate-none"
                      >
                        <XSquare className="h-4.5 w-4.5 shrink-0 mr-1" />
                        <span>Reject Spam</span>
                      </Button>
                      <Button
                        onClick={() => handleVerifyAction('verified')}
                        loading={verifyMutation.isPending}
                        variant="primary"
                        className="w-full py-2.5 h-auto"
                      >
                        <ShieldCheck className="h-4.5 w-4.5 shrink-0 mr-1" />
                        <span>Verify Issue</span>
                      </Button>
                    </div>
                  )}
                </div>

              </Card>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
