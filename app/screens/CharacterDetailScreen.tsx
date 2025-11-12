// File: src/screens/CharacterDetailScreen.tsx
import "@/global.css";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios, { CancelTokenSource } from "axios";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-native-markdown-display";
import type { Character } from "@/types/rmapi";

export default function CharacterDetailScreen({ route }: any) {
  const { id } = route.params;
  const router = useRouter();

  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [geminiText, setGeminiText] = useState<string>("");
  const [isGeminiLoading, setIsGeminiLoading] = useState<boolean>(false);

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
        if (axios.isCancel(err)) return;
        if (axios.isAxiosError(err)) {
          if (err.response)
            setError(`Error ${err.response.status}: ${err.response.statusText}`);
          else if (err.request)
            setError("No se recibió respuesta del servidor");
          else setError(`Error desconocido: ${err.message}`);
        } else if (err instanceof Error) setError(err.message);
        else setError("Error desconocido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCharacter();

    return () => {
      if (cancelSource) cancelSource.cancel("Componente desmontado");
    };
  }, [id]);

  // 🧠 Función: Llamar a Gemini cuando se pulsa "Saber más"
  async function callGemini(characterData: Character) {
    try {
      setIsGeminiLoading(true);
      setGeminiText("");

      // Obtener episodios
      const episodeUrls = characterData.episode.slice(0, 3);
      const episodeData = await Promise.all(
        episodeUrls.map((url) => axios.get(url).then((r) => r.data))
      );
      const episodeList = episodeData.map(
        (ep: any) =>
          `T${ep.episode.slice(1, 3)}E${ep.episode.slice(4, 6)} - ${ep.name}`
      );

      // Personajes relacionados
      const relatedUrls = episodeData
        .flatMap((ep: any) => ep.characters)
        .filter((url: string) => !url.endsWith(`/${characterData.id}`))
        .slice(0, 3);

      const relatedNames = await Promise.all(
        relatedUrls.map((url) => axios.get(url).then((r) => r.data.name))
      );

      const prompt = `
Eres una IA experta en Rick y Morty.
Analiza al personaje "${characterData.name}".
1️⃣ Aparece en: ${episodeList.join(", ")}.
2️⃣ Personajes relacionados: ${relatedNames.join(", ")}.
3️⃣ Responde en español, breve, con emojis y en formato **Markdown**.
4️⃣ Termina con "💬 Wubba Lubba Dub Dub!"
`;

      const ai = new GoogleGenAI({
        apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const text = response?.text ?? "No se pudo obtener respuesta de Gemini.";
      setGeminiText(text);
    } catch (e: any) {
      console.error("Error al llamar a Gemini:", e);
      const message =
        e.message?.includes("Failed to fetch") || e.message?.includes("network")
          ? "⚠️ Error de conexión. Verifica tu internet."
          : "⚠️ No se pudo conectar con Gemini.";
      setGeminiText(message);
    } finally {
      setIsGeminiLoading(false);
    }
  }

  // 🌀 Pantalla de carga
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0b0c10]">
        <ActivityIndicator size="large" color="#97ce4c" />
        <Text className="mt-3 text-[#97ce4c] text-lg font-bold">
          Cargando detalle...
        </Text>
      </View>
    );
  }

  // 💥 Error
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-[#12002f] p-4">
        <Text className="text-red-400 mb-2 font-semibold text-lg">
          Error: {error}
        </Text>
        <Text className="text-gray-200 text-center">
          Intenta volver a la lista y seleccionar otro personaje.
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

  // 🧪 Render principal
  return (
    <ScrollView className="flex-1 bg-[#000000]">
      {/* Botón de regresar */}
      <View className="absolute top-10 left-5 z-10">
        <TouchableOpacity
          onPress={() => router.push("/")}
          className="bg-[#111827]/70 p-2 rounded-full"
        >
          <Ionicons name="arrow-back" size={24} color="#97ce4c" />
        </TouchableOpacity>
      </View>

      {/* Imagen */}
      <View className="items-center mt-16 mb-4">
        <View className="rounded-full border-[5px] border-[#97ce4c] shadow-[0_0_25px_#97ce4c]">
          <Image
            source={{ uri: character.image }}
            style={{ width: 250, height: 250, borderRadius: 125 }}
          />
        </View>
      </View>

      {/* Datos principales */}
      <View className="mx-5 mb-8 bg-[#111827] rounded-2xl p-6 border border-[#00ff9f]/40 shadow-xl shadow-[#00ff9f]/20">
        <Text className="text-3xl font-extrabold text-center text-[#00ff9f] mb-1">
          {character.name}
        </Text>
        <Text className="text-center text-[#8ee6ff] mb-4 font-semibold">
          #{character.id}
        </Text>

        <View className="space-y-3">
          <Text className="text-lg text-gray-200">
            <Text className="font-semibold text-[#97ce4c]">Status:</Text>{" "}
            {character.status}
          </Text>
          <Text className="text-lg text-gray-200">
            <Text className="font-semibold text-[#97ce4c]">Species:</Text>{" "}
            {character.species}
          </Text>
          <Text className="text-lg text-gray-200">
            <Text className="font-semibold text-[#97ce4c]">Gender:</Text>{" "}
            {character.gender}
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

      {/* Sección IA de Gemini */}
      <View className="mx-5 mb-10 bg-[#0b0c10] rounded-2xl p-6 border border-[#8ee6ff]/40 shadow-lg shadow-[#00bcd4]/30">
        <Text className="text-2xl font-extrabold text-center text-[#8ee6ff] mb-4">
          IA de Rick
        </Text>

        {/* Botón Saber más */}
        {!geminiText && !isGeminiLoading && (
          <TouchableOpacity
            onPress={() => callGemini(character)}
            className="bg-[#00bcd4] p-3 rounded-xl mt-2"
          >
            <Text className="text-white text-center font-bold text-lg">
              🧠 Saber más
            </Text>
          </TouchableOpacity>
        )}

        {isGeminiLoading && (
          <View className="items-center mt-4">
            <ActivityIndicator size="small" color="#8ee6ff" />
            <Text className="text-gray-400 mt-2">
              Consultando el multiverso...
            </Text>
          </View>
        )}

        {geminiText !== "" && (
          <Markdown
            style={{
              body: { color: "#e5e7eb", fontSize: 16, lineHeight: 22 },
              strong: { color: "#97ce4c" },
              heading1: { color: "#8ee6ff", fontSize: 24 },
              bullet_list: { marginLeft: 10 },
              paragraph: { marginTop: 6 },
            }}
          >
            {geminiText}
          </Markdown>
        )}
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
