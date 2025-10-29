// components/Error404.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface Error404Props {
  message?: string;
  onRetry?: () => void;
  buttonText?: string;
}

export default function Error404({ 
  message = "No se encontraron resultados", 
  onRetry,
  buttonText = "Reintentar"
}: Error404Props) {
  return (
    <View className="flex-1 justify-center items-center px-6 bg-gray-100">
      {/* Portal Gun Icon (usando emoji como alternativa) */}
      <View className="mb-6">
        <Image source={require('@/assets/portal-gun.png')} className="w-32 h-32"></Image>
      </View>
      
      {/* Error 404 Title */}
      <Text className="text-6xl font-bold text-green-600 mb-2">404</Text>
      
      {/* Subtitle */}
      <Text className="text-xl font-semibold text-gray-800 mb-3 text-center">
        ¡Aw geez!
      </Text>
      
      {/* Message */}
      <Text className="text-base text-gray-600 text-center mb-8 px-4">
        {message}
      </Text>
      
      {/* Portal animation decoration */}
      <View className="mb-8 flex-row gap-2">
        <View className="w-3 h-3 rounded-full bg-green-400" />
        <View className="w-3 h-3 rounded-full bg-green-500" />
        <View className="w-3 h-3 rounded-full bg-green-600" />
      </View>
      
      {/* Retry Button */}
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-green-600 px-8 py-4 rounded-lg active:bg-green-700"
        >
          <Text className="text-white font-semibold text-base">
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
      
      {/* Footer message */}
      <Text className="text-sm text-gray-500 mt-8 text-center italic">
        Parece que este personaje está en otra dimensión...
      </Text>
    </View>
  );
}