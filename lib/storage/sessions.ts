import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import type { CaptureImage, CaptureSession, CaptureAngle, Product } from "@/types/models";
import { REQUIRED_ANGLES, getNextAngle } from "@/types/models";

const SESSIONS_KEY = "captures:sessions";

export async function getAllSessions(): Promise<CaptureSession[]> {
  const raw = await AsyncStorage.getItem(SESSIONS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CaptureSession[];
  } catch {
    return [];
  }
}

async function saveAllSessions(sessions: CaptureSession[]): Promise<void> {
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export async function createSession(params: {
  shopCode: string;
  shopName?: string;
  product: Product;
}): Promise<CaptureSession> {
  const sessions = await getAllSessions();
  const newSession: CaptureSession = {
    id: String(uuid.v4()),
    shopCode: params.shopCode,
    shopName: params.shopName,
    productId: params.product.id,
    productCode: params.product.code,
    productName: params.product.name,
    startedAt: new Date().toISOString(),
    images: [],
    status: "in_progress",
  };
  const updated = [newSession, ...sessions];
  await saveAllSessions(updated);
  return newSession;
}

export async function getSessionById(sessionId: string): Promise<CaptureSession | undefined> {
  const sessions = await getAllSessions();
  return sessions.find((s) => s.id === sessionId);
}

export async function upsertSession(updatedSession: CaptureSession): Promise<void> {
  const sessions = await getAllSessions();
  const idx = sessions.findIndex((s) => s.id === updatedSession.id);
  if (idx >= 0) {
    sessions[idx] = updatedSession;
  } else {
    sessions.unshift(updatedSession);
  }
  await saveAllSessions(sessions);
}

export async function addOrUpdateImage(
  sessionId: string,
  image: CaptureImage
): Promise<CaptureSession | undefined> {
  const session = await getSessionById(sessionId);
  if (!session) return undefined;
  const idx = session.images.findIndex((img) => img.angle === image.angle);
  if (idx >= 0) {
    session.images[idx] = image;
  } else {
    session.images.push(image);
  }
  await upsertSession(session);
  return session;
}

export function isSessionComplete(session: CaptureSession): boolean {
  const capturedAngles = new Set(session.images.map((i) => i.angle));
  return REQUIRED_ANGLES.every((a) => capturedAngles.has(a));
}

export { REQUIRED_ANGLES, getNextAngle };


