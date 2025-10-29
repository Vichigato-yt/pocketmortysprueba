// components/Error404.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export default function Error404({ onRetry }: { onRetry?: () => void }) {
  return (
    <View className="flex-1 justify-center items-center bg-[#0b0c10] p-4 rounded-2xl">
      <Image
        source={{
          uri: "https://rickandmortyapi.com/api/character/avatar/19.jpeg", // Evil Morty 😎
        }}
        style={{ width: 180, height: 180, borderRadius: 90, marginBottom: 16 }}
      />

      <Text className="text-[#97ce4c] text-5xl font-extrabold">404</Text>
      <Text className="text-[#00ff9f] text-xl font-semibold mt-2 text-center">
        ¡Personaje no encontrado!
      </Text>

      <Text className="text-gray-300 text-base mt-3 text-center">
        No pudimos encontrar ningún personaje con ese nombre.  
        ¡Prueba con otro universo!
      </Text>

      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="mt-6 px-5 py-3 bg-[#00ff9f] rounded-full shadow-lg shadow-[#00ff9f]/40"
        >
          <Text className="text-black font-bold text-lg">Volver a intentar 🔍</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
