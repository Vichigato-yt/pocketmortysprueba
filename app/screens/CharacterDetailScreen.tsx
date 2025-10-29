// screens/CharacterDetailScreen.tsx
import "@/global.css"
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app';
import type { Character } from '@/types/rmapi';

type Props = NativeStackScreenProps<RootStackParamList, 'CharacterDetail'>;

export default function CharacterDetailScreen({ route }: Props) {
  const { id } = route.params;
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function fetchCharacter() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`, { signal: controller.signal });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API error: ${res.status} ${text}`);
        }
        const data: Character = await res.json();
        if (ignore) return;
        setCharacter(data);
      } catch (err: unknown) {
        if (ignore) return;
        if (err instanceof Error) setError(err.message);
        else setError('Unknown error');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchCharacter();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [id]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
        <Text className="mt-2">Cargando detalle...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-red-600 mb-2">Error: {error}</Text>
        <Text className="text-gray-600">Intenta volver a la lista y seleccionar otro Morty.</Text>
      </View>
    );
  }

  if (!character) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Sin datos del personaje.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="items-center mb-4">
        <Image source={{ uri: character.image }} style={{ width: 300, height: 300, borderRadius: 12 }} />
      </View>

      <View className="bg-gray-50 rounded-lg p-4 shadow">
        <Text className="text-xl font-bold mb-2">{character.name} <Text className="text-sm text-gray-500">#{character.id}</Text></Text>

        <Text className="text-sm text-gray-700"><Text className="font-semibold">Status:</Text> {character.status}</Text>
        <Text className="text-sm text-gray-700"><Text className="font-semibold">Species:</Text> {character.species}</Text>
        <Text className="text-sm text-gray-700"><Text className="font-semibold">Gender:</Text> {character.gender}</Text>
        <Text className="text-sm text-gray-700 mt-2"><Text className="font-semibold">Origin:</Text> {character.origin?.name ?? 'unknown'}</Text>
        <Text className="text-sm text-gray-700"><Text className="font-semibold">Location:</Text> {character.location?.name ?? 'unknown'}</Text>
      </View>
    </ScrollView>
  );
}
