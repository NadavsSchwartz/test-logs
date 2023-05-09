import { classNames } from '@/utility/className';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={classNames(
      'relative h-4   overflow-hidden rounded-full bg-gray-100',
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full   flex-1 bg-orange-400  transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
