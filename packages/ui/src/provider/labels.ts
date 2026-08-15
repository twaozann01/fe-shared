// Toàn bộ chữ mà component tự sinh ra đều nằm ở đây — component KHÔNG gọi i18n library.
// Lý do: thư viện UI không được ép app phải dùng i18next, cũng không được đoán tên key
// của app. App bọc <UIProvider labels={...}> một lần để bơm bản dịch của mình vào.
//
// Chữ có tham số thì là HÀM (`tooLarge: (mb) => ...`) chứ không phải chuỗi có placeholder —
// nhờ vậy TypeScript bắt được lỗi thiếu tham số ngay lúc biên dịch.

export interface UILabels {
  common: {
    close: string;
    search: string;
    dark: string;
    light: string;
    cancel: string;
    confirm: string;
  };
  confirm: {
    /** Tiêu đề mặc định của hộp thoại xác nhận khi nơi gọi không truyền. */
    title: string;
  };
  table: {
    empty: string;
  };
  multiSelect: {
    /** Hiện trên trigger khi đã chọn ít nhất một mục. */
    selected: (count: number) => string;
  };
  pagination: {
    previous: string;
    next: string;
    page: (page: number) => string;
  };
  filter: {
    reset: string;
    all: string;
    yes: string;
    no: string;
    min: string;
    max: string;
    sort: string;
    sortDefault: string;
    from: string;
    to: string;
  };
  image: {
    hint: string;
    remove: string;
    invalidType: string;
    tooLarge: (sizeMB: number) => string;
  };
  error: {
    title: string;
    description: string;
    reload: string;
    notFound: string;
    forbidden: string;
    backHome: string;
  };
  placeholder: {
    wip: string;
    comingSoon: string;
  };
}

/** Override từng nhóm một — không cần khai lại toàn bộ từ điển. */
export type UILabelsOverride = {
  [Group in keyof UILabels]?: Partial<UILabels[Group]>;
};

/** Bản mặc định tiếng Việt: dự án mới cắm vào là chạy, chưa cấu hình gì cũng có chữ tử tế. */
export const defaultLabels: UILabels = {
  common: {
    close: 'Đóng',
    search: 'Tìm kiếm',
    dark: 'Tối',
    light: 'Sáng',
    cancel: 'Huỷ',
    confirm: 'Xác nhận',
  },
  confirm: {
    title: 'Bạn có chắc không?',
  },
  table: {
    empty: 'Không có dữ liệu',
  },
  multiSelect: {
    selected: (count) => `Đã chọn ${count}`,
  },
  pagination: {
    previous: 'Trang trước',
    next: 'Trang sau',
    page: (page) => `Trang ${page}`,
  },
  filter: {
    reset: 'Đặt lại',
    all: 'Tất cả',
    yes: 'Có',
    no: 'Không',
    min: 'Từ',
    max: 'Đến',
    sort: 'Sắp xếp',
    sortDefault: 'Mặc định',
    from: 'Từ ngày',
    to: 'Đến ngày',
  },
  image: {
    hint: 'Chọn hoặc kéo ảnh vào đây',
    remove: 'Xoá ảnh',
    invalidType: 'Tệp không phải ảnh',
    tooLarge: (sizeMB) => `Ảnh vượt quá ${sizeMB}MB`,
  },
  error: {
    title: 'Đã có lỗi xảy ra',
    description: 'Vui lòng thử lại. Nếu vẫn lỗi, hãy liên hệ hỗ trợ.',
    reload: 'Tải lại',
    notFound: 'Không tìm thấy trang',
    forbidden: 'Bạn không có quyền truy cập',
    backHome: 'Về trang chủ',
  },
  placeholder: {
    wip: 'Tính năng đang phát triển',
    comingSoon: 'Sẽ sớm có mặt',
  },
};

/**
 * Trộn nông theo từng nhóm — đủ vì từ điển chỉ sâu 2 tầng.
 *
 * Bên trong dùng Record<string, …>: khi lặp qua `Object.keys`, TypeScript không giữ được
 * liên kết giữa key và kiểu giá trị tương ứng nữa. Chữ ký hàm bên ngoài vẫn chặt, nên
 * người dùng không mất tính an toàn — chỗ lỏng nằm gọn trong 5 dòng này.
 */
export function mergeLabels(base: UILabels, override?: UILabelsOverride): UILabels {
  if (!override) return base;

  const groups = base as unknown as Record<string, object>;
  const patches = override as unknown as Record<string, object | undefined>;
  const merged: Record<string, object> = { ...groups };

  for (const key of Object.keys(groups)) {
    const patch = patches[key];
    if (patch) merged[key] = { ...groups[key], ...patch };
  }

  return merged as unknown as UILabels;
}
