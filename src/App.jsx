import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/locales/LanguageContext';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ToastContainer } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import AppRoutes from '@/routes/AppRoutes';

// Import Leaflet styles to prevent distorted map views
import 'leaflet/dist/leaflet.css';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 10000,
      retry: false
    }
  }
});

function App() {
  const initTheme = useThemeStore(state => state.initTheme);
  const setUser = useAuthStore(state => state.setUser);
  const setLoading = useAuthStore(state => state.setLoading);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    let active = true;

    // Load initial session on startup / refresh
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (active) {
        setUser(session?.user ?? null);
      }
    }).catch(() => {
      if (active) {
        setUser(null);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <ToastContainer />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
