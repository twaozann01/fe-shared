import { createContext, useContext, type ReactNode } from 'react';

/**
 * NGĂN XẾP LỚP CHE.
 *
 * Trước đây Dialog khai `z-50` CỐ ĐỊNH. Cố định nghĩa là hai dialog bằng z nhau, thứ tự vẽ do
 * thứ tự node trong DOM quyết định — hên xui theo lúc portal được gắn. Dialog mở sau KHÔNG
 * chắc nằm trên, và tệ hơn: lớp mờ của nó cũng bằng z với thân dialog trước nên dialog trước
 * không bị phủ bóng, hai lớp nội dung đứng cạnh nhau trông như một mớ.
 *
 * Nay z tự suy theo ĐỘ SÂU LỒNG NHAU. Mỗi dialog đọc độ sâu từ context rồi cấp cho con nó
 * độ sâu + 1. React context đi xuyên portal (nó theo cây React chứ không theo cây DOM) nên
 * dialog lồng trong dialog nhận đúng độ sâu, dù Radix đã bốc nó ra `document.body`.
 *
 *   sâu 0:  mờ 1100 · thân 1101
 *   sâu 1:  mờ 1110 · thân 1111     ← 1110 > 1101 nên PHỦ TRỌN dialog sâu 0
 *   sâu 2:  mờ 1120 · thân 1121
 */
const LayerDepthContext = createContext(0);

/** Độ sâu lồng nhau của lớp che hiện tại (0 = mở từ trang). */
export function useLayerDepth(): number {
  return useContext(LayerDepthContext);
}

/** Bọc phần thân của một lớp che để con của nó nhận độ sâu + 1. */
export function LayerDepthProvider({ depth, children }: { depth: number; children: ReactNode }) {
  return <LayerDepthContext.Provider value={depth}>{children}</LayerDepthContext.Provider>;
}

export const MAX_LAYER_DEPTH = 4;

/*
 * Phải là CHUỖI NGUYÊN VĂN, không được ghép `z-[${1100 + depth * 10}]`.
 * Tailwind sinh CSS bằng cách đọc TĨNH source code — class ghép lúc chạy không có trong file
 * nên không được sinh ra, mà class không tồn tại thì trình duyệt bỏ qua lặng lẽ: không lỗi
 * build, không lỗi runtime, chỉ có thứ tự lớp sai.
 */
const OVERLAY_Z = ['z-[1100]', 'z-[1110]', 'z-[1120]', 'z-[1130]', 'z-[1140]'] as const;
const CONTENT_Z = ['z-[1101]', 'z-[1111]', 'z-[1121]', 'z-[1131]', 'z-[1141]'] as const;

/*
 * `urgent` — dành cho AlertDialog: cộng thêm 4 ở CÙNG nấc.
 *
 * Hộp cảnh báo mở từ trong một dialog thường nằm cùng cây React nên đã có độ sâu lớn hơn.
 * Nhưng rất nhiều màn khai AlertDialog ở cấp TRANG rồi mới bấm mở từ trong dialog — lúc đó
 * context không với tới, độ sâu vẫn là 0. Cộng 4 giữ cho nó vẫn nằm trên dialog cùng nấc
 * (1104 > 1101), tức "cảnh báo luôn cắt ngang" đúng như ngữ nghĩa của nó.
 */
const URGENT_OVERLAY_Z = ['z-[1104]', 'z-[1114]', 'z-[1124]', 'z-[1134]', 'z-[1144]'] as const;
const URGENT_CONTENT_Z = ['z-[1105]', 'z-[1115]', 'z-[1125]', 'z-[1135]', 'z-[1145]'] as const;

/**
 * Popover / Select / DropdownMenu đứng TRÊN mọi nấc dialog.
 *
 * Chúng được portal ra body chứ không nằm trong thân dialog, nên nếu không cao hơn thì menu
 * xổ ra trong dialog sẽ chui xuống dưới chính dialog đó. 5 nấc là quá đủ — lồng quá 3 lớp
 * đã là vấn đề luồng thao tác chứ không còn là vấn đề z-index.
 */
export const POPPER_Z = 'z-[1205]';

/**
 * Class `z-index` cho một tầng của lớp che.
 *
 * Trả về CLASS chứ không phải inline `style` là có lý do: app đôi khi cần leo lên trên một
 * lớp portal ngoài hệ (widget chat, iframe nhúng…). Class thì `cn()` cho bên gọi đè lại
 * được; inline style thì đè ngược, chỗ nào đang vá tay sẽ tụt xuống và biến mất.
 */
export function layerZClass(
  depth: number,
  part: 'overlay' | 'content',
  urgent = false,
): string {
  const index = Math.min(Math.max(depth, 0), MAX_LAYER_DEPTH);
  if (urgent) return (part === 'overlay' ? URGENT_OVERLAY_Z : URGENT_CONTENT_Z)[index]!;
  return (part === 'overlay' ? OVERLAY_Z : CONTENT_Z)[index]!;
}
