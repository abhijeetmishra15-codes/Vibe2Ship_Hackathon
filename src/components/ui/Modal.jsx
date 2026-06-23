import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl'
};

export function Modal({
  isOpen,
  onClose,
  size = 'md',
  children,
  className = ''
}) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sizeClass = modalSizes[size] || modalSizes.md;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Blur Layer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 dark:bg-background/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            className={`w-full ${sizeClass} bg-card border border-border/80 rounded-3xl shadow-2xl relative z-10 flex flex-col overflow-hidden max-h-[90vh] ${className}`}
          >
            {/* Standard Accessible Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
              aria-label="Close dialog"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export const ModalHeader = ({ className = '', children, ...props }) => {
  return (
    <div className={`p-6 pb-3 space-y-1.5 pr-14 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const ModalTitle = ({ className = '', children, ...props }) => {
  return (
    <h3 
      className={`font-display font-black text-base sm:text-lg text-foreground leading-snug ${className}`} 
      {...props}
    >
      {children}
    </h3>
  );
};

export const ModalDescription = ({ className = '', children, ...props }) => {
  return (
    <p 
      className={`text-xs text-muted-foreground leading-relaxed ${className}`} 
      {...props}
    >
      {children}
    </p>
  );
};

export const ModalContent = ({ className = '', children, ...props }) => {
  return (
    <div className={`p-6 pt-3 pb-5 flex-1 text-xs leading-relaxed overflow-y-auto ${className}`} {...props}>
      {children}
    </div>
  );
};

export const ModalFooter = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={`bg-secondary/20 border-t border-border/50 px-6 py-4 flex items-center justify-end gap-3 mt-auto ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};
