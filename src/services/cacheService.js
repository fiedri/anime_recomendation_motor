import fileHandler from "../utils/fileHandler.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CacheService {
    constructor() {
        // Construimos la ruta absoluta hacia data/animeCache.json
        this.cachePath = path.join(__dirname, "../../data/animeCache.json");
        this.cache = null;
    }

    async loadCache() {
        if (this.cache) return this.cache;
        console.log(`[DEBUG] Buscando caché en: ${this.cachePath}`);
        try {
            this.cache = await fileHandler.readJSON(this.cachePath);
            console.log(`[CACHE] Cargada con éxito (${Object.keys(this.cache).length} entradas).`);
        } catch (error) {
            console.log("[CACHE] No se encontró caché previa o el archivo está corrupto, iniciando vacía.");
            this.cache = {};
        }
        return this.cache;
    }

    get(id) {
        return this.cache[id] || null;
    }

    updateInMemory(id, data) {
        this.cache[id] = data;
    }

    async saveToDisk() {
        try {
            await fileHandler.writeJSON(this.cachePath, this.cache);
            console.log(`[CACHE] Guardada en disco (${Object.keys(this.cache).length} entradas totales).`);
        } catch (err) {
            console.error("[CACHE] Error al guardar en disco:", err.message);
        }
    }
}

export default new CacheService();
