import { Button, useUILabels } from '@twaozann/ui';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StatusPage } from './status-page';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Nhận lỗi để log ra Sentry/log service. Không truyền thì chỉ console.error. */
  onError?: (error: Error, info: ErrorInfo) => void;
  /** Chạy khi người dùng bấm "Tải lại". Mặc định `window.location.reload()`. */
  onReset?: () => void;
  /** Thay hẳn màn hình lỗi bằng UI riêng của app. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

// Fallback tách thành function component để dùng được hook (class không gọi hook được).
function ErrorFallback({ onReset }: { onReset: () => void }) {
  const labels = useUILabels();

  return (
    <StatusPage
      title={labels.error.title}
      description={labels.error.description}
      action={<Button onClick={onReset}>{labels.error.reload}</Button>}
      className="gap-3"
    />
  );
}

/**
 * Bắt lỗi render (exception trong cây React) → hiện fallback thay vì màn hình trắng.
 *
 * Lỗi mạng/API KHÔNG đi qua đây — chúng bị bắt ở lớp data-fetching của app.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack);
    this.props.onError?.(error, info);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false });
    if (this.props.onReset) this.props.onReset();
    else window.location.reload();
  };

  override render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    return this.props.fallback ?? <ErrorFallback onReset={this.handleReset} />;
  }
}
