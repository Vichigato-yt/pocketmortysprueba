// screens/CharacterDetailScreen.tsx
import "@/global.css";
import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, ScrollView } from "react-native";
import axios, { CancelTokenSource } from "axios";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/app";
import type { Character } from "@/types/rmapi";

type Props = NativeStackScreenProps<RootStackParamList, "CharacterDetail">;

export default function CharacterDetailScreen({ route }: Props) {
  const { id } = route.params;
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelSource: CancelTokenSource;

    async function fetchCharacter() {
      setIsLoading(true);
      setError(null);

      cancelSource = axios.CancelToken.source();

      try {
        const res = await axios.get<Character>(
          `https://rickandmortyapi.com/api/character/${id}`,
          { cancelToken: cancelSource.token }
        );

        setCharacter(res.data);
      } catch (err: unknown) {
        if (axios.isCancel(err)) {
          console.log("⏹️ Petición cancelada");
          return;
        }

        if (axios.isAxiosError(err)) {
          if (err.response) {
            setError(`Error ${err.response.status}: ${err.response.statusText}`);
          } else if (err.request) {
            setError("No se recibió respuesta del servidor");
          } else {
            setError(`Error desconocido: ${err.message}`);
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

    fetchCharacter();

    return () => {
      if (cancelSource) cancelSource.cancel("Componente desmontado");
    };
  }, [id]);

  // 🌀 Pantalla de carga
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0b0c10]">
        <ActivityIndicator size="large" color="#97ce4c" />
        <Text className="mt-3 text-[#97ce4c] text-lg font-bold">Cargando detalle...</Text>
      </View>
    );
  }

  // 💥 Error
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#12002f] p-4">
        <Text className="text-red-400 mb-2 font-semibold text-lg">Error: {error}</Text>
        <Text className="text-gray-200 text-center">
          Intenta volver a la lista y seleccionar otro Morty.
        </Text>
      </View>
    );
  }

  // 💀 Sin datos
  if (!character) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0b0c10]">
        <Text className="text-gray-400">Sin datos del personaje.</Text>
      </View>
    );
  }

  // 🧪 Detalle del personaje
  return (
    <ScrollView className="flex-1 bg-[#000000]">
      <View className="items-center mt-8 mb-4">
        <View className="rounded-full border-[5px] border-[#97ce4c] shadow-[0_0_25px_#97ce4c]">
          <Image
            source={{ uri: character.image }}
            style={{ width: 250, height: 250, borderRadius: 125 }}
          />
        </View>
      </View>

      <View className="mx-5 mb-10 bg-[#111827] rounded-2xl p-6 border border-[#00ff9f]/40 shadow-xl shadow-[#00ff9f]/20">
        <Text className="text-3xl font-extrabold text-center text-[#00ff9f] mb-1">
          {character.name}
        </Text>
        <Text className="text-center text-[#8ee6ff] mb-4 font-semibold">
          #{character.id}
        </Text>

        <View className="space-y-3">
          <Text className="text-lg text-gray-200">
            <Text className="font-semibold text-[#97ce4c]">Status:</Text> {character.status}
          </Text>
          <Text className="text-lg text-gray-200">
            <Text className="font-semibold text-[#97ce4c]">Species:</Text> {character.species}
          </Text>
          <Text className="text-lg text-gray-200">
            <Text className="font-semibold text-[#97ce4c]">Gender:</Text> {character.gender}
          </Text>
          <Text className="text-lg text-gray-200 mt-2">
            <Text className="font-semibold text-[#97ce4c]">Origin:</Text>{" "}
            {character.origin?.name ?? "unknown"}
          </Text>
          <Text className="text-lg text-gray-200">
            <Text className="font-semibold text-[#97ce4c]">Location:</Text>{" "}
            {character.location?.name ?? "unknown"}
          </Text>
        </View>
      </View>

      <View className="items-center mb-8">
        <Text className="text-[#97ce4c] text-lg font-semibold text-center">
          🛸 Wubba Lubba Dub Dub! 🛸
        </Text>
        <View className="h-1 w-32 bg-[#00ff9f] mt-2 rounded-full shadow-[0_0_10px_#00ff9f]" />
      </View>
    </ScrollView>
  );
}
