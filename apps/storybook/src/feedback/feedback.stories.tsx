import { ErrorBoundary, FeaturePlaceholder, Forbidden, NotFound } from '@twaozann01/feedback';
import { Button } from '@twaozann01/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { BarChart3 } from 'lucide-react';

const meta: Meta = {
  title: 'Feedback/Trạng thái',
};

export default meta;

// App truyền link của router mình dùng vào `action` — thư viện không biết router nào.
const homeLink = (
  <a href="#" className="text-primary hover:underline">
    Về trang chủ
  </a>
);

export const KhongTimThay: StoryObj = {
  name: '404',
  render: () => <NotFound action={homeLink} />,
};

export const KhongCoQuyen: StoryObj = {
  name: '403',
  render: () => <Forbidden action={homeLink} />,
};

export const DangPhatTrien: StoryObj = {
  name: 'Tính năng đang phát triển',
  render: () => (
    <FeaturePlaceholder title="Báo cáo doanh thu" icon={<BarChart3 className="h-5 w-5" />} />
  ),
};

function Boom(): never {
  throw new Error('Lỗi cố ý để xem màn hình fallback');
}

export const BatLoiRender: StoryObj = {
  name: 'ErrorBoundary',
  render: () => (
    <ErrorBoundary onReset={() => undefined}>
      <Boom />
    </ErrorBoundary>
  ),
};

export const FallbackRieng: StoryObj = {
  name: 'ErrorBoundary — fallback riêng',
  render: () => (
    <ErrorBoundary
      fallback={
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="mb-3 text-sm">Màn hình lỗi riêng của app</p>
          <Button size="sm">Thử lại</Button>
        </div>
      }
    >
      <Boom />
    </ErrorBoundary>
  ),
};
