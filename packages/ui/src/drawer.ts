// Entry con: `import { Drawer } from '@twaozann01/ui/drawer'`.
//
// Tách khỏi entry chung vì `vaul` (thư viện đứng sau Drawer) không khai
// `sideEffects: false`. Bundler vì thế không dám bỏ nó đi, nên nếu Drawer nằm chung
// entry thì MỌI app đều gánh `vaul` dù có dùng Drawer hay không.
//
// `MobileDrawer` thì vẫn ở entry chung — nó tự dựng bằng div, không đụng tới vaul.
export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerClose,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  type DrawerContentProps,
} from './components/drawer';
