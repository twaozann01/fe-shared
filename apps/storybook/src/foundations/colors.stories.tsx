import { colorTokenNames } from '@twaozann/design-tokens';
import { Card, CardContent } from '@twaozann/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Nền tảng/Bảng màu',
  parameters: {
    docs: {
      description: {
        component:
          'Toàn bộ token màu. Đổi giá trị ở packages/design-tokens/src/tokens.ts là mọi component đổi theo.',
      },
    },
  },
};

export default meta;

// Token đi theo cặp: `x` là nền, `x-foreground` là chữ nằm trên nền đó.
// Dùng Set<string> vì `${name}-foreground` là chuỗi ghép, TypeScript không biết nó có
// thuộc ColorToken hay không — mà ở đây đúng là ta đang đi hỏi điều đó.
const allNames = new Set<string>(colorTokenNames);
const pairs = colorTokenNames.filter(
  (name) => !name.endsWith('-foreground') && allNames.has(`${name}-foreground`),
);
const singles = colorTokenNames.filter(
  (name) => !name.endsWith('-foreground') && !pairs.includes(name),
);

export const Palette: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Cặp nền / chữ</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pairs.map((name) => (
            <Card key={name}>
              <CardContent
                className="flex h-24 items-center justify-center rounded-lg p-6"
                style={{
                  backgroundColor: `hsl(var(--${name}))`,
                  color: `hsl(var(--${name}-foreground))`,
                }}
              >
                <code className="text-sm font-medium">--{name}</code>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Token đơn</h2>
        <div className="flex flex-wrap gap-3">
          {singles.map((name) => (
            <div key={name} className="flex items-center gap-2 rounded-md border px-3 py-2">
              <span
                className="h-5 w-5 rounded border"
                style={{ backgroundColor: `hsl(var(--${name}))` }}
              />
              <code className="text-xs">--{name}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
