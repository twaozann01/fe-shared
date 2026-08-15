import * as React from 'react';
import { cn } from '../lib/cn';
import { fieldBaseClass } from './field';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => (
    <textarea className={cn(fieldBaseClass, 'min-h-[80px] px-3 py-2', className)} ref={ref} {...props} />
  ),
);
Textarea.displayName = 'Textarea';

export { Textarea };
