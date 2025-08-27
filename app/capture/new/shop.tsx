import { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { getShop } from '@/lib/api/mock';
import { router } from 'expo-router';

export default function ShopScreen() {
  const [shopCode, setShopCode] = useState('');
  const [shopName, setShopName] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    setLoading(true);
    const res = await getShop(shopCode.trim());
    setShopName(res?.shopName ?? undefined);
    setLoading(false);
  };

  const next = () => {
    router.push({ pathname: '/capture/new/product', params: { shopCode, shopName } });
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


