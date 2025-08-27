import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getAllSessions } from '@/lib/storage/sessions';
import { processPendingUploads } from '@/lib/upload/queue';
import type { CaptureSession } from '@/types/models';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

export default function CapturesListScreen() {
  const [sessions, setSessions] = useState<CaptureSession[]>([]);

  useEffect(() => {
    (async () => {
      const all = await getAllSessions();
      setSessions(all);
    })();
  }, []);

  const retryAllFailed = async () => {
    await processPendingUploads();
    const all = await getAllSessions();
    setSessions(all);
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title">My Captures</ThemedText>
      <Pressable onPress={retryAllFailed} style={{ marginVertical: 8, backgroundColor: '#6e7781', padding: 10, borderRadius: 8, alignItems: 'center' }}>
        <ThemedText style={{ color: '#fff' }}>Retry Failed Uploads</ThemedText>
      </Pressable>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <ThemedView style={{ padding: 12, borderRadius: 8, backgroundColor: '#262b33' }}>
            <ThemedText type="defaultSemiBold">{item.productName}</ThemedText>
            <ThemedText>Shop: {item.shopCode}</ThemedText>
            <ThemedText>Status: {item.status}</ThemedText>
          </ThemedView>
        )}
        ListEmptyComponent={<ThemedText style={{ marginTop: 16 }}>No captures yet.</ThemedText>}
      />
    </ThemedView>
  );
}


