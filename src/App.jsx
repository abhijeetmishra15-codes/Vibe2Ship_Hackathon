import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/locales/LanguageContext';
import { useThemeStore } from '@/store/useThemeStore';
import { ToastContainer } from '@/components/ui/Toast';
import AppRoutes from '@/routes/AppRoutes';

// Import Leaflet styles to prevent distorted map views
import 'leaflet/dist/leaflet.css';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});

function App() {
  const initTheme = useThemeStore(state => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

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
