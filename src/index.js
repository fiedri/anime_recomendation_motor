import fileHandler from "./utils/fileHandler.js";
import adnProcessor from "./logic/adnProcessor.js";
import jikanService from "./services/jikanService.js";
import Formatter from "./logic/formatter.js";
import utils from "./utils/utils.js";


async function main() {
    const startTime = Date.now();
    try {
        console.log(`[LOG] Inicio de secuencia: ${new Date().toISOString()}`);
        
        const rawData = await fileHandler.readXML("../data/animelist.xml");
        const { Completed, PlanToWatch } = await adnProcessor.processDataFromXML(rawData);
        console.log(`[DATA] XML procesado: ${Completed.length} Completados, ${PlanToWatch.length} Planificado para ver.`);

        console.log(`[JIKAN] Iniciando fetch de ${Completed.length} favoritos...`);
        const animeInfoListC = await jikanService.getAnimeInfo(Completed);
        
        const formatInfoListC = Formatter.formatInfo(animeInfoListC);
        const myADN = adnProcessor.generateADN(formatInfoListC);
    
        const totalGenres = Object.keys(myADN.genres).length;
        const totalThemes = Object.keys(myADN.themes).length;
        console.log(`[ADN] Perfil generado: ${totalGenres} géneros y ${totalThemes} temas analizados.`);
        
        await fileHandler.writeJSON("../data/myADN.json", myADN);

        // 3. Fase Ranking
        console.log(`[JIKAN] Consultando metadata de ${PlanToWatch.length} objetivos del PTW...`);
        const animePTWListInfo = await jikanService.getAnimeInfo(PlanToWatch);
        
        const preFilterCount = animePTWListInfo.length;
        const formatInfoListPTW = Formatter.formatInfo(animePTWListInfo)
            .filter(anime => anime.status === "Finished Airing" || anime.status === "Currently Airing");
        
        console.log(`[FILTER] Objetivos válidos: ${formatInfoListPTW.length}/${preFilterCount} (Descartados los no emitidos o no completados).`);

        const ptwRanking = adnProcessor.getRanking(formatInfoListPTW, myADN);
        await fileHandler.writeJSON("../data/ptwRanking.json", ptwRanking);

        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        const maxPossibleScore = 1000; // Suma de todos los pesos (300+200+200+100+100+100)
        console.log("\n================ REPORT ================");
        console.log(`TIEMPO DE EJECUCIÓN: ${duration}s`);
        console.log(`TOP 1: ${ptwRanking[0].titulo}`);
        console.log(`MATCH SCORE: ${ptwRanking[0].matchScore.toFixed(2)}`);
        console.log(`AFINIDAD ESTIMADA: ${Math.min((ptwRanking[0].matchScore / maxPossibleScore) * 100, 100).toFixed(1)}%`);
        console.log("==============================================\n");

    } catch (err) {
        console.error(`[ERROR FATAL] Interrupción en T+${((Date.now() - startTime) / 1000).toFixed(2)}s`);
        console.error(err.stack);
    }
}
main()