// screens/MortyListScreen.tsx
import "@/global.css"
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app';
import type { Character, CharactersResponse } from '@/types/rmapi';
import MortyCard from '@/components/MortyCard';

type Props = NativeStackScreenProps<RootStackParamList, 'MortyList'>;

export default function MortyListScreen({ navigation }: Props) {
  const [mortys, setMortys] = useState<Character[]>([]);
  const [page, setPage] = useState<number>(1);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const buildUrl = (p = 1) => `https://rickandmortyapi.com/api/character/?name=morty&page=${p}`;

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function fetchMortys() {
      setIsLoading(true);
      setError(null);
      try {
        const url = buildUrl(page);
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          // API returns 404 when no results; capture message
          const text = await res.text();
          throw new Error(`API error: ${res.status} ${text}`);
        }
        const data: CharactersResponse = await res.json();
        if (ignore) return;
        setMortys(prev => (page === 1 ? data.results : [...prev, ...data.results]));
        setNextUrl(data.info?.next ?? null);
      } catch (err: unknown) {
        if (ignore) return;
        if (err instanceof Error) setError(err.message);
        else setError('Unknown error');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchMortys();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [page]);

  const loadMore = () => {
    if (nextUrl) setPage(prev => prev + 1);
  };

  const renderItem = ({ item }: { item: Character }) => (
    <MortyCard
      item={item}
      onPress={() => navigation.navigate('CharacterDetail', { id: item.id })}
    />
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-3">Morty Selector Index</Text>

      {isLoading && page === 1 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
          <Text className="mt-2">Cargando Mortys...</Text>
        </View>
      ) : error && mortys.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-600 mb-2">Error: {error}</Text>
          <Button title="Reintentar" onPress={() => setPage(1)} />
        </View>
      ) : (
        <>
          <FlatList
            data={mortys}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={() => (
              <View className="mt-6 items-center">
                <Text className="text-gray-600">No se encontraron Mortys.</Text>
              </View>
            )}
            ListFooterComponent={() => (
              <View className="mt-4">
                {isLoading && page > 1 ? (
                  <View className="py-3 items-center">
                    <ActivityIndicator />
                    <Text className="mt-1">Cargando más...</Text>
                  </View>
                ) : nextUrl ? (
                  <View className="py-2">
                    <Button title="Cargar más Mortys" onPress={loadMore} />
                  </View>
                ) : (
                  <View className="py-2 items-center">
                    <Text className="text-sm text-gray-500">No hay más Mortys.</Text>
                  </View>
                )}
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}
