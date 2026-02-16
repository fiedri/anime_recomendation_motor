# Anime Recommendation Motor 🚀

Un motor de recomendación de anime inteligente que analiza tu perfil de MyAnimeList (MAL) para encontrar qué series de tu lista "Plan to Watch" (PTW) se ajustan mejor a tus gustos personales.

## 📋 Descripción

Este proyecto procesa un archivo XML exportado de MyAnimeList, analiza tus animes completados (especialmente aquellos con puntuación ≥ 7) y genera un perfil de "ADN" basado en múltiples metadatos. Luego, utiliza ese perfil para puntuar y rankear tu lista de pendientes, dándote una recomendación personalizada de qué ver a continuación.

## ✨ Características

- **Análisis de Perfil (ADN):** Genera un perfil de preferencias basado en:
    - Clasificación (Rating)
    - Demografía
    - Temas
    - Géneros
    - Material de origen (Source)
    - Tipo de medio (TV, Movie, etc.)
- **Integración con Jikan API:** Utiliza la API v4 de MyAnimeList para obtener metadatos detallados.
- **Sistema de Caché Inteligente:** Almacena la información de los animes localmente para evitar peticiones redundantes y respetar los límites de la API.
- **Algoritmo de Match:** Calcula una puntuación de afinidad (Match Score) ponderada para cada anime en tu lista de pendientes.

## 🚀 Instalación

Asegúrate de tener [Node.js](https://nodejs.org/) instalado. Este proyecto utiliza `pnpm` como gestor de paquetes.

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   pnpm install
   ```

## 🛠️ Uso

1. **Exporta tu lista:** Ve a MyAnimeList y exporta tu lista de anime en formato XML.
2. **Prepara los datos:** Guarda el archivo exportado como `data/animelist.xml`.
3. **Ejecuta el motor:**
   ```bash
   node src/index.js
   ```

## 📊 Salida de Datos

El programa generará los siguientes archivos en la carpeta `data/`:

- `myADN.json`: El perfil de tus gustos analizados.
- `ptwRanking.json`: Tu lista "Plan to Watch" ordenada por afinidad.
- `cache.json`: Almacén de metadatos para acelerar futuras ejecuciones.

## ⚖️ Pesos del Algoritmo

El ranking se calcula sumando puntos basados en la coincidencia con tu perfil:
- **Rating:** x300
- **Demografía:** x200
- **Temas:** x200
- **Géneros:** x100
- **Origen:** x100
- **Tipo:** x100

## 🛠️ Tecnologías

- **Node.js**
- **xml2js**: Para procesar el archivo XML de MAL.
- **Jikan API**: Para obtener información detallada de los animes.

---
Desarrollado para optimizar el tiempo de decisión sobre qué anime ver a continuación. 📺✨
