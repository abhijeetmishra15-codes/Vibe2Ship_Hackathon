
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useTranslation } from '@/locales/LanguageContext';
import { 
  LayoutDashboard, Map, Trophy, User, 
  BarChart3, ShieldAlert, PlusCircle, List, 
  X, Award
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Sidebar({ isOpen, onClose }) {
  const { user, role, loadingProfile } = useAuthStore();
  const { t } = useTranslation();

  if (loadingProfile || !user) {
    return null;
  }

  const normalizedRole = (role || '').trim().toLowerCase();

  // Define links based on user roles
  const getNavLinks = () => {
    const common = [
      { to: '/issues', label: t('navFeed'), icon: List },
      { to: '/map', label: t('navMap'), icon: Map },
      { to: '/leaderboard', label: t('navLeaderboard'), icon: Trophy },
    ];

    if (normalizedRole === 'admin') {
      return [
        { to: '/admin', label: t('navAdmin'), icon: LayoutDashboard },
        { to: '/analytics', label: t('navAnalytics'), icon: BarChart3 },
        ...common,
        { to: '/profile', label: t('navProfile'), icon: User }
      ];
    }

    if (normalizedRole === 'verifier') {
      return [
        { to: '/dashboard', label: t('dashTitle'), icon: LayoutDashboard },
        { to: '/verify', label: t('navVerify'), icon: ShieldAlert },
        ...common,
        { to: '/profile', label: t('navProfile'), icon: User }
      ];
    }

    if (normalizedRole === 'citizen') {
      return [
        { to: '/dashboard', label: t('dashTitle'), icon: LayoutDashboard },
        { to: '/report', label: t('reportCTA'), icon: PlusCircle, highlight: true },
        ...common,
        { to: '/profile', label: t('navProfile'), icon: User }
      ];
    }

    // Defensive fallback for undefined or unrecognized role
    return [
      { to: '/dashboard', label: t('dashTitle'), icon: LayoutDashboard },
      ...common,
      { to: '/profile', label: t('navProfile'), icon: User }
    ];
  };

  const links = getNavLinks();

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 flex flex-col w-64 border-r border-primary/20 bg-card z-50 transform md:translate-x-0 md:static transition-transform duration-300 ease-in-out shadow-[4px_0_24px_rgba(34,197,94,0.15)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header (Only on mobile drawers) */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border md:hidden">
          <span className="font-display font-bold text-lg text-primary">{t('logo')}</span>
          <Button variant="ghost" onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Profile Summary */}
        <div className="px-6 py-6 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <img 
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20" 
              src={user.avatar} 
              alt={user.name} 
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-foreground truncate">{user.name}</p>
              <p className="text-xxs text-muted-foreground capitalize">{normalizedRole} role</p>
            </div>
          </div>

          {/* Citizen Gamification XP Mini-Widget */}
          {normalizedRole === 'citizen' && (
            <div className="mt-4 bg-primary/5 rounded-xl p-3 border border-primary/10">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-primary flex items-center space-x-1">
                  <Award className="h-3.5 w-3.5" />
                  <span>{t('gamificationBadge')}</span>
                </span>
                <span className="text-muted-foreground">{user.points} XP</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (user.points / 500) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                {500 - user.points} {t('pointsToNext')}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${link.highlight 
                    ? 'bg-gradient-to-r from-primary to-emerald-500 text-white hover:brightness-105 shadow-premium' 
                    : isActive 
                      ? 'bg-primary/10 text-primary font-semibold' 
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${link.highlight ? 'text-white' : ''}`} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-border/50 text-center">
          <p className="text-[10px] text-muted-foreground">© 2026 {t('logo')}</p>
          <p className="text-[9px] text-muted-foreground/60 mt-0.5">Hackathon Spec Build v1.0</p>
        </div>
      </aside>
    </>
  );
}
