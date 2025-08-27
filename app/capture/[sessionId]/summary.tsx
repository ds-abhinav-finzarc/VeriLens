import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { presignUploads, submitCaptureMetadata } from '@/lib/api/mock';
import { getSessionById, upsertSession } from '@/lib/storage/sessions';
import { processPendingUploads } from '@/lib/upload/queue';
import type { CaptureSession, Geo } from '@/types/models';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

export default function SummaryScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const [session, setSession] = useState<CaptureSession | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      if (!sessionId) return;
      const s = await getSessionById(String(sessionId));
      setSession(s);
    })();
  }, [sessionId]);

  const save = async () => {
    if (!session || busy) return;
    setBusy(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    let geo: Geo | undefined = undefined;
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      geo = { lat: loc.coords.latitude, lon: loc.coords.longitude, accuracy: loc.coords.accuracy ?? undefined, capturedAt: new Date().toISOString() };
    }

    const presigned = await presignUploads(session.images);
    const updated = { ...session, geo, status: 'saved', completedAt: new Date().toISOString() } as CaptureSession;
    await upsertSession(updated);
    await processPendingUploads();
    await submitCaptureMetadata(updated);
    const refreshed = await getSessionById(updated.id);
    setSession(refreshed);
  };

  const goDashboard = () => router.replace('/dashboard');
  const captureAnother = () => router.replace('/capture/new/shop');

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title">Summary</ThemedText>
      <ThemedText>Shop: {session?.shopCode}</ThemedText>
      <ThemedText>Product: {session?.productName}</ThemedText>
      {session?.geo ? (
        <ThemedText>Geo: {session.geo.lat.toFixed(4)}, {session.geo.lon.toFixed(4)}</ThemedText>
      ) : (
        <ThemedText>Geo: Not captured</ThemedText>
      )}
      <Pressable onPress={save} disabled={busy} style={{ marginTop: 16, padding: 14, borderRadius: 10, alignItems: 'center', backgroundColor: '#1f6feb' }}>
        <ThemedText style={{ color: '#fff', fontWeight: '600' }}>{busy ? 'Saving…' : 'Finalize & Upload (mock)'}</ThemedText>
      </Pressable>
      <View style={{ height: 8 }} />
      <Pressable onPress={captureAnother} style={{ padding: 14, borderRadius: 10, alignItems: 'center', backgroundColor: '#6e7781' }}>
        <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Capture Another</ThemedText>
      </Pressable>
      <View style={{ height: 8 }} />
      <Pressable onPress={goDashboard} style={{ padding: 14, borderRadius: 10, alignItems: 'center', backgroundColor: '#6e7781' }}>
        <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Back to Dashboard</ThemedText>
      </Pressable>
    </ThemedView>
  );
}


