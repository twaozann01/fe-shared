import { ImagePlus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { useUI } from '../provider/ui-provider';

export type ImageValue = File | string | null;

export interface ImageUploadProps {
  value: ImageValue;
  onChange: (value: File | null) => void;
  /** Loại tệp chấp nhận (thuộc tính accept). Mặc định mọi ảnh. */
  accept?: string;
  /** Giới hạn dung lượng (MB). Mặc định 5. */
  maxSizeMB?: number;
  disabled?: boolean;
  id?: string;
  onBlur?: () => void;
  className?: string;
}

// Chọn + xem trước 1 ảnh: bấm hoặc kéo-thả. Controlled qua value/onChange.
// value: File (ảnh mới) | string (URL ảnh cũ) | null. Chỉ chọn + validate, KHÔNG tự upload —
// việc gọi API upload là nghiệp vụ của app, không thuộc design system.
//
// Lỗi validate báo qua `onError` của UIProvider chứ không gọi thẳng toast: mỗi app một
// hệ thông báo riêng, thư viện không được ép dùng `sonner`.
export function ImageUpload({
  value,
  onChange,
  accept = 'image/*',
  maxSizeMB = 5,
  disabled,
  id,
  onBlur,
  className,
}: ImageUploadProps) {
  const { labels, onError } = useUI();
  const inputRef = useRef<HTMLInputElement>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  // Ảnh mới (File) → tạo object URL để preview; thu hồi khi đổi/unmount (tránh rò bộ nhớ).
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setObjectUrl(null);
    return undefined;
  }, [value]);

  const previewSrc =
    value instanceof File ? objectUrl : typeof value === 'string' && value ? value : null;

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onError(labels.image.invalidType);
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      onError(labels.image.tooLarge(maxSizeMB));
      return;
    }
    onChange(file);
  };

  const remove = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={cn(className)}>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled}
        onBlur={onBlur}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {previewSrc ? (
        <div className="relative inline-block">
          <img
            src={previewSrc}
            alt=""
            className="h-32 w-32 rounded-md border border-input object-cover"
          />
          {!disabled && (
            <button
              type="button"
              onClick={remove}
              aria-label={labels.image.remove}
              className="absolute -right-2 -top-2 rounded-full border bg-background p-1 shadow-sm hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (!disabled) handleFile(e.dataTransfer.files?.[0]);
          }}
          className="flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input bg-transparent p-2 text-center text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ImagePlus className="h-6 w-6" />
          {labels.image.hint}
        </button>
      )}
    </div>
  );
}
