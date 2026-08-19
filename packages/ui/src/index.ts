// Public API của @twaozann01/ui. Chỉ những gì xuất ở đây mới là hợp đồng với app tiêu dùng;
// mọi thứ khác trong src/ là chi tiết nội bộ và có thể đổi bất cứ lúc nào.

// Provider + từ điển
export {
  UIProvider,
  useUI,
  useUILabels,
  type UIProviderProps,
  type UIContextValue,
} from './provider/ui-provider';
export { defaultLabels, type UILabels, type UILabelsOverride } from './provider/labels';

// Theme sáng/tối — nhớ lựa chọn, theo được cài đặt hệ điều hành, gắn class `.dark` lên <html>.
export {
  ThemeProvider,
  useTheme,
  useOptionalTheme,
  getThemeInitScript,
  type ThemeMode,
  type ResolvedTheme,
  type ThemeContextValue,
  type ThemeProviderProps,
  type ThemeStorage,
} from './provider/theme-provider';

// Tiện ích style
// Hộp thoại xác nhận dùng chung — thay cho window.confirm() và cho mỗi màn hình một dialog riêng.
export {
  ConfirmProvider,
  useConfirm,
  type ConfirmFn,
  type ConfirmOptions,
  type ConfirmProviderProps,
} from './provider/confirm-provider';

export { cn } from './lib/cn';
export { useDebounce } from './lib/use-debounce';
export { fieldBaseClass, fieldSingleLineClass } from './components/field';

// Primitives
export { Button, buttonVariants, type ButtonProps } from './components/button';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/card';
export { Badge, badgeVariants, type BadgeProps } from './components/badge';
export { Input } from './components/input';
export { Textarea } from './components/textarea';
export { Switch } from './components/switch';
export { Checkbox } from './components/checkbox';
export { RadioGroup, RadioGroupItem } from './components/radio-group';
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from './components/select';
export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  type DialogContentProps,
} from './components/dialog';
export {
  DialogShell,
  type DialogShellProps,
  type DialogShellSize,
} from './components/dialog-shell';
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './components/alert-dialog';
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  type SheetSide,
  type SheetContentProps,
} from './components/sheet';
// `Drawer` CỐ Ý không nằm ở entry này — nó ở '@twaozann01/ui/drawer'.
// Lý do: nó dựa trên `vaul`, mà `vaul` không khai `sideEffects: false`. Chỉ cần một dòng
// `import ... from 'vaul'` đứng trong entry chung là bundler của app buộc phải giữ nguyên
// cả gói, kể cả khi app không dùng Drawer — đo được ~70KB vào chunk vendor.
export {
  DIALOG_BG_CLASS,
  DIALOG_OVERLAY_CLASS,
  DIALOG_TITLE_CLASS,
  DIALOG_DESCRIPTION_CLASS,
  DIALOG_SHELL_CLASS,
  DIALOG_HEADER_CLASS,
  DIALOG_BODY_CLASS,
  DIALOG_FOOTER_CLASS,
  DIALOG_ICON_CLASS,
  DIALOG_TITLE_BLOCK_CLASS,
} from './components/dialog-surface';
export { THIN_SCROLL } from './lib/scroll';
export {
  LayerDepthProvider,
  useLayerDepth,
  layerZClass,
  POPPER_Z,
  MAX_LAYER_DEPTH,
} from './lib/layer-stack';
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from './components/popover';
export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './components/table';
export { DataTable, type Column, type DataTableProps } from './components/data-table';
export {
  MultiSelect,
  type MultiSelectOption,
  type MultiSelectProps,
} from './components/multi-select';
export { Pagination, getPageItems, type PaginationProps } from './components/pagination';
export { MobileDrawer, type MobileDrawerProps } from './components/mobile-drawer';
export { ImageUpload, type ImageValue, type ImageUploadProps } from './components/image-upload';
export { ThemeToggle, type ThemeToggleProps } from './components/theme-toggle';
export {
  LanguageSwitcher,
  type LanguageOption,
  type LanguageSwitcherProps,
} from './components/language-switcher';
