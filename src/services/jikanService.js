import Utils from "../utils/utils.js";
import cacheService from "./cacheService.js";

class jikanService {
    constructor(url){
        this.url = url;
    }
    async getAnimeInfo(List){
    const animeInfoList = [];
    let longitud = List.length;
    
    // Cargamos la caché una sola vez al inicio
    await cacheService.loadCache();

    for (const [index, anime] of List.entries()){   
        const animeId = String(anime.id); // Asegurar que el ID sea un String
        
        // Intentar obtener de la caché
        const cachedData = cacheService.get(animeId);
        if (cachedData) {
            animeInfoList.push(cachedData);
            console.log(`[${index+1}/${longitud}] (CACHÉ) ${anime.title}`);
            continue;
        }

        // Si no está en caché, hacemos el fetch
        try {
            const response = await fetch(`${this.url}/anime/${animeId}/full`);
            
            if (!response.ok) {
                console.warn(`[WARN] No se pudo obtener info para ID ${animeId} (${anime.title}). Status: ${response.status}`);
                continue;
            }

            const animeInfo = await response.json();
            
            if (animeInfo && animeInfo.data) {
                animeInfoList.push(animeInfo);
                await cacheService.set(animeId, animeInfo); // Guardar con ID string
                console.log(`[${index+1}/${longitud}] Procesado: ${anime.title}`);
            } else {
                console.warn(`[WARN] Datos inválidos para ID ${animeId}`);
            }

        } catch (error) {
            console.error(`[ERROR] Error en fetch para ID ${anime.id}:`, error.message);
        }

        await Utils.sleep(2000); // Respetar Rate Limit solo si hubo fetch
    }
    return animeInfoList;
}
}

export default new jikanService("https://api.jikan.moe/v4");