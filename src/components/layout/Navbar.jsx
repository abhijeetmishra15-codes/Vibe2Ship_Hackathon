import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useTranslation } from '@/locales/LanguageContext';
import { useNotificationStore } from '@/store/useNotificationStore';
import { 
  Bell, Sun, Moon, Languages, Menu, Shield, 
  Award, X, Check, MapPin, ChevronDown 
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { user, role, setRole } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { t, language, setLanguage } = useTranslation();
  const { notifications, unreadCount, fetchNotifications, markAllRead } = useNotificationStore();
  
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setShowRoleMenu(false);
    navigate(newRole === 'admin' ? '/admin' : newRole === 'verifier' ? '/verify' : '/dashboard');
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    markAllRead();
  };

  return (
    <nav className="glass-nav sticky top-0 z-[9999]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <button 
              onClick={onToggleSidebar}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground md:hidden mr-2 focus:outline-none"
              aria-label="Toggle Sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-tr from-primary to-emerald-400 p-2 rounded-lg flex items-center justify-center text-white shadow-premium">
                <Shield className="h-6 w-6" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                {t('logo')}
              </span>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowRoleMenu(!showRoleMenu);
                  setShowNotifMenu(false);
                  setShowProfileMenu(false);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5 text-primary text-xs font-semibold hover:bg-primary/10 transition-all duration-200"
              >
                <span>{role.toUpperCase()}</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-premium bg-card border border-border p-1.5 z-[9999] animate-fade-in">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border mb-1.5">
                    {t('roleLabel')}
                  </div>
                  <button
                    onClick={() => handleRoleChange('citizen')}
                    className={`flex items-center justify-between w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-secondary transition-colors ${role === 'citizen' ? 'text-primary font-bold' : 'text-foreground'}`}
                  >
                    <span>Citizen</span>
                    {role === 'citizen' && <Check className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('verifier')}
                    className={`flex items-center justify-between w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-secondary transition-colors ${role === 'verifier' ? 'text-primary font-bold' : 'text-foreground'}`}
                  >
                    <span>Verifier</span>
                    {role === 'verifier' && <Check className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className={`flex items-center justify-between w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-secondary transition-colors ${role === 'admin' ? 'text-primary font-bold' : 'text-foreground'}`}
                  >
                    <span>Municipal Admin</span>
                    {role === 'admin' && <Check className="h-3.5 w-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground focus:bg-transparent active:bg-transparent hover:bg-secondary/40 transition-all outline-none"
              title="Toggle Language"
            >
              <div className="flex items-center space-x-1">
                <Languages className="h-5 w-5" />
                <span className="text-xs font-bold uppercase">{language}</span>
              </div>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground focus:bg-transparent active:bg-transparent hover:bg-secondary/40 transition-all outline-none"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications Tray */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowRoleMenu(false);
                  setShowProfileMenu(false);
                }}
                className={`p-2 rounded-lg text-muted-foreground hover:text-foreground focus:bg-transparent active:bg-transparent relative transition-all outline-none ${showNotifMenu ? 'bg-transparent' : 'hover:bg-secondary/40'}`}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background animate-pulse" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl shadow-premium bg-card border border-border py-2 z-[9999] animate-fade-in-up">
                  <div className="flex justify-between items-center px-4 py-2 border-b border-border">
                    <h3 className="font-bold text-sm">{t('notifications')}</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead} 
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        {t('markAllRead')}
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                        {t('noNotifications')}
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => {
                            setShowNotifMenu(false);
                            if (notif.issueId) navigate(`/issues/${notif.issueId}`);
                          }}
                          className={`px-4 py-3 hover:bg-secondary/80 border-b border-border/40 last:border-0 cursor-pointer transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}
                        >
                          <div className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-xs text-foreground">{notif.title}</h4>
                              <p className="text-xxs text-muted-foreground mt-0.5">{notif.description}</p>
                              <span className="text-[10px] text-muted-foreground/70 mt-1 block">
                                {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowRoleMenu(false);
                  setShowNotifMenu(false);
                }}
                className={`flex items-center space-x-2 p-1 rounded-full focus:outline-none transition-all active:bg-transparent focus:bg-transparent ${showProfileMenu ? 'bg-transparent' : 'hover:bg-secondary/40'}`}
              >
                <img
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/10"
                  src={user.avatar}
                  alt={user.name}
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-premium bg-card border border-border py-2 z-[9999] animate-fade-in">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{t('navProfile')}</p>
                    <p className="font-black text-sm text-foreground truncate mt-1">{user.name}</p>
                    <p className="text-xxs text-muted-foreground truncate">{user.email}</p>
                    {role === 'citizen' && (
                      <div className="flex items-center space-x-1 mt-2.5 text-primary font-bold text-[10px] bg-primary/10 px-2 py-0.5 rounded-md w-fit border border-primary/20">
                        <Award className="h-3.5 w-3.5 text-primary animate-pulse" />
                        <span>{user.points} XP</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2 space-y-0.5">
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="block px-3 py-2 text-xs font-semibold rounded-lg text-foreground hover:bg-secondary transition-colors"
                    >
                      {t('navProfile')}
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setShowProfileMenu(false)}
                      className="block px-3 py-2 text-xs font-semibold rounded-lg text-foreground hover:bg-secondary transition-colors"
                    >
                      {t('dashTitle')}
                    </Link>
                  </div>
                  <div className="border-t border-border p-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/auth');
                      }}
                      className="block w-full text-left px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      {t('logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
