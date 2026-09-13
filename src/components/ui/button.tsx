import * as React from 'react';
import * as Slot from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 text-sm font-medium tracking-snug transition-all duration-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] select-none',
  {
    variants: {
      variant: {
        default:
          'bg-accent hover:bg-accent-bright text-white rounded-lg shadow-ambient',
        secondary:
          'bg-white/[0.04] hover:bg-white/[0.08] text-secondary hover:text-fg border border-white/[0.06] hover:border-white/[0.10] rounded-lg',
        ghost:
          'text-secondary hover:text-fg hover:bg-white/[0.04] rounded-md',
        destructive:
          'text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 rounded-lg',
        outline:
          'border border-white/[0.08] hover:border-white/[0.14] bg-transparent hover:bg-white/[0.03] text-fg rounded-lg',
        link: 'text-accent-bright hover:text-accent underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 py-1.5 text-xs',
        lg: 'h-10 px-5 py-2.5',
        icon: 'h-9 w-9',
        xs: 'h-7 px-2.5 py-1 text-xs',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };