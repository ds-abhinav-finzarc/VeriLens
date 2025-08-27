export type CaptureAngle =
  | "top"
  | "bottom"
  | "front_ijp" // confirm label
  | "address_info"
  | "back_of_pack"
  | "legal_box"
  | "extra_7th?"; // confirm

export interface Product {
  id: string;
  code: string;
  name: string;
}

export interface Geo {
  lat: number;
  lon: number;
  accuracy?: number;
  capturedAt: string;
}

export interface CaptureImage {
  id: string;
  angle: CaptureAngle;
  localUri: string;
  width: number;
  height: number;
  fileSize: number;
  s3Key?: string;
  uploadStatus: "pending" | "uploading" | "uploaded" | "failed";
}

export interface CaptureSession {
  id: string;
  shopCode: string;
  shopName?: string;
  productId: string;
  productCode: string;
  productName: string;
  startedAt: string;
  completedAt?: string;
  geo?: Geo;
  images: CaptureImage[];
  status: "in_progress" | "saved" | "uploaded" | "upload_failed";
}

export const REQUIRED_ANGLES: CaptureAngle[] = [
  "top",
  "bottom",
  "front_ijp",
  "address_info",
  "back_of_pack",
  "legal_box",
];

export function getNextAngle(current: CaptureAngle): CaptureAngle | null {
  const idx = REQUIRED_ANGLES.indexOf(current);
  if (idx < 0) return null;
  const nextIdx = idx + 1;
  return nextIdx < REQUIRED_ANGLES.length ? REQUIRED_ANGLES[nextIdx] : null;
}


