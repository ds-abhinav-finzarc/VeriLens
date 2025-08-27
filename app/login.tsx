import { Link, router } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { demoLogin } from '@/lib/api/mock';
import { setAuthToken } from '@/lib/storage/auth';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (loading) return;
    setLoading(true);
    const { token } = await demoLogin();
    await setAuthToken(token);
    router.replace('/dashboard');
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <ThemedText type="title">VeriLens</ThemedText>
      <ThemedText style={{ marginTop: 12, opacity: 0.8 }}>Demo login</ThemedText>
      <Pressable onPress={onLogin} style={{ marginTop: 24, backgroundColor: '#1f6feb', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}>
        <Text style={{ color: 'white', fontWeight: '600' }}>{loading ? 'Signing in...' : 'Sign in'}</Text>
      </Pressable>
    </ThemedView>
  );
}


