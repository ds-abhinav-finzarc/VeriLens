import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { searchProducts } from '@/lib/api/mock';
import type { Product } from '@/types/models';

export default function ProductScreen() {
  const { shopCode, shopName } = useLocalSearchParams<{ shopCode: string; shopName?: string }>();
  const [q, setQ] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    (async () => {
      const { products } = await searchProducts(q);
      setProducts(products);
    })();
  }, [q]);

  const select = (product: Product) => {
    router.push({ pathname: `/capture/${'new'}/step/top`, params: { shopCode, shopName, product: JSON.stringify(product) } });
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title">Product</ThemedText>
      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="Search products"
        style={{ marginTop: 8, backgroundColor: '#1f232a', color: '#fff', padding: 12, borderRadius: 8 }}
      />
      <FlatList
        style={{ marginTop: 12 }}
        data={products}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <Pressable onPress={() => select(item)} style={{ padding: 12, borderRadius: 8, backgroundColor: '#262b33' }}>
            <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
            <ThemedText>{item.code}</ThemedText>
          </Pressable>
        )}
      />
    </ThemedView>
  );
}


