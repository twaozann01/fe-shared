import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@twaozann/ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'UI/Bố cục',
};

export default meta;

export const The: StoryObj = {
  name: 'Card',
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Đơn hàng tháng này</CardTitle>
          <CardDescription>Số liệu tính đến hôm nay</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">1.284</p>
          <Badge variant="success" className="mt-2">
            +12% so với tháng trước
          </Badge>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline">
            Xem chi tiết
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chỉ có tiêu đề</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Card không bắt buộc phải có đủ 5 phần — dùng phần nào thì đưa phần đó vào.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const BangTho: StoryObj = {
  name: 'Table (thô)',
  render: () => (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead className="text-right">Số đơn</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Nguyễn An</TableCell>
            <TableCell>Thợ điện</TableCell>
            <TableCell className="text-right">42</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Trần Bình</TableCell>
            <TableCell>Thợ nước</TableCell>
            <TableCell className="text-right">17</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

export const NoiDungNoi: StoryObj = {
  name: 'Popover',
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Mở popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <p className="text-sm font-medium">Nội dung nổi</p>
          <p className="text-sm text-muted-foreground">
            Dùng làm nền cho MultiSelect và các menu tuỳ chọn.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
