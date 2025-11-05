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
import axios, { CancelTokenSource } from "axios";
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
    let cancelSource: CancelTokenSource;

    async function fetchMortys() {
      setIsLoading(true);
      setError(null);
      setNotFound(false);

      cancelSource = axios.CancelToken.source();

      try {
        const url = buildUrl(page, searchQuery);

        const res = await axios.get<CharactersResponse>(url, {
          cancelToken: cancelSource.token,
          validateStatus: (status) => status < 500, // Permite manejar 404 sin lanzar error
        });

        // 👇 Detectar 404 (sin resultados)
        if (res.status === 404) {
          setNotFound(true);
          setMortys([]);
          setNextUrl(null);
          return;
        }

        if (res.status !== 200 || !res.data) {
          throw new Error(`Error ${res.status}: No se pudieron cargar los datos`);
        }

        const data = res.data;
        setMortys((prev) => (page === 1 ? data.results : [...prev, ...data.results]));
        setNextUrl(data.info?.next ?? null);
      } catch (err: unknown) {
        if (axios.isCancel(err)) {
          console.log("⏹️ Petición cancelada");
          return;
        }

        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setNotFound(true);
            setMortys([]);
            setNextUrl(null);
          } else {
            setError(`Error: ${err.message}`);
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchMortys();

    return () => {
      if (cancelSource) cancelSource.cancel("Componente desmontado");
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
      <View>
        <Text>.</Text>
      </View>
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
            nextUrl && !notFound ? (
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
