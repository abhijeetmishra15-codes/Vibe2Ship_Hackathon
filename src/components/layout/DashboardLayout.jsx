import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import CopilotDrawer from '@/components/ai/CopilotDrawer';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('realtime-profiles-sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        (payload) => {
          // Invalidate queries so that dashboards (issues, verification status, and leaderboard) update automatically
          queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
          queryClient.invalidateQueries({ queryKey: ['issues'] });

          // If it is the current user's profile, update their points in the auth store
          if (payload.new && payload.new.id === user.id) {
            const newPoints = payload.new.points;
            const authState = useAuthStore.getState();
            if (typeof newPoints === 'number' && authState.user && authState.user.points !== newPoints) {
              authState.setPoints(newPoints);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Viewport */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto bg-background px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Global Floating AI Copilot */}
      <CopilotDrawer />
    </div>
  );
}
