import React from 'react';

export const Card = React.forwardRef(({
  className = '',
  variant = 'default',
  hoverable = false,
  children,
  ...props
}, ref) => {
  const baseCard = 'rounded-2xl border border-border/80 overflow-hidden transition-all duration-300 flex flex-col';
  
  const variants = {
    default: 'bg-card text-card-foreground shadow-premium',
    glass: 'glass-card backdrop-blur-md',
    secondary: 'bg-secondary text-foreground border-border/60',
    primary: 'bg-gradient-to-tr from-primary/10 via-emerald-400/5 to-transparent border-primary/20 text-foreground'
  };

  const hoverClass = hoverable 
    ? 'hover:shadow-premium-hover hover:-translate-y-0.5 hover:border-primary/40 cursor-pointer' 
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
