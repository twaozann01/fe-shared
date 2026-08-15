import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview, ReactRenderer } from '@storybook/react';
import '../src/styles.css';

// Đổi theme bằng cách gắn class `.dark` lên <html> — đúng y cách app thật làm,
// nên những gì thấy ở Storybook là những gì sẽ thấy trong app.
const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true }, // nền do token quyết định, không để addon ghi đè
  },
  decorators: [
    withThemeByClassName<ReactRenderer>({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
    }),
    (Story) => (
      <div className="min-h-screen bg-background p-8 text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default preview;
