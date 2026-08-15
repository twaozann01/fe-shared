import { useUILabels } from '@twaozann01/ui';
import type { ReactNode } from 'react';

export interface FeaturePlaceholderProps {
  /** Tiêu đề đã dịch sẵn. */
  title: ReactNode;
  /** Icon tuỳ ý — truyền phần tử luôn (`<Wrench className="h-5 w-5" />`). */
  icon?: ReactNode;
  wipMessage?: ReactNode;
  comingSoonMessage?: ReactNode;
}

// Trang giữ chỗ cho tính năng chưa làm xong — tránh trang trống hoặc 404 giữa chừng.
export function FeaturePlaceholder({
  title,
  icon,
  wipMessage,
  comingSoonMessage,
}: FeaturePlaceholderProps) {
  const labels = useUILabels();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card py-16 text-center">
        <p className="text-sm font-medium">{wipMessage ?? labels.placeholder.wip}</p>
        <p className="text-xs text-muted-foreground">
          {comingSoonMessage ?? labels.placeholder.comingSoon}
        </p>
      </div>
    </div>
  );
}
