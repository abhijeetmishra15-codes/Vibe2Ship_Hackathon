
import { useGetLeaderboard } from '@/hooks/useIssues';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Trophy, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function Leaderboard() {
  const { data: leaderboard = [], isLoading } = useGetLeaderboard();

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-amber-500 text-white border-amber-400';
    if (rank === 2) return 'bg-slate-300 text-slate-800 border-slate-200';
    if (rank === 3) return 'bg-amber-600 text-white border-amber-500';
    return 'bg-secondary text-muted-foreground border-border';
  };

  const getBadgeIconColor = (badgeName) => {
    switch (badgeName) {
      case 'Pothole Buster': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Green Guardian': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Elite Verifier': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'Civic Star': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
        {/* Header */}
        <div className="space-y-1 border-b border-border/60 pb-4">
          <h1 className="font-display font-black text-2xl text-foreground flex items-center space-x-2">
            <Trophy className="h-7 w-7 text-amber-500 animate-bounce" />
            <span>Civic Leaderboard</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Top contributing citizens and verifiers in Noida District. Earn XP points by reporting issues and auditing claims.
          </p>
        </div>

        {/* Podium Layout for Top 3 (Mocked) */}
        {!isLoading && leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 items-end pt-8 pb-4 max-w-lg mx-auto text-center">
            {/* Rank 2 */}
            <div className="space-y-3 order-1">
              <div className="relative inline-block">
                <img 
                  src={leaderboard[1].avatar} 
                  alt={leaderboard[1].name} 
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-300 mx-auto" 
                />
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-800 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-white">2</span>
              </div>
              <Card className="rounded-t-2xl rounded-b-none p-3 h-28 shadow-premium border-b-0">
                <p className="font-bold text-xs text-foreground truncate">{leaderboard[1].name.split(" ")[0]}</p>
                <p className="text-primary text-xs font-extrabold mt-1">{leaderboard[1].points} XP</p>
                <p className="text-[9px] text-muted-foreground mt-2">{leaderboard[1].reports} reports</p>
              </Card>
            </div>

            {/* Rank 1 */}
            <div className="space-y-3 order-2">
              <div className="relative inline-block">
                <img 
                  src={leaderboard[0].avatar} 
                  alt={leaderboard[0].name} 
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-400 mx-auto" 
                />
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border border-white">1</span>
              </div>
              <Card variant="primary" className="rounded-t-3xl rounded-b-none p-4 h-36 shadow-premium relative border-b-0">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Hero
                </div>
                <p className="font-black text-sm text-foreground truncate mt-1">{leaderboard[0].name.split(" ")[0]}</p>
                <p className="text-primary text-sm font-black mt-0.5">{leaderboard[0].points} XP</p>
                <p className="text-[10px] text-muted-foreground mt-2">{leaderboard[0].reports} reports</p>
              </Card>
            </div>

            {/* Rank 3 */}
            <div className="space-y-3 order-3">
              <div className="relative inline-block">
                <img 
                  src={leaderboard[2].avatar} 
                  alt={leaderboard[2].name} 
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-amber-600 mx-auto" 
                />
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-white">3</span>
              </div>
              <Card className="rounded-t-2xl rounded-b-none p-3 h-24 shadow-premium border-b-0">
                <p className="font-bold text-xs text-foreground truncate">{leaderboard[2].name.split(" ")[0]}</p>
                <p className="text-primary text-xs font-extrabold mt-1">{leaderboard[2].points} XP</p>
                <p className="text-[9px] text-muted-foreground mt-1">{leaderboard[2].reports} reports</p>
              </Card>
            </div>
          </div>
        )}

        {/* Full Rankings List Table */}
        <Card className="rounded-3xl shadow-premium overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-secondary/20">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground">Community Leaderboard Standings</h3>
          </div>

          {isLoading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Fetching rankings...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs text-foreground">
                <thead className="bg-secondary/40 border-b border-border/60 text-[10px] uppercase font-bold text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 w-16">Rank</th>
                    <th scope="col" className="px-6 py-3.5">Contributor</th>
                    <th scope="col" className="px-6 py-3.5 text-center">Score (XP)</th>
                    <th scope="col" className="px-6 py-3.5 text-center">Reports</th>
                    <th scope="col" className="px-6 py-3.5 text-center">Audits</th>
                    <th scope="col" className="px-6 py-3.5 hidden md:table-cell">Badges Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {leaderboard.map((row) => (
                    <tr key={row.rank} className="hover:bg-secondary/20 transition-colors">
                      {/* Rank */}
                      <td className="px-6 py-4 font-bold text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full border font-black text-xxs ${getRankBadgeColor(row.rank)}`}>
                          {row.rank}
                        </span>
                      </td>
                      
                      {/* Avatar & Name */}
                      <td className="px-6 py-4 font-semibold">
                        <div className="flex items-center space-x-3">
                          <img src={row.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                          <div className="flex flex-col">
                            <span className="truncate">{row.name}</span>
                            <span className="text-[10px] text-muted-foreground capitalize">{row.role}</span>
                          </div>
                        </div>
                      </td>
                      
                      {/* Points */}
                      <td className="px-6 py-4 font-extrabold text-primary text-center">
                        {row.points}
                      </td>

                      {/* Reports */}
                      <td className="px-6 py-4 text-muted-foreground text-center">
                        {row.reports}
                      </td>

                      {/* Verifications */}
                      <td className="px-6 py-4 text-muted-foreground text-center">
                        {row.verifications}
                      </td>

                      {/* Badges */}
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {row.badges.map((b, idx) => (
                            <span 
                              key={idx} 
                              className={`text-[9px] font-bold px-2 py-0.5 rounded border ${getBadgeIconColor(b)}`}
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
