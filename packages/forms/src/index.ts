// Public API của bộ form component dùng cho React Hook Form.
export { Form, type FormProps } from './form';
export { FormField, type FormFieldProps } from './form-field';
export type { FieldRules } from './rules';
export { TextField, type TextFieldProps } from './text-field';
export { TextareaField, type TextareaFieldProps } from './textarea-field';
export { NumberField, type NumberFieldProps } from './number-field';
export { SelectField, type SelectOption, type SelectFieldProps } from './select-field';
export { RadioField, type RadioOption, type RadioFieldProps } from './radio-field';
export { MultiSelectField, type MultiSelectFieldProps } from './multi-select-field';
export { ImageField, type ImageFieldProps } from './image-field';
export { CheckboxField, type CheckboxFieldProps } from './checkbox-field';
export { SwitchField, type SwitchFieldProps } from './switch-field';

// Re-export cho tiện: hai kiểu này thuộc @twaozann/ui nhưng người dùng form luôn cần.
export type { MultiSelectOption, ImageValue } from '@twaozann/ui';
