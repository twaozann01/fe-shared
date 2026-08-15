import {
  BooleanFilter,
  DateRangeFilter,
  FilterBar,
  MultiSelectFilter,
  RangeFilter,
  SearchInput,
  SelectFilter,
  SortSelect,
  type DateRangeValue,
  type RangeValue,
} from '@twaozann/filters';
import { Card, CardContent } from '@twaozann/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Filters/Thanh lọc',
  parameters: {
    docs: {
      description: {
        component:
          'Mọi filter đều controlled: nhận value + onChange. State lọc (zustand, useState, query string) do app tự quản.',
      },
    },
  },
};

export default meta;

const categories = [
  { value: 'dien', label: 'Điện' },
  { value: 'nuoc', label: 'Nước' },
  { value: 'dieu-hoa', label: 'Điều hoà' },
];

const sortOptions = [
  { value: 'createdAt:desc', label: 'Mới nhất' },
  { value: 'price:asc', label: 'Giá tăng dần' },
];

export const DayDu: StoryObj = {
  name: 'Đầy đủ',
  render: function Render() {
    const [q, setQ] = useState('');
    const [category, setCategory] = useState<string | undefined>();
    const [tags, setTags] = useState<string[]>([]);
    const [price, setPrice] = useState<RangeValue>({});
    const [dates, setDates] = useState<DateRangeValue>({});
    const [active, setActive] = useState<boolean | undefined>();
    const [sort, setSort] = useState<string | undefined>();

    const reset = () => {
      setQ('');
      setCategory(undefined);
      setTags([]);
      setPrice({});
      setDates({});
      setActive(undefined);
      setSort(undefined);
    };

    return (
      <div className="space-y-4">
        <FilterBar onReset={reset}>
          <SearchInput value={q} onChange={setQ} className="w-64" />
          <SelectFilter value={category} onChange={setCategory} options={categories} />
          <MultiSelectFilter value={tags} onChange={setTags} options={categories} />
          <BooleanFilter value={active} onChange={setActive} />
          <SortSelect value={sort} onChange={setSort} options={sortOptions} />
        </FilterBar>

        <FilterBar>
          <RangeFilter value={price} onChange={setPrice} />
          <DateRangeFilter value={dates} onChange={setDates} />
        </FilterBar>

        <Card>
          <CardContent className="p-4">
            <p className="mb-2 text-sm text-muted-foreground">
              Giá trị gửi lên API (chỉ những gì khác rỗng):
            </p>
            <pre className="overflow-auto rounded bg-muted p-3 text-xs">
              {JSON.stringify({ q, category, tags, price, dates, active, sort }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  },
};
