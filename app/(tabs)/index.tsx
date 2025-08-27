import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }} headerImage={<View />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Dashboard</ThemedText>
      </ThemedView>
      <ThemedView style={{ gap: 12 }}>
        <Pressable style={styles.primaryBtn} onPress={() => router.push('/capture/new/shop')}>
          <ThemedText style={styles.btnText}>New Capture</ThemedText>
        </Pressable>
        <Pressable style={styles.secondaryBtn} onPress={() => router.push('/captures')}>
          <ThemedText style={styles.btnText}>My Captures</ThemedText>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryBtn: { backgroundColor: '#1f6feb', padding: 14, borderRadius: 10, alignItems: 'center' },
  secondaryBtn: { backgroundColor: '#6e7781', padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
});
