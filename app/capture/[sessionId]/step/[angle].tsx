import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { addOrUpdateImage, createSession, getNextAngle, getSessionById, upsertSession } from '@/lib/storage/sessions';
import type { CaptureAngle, CaptureImage, Product } from '@/types/models';
import uuid from 'react-native-uuid';

export default function CaptureStepScreen() {
  const params = useLocalSearchParams<{ sessionId?: string; angle: CaptureAngle; shopCode?: string; shopName?: string; product?: string }>();
  const angle = params.angle as CaptureAngle;
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [sessionId, setSessionId] = useState<string | undefined>(params.sessionId);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      if (!permission?.granted) await requestPermission();
      if (!params.sessionId && params.product && params.shopCode) {
        const product: Product = JSON.parse(String(params.product));
        const session = await createSession({ shopCode: String(params.shopCode), shopName: params.shopName ? String(params.shopName) : undefined, product });
        setSessionId(session.id);
      } else if (params.sessionId) {
        const s = await getSessionById(String(params.sessionId));
        setSessionId(s?.id);
      }
    })();
  }, [params.sessionId]);

  const capture = async () => {
    if (!cameraRef.current || !sessionId || busy) return;
    setBusy(true);
    const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
    const manipulated = await ImageManipulator.manipulateAsync(photo.uri, [{ resize: { width: 1600 } }], { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG });
    const fileInfo = await FileSystem.getInfoAsync(manipulated.uri, { size: true });
    const image: CaptureImage = {
      id: String(uuid.v4()),
      angle,
      localUri: manipulated.uri,
      width: photo.width ?? 0,
      height: photo.height ?? 0,
      fileSize: typeof fileInfo.size === 'number' ? fileInfo.size : 0,
      uploadStatus: 'pending',
    };
    await addOrUpdateImage(sessionId, image);
    const next = getNextAngle(angle);
    if (next) {
      router.replace({ pathname: `/capture/${sessionId}/step/${next}` });
    } else {
      router.replace({ pathname: `/capture/${sessionId}/preview` });
    }
    setBusy(false);
  };

  if (!permission) return null;
  if (!permission.granted) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Camera permission is required.</ThemedText>
        <Pressable onPress={requestPermission} style={{ marginTop: 12, padding: 12, backgroundColor: '#1f6feb', borderRadius: 8 }}>
          <ThemedText style={{ color: '#fff' }}>Grant permission</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedText style={{ padding: 12 }} type="subtitle">Capture: {angle}</ThemedText>
      <View style={{ flex: 1 }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} />
      </View>
      <Pressable onPress={capture} disabled={busy} style={{ padding: 16, backgroundColor: '#1f6feb', alignItems: 'center' }}>
        <ThemedText style={{ color: '#fff', fontWeight: '600' }}>{busy ? 'Saving…' : 'Capture'}</ThemedText>
      </Pressable>
    </ThemedView>
  );
}


