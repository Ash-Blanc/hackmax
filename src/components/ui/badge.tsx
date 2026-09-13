import * as React from 'react';
import { cn } from '@/lib/utils';

export const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'inline-flex items-center rounded-md border border-white/[0.06] px-2 py-0.5 text-2xs font-medium tracking-snug transition-colors',
      className
    )}
    {...props}
  />
));
Badge.displayName = 'Badge';