import fileHandler from "../utils/fileHandler.js";

class CacheService {
    constructor(cachePath) {
        this.cachePath = cachePath;
        this.cache = null;
    }

    async loadCache() {
        if (this.cache) return this.cache;
        try {
            this.cache = await fileHandler.readJSON(this.cachePath);
        } catch (error) {
            console.log("[CACHE] No se encontró caché previa, creando una nueva...");
            this.cache = {};
        }
        return this.cache;
    }

    get(id) {
        return this.cache[id] || null;
    }

    async set(id, data) {
        this.cache[id] = data;
        await fileHandler.writeJSON(this.cachePath, this.cache);
    }
}

export default new CacheService("../data/animeCache.json");
