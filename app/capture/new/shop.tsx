import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getShop } from '@/lib/api/mock';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, TextInput } from 'react-native';

export default function ShopScreen() {
  const [shopCode, setShopCode] = useState('');
  const [shopName, setShopName] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    if (!shopCode.trim()) return;
    setLoading(true);
    try {
      const res = await getShop(shopCode.trim());
      setShopName(res?.shopName ?? undefined);
    } catch (e) {
      setShopName(undefined);
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    const base = `/capture/new/product?shopCode=${encodeURIComponent(shopCode.trim())}`;
    const url = shopName ? `${base}&shopName=${encodeURIComponent(shopName)}` : base;
    router.push(url);
  };

  const canNext = shopCode.trim().length > 0;

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title">Shop</ThemedText>
      <ThemedText style={{ marginTop: 12 }}>Enter shop code</ThemedText>
      <TextInput
        value={shopCode}
        onChangeText={setShopCode}
        placeholder="e.g. SHP123"
        style={{ marginTop: 8, backgroundColor: '#1f232a', color: '#fff', padding: 12, borderRadius: 8 }}
        autoCapitalize="characters"
        returnKeyType="search"
        onSubmitEditing={lookup}
      />
      <Pressable onPress={lookup} style={{ marginTop: 12, backgroundColor: '#6e7781', padding: 12, alignItems: 'center', borderRadius: 8 }}>
        <ThemedText style={{ color: '#fff' }}>{loading ? 'Looking up…' : 'Lookup name (mock)'}</ThemedText>
      </Pressable>
      {shopName ? <ThemedText style={{ marginTop: 8 }}>Name: {shopName}</ThemedText> : null}
      <Pressable disabled={!canNext} onPress={next} style={{ marginTop: 24, backgroundColor: canNext ? '#1f6feb' : '#6e7781', padding: 12, alignItems: 'center', borderRadius: 8 }}>
        <ThemedText style={{ color: '#fff' }}>Next</ThemedText>
      </Pressable>
    </ThemedView>
  );
}


