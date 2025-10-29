import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MortyListScreen from '@/app/screens/MortyListScreen';
import CharacterDetailScreen from '@/app/screens/CharacterDetailScreen';

export type RootStackParamList = {
  MortyList: undefined;
  CharacterDetail: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function index() {
  return (
    <SafeAreaProvider>
        <Stack.Navigator initialRouteName="MortyList">
          <Stack.Screen
            name="MortyList"
            component={MortyListScreen}
          />
          <Stack.Screen
            name="CharacterDetail"
            component={CharacterDetailScreen}
            options={{ title: 'Morty Detail' }}
          />
        </Stack.Navigator>
    </SafeAreaProvider>
  );
}