# @twaozann01/storybook

Xưởng xem và thử component — tài liệu sống của design system.

```bash
pnpm storybook     # từ thư mục gốc repo
```

Mở http://localhost:6006.

Thanh công cụ có nút đổi **light / dark**: nó gắn class `.dark` lên `<html>` đúng như app thật làm, nên những gì thấy ở đây là những gì sẽ thấy trong app.

Story nên viết cho **mọi trạng thái đáng quan tâm**, không chỉ trạng thái đẹp: rỗng, đang tải, lỗi, chữ dài tràn dòng, vô hiệu. Đó là lúc design system hay vỡ nhất.

App này không được publish (`private: true`) và không nằm trong graph tầng — nó chỉ tiêu thụ thư viện.
