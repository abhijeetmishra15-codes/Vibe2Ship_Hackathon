import React from 'react';

export const Card = React.forwardRef(({
  className = '',
  variant = 'default',
  hoverable = false,
  children,
  ...props
}, ref) => {
  const baseCard = 'rounded-3xl border overflow-hidden transition-all duration-300 ease-out flex flex-col hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-premium-hover backdrop-blur-xl relative';
  
  const variants = {
    default: 'bg-card/40 text-card-foreground shadow-[0_8px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(20,184,166,0.06)] border-primary/20',
    glass: 'glass-card border-primary/30',
    secondary: 'bg-secondary/40 text-foreground shadow-[0_8px_15px_rgba(0,0,0,0.05)] border-primary/10',
    primary: 'bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border-primary/40 text-foreground shadow-[0_0_25px_rgba(20,184,166,0.2)]'
  };

  const hoverClass = hoverable 
    ? 'hover:shadow-[0_15px_40px_rgba(20,184,166,0.25)] hover:-translate-y-1 hover:border-primary/60 cursor-pointer' 
    : '';

  const variantClass = variants[variant] || variants.default;

  return (
    <div
      ref={ref}
      className={`${baseCard} ${variantClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader = ({ className = '', children, ...props }) => {
  return (
    <div className={`p-5 pb-3 space-y-1.5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className = '', children, ...props }) => {
  return (
    <h3 
      className={`font-display font-bold text-base text-foreground leading-snug ${className}`} 
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({ className = '', children, ...props }) => {
  return (
    <p 
      className={`text-[10px] sm:text-xs text-muted-foreground leading-relaxed ${className}`} 
      {...props}
    >
      {children}
    </p>
  );
};

export const CardContent = ({ className = '', children, ...props }) => {
  return (
    <div className={`p-5 pt-3 pb-4 flex-1 text-xs leading-relaxed ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={`bg-secondary/20 border-t border-border/50 px-5 py-3.5 flex items-center justify-between mt-auto ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};
