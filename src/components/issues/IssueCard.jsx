
// import { Link } from 'react-router-dom';
// import { useAuthStore } from '@/store/useAuthStore';
// import { useUpvoteIssue } from '@/hooks/useIssues';
// import { StatusBadge, SeverityBadge } from '@/components/ui/Badge';
// import { MessageSquare, ThumbsUp, MapPin, Eye, Calendar, UserCheck } from 'lucide-react';
// import { useTranslation } from '@/locales/LanguageContext';
// import { Button } from '@/components/ui/Button';
// import { Card, CardContent, CardFooter } from '@/components/ui/Card';

// export default function IssueCard({ issue }) {
//   const { user } = useAuthStore();
//   const { t } = useTranslation();
//   const upvoteMutation = useUpvoteIssue();

//   const isUpvoted = issue.upvotes.includes(user.id);

//   const handleUpvote = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     upvoteMutation.mutate({ issueId: issue.id, userId: user.id });
//   };

//   const getCategoryTranslation = (cat) => {
//     switch (cat) {
//       case 'Pothole': return t('catPothole');
//       case 'Garbage': return t('catGarbage');
//       case 'Water Leakage': return t('catWaterLeak');
//       case 'Streetlight': return t('catStreetlight');
//       case 'Sewer': return t('catSewer');
//       case 'Public Infrastructure': return t('catPublicInfra');
//       default: return cat;
//     }
//   };

//   const timeAgo = (dateString) => {
//     const date = new Date(dateString);
//     const seconds = Math.floor((new Date() - date) / 1000);
//     let interval = Math.floor(seconds / 31536000);

//     if (interval >= 1) return `${interval}y ago`;
//     interval = Math.floor(seconds / 2592000);
//     if (interval >= 1) return `${interval}m ago`;
//     interval = Math.floor(seconds / 86400);
//     if (interval >= 1) return `${interval}d ago`;
//     interval = Math.floor(seconds / 3600);
//     if (interval >= 1) return `${interval}h ago`;
//     interval = Math.floor(seconds / 60);
//     if (interval >= 1) return `${interval}m ago`;
//     return 'Just now';
//   };

//   return (
//     <Card variant="glass" hoverable className="h-full">
//       {/* Issue Image */}
//       <div className="relative h-48 w-full bg-secondary overflow-hidden">
//         <img 
//           src={issue.image} 
//           alt={issue.title} 
//           className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//           loading="lazy"
//         />
//         {/* Category Floating Tag */}
//         <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-md text-foreground font-semibold text-xs px-2.5 py-1 rounded-lg border border-border/20 shadow-sm">
//           {getCategoryTranslation(issue.category)}
//         </span>

//         {/* Verification Status Flag */}
//         {issue.verifications.length > 0 && (
//           <span className="absolute bottom-3 left-3 flex items-center space-x-1 bg-green-500 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
//             <UserCheck className="h-3 w-3" />
//             <span>{t('verified')}</span>
//           </span>
//         )}
//       </div>

//       {/* Content */}
//       <CardContent className="flex flex-col flex-1 p-5 pb-4">
//         {/* Status / Severity row */}
//         <div className="flex items-center justify-between mb-3">
//           <StatusBadge status={issue.status} />
//           <SeverityBadge severity={issue.severity} />
//         </div>

//         {/* Title */}
//         <Link to={`/issues/${issue.id}`} className="block group">
//           <h3 className="font-display font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-1">
//             {issue.title}
//           </h3>
//         </Link>

//         {/* Description */}
//         <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed flex-1">
//           {issue.description}
//         </p>

//         {/* Location / Date info */}
//         <div className="mt-4 pt-3 border-t border-border/40 space-y-1.5">
//           <div className="flex items-center text-xxs text-muted-foreground">
//             <MapPin className="h-3.5 w-3.5 mr-1 text-primary/70 shrink-0" />
//             <span className="truncate">{issue.location.address}</span>
//           </div>
//           <div className="flex items-center justify-between text-[10px] text-muted-foreground/80">
//             <div className="flex items-center space-x-1">
//               <img 
//                 src={issue.reporter.avatar} 
//                 alt={issue.reporter.name} 
//                 className="w-4.5 h-4.5 rounded-full object-cover" 
//               />
//               <span className="font-medium">{issue.reporter.name}</span>
//             </div>
//             <div className="flex items-center space-x-0.5">
//               <Calendar className="h-3 w-3" />
//               <span>{timeAgo(issue.createdAt)}</span>
//             </div>
//           </div>
//         </div>
//       </CardContent>

//       {/* Actions Footer */}
//       <CardFooter className="bg-secondary/40 border-t border-border/50 px-5 py-3 flex items-center justify-between mt-auto">
//         <Button
//           variant={isUpvoted ? 'primary' : 'ghost'}
//           onClick={handleUpvote}
//           disabled={upvoteMutation.isPending}
//           className={`flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all h-auto ${
//             isUpvoted 
//               ? 'text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20' 
//               : 'text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent'
//           }`}
//         >
//           <ThumbsUp className={`h-4 w-4 ${isUpvoted ? 'fill-current' : ''}`} />
//           <span>{issue.upvotes.length} {t('upvotes')}</span>
//         </Button>

//         <Link
//           to={`/issues/${issue.id}`}
//           className="flex items-center space-x-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-all px-2.5 py-1.5 rounded-lg hover:bg-secondary border border-transparent"
//         >
//           <MessageSquare className="h-4 w-4" />
//           <span>{issue.comments.length}</span>
//         </Link>

//         <Link
//           to={`/issues/${issue.id}`}
//           className="flex items-center space-x-1 text-xs font-bold text-primary hover:underline"
//         >
//           <span>View Details</span>
//           <Eye className="h-4 w-4" />
//         </Link>
//       </CardFooter>
//     </Card>
//   );
// }


import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useUpvoteIssue } from '@/hooks/useIssues';
import { StatusBadge, SeverityBadge } from '@/components/ui/Badge';
import { MessageSquare, ThumbsUp, MapPin, Eye, Calendar, UserCheck } from 'lucide-react';
import { useTranslation } from '@/locales/LanguageContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';

export default function IssueCard({ issue }) {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const upvoteMutation = useUpvoteIssue();
  const navigate = useNavigate();

  const upvotes = issue?.issue_votes || [];
  const comments = issue?.issue_comments || [];
  const verifications = issue?.issue_verifications || [];

  const isUpvoted = upvotes.some(v => v.user_id === user?.id);

  const handleUpvote = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user?.id) return;
    upvoteMutation.mutate({ issueId: issue.id, userId: user.id });
  };

  const getCategoryTranslation = (cat) => {
    switch (cat) {
      case 'Pothole': return t('catPothole');
      case 'Garbage': return t('catGarbage');
      case 'Water Leakage': return t('catWaterLeak');
      case 'Streetlight': return t('catStreetlight');
      case 'Sewer': return t('catSewer');
      case 'Public Infrastructure': return t('catPublicInfra');
      default: return cat;
    }
  };

  const timeAgo = (dateString) => {
    if (!dateString) return 'Unknown time';

    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval}y ago`;

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}m ago`;

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d ago`;

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h ago`;

    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}m ago`;

    return 'Just now';
  };

  return (
    <Card 
      variant="glass" 
      hoverable 
      className="h-full cursor-pointer"
      onClick={() => navigate(`/issues/${issue?.id}`)}
    >

      {/* IMAGE / VIDEO PREVIEW */}
      <div className="relative h-48 w-full bg-secondary overflow-hidden">
        {issue?.image_url || issue?.image || !issue?.video_url ? (
          <img
            src={issue?.image_url || issue?.image}
            alt={issue?.title || "Issue proof"}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            src={issue.video_url}
            className="w-full h-full object-cover"
            playsInline
            preload="metadata"
            muted
            onError={(e) => console.error("IssueCard video thumbnail failed to load:", e)}
          />
        )}

        <span className="absolute top-3 left-3 bg-background/90 text-xs px-2 py-1 rounded">
          {getCategoryTranslation(issue?.category)}
        </span>

        {verifications.length > 0 && (
          <span className="absolute bottom-3 left-3 flex items-center space-x-1 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded">
            <UserCheck className="h-3 w-3" />
            <span>{t('verified')}</span>
          </span>
        )}
      </div>

      {/* CONTENT */}
      <CardContent className="p-5">

        <div className="flex justify-between mb-2">
          <StatusBadge status={issue?.status} />
          <SeverityBadge severity={issue?.severity} />
        </div>

        <Link to={`/issues/${issue?.id}`} onClick={(e) => e.stopPropagation()}>
          <h3 className="font-bold">{issue?.title}</h3>
        </Link>

        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
          {issue?.description}
        </p>

        <div className="mt-4 space-y-2">

          <div className="flex items-center text-xs">
            <MapPin className="h-3 w-3 mr-1" />
            {issue?.location || "Unknown location"}
          </div>

          <div className="flex items-center justify-between text-[10px]">

            <span className="truncate max-w-[150px]">
              Created by: {issue?.profiles?.full_name || "Anonymous User"}
            </span>

            <span className="flex items-center gap-1 shrink-0">
              <Calendar className="h-3 w-3" />
              {timeAgo(issue?.created_at || issue?.createdAt)}
            </span>

          </div>
        </div>

      </CardContent>

      {/* FOOTER */}
      <CardFooter className="flex justify-between">

        <Button
          variant={isUpvoted ? "primary" : "ghost"}
          onClick={handleUpvote}
        >
          <ThumbsUp className={isUpvoted ? "fill-current" : ""} />
          {upvotes.length}
        </Button>

        <Link to={`/issues/${issue?.id}`} onClick={(e) => e.stopPropagation()}>
          <MessageSquare className="h-4 w-4" />
          {comments.length}
        </Link>

        <Link to={`/issues/${issue?.id}`} onClick={(e) => e.stopPropagation()}>
          <Eye className="h-4 w-4" />
        </Link>

      </CardFooter>

    </Card>
  );
}