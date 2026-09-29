import React from 'react';

// Mora Logo with exact letter coloring: m (primary), o (coral), r (sun), a (mint)
export const MoraLogo: React.FC<{ className?: string; onClick?: () => void }> = ({
  className = '',
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-0.5 font-display text-3xl font-black tracking-tight cursor-pointer focus-visible:outline-primary select-none ${className}`}
    aria-label="Mora - Play, Learn & Grow Together"
  >
    <span className="text-primary">m</span>
    <span className="text-coral">o</span>
    <span className="text-sun">r</span>
    <span className="text-mint">a</span>
  </button>
);

// Mora Section Header with playful eyebrow and bold heading.
// `size="lg"` (default) is the section-level treatment used throughout the
// marketing homepage — unchanged, renders <h2> (the page's own <h1> lives
// in that page's hero/banner component, e.g. HeroBanner or MoraFamilyHome's
// "Halo, Keluarga X!"). `size="page"` is a step down in scale AND renders
// <h1> — reserved for a sub-page that has no other <h1> of its own (e.g.
// "Play with Mora"), so the document outline has exactly one top-level
// heading per page instead of every section sitting at the same level.
export const MoraSectionHeader: React.FC<{
  eyebrow?: string;
  children: React.ReactNode;
  subtitle?: string;
  centered?: boolean;
  size?: 'lg' | 'page';
  className?: string;
}> = ({ eyebrow, children, subtitle, centered = false, size = 'lg', className = '' }) => {
  const HeadingTag = size === 'page' ? 'h1' : 'h2';
  return (
    <div className={`${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'} ${className}`}>
      {eyebrow && (
        <p
          className={`mb-3 font-hand font-bold uppercase tracking-wider text-primary ${
            size === 'page' ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <HeadingTag
        className={`font-black leading-tight text-foreground font-display ${
          size === 'page' ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl lg:text-5xl'
        }`}
      >
        {children}
      </HeadingTag>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-ink-soft leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};

// Mora Button with exact variants from the reference: joyful, sunshine, outline, ghost, secondary
export interface MoraButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'joyful' | 'sunshine' | 'outline' | 'ghost' | 'secondary' | 'default';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

export const MoraButton: React.FC<MoraButtonProps> = ({
  variant = 'joyful',
  size = 'default',
  className = '',
  children,
  ...props
}) => {
  let variantClasses = '';
  switch (variant) {
    case 'joyful':
      variantClasses =
        'rounded-full bg-primary text-primary-foreground shadow-play hover:-translate-y-0.5 hover:bg-primary/90 font-bold active:translate-y-0';
      break;
    case 'sunshine':
      variantClasses =
        'rounded-full bg-sun text-sun-foreground shadow-play hover:-translate-y-0.5 hover:bg-sun/90 font-bold active:translate-y-0';
      break;
    case 'outline':
      variantClasses =
        'rounded-full border border-border bg-card text-foreground shadow-xs hover:bg-muted/80 hover:text-foreground font-semibold';
      break;
    case 'secondary':
      variantClasses =
        'rounded-full bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 font-bold';
      break;
    case 'ghost':
      variantClasses =
        'rounded-full hover:bg-muted hover:text-foreground text-ink-soft font-semibold';
      break;
    default:
      variantClasses =
        'rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 font-bold';
      break;
  }

  let sizeClasses = '';
  switch (size) {
    case 'sm':
      sizeClasses = 'h-8 px-3.5 text-xs';
      break;
    case 'lg':
      sizeClasses = 'h-12 px-7 text-base';
      break;
    case 'icon':
      sizeClasses = 'size-9 p-0 flex items-center justify-center';
      break;
    default:
      sizeClasses = 'h-10 px-5 text-sm';
      break;
  }

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Sun icon container with bob animation
export const MoraSunBob: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`flex size-14 items-center justify-center rounded-full bg-sun text-sun-foreground shadow-md ${className}`}
    aria-hidden="true"
  >
    <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  </div>
);
