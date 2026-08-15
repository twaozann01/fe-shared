import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  ThemeProvider,
  ThemeToggle,
  useTheme,
} from '@twaozann01/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Nền tảng/Theme',
  parameters: {
    docs: {
      description: {
        component:
          'ThemeProvider là thứ duy nhất app cần để có dark mode: nhớ lựa chọn, theo được cài đặt hệ điều hành, và gắn class .dark lên <html>.',
      },
    },
  },
};

export default meta;

function ThemePanel() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Bảng điều khiển theme</CardTitle>
        <CardDescription>
          Lựa chọn: <Badge variant="info">{theme}</Badge> · Đang hiển thị:{' '}
          <Badge variant="secondary">{resolvedTheme}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme('light')}
          >
            Sáng
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme('dark')}
          >
            Tối
          </Button>
          <Button
            variant={theme === 'system' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTheme('system')}
          >
            Theo hệ thống
          </Button>
        </div>

        <div className="flex items-center gap-3 border-t pt-4">
          <span className="text-sm text-muted-foreground">Nút lật nhanh:</span>
          <ThemeToggle />
          <ThemeToggle iconOnly />
        </div>

        <div className="space-y-2 border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Mọi component bên dưới đổi theo mà không cần biết theme là gì:
          </p>
          <Input placeholder="Ô nhập liệu" />
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">Hoàn tất</Badge>
            <Badge variant="warning">Chờ</Badge>
            <Badge variant="destructive">Huỷ</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const DoiTheme: StoryObj = {
  name: 'Đổi theme',
  render: () => (
    // persist=false để mỗi lần mở story là trạng thái sạch, không dính lựa chọn cũ.
    <ThemeProvider defaultTheme="light" persist={false}>
      <ThemePanel />
    </ThemeProvider>
  ),
};
