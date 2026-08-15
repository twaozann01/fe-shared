import { useUILabels } from '@twaozann01/ui';
import type { ReactNode } from 'react';
import { StatusPage } from './status-page';

export interface NotFoundProps {
  /** Liên kết về trang chủ — app tự truyền <Link to="/">…</Link> của router mình dùng. */
  action?: ReactNode;
  description?: ReactNode;
}

export function NotFound({ action, description }: NotFoundProps) {
  const labels = useUILabels();

  return (
    <StatusPage title="404" description={description ?? labels.error.notFound} action={action} />
  );
}
