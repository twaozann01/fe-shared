// Leaflet ship ảnh marker dạng .png; khai kiểu để TypeScript chấp nhận import.
declare module '*.png' {
  const src: string;
  export default src;
}
