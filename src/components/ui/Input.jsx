import React from 'react';

const baseInputClasses = 'w-full bg-card rounded-xl border border-border/80 px-4 py-2.5 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60 disabled:opacity-50 disabled:pointer-events-none';
const errorInputClasses = 'border-destructive/80 focus:border-destructive focus:ring-destructive/20';

export const Input = React.forwardRef(({
  className = '',
  label,
  error,
  icon: Icon,
  type = 'text',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Date.now()}`;
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-muted-foreground uppercase"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground/70 absolute left-3.5 pointer-events-none" />
        )}
        <input
          ref={ref}
          type={type}
          id={inputId}
          className={`${baseInputClasses} ${Icon ? 'pl-10' : ''} ${error ? errorInputClasses : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-[10px] text-destructive mt-1 block animate-fade-in">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = React.forwardRef(({
  className = '',
  label,
  error,
  id,
  rows = 5,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Date.now()}`;
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-bold text-muted-foreground uppercase"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`${baseInputClasses} ${error ? errorInputClasses : ''} ${className} resize-none`}
        {...props}
      />
      {error && (
        <span className="text-[10px] text-destructive mt-1 block animate-fade-in">
          {error}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
