import { Button, ImageUpload, LanguageSwitcher, MobileDrawer, ThemeToggle } from '@twaozann/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'UI/Khung ứng dụng',
  parameters: {
    docs: {
      description: {
        component:
          'Những mảnh dựng khung app: drawer mobile, đổi ngôn ngữ, đổi theme, chọn ảnh. Tất cả đều stateless hoặc controlled.',
      },
    },
  },
};

export default meta;

export const Drawer: StoryObj = {
  name: 'MobileDrawer',
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story: 'Chỉ hiện dưới breakpoint md — thu nhỏ cửa sổ để thấy.',
      },
    },
  },
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Mở menu</Button>
        <MobileDrawer open={open} onClose={() => setOpen(false)}>
          <div className="space-y-1 p-4">
            <p className="mb-3 font-semibold">Menu</p>
            {['Trang chủ', 'Đơn hàng', 'Ví tiền', 'Hồ sơ'].map((item) => (
              <button
                key={item}
                className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
              >
                {item}
              </button>
            ))}
          </div>
        </MobileDrawer>
        <p className="mt-4 text-sm text-muted-foreground">
          Drawer chỉ hiện ở màn hình nhỏ (`md:hidden`).
        </p>
      </div>
    );
  },
};

export const DoiNgonNgu: StoryObj = {
  name: 'LanguageSwitcher',
  render: function Render() {
    const [lang, setLang] = useState('vi');

    return (
      <div className="space-y-3">
        <LanguageSwitcher
          languages={[
            { value: 'vi', label: 'VI' },
            { value: 'en', label: 'EN' },
          ]}
          current={lang}
          onChange={setLang}
        />
        <p className="text-sm text-muted-foreground">
          Đang chọn: <code>{lang}</code> — việc đổi ngôn ngữ thật do app làm.
        </p>
      </div>
    );
  },
};

export const NutTheme: StoryObj = {
  name: 'ThemeToggle (controlled)',
  render: function Render() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    return (
      <div className="flex items-center gap-3">
        <ThemeToggle
          theme={theme}
          onToggle={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        />
        <ThemeToggle
          iconOnly
          theme={theme}
          onToggle={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
        />
        <span className="text-sm text-muted-foreground">
          Chế độ controlled — không đổi theme thật. Xem Nền tảng/Theme để thử bản đầy đủ.
        </span>
      </div>
    );
  },
};

export const ChonAnh: StoryObj = {
  name: 'ImageUpload',
  render: function Render() {
    const [value, setValue] = useState<File | string | null>(null);

    return (
      <div className="space-y-3">
        <ImageUpload value={value} onChange={setValue} maxSizeMB={2} />
        <p className="text-sm text-muted-foreground">
          {value instanceof File ? `Đã chọn: ${value.name}` : 'Chưa chọn ảnh nào.'}
        </p>
        <p className="text-xs text-muted-foreground">
          Thử kéo vào một file không phải ảnh, hoặc ảnh &gt; 2MB — lỗi đi qua `onError` của
          UIProvider, không phải toast cứng trong thư viện.
        </p>
      </div>
    );
  },
};
