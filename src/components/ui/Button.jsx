import React from 'react';

export const Button = React.forwardRef(({
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  type = 'button',
  ...props
}, ref) => {
  // Base classes with transition, ring, and active states
  const baseClasses = 'inline-flex items-center justify-center font-display rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none';

  // Variant styles - Premium Lighter Green Style with High-Contrast White Text
  const variants = {
    primary: 'bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] hover:scale-[1.02] hover:-translate-y-0.5',
    secondary: 'bg-secondary/80 hover:bg-secondary border border-border/60 text-foreground font-semibold hover:border-border/80 shadow-sm hover:shadow-md hover:scale-[1.01]',
    danger: 'bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold border border-rose-400/30 shadow-[0_0_15px_rgba(225,29,72,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(225,29,72,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] hover:scale-[1.02] hover:-translate-y-0.5',
    ghost: 'text-foreground hover:bg-secondary/60 font-semibold border border-transparent hover:scale-[1.01]'
  };

  // Size styles aligned with scale, flex constraints, and min-heights
  const sizes = {
    sm: 'px-4 py-2 min-h-[32px] text-[13px]',
    md: 'px-6 py-2.5 min-h-[40px] text-[15px]',
    lg: 'px-8 py-3 min-h-[48px] text-[17px]'
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  // Spinner size based on button size
  const spinnerSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  const spinnerSize = spinnerSizes[size] || spinnerSizes.md;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`relative overflow-hidden ${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {/* Container ensures text is ALWAYS opaque, centered, and visible */}
      <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap opacity-100">
        
        {/* Spinner only conditionally renders inline during loading */}
        {loading && (
          <svg
            className={`animate-spin ${spinnerSize} text-current shrink-0`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            <path
              className="opacity-85"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {/* Text remains visible and never overlaps with absolute layers */}
        <span className="flex items-center gap-1.5">{children}</span>
      </span>
    </button>
  );
});

Button.displayName = 'Button';
