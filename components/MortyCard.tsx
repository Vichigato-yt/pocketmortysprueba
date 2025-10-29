// components/MortyCard.tsx
import "@/global.css"
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import type { Character } from '../types/rmapi';

type Props = {
  item: Character;
  onPress?: () => void;
};

export default function MortyCard({ item, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center bg-white rounded-lg p-3 mb-3 shadow">
      <Image
        source={{ uri: item.image }}
        style={{ width: 72, height: 72, borderRadius: 12 }}
        className="mr-3"
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-900">{item.name}</Text>
        <Text className="text-sm text-gray-500">#{item.id} • {item.species}</Text>
      </View>
    </TouchableOpacity>
  );
}
