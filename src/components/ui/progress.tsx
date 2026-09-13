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
    className={cn('relative h-2 w-full overflow-hidden rounded-full bg-border', className)}
    {...props}
  >
    {value !== undefined && (
      <div
        className="h-full w-full bg-accent transition-all"
        style={{ transform: `translateX(-${(1 - value / max) * 100}%)`, width: `${(value / max) * 100}%` }}
      />
    )}
  </div>
));
Progress.displayName = 'Progress';