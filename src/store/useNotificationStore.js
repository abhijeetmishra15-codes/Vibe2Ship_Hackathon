import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  
  fetchNotifications: async () => {
    const list = JSON.parse(localStorage.getItem("ch_notifications") || "[]");
    const unread = list.filter(n => !n.read).length;
    set({ notifications: list, unreadCount: unread });
  },
  
  markAllRead: async () => {
    const list = JSON.parse(localStorage.getItem("ch_notifications") || "[]");
    const updated = list.map(n => ({ ...n, read: true }));
    localStorage.setItem("ch_notifications", JSON.stringify(updated));
    set({ notifications: updated, unreadCount: 0 });
  },
  
  clearNotifications: async () => {
    localStorage.setItem("ch_notifications", JSON.stringify([]));
    set({ notifications: [], unreadCount: 0 });
  },
  
  triggerNotification: (title, description, type, issueId = null) => {
    const newNotification = {
      id: `n-${Date.now()}`,
      title,
      description,
      type,
      issueId,
      read: false,
      date: new Date().toISOString()
    };
    
    // Save to localStorage
    const current = JSON.parse(localStorage.getItem("ch_notifications") || "[]");
    current.unshift(newNotification);
    localStorage.setItem("ch_notifications", JSON.stringify(current));
    
    set((state) => {
      const list = [newNotification, ...state.notifications];
      return { notifications: list, unreadCount: state.unreadCount + 1 };
    });
  }
}));
