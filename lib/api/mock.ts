import type { CaptureImage, CaptureSession, Product } from "@/types/models";

export async function demoLogin(): Promise<{ token: string }> {
  return { token: "demo-token" };
}

export async function getShop(shopCode: string): Promise<{ shopCode: string; shopName: string } | null> {
  if (!shopCode) return null;
  return { shopCode, shopName: `Demo Shop ${shopCode}` };
}

const MOCK_PRODUCTS: Product[] = [
  { id: "1", code: "P001", name: "Sample Product One" },
  { id: "2", code: "P002", name: "Sample Product Two" },
  { id: "3", code: "P003", name: "Another Product" },
];

export async function searchProducts(q: string): Promise<{ products: Product[] }> {
  const query = (q || "").toLowerCase();
  const products = MOCK_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query)
  );
  return { products };
}

export interface PresignedUrl {
  key: string;
  url: string; // mock URL scheme: mock://s3/<key>
  contentType: string;
}

export async function presignUploads(images: CaptureImage[]): Promise<{ urls: PresignedUrl[] }> {
  const urls: PresignedUrl[] = images.map((img) => ({
    key: `captures/${img.id}.jpg`,
    url: `mock://s3/captures/${img.id}.jpg`,
    contentType: "image/jpeg",
  }));
  return { urls };
}

// Mock upload: pretend to PUT to URL, return success
export async function uploadToPresignedUrl(url: string, fileUri: string, contentType: string): Promise<{ ok: boolean }> {
  // In mock mode, immediately resolve as success
  return { ok: true };
}

export async function submitCaptureMetadata(session: CaptureSession): Promise<{ ok: boolean; captureId: string }> {
  return { ok: true, captureId: session.id };
}


