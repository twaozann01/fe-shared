import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '../lib/cn';

// Nhãn nhỏ hiển thị trạng thái/thuộc tính. Màu qua token nên tự hợp cả light lẫn dark.
// KHÔNG biết domain: app tự map trạng thái nghiệp vụ của mình sang variant.
//
// Ba variant success/warning/info dùng token ngữ nghĩa (--success…), không dùng palette thô
// của Tailwind — đổi sắc độ chỉ cần sửa @twaozann01/design-tokens một chỗ.
const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        success: 'border-transparent bg-success/15 text-success-foreground',
        warning: 'border-transparent bg-warning/15 text-warning-foreground',
        info: 'border-transparent bg-info/15 text-info-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
