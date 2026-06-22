import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';

const toastIcons = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
  error: <AlertCircle className="h-5 w-5 text-destructive shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
  info: <Info className="h-5 w-5 text-blue-500 shrink-0" />
};

const toastColors = {
  success: 'border-emerald-500/20 bg-card/90 dark:bg-card/75 text-foreground shadow-premium',
  error: 'border-destructive/20 bg-card/90 dark:bg-card/75 text-foreground shadow-premium',
  warning: 'border-amber-500/20 bg-card/90 dark:bg-card/75 text-foreground shadow-premium',
  info: 'border-blue-500/20 bg-card/90 dark:bg-card/75 text-foreground shadow-premium'
};

export function ToastContainer() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[99999] flex flex-col gap-2.5 w-full max-w-sm pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className={`pointer-events-auto flex items-start space-x-3.5 p-4 rounded-2xl border backdrop-blur-md ${toastColors[t.type]} select-none`}
          >
            {toastIcons[t.type] || toastIcons.info}
            
            <div className="flex-1 min-w-0 space-y-0.5">
              <h4 className="font-display font-bold text-xs text-foreground leading-snug">
                {t.title}
              </h4>
              {t.description && (
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-normal">
                  {t.description}
                </p>
              )}
            </div>

            <button
              onClick={() => dismiss(t.id)}
              className="p-1 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground shrink-0 transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
export { useToastStore };
