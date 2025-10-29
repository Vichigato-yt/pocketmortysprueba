// screens/MortyListScreen.tsx
import "@/global.css";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  TextInput,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/app";
import type { Character, CharactersResponse } from "@/types/rmapi";
import MortyCard from "@/components/MortyCard";
import Error404 from "@/components/Error404"; // 👈 componente 404

type Props = NativeStackScreenProps<RootStackParamList, "MortyList">;

export default function MortyListScreen({ navigation }: Props) {
  const [mortys, setMortys] = useState<Character[]>([]);
  const [page, setPage] = useState<number>(1);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("morty");
  const [notFound, setNotFound] = useState<boolean>(false);

  const buildUrl = (p = 1, query = "morty") =>
    `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(
      query
    )}&page=${p}`;

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function fetchMortys() {
      setIsLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const url = buildUrl(page, searchQuery);
        const res = await fetch(url, { signal: controller.signal });

        // 👇 Detectar 404 (sin resultados)
        if (res.status === 404) {
          if (!ignore) {
            setNotFound(true);
            setMortys([]); // limpiar lista
            setNextUrl(null);
          }
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API error: ${res.status} ${text}`);
        }

        const data: CharactersResponse = await res.json();
        if (ignore) return;

        setMortys((prev) => (page === 1 ? data.results : [...prev, ...data.results]));
        setNextUrl(data.info?.next ?? null);
      } catch (err: unknown) {
        if (ignore) return;
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchMortys();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [page, searchQuery]);

  const handleSearch = (text: string) => {
    setSearchQuery(text || "morty");
    setPage(1);
    setMortys([]);
    setNextUrl(null);
  };

  const loadMore = () => {
    if (nextUrl) setPage((prev) => prev + 1);
  };

  const renderItem = ({ item }: { item: Character }) => (
    <MortyCard
      item={item}
      onPress={() => navigation.navigate("CharacterDetail", { id: item.id })}
    />
  );

  // 🌌 Interfaz principal
  return (
    <View className="flex-1 bg-[#0b0c10] p-4">
      <Text className="text-3xl font-extrabold text-[#97ce4c] mb-3 text-center">
        Character Selector 🧪
      </Text>

      {/* 🔍 Barra de búsqueda */}
      <View className="mb-4">
        <TextInput
          className="bg-[#1a1d24] border border-[#00ff9f]/30 text-white rounded-xl px-4 py-3 text-base"
          placeholder="Buscar personaje..."
          placeholderTextColor="#808080"
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* 🌀 Cargando */}
      {isLoading && page === 1 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#97ce4c" />
          <Text className="mt-2 text-[#97ce4c]">Cargando personajes...</Text>
        </View>
      ) : notFound ? (
        // 🚫 Mostrar Error404 si no hay resultados
        <Error404 onRetry={() => handleSearch("morty")} />
      ) : error && mortys.length === 0 ? (
        // 💥 Error general
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-400 mb-2">Error: {error}</Text>
          <Button title="Reintentar" onPress={() => setPage(1)} />
        </View>
      ) : (
        // 🧪 Lista de personajes
        <FlatList
          data={mortys}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={() =>
            !isLoading && !error ? (
              <View className="mt-6 items-center">
                <Text className="text-gray-400">No se encontraron personajes.</Text>
              </View>
            ) : null
          }
          ListFooterComponent={() =>
            nextUrl && !notFound ? ( // 👈 solo muestra si hay más páginas y no hay 404
              <View className="mt-4 py-2">
                {isLoading && page > 1 ? (
                  <View className="py-3 items-center">
                    <ActivityIndicator color="#97ce4c" />
                    <Text className="mt-1 text-[#97ce4c]">Cargando más...</Text>
                  </View>
                ) : (
                  <Button title="Cargar más personajes" onPress={loadMore} />
                )}
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}
