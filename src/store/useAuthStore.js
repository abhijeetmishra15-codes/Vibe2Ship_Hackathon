import { create } from 'zustand';

const ROLES = {
  citizen: {
    id: "user-cit-1",
    name: "Aarav Sharma",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    points: 240,
    role: "citizen",
    email: "aarav.sharma@civic.in"
  },
  verifier: {
    id: "user-ver-1",
    name: "Vikram Singh",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    points: 130,
    role: "verifier",
    email: "vikram.singh@verify.org"
  },
  admin: {
    id: "user-admin-1",
    name: "Officer Amit Kumar",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80",
    points: 999,
    role: "admin",
    email: "a.kumar@noida.gov.in"
  }
};

export const useAuthStore = create((set) => ({
  user: ROLES.citizen,
  role: "citizen",
  setRole: (roleName) => {
    if (ROLES[roleName]) {
      set({ role: roleName, user: ROLES[roleName] });
    }
  },
  addPoints: (points) => {
    set((state) => {
      const updatedUser = { ...state.user, points: state.user.points + points };
      return { user: updatedUser };
    });
  }
}));
