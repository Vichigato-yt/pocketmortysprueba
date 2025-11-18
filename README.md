### Rick & Morty Explorer + Gemini AI

Un proyecto en React Native + Expo Router que permite explorar personajes de la serie Rick & Morty y obtener análisis avanzados generados con Gemini AI.
Incluye un diseño moderno, soporte para Markdown bonito y efectos visuales optimizados.

## ✨ Características principales
# 🔍 Exploración de Personajes

Lista de personajes consumidos desde la API oficial de Rick & Morty.

Detalles completos: estado, especie, género, origen, ubicación y más.

Imágenes con borde luminoso estilo sci-fi.

# 🤖 Análisis con Gemini AI
  
Botón "Saber más" dentro de la pantalla del personaje.

Se hace un prompt dinámico basado en:

Episodios donde aparece el personaje.

Personajes relacionados.

Respuesta en Markdown bonito usando react-native-markdown-display.

# 🧭 Navegación con Expo Router

Navegación simple y clara basada en archivos.

Botón superior para volver al Home usando Ionicons.

# 🎨 UI moderna con Tailwind (NativeWind)

Estilos oscuros, vibrantes y con sombras neón.

Compatible con iOS, Android y Web.

## 🛠️ Tecnologías utilizadas

React Native (con Expo)

Expo Router

TypeScript

NativeWind para estilos (Tailwind)

Google GenAI SDK (@google/genai)

react-native-markdown-display

Axios

Ionicons

### Instalación
# 1️⃣ Clona el repositorio
git clone https://github.com/tu-usuario/rick-and-morty-explorer.git
cd rick-and-morty-explorer

# 2️⃣ Instala dependencias
npm install

# 3️⃣ Agrega tu API Key de Gemini

Crea un archivo .env en la raíz del proyecto:

EXPO_PUBLIC_GEMINI_API_KEY=TU_API_KEY_AQUI


⚠️ Debe comenzar con EXPO_PUBLIC_ para que Expo pueda utilizarla en el cliente.

# 4️⃣ Ejecuta el proyecto
npx expo start

📂 Estructura del proyecto
📦 src
 ┣ 📂 screens
 ┃ ┣ MortyListScreen.tsx
 ┃ ┗ CharacterDetailScreen.tsx
 ┣ 📂 components
 ┣ 📂 types
 ┃ ┗ rmapi.ts
 ┣ app
 ┃ ┣ index.tsx
 ┃ ┗ [...routes]

## 🤖 Cómo funciona la integración con Gemini

Dentro de CharacterDetailScreen.tsx se prepara un prompt inteligente que:

Analiza episodios donde aparece el personaje.

Obtiene personajes relacionados.

Pide a Gemini respuesta en español con emojis y formato Markdown.

Luego el texto es renderizado con:

import Markdown from "react-native-markdown-display";

# 🎨 Mejoras visuales incluidas

Colores temáticos de Rick & Morty.

Sombra luminosa verde y azul.

Botón superior para volver a la pantalla principal:

<Ionicons name="arrow-back" size={24} color="#97ce4c" />

## 🧪 API utilizada

📡 Rick & Morty API
https://rickandmortyapi.com/

Permite obtener personajes, episodios y ubicaciones.

🧑‍💻 Autor  

Vicente Mendieta

🛸 Wubba Lubba Dub Dub!


![Demostración de la app](./assets/GIFAPP.gif)
