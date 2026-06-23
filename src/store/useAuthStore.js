import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { getProfile, createProfile } from '@/services/profile';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  role: 'citizen',
  loading: true,
  loadingProfile: false,

  setUser: async (supabaseUser) => {
    if (!supabaseUser) {
      set({ user: null, profile: null, role: 'citizen', loading: false, loadingProfile: false });
      return;
    }

    set({ loading: true, loadingProfile: true });
    const currentLoadingId = supabaseUser.id;

    const metadata = supabaseUser.user_metadata || {};
    const localPointsKey = `ch_points_${supabaseUser.id}`;
    const storedPoints = localStorage.getItem(localPointsKey);
    const points = storedPoints ? parseInt(storedPoints, 10) : 240;

    let profile;
    try {
      // 1. Attempt to get profile
      profile = await getProfile(supabaseUser.id);
      
      // 2. Defensive handling: If profile does not exist, create it automatically
      if (!profile) {
        profile = await createProfile(supabaseUser);
      }
    } catch (err) {
      console.error('Error loading/creating profile in setUser:', err);
      // Fallback: create mock profile in memory if Supabase has issues, avoiding crash
      profile = {
        id: supabaseUser.id,
        full_name: metadata.name || supabaseUser.email.split('@')[0],
        role: 'citizen',
        created_at: new Date().toISOString()
      };
    }

    // Verify session/user is still current to avoid race conditions
    const sessionRes = await supabase.auth.getSession().catch(() => null);
    const activeUserId = sessionRes?.data?.session?.user?.id;
    if (activeUserId !== currentLoadingId) {
      // Stale invocation, user has changed or logged out
      return;
    }

    const activeRole = profile?.role || 'citizen';

    set({
      user: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: profile?.full_name || metadata.name || supabaseUser.email.split('@')[0],
        avatar: metadata.avatar || DEFAULT_AVATAR,
        points: points,
        role: activeRole
      },
      profile: profile,
      role: activeRole,
      loading: false,
      loadingProfile: false
    });
  },

  addPoints: (points) => {
    set((state) => {
      if (!state.user) return {};
      const newPoints = state.user.points + points;
      localStorage.setItem(`ch_points_${state.user.id}`, newPoints.toString());
      return {
        user: { ...state.user, points: newPoints }
      };
    });
  },

  setLoading: (isLoading) => set({ loading: isLoading }),
  setLoadingProfile: (isLoadingProfile) => set({ loadingProfile: isLoadingProfile })
}));
