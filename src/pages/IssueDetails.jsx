import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useGetIssueById, useAddComment, useUpvoteIssue } from '@/hooks/useIssues';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  ArrowLeft, ThumbsUp, MessageSquare, MapPin, 
  Calendar, CheckCircle, AlertTriangle, Send, User, Bot, Sparkles
} from 'lucide-react';
import { StatusBadge, SeverityBadge, DepartmentBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { getDefaultIssueImage } from '@/lib/utils';

export default function IssueDetails() {
  const { id } = useParams();
  const { user, role } = useAuthStore();
  
  const { data: issue, isLoading, error } = useGetIssueById(id);
  const addCommentMutation = useAddComment();
  const upvoteMutation = useUpvoteIssue();
  
  const [newCommentText, setNewCommentText] = useState("");

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse pb-16">
          <div className="h-4 w-32 bg-muted/60 rounded mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="rounded-3xl overflow-hidden shadow-none border-border/40 flex flex-col">
                <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-secondary/80" />
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-6 w-24 bg-muted/60 rounded-full" />
                    <div className="h-6 w-24 bg-muted/60 rounded-full" />
                  </div>
                  <div className="h-8 bg-muted/70 rounded w-3/4 mb-4" />
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-muted/50 rounded w-full" />
                    <div className="h-3 bg-muted/50 rounded w-11/12" />
                    <div className="h-3 bg-muted/50 rounded w-4/5" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                    <div className="h-10 bg-muted/40 rounded w-full" />
                    <div className="h-10 bg-muted/40 rounded w-full" />
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-border/40 mt-4">
                    <div className="h-10 w-32 bg-muted/60 rounded-xl" />
                    <div className="h-4 w-28 bg-muted/50 rounded" />
                  </div>
                </div>
              </Card>
            </div>
            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <Card className="rounded-3xl p-6 h-[400px] bg-card border-border/40 flex flex-col">
                <div className="h-6 w-32 bg-muted/60 rounded mb-6" />
                <div className="flex-1 space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
                  {[1, 2].map(n => (
                    <div key={n} className="flex gap-4">
                      <div className="h-10 w-10 bg-muted/60 rounded-full shrink-0" />
                      <div className="space-y-2 flex-1 pt-1">
                        <div className="h-4 w-2/3 bg-muted/60 rounded" />
                        <div className="h-3 w-full bg-muted/40 rounded" />
                        <div className="h-3 w-4/5 bg-muted/40 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !issue) {
    return (
      <DashboardLayout>
        <Card className="border-destructive/20 bg-destructive/10 p-8 text-center max-w-md mx-auto space-y-4 shadow-none">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto" />
          <h3 className="font-bold text-base">Issue Not Found</h3>
          <p className="text-xs text-muted-foreground">This report may have been deleted, flagged as spam, or the URL is invalid.</p>
          <Link to="/issues" className="inline-block">
            <Button variant="primary">
              Back to Feed
            </Button>
          </Link>
        </Card>
      </DashboardLayout>
    );
  }

  const comments = issue?.issue_comments || [];
  const verifications = issue?.issue_verifications || [];
  const upvotes = issue?.issue_votes || [];

  const isUpvoted = upvotes.some(v => v.user_id === user?.id);

  const aiDataArray = issue?.issue_ai_analysis;
  const aiData = Array.isArray(aiDataArray) ? aiDataArray[0] : aiDataArray;

  const handleUpvote = () => {
    if (!user?.id) return;
    upvoteMutation.mutate({ issueId: issue.id, userId: user.id });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    addCommentMutation.mutate({
      issueId: issue.id,
      commentData: {
        content: newCommentText
      }
    }, {
      onSuccess: () => {
        setNewCommentText("");
      }
    });
  };

  // Construct timeline dynamically
  const timeline = [
    {
      status: issue.status === 'open' ? 'open' : 'pending',
      title: "Issue Reported",
      description: `Reported by user ${issue.profiles?.full_name || "Anonymous User"}.`,
      date: issue.created_at,
    }
  ];

  verifications.forEach((v) => {
    let details = {};
    try {
      details = JSON.parse(v.comment);
    } catch (e) {
      details = { notes: v.comment, status: 'verified' };
    }

    // Only process verifications (status 'verified', 'verifying', 'rejected', 'duplicate')
    if (details.status === 'verified' || details.status === 'verifying' || details.status === 'rejected' || details.status === 'duplicate') {
      timeline.push({
        status: details.status === 'verifying' ? 'verified' : details.status,
        title: details.status === "verified" || details.status === "verifying" ? "Verified by Verifier" : "Rejected by Verifier",
        description: details.notes,
        date: v.created_at,
        updatedBy: v.profiles?.full_name || "Anonymous User"
      });
    }
  });

  // If resolved, add resolution event from resolution_reports
  if (issue.resolution_reports && issue.resolution_reports[0]) {
    const report = issue.resolution_reports[0];
    timeline.push({
      status: "resolved",
      title: "Issue Resolved",
      description: report.resolution_message,
      date: report.created_at,
      updatedBy: report.profiles?.full_name || "Admin"
    });
  }

  // Sort timeline chronologically
  timeline.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Extract resolution proof
  const resolutionUpdate = issue.resolution_reports && issue.resolution_reports[0] ? {
    adminName: issue.resolution_reports[0].profiles?.full_name || "Official Resolver",
    notes: issue.resolution_reports[0].resolution_message,
    image: issue.resolution_reports[0].proof_image_url,
    date: issue.resolution_reports[0].created_at
  } : null;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in pb-16">
        {/* Back Link */}
        <Link 
          to="/issues" 
          className="inline-flex items-center space-x-1.5 text-xs text-muted-foreground hover:text-primary font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Issues Feed</span>
        </Link>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column (Left 2 spans) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image & Title Card */}
            <Card className="rounded-3xl shadow-premium overflow-hidden">
              <div className="flex flex-col w-full">
                {/* Primary Media: Image */}
                <div className="relative w-full">
                  <img 
                    src={issue.image_url || getDefaultIssueImage(issue.category)} 
                    alt={issue.title} 
                    className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-background/95 backdrop-blur text-foreground font-semibold text-xs px-3 py-1 rounded-xl shadow-sm border border-border/20">
                    {issue.category || "General"}
                  </span>
                </div>

                {/* Secondary Media: Video */}
                {issue.video_url && (
                  <div className="w-full px-4 sm:px-6 pt-6 pb-0">
                    <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-border/10 bg-black/5 dark:bg-white/5">
                      <video 
                        src={issue.video_url} 
                        className="w-full max-h-[400px] object-contain"
                        controls
                        playsInline
                        preload="metadata"
                        onError={(e) => console.error("IssueDetails video failed to load:", e)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={issue.status} />
                    {aiData?.ai_severity ? (
                       <SeverityBadge severity={aiData.ai_severity} label={`AI: ${aiData.ai_severity}`} />
                    ) : (
                       <SeverityBadge severity={issue.severity || "medium"} />
                    )}
                    {aiData?.responsible_department && (
                       <DepartmentBadge department={aiData.responsible_department} />
                    )}
                  </div>
                </div>

                <h1 className="font-display font-black text-xl sm:text-2xl text-foreground">
                  {issue.title}
                </h1>

                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {issue.description}
                </p>

                {/* AI Intelligence Card */}
                {aiData && (
                  <div className="mt-6 rounded-2xl bg-primary/5 border border-primary/20 p-5 space-y-4">
                    <div className="flex items-center gap-2 text-primary font-display font-bold">
                      <Sparkles className="h-5 w-5" />
                      <span>Civic AI Intelligence</span>
                    </div>
                    
                    {aiData.ai_summary && (
                      <p className="text-sm font-semibold text-foreground/90 italic">
                        "{aiData.ai_summary}"
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="block text-muted-foreground font-semibold mb-1">AI Category</span>
                        <span className="bg-background px-2 py-1 rounded text-foreground inline-flex items-center gap-1 border border-border/50">
                          <Bot className="h-3 w-3" /> {aiData.ai_category || "Uncategorized"}
                        </span>
                      </div>
                      {aiData.estimated_resolution_time && (
                        <div>
                          <span className="block text-muted-foreground font-semibold mb-1">Estimated Time</span>
                          <span className="text-foreground">{aiData.estimated_resolution_time}</span>
                        </div>
                      )}
                      {aiData.suggested_action && (
                        <div className="col-span-2">
                          <span className="block text-muted-foreground font-semibold mb-1">Suggested Action</span>
                          <span className="text-foreground">{aiData.suggested_action}</span>
                        </div>
                      )}
                      {aiData.image_analysis && (
                        <div className="col-span-2 mt-2 p-3 bg-background rounded-lg border border-border/50">
                          <span className="block text-muted-foreground font-semibold mb-1">Vision Analysis</span>
                          <span className="text-muted-foreground leading-relaxed">{aiData.image_analysis}</span>
                        </div>
                      )}
                      {(aiData.fake_report_score > 0 || aiData.duplicate_issue_id) && (
                        <div className="col-span-2 flex flex-col gap-2 mt-2">
                          {aiData.fake_report_score > 50 && (
                            <div className="text-rose-500 bg-rose-500/10 px-3 py-2 rounded-lg border border-rose-500/20 font-semibold flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Suspicious Report Score: {aiData.fake_report_score}/100
                            </div>
                          )}
                          {aiData.duplicate_issue_id && (
                            <div className="text-amber-500 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20 font-semibold flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Possible Duplicate (Confidence: {aiData.duplicate_confidence}%)
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Location / Reporter Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50 text-xs">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-muted-foreground uppercase text-[10px]">Location Pin</p>
                      <p className="text-foreground mt-0.5">{issue.location || "Unknown Location"}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-muted-foreground uppercase text-[10px]">Reported Date</p>
                      <p className="text-foreground mt-0.5">
                        {new Date(issue.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border/40 font-display">
                  <Button
                    onClick={handleUpvote}
                    disabled={upvoteMutation.isPending}
                    variant={isUpvoted ? 'primary' : 'ghost'}
                    className={`group flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-300 active:scale-95 border h-auto ${
                      upvoteMutation.isPending ? 'opacity-70 cursor-not-allowed scale-95' : ''
                    } ${
                      isUpvoted 
                        ? '!text-primary !bg-primary/10 border-primary/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary border-transparent'
                    }`}
                  >
                    <ThumbsUp className={`h-4.5 w-4.5 mr-2 transition-transform duration-300 group-hover:scale-110 group-active:scale-90 ${isUpvoted ? 'fill-current' : ''}`} />
                    <span>{upvotes.length} Upvotes</span>
                  </Button>
                  <div className="text-xxs text-muted-foreground">
                    Created By: <strong>{issue.profiles?.full_name || "Anonymous User"}</strong>
                  </div>
                </div>
              </div>
            </Card>

            {/* Resolution Updates (If Resolved) */}
            {issue.status === 'resolved' && resolutionUpdate && (
              <Card className="!bg-emerald-500/5 border-emerald-500/20 rounded-3xl p-6 space-y-4 shadow-none">
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-6 w-6" />
                  <h3 className="font-display font-bold text-base">Official Resolution Proof</h3>
                </div>
                <p className="text-xs text-foreground leading-relaxed bg-card/50 p-3.5 rounded-xl border border-border/40">
                  {resolutionUpdate.notes}
                </p>
                {resolutionUpdate.image && (
                  <div className="h-64 rounded-2xl overflow-hidden border border-emerald-500/10">
                    <img 
                      src={resolutionUpdate.image} 
                      alt="Resolution proof" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="text-xxs text-muted-foreground flex justify-between">
                  <span>Resolved by: <strong>{resolutionUpdate.adminName || "Admin"}</strong></span>
                  <span>Date: {new Date(resolutionUpdate.date).toLocaleString()}</span>
                </div>
              </Card>
            )}

            {/* Discussion / Comments Section */}
            <Card className="rounded-3xl p-6 space-y-6">
              <h3 className="font-display font-bold text-base text-foreground flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span>Discussion ({comments.length})</span>
              </h3>

              {/* Add Comment Input */}
              <form onSubmit={handleCommentSubmit} className="flex items-start space-x-3">
                <img 
                  src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"} 
                  alt={user?.name || "User"} 
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="flex-1 flex items-center bg-secondary/60 rounded-2xl border border-border/80 px-4 py-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <Input
                    type="text"
                    placeholder="Write a supportive comment, offer to help, or ask questions..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="!bg-transparent !border-0 focus:!ring-0 focus:!border-transparent !py-1.5"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    className="p-1.5 text-primary hover:bg-primary/10 rounded-xl transition-all h-auto bg-transparent hover:bg-transparent"
                    disabled={!newCommentText.trim() || addCommentMutation.isPending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>

              {/* Comment Thread List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-6 text-xxs text-muted-foreground">
                    No comments yet. Start the conversation!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3 text-xs leading-normal">
                      <img 
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" 
                        alt={comment.profiles?.full_name || "User"} 
                        className="w-8 h-8 rounded-full object-cover shrink-0" 
                      />
                      <div className="bg-secondary/40 rounded-2xl p-3 border border-border/40 flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-foreground">{comment.profiles?.full_name || "Unknown User"}</span>
                          <span className="text-[10px] text-muted-foreground/60">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {comment.profiles?.role && comment.profiles.role.trim().toLowerCase() !== 'citizen' && (
                          <span className="inline-block text-[9px] font-bold text-primary uppercase bg-primary/10 px-1.5 py-0.2 rounded-md mb-1.5">
                            {comment.profiles.role}
                          </span>
                        )}
                        <p className="text-muted-foreground text-xxs">{comment.comment}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Timeline / Sidebar Column (Right 1 span) */}
          <div className="space-y-6">
            {/* Status Timeline Widget */}
            <Card className="rounded-3xl p-6 space-y-4">
              <h3 className="font-display font-bold text-base text-foreground">Timeline Status</h3>
              
              <div className="flow-root">
                <ul className="-mb-8">
                  {timeline.map((event, eventIdx) => (
                    <li key={eventIdx}>
                      <div className="relative pb-8">
                        {eventIdx !== timeline.length - 1 && (
                          <span 
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border" 
                            aria-hidden="true" 
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-card ${
                              event.status === 'resolved' 
                                ? 'bg-green-500 text-white' 
                                : (event.status === 'verifying' || event.status === 'verified')
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-primary text-white'
                            }`}>
                              {event.status === 'resolved' ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 pt-1.5">
                            <p className="text-xs font-bold text-foreground">{event.title}</p>
                            <p className="text-xxs text-muted-foreground mt-0.5">{event.description}</p>
                            <span className="text-[9px] text-muted-foreground/60 mt-1 block">
                              {new Date(event.date).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Verifier Evidence Section (If verifies exist) */}
            {verifications.filter(v => {
              try {
                const status = JSON.parse(v.comment).status;
                return status === 'verified' || status === 'verifying' || status === 'rejected' || status === 'duplicate';
              } catch(e) {
                return true;
              }
            }).length > 0 && (
              <Card className="rounded-3xl p-6 space-y-4">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground">Verifier Audits</h3>
                {verifications.filter(v => {
                  try {
                    const status = JSON.parse(v.comment).status;
                    return status === 'verified' || status === 'verifying' || status === 'rejected' || status === 'duplicate';
                  } catch(e) {
                    return true;
                  }
                }).map((v, idx) => {
                  let details = {};
                  try {
                    details = JSON.parse(v.comment);
                  } catch (e) {
                    details = { notes: v.comment, status: 'verified', evidenceImage: null };
                  }
                  
                  return (
                    <div key={idx} className="space-y-2 border-b border-border/40 pb-3 last:border-0 last:pb-0">
                      <p className="text-xs font-semibold text-foreground">{v.profiles?.full_name || "Anonymous User"}</p>
                      <span className="inline-block text-[9px] font-bold uppercase text-emerald-500 bg-emerald-500/10 px-1.5 rounded">
                        {details.status || "verified"}
                      </span>
                      <p className="text-xxs text-muted-foreground italic">"{details.notes}"</p>
                      {details.evidenceImage && (
                        <div className="h-28 rounded-xl overflow-hidden mt-2">
                          <img src={details.evidenceImage} alt="Verifier Proof" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </Card>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
