import {
  Checkbox,
  Input,
  MultiSelect,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from '@twaozann01/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'UI/Control nhập liệu',
  parameters: {
    docs: {
      description: {
        component:
          'Mọi control dựng trên fieldBaseClass trong ui/src/components/field.ts — sửa ở đó là cả bộ đổi theo.',
      },
    },
  },
};

export default meta;

const options = [
  { value: 'dien', label: 'Điện' },
  { value: 'nuoc', label: 'Nước' },
  { value: 'dieu-hoa', label: 'Điều hoà' },
];

export const TatCa: StoryObj = {
  name: 'Tất cả',
  render: function Render() {
    const [multi, setMulti] = useState<string[]>([]);

    return (
      <div className="grid max-w-md gap-4">
        <Input placeholder="Ô text" />
        <Input type="number" placeholder="Ô số" />
        <Input disabled placeholder="Vô hiệu" />
        <Textarea placeholder="Ô nhiều dòng" />

        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Chọn một" />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <MultiSelect
          value={multi}
          onChange={setMulti}
          options={options}
          placeholder="Chọn nhiều"
        />

        <div className="flex items-center gap-2">
          <Checkbox id="cb" />
          <label htmlFor="cb" className="text-sm">
            Ô tích
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Switch id="sw" />
          <label htmlFor="sw" className="text-sm">
            Công tắc
          </label>
        </div>

        <RadioGroup defaultValue="dien">
          {options.map((o) => (
            <div key={o.value} className="flex items-center gap-2">
              <RadioGroupItem value={o.value} id={`r-${o.value}`} />
              <label htmlFor={`r-${o.value}`} className="text-sm">
                {o.label}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  },
};
