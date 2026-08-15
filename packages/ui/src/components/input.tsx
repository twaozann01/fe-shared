import * as React from 'react';
import { cn } from '../lib/cn';
import { fieldBaseClass, fieldSingleLineClass } from './field';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        fieldBaseClass,
        fieldSingleLineClass,
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
