import { useUILabels } from '@twaozann01/ui';
import type { ReactNode } from 'react';
import { StatusPage } from './status-page';

export interface ForbiddenProps {
  action?: ReactNode;
  description?: ReactNode;
}

export function Forbidden({ action, description }: ForbiddenProps) {
  const labels = useUILabels();

  return (
    <StatusPage title="403" description={description ?? labels.error.forbidden} action={action} />
  );
}
