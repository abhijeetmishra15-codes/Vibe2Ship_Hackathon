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
  // Base classes for premium buttons with custom Outfit/Inter typography, focus ring and hover transitions
  const baseClasses = 'inline-flex items-center justify-center font-display font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';

  // Variant styles
  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white shadow-premium hover:shadow-premium-hover',
    secondary: 'bg-secondary hover:bg-secondary/80 border border-border text-foreground hover:text-foreground',
    danger: 'bg-destructive hover:bg-destructive-hover text-destructive-foreground shadow-premium',
    ghost: 'text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent'
  };

  // Size styles aligned with 4px grid spacing scale
  const sizes = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-4 py-2.5 text-xs',
    lg: 'px-6 py-3.5 text-sm'
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4.5 w-4.5 text-current shrink-0"
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
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
