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
        className="h-full rounded-full bg-accent transition-all duration-500 ease-spring"
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      />
    )}
  </div>
));
Progress.displayName = 'Progress';