import * as React from 'react';
import { cn } from '@/lib/utils';

export const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number; max?: number }
>(({ className, value, max = 100, ...props }, ref) => (
  <div
    ref={ref}
    role="progressbar"
    aria-valuenow={value}
    aria-valuemin={0}
    aria-valuemax={max}
    className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]', className)}
    {...props}
  >
    {value !== undefined && (
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent via-accent-bright to-accent-cyan transition-all duration-500 ease-spring shadow-[0_0_8px_rgba(59,130,246,0.5)]"
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      />
    )}
  </div>
));
Progress.displayName = 'Progress';