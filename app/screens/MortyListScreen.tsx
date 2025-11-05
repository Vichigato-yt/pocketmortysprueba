import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import '@/global.css';

export default function MortyListScreen() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [isCreativeMode, setIsCreativeMode] = useState(false);
  const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  // ✅ Cargar personajes de la API de Rick y Morty
  useEffect(() => {
    axios
      .get("https://rickandmortyapi.com/api/character")
      .then((res) => setCharacters(res.data.results))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Función para consultar Gemini
  const consultarGemini = async (pregunta: string) => {
    if (!pregunta.trim()) return;

    setIsLoading(true);
    setResponse("");

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: [
            {
              parts: [
                {
                  text: isCreativeMode
                    ? `Genera una historia corta o idea creativa sobre: ${pregunta}`
                    : `Dame más información sobre el personaje de Rick y Morty llamado ${pregunta}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: isCreativeMode ? 0.9 : 0.5,
            maxOutputTokens: 500,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": API_KEY,
          },
        }
      );

      const result = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      setResponse(result || "No se obtuvo respuesta de Gemini.");
    } catch (error) {
      setResponse("Error al conectar con Gemini. Verifica tu API Key.");
      console.error(error);
    } finally {
      setValue("");
      setIsLoading(false);
    }
  };

  // ✅ Estilos simples inline para reemplazar PromptText y ResponseBox
  const PromptText = (
    <TextInput
      value={value}
      onChangeText={setValue}
      placeholder="Escribe el nombre de un personaje..."
      placeholderTextColor="#888"
      className="bg-gray-800 text-white p-3 rounded-md mb-3"
    />
  );

  const ResponseBox = response ? (
    <View className="bg-gray-800 p-4 rounded-md mt-3">
      <Text className="text-white">{response}</Text>
    </View>
  ) : null;

  return (
    <KeyboardAvoidingView className="flex-1 bg-gray-900">
      <ScrollView contentContainerClassName="p-6">
        <Text className="text-3xl font-bold text-pink-500 mb-4 text-center">
          Personajes de Rick y Morty
        </Text>

        {/* Lista de personajes */}
        <FlatList
          data={characters}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="bg-gray-800 p-4 mb-2 rounded-md">
              <Text className="text-white font-bold">{item.name}</Text>
              <Text className="text-gray-400">{item.species}</Text>
            </View>
          )}
        />

        {/* Chatbot de Gemini */}
        <View className="mt-8 border-t border-gray-700 pt-4">
          <Text className="text-xl font-semibold text-pink-400 mb-2 text-center">
            {isCreativeMode ? "Gemini Creativo" : "Gemini Informativo"}
          </Text>

          {PromptText}

          <TouchableOpacity
            onPress={() => consultarGemini(value)}
            disabled={isLoading}
            className="bg-pink-500 p-3 rounded-md items-center mb-2"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold">Preguntar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsCreativeMode(!isCreativeMode)}
            className="bg-gray-700 p-3 rounded-md items-center"
          >
            <Text className="text-white font-semibold">
              {isCreativeMode ? "Modo Informativo" : "Modo Creativo"}
            </Text>
          </TouchableOpacity>

          {ResponseBox}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
