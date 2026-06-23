import { create } from 'zustand';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

export const useAuthStore = create((set) => ({
  user: null,
  role: 'citizen',
  loading: true,

  setRole: (roleName) => {
    set((state) => {
      if (state.user) {
        return {
          role: roleName,
          user: { ...state.user, role: roleName }
        };
      }
      return { role: roleName };
    });
  },

  setUser: (supabaseUser) => {
    if (!supabaseUser) {
      set({ user: null, role: 'citizen', loading: false });
      return;
    }

    const metadata = supabaseUser.user_metadata || {};
    const localPointsKey = `ch_points_${supabaseUser.id}`;
    const storedPoints = localStorage.getItem(localPointsKey);
    const points = storedPoints ? parseInt(storedPoints, 10) : 240;

    set((state) => {
      const activeRole = state.role || 'citizen';
      return {
        user: {
          id: supabaseUser.id,
          email: supabaseUser.email,
          name: metadata.name || supabaseUser.email.split('@')[0],
          avatar: metadata.avatar || DEFAULT_AVATAR,
          points: points,
          role: activeRole
        },
        role: activeRole,
        loading: false
      };
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

  setLoading: (isLoading) => set({ loading: isLoading })
}));
