import { create } from 'zustand';

export const useToastStore = create((set) => ({
  toasts: [],
  
  toast: ({ title, description, type = 'success', duration = 4000 }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    set((state) => ({
      toasts: [...state.toasts, { id, title, description, type, duration }]
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      }, duration);
    }
  },

  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  }
}));
