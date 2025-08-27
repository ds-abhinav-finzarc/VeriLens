import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { getSessionById, isSessionComplete } from '@/lib/storage/sessions';
import type { CaptureSession } from '@/types/models';

export default function PreviewScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const [session, setSession] = useState<CaptureSession | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (!sessionId) return;
      const s = await getSessionById(String(sessionId));
      setSession(s);
    })();
  }, [sessionId]);

  const complete = session ? isSessionComplete(session) : false;

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title">Preview</ThemedText>
      <FlatList
        style={{ marginTop: 12 }}
        data={session?.images ?? []}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 8 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <View style={{ flex: 1, backgroundColor: '#1f232a', borderRadius: 8, overflow: 'hidden' }}>
            <Image source={{ uri: item.localUri }} style={{ aspectRatio: 1 }} />
            <ThemedText style={{ padding: 8 }}>{item.angle}</ThemedText>
          </View>
        )}
        ListEmptyComponent={<ThemedText>No images yet.</ThemedText>}
      />
      <Pressable
        disabled={!complete}
        onPress={() => router.push(`/capture/${sessionId}/summary`)}
        style={{ marginTop: 16, padding: 14, borderRadius: 10, alignItems: 'center', backgroundColor: complete ? '#1f6feb' : '#6e7781' }}>
        <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Save</ThemedText>
      </Pressable>
    </ThemedView>
  );
}


