class adnProcessor {
    constructor(){
        this.myADN = { 
         totalItems: 0,
         source: {},
         demographics: {},
         genres: {},
         themes: {},
         studios: {},
         type: {},
         rating: {},
     }
    }

    async processDataFromXML(data){
        const completed = data.filter((value, index, array) => value.my_score >=7 && value.my_status[0] === "Completed")
    .map((value, index, array) => {
        return {
            id: value.series_animedb_id[0],
            title: value.series_title[0],
            score: value.my_score[0],
        }
    });
    const PWT = data.filter((value, index, array) => value.my_status[0] === "Plan to Watch")
    .map((value, index, array) => {
        return {
            id: value.series_animedb_id[0],
            title: value.series_title[0],
        }
    });
    return{
        Completed: completed,
        PlanToWatch: PWT,
    }
    }

    generateADN(items){
        this.myADN.totalItems = items.length;
        items.forEach((animeInfo, index, array) => {
         if(this.myADN.source[animeInfo.source]){
             this.myADN.source[animeInfo.source] += 1;
         }else{
             this.myADN.source[animeInfo.source] = 1;
         }
         animeInfo.demographics.forEach((demographic, index, array) => {
             if(this.myADN.demographics[demographic]){
                 this.myADN.demographics[demographic] += 1;
             }else{
                 this.myADN.demographics[demographic] = 1;
             }
         })
         animeInfo.genres.forEach((genre, index, array) => {
             if(this.myADN.genres[genre]){
                 this.myADN.genres[genre] += 1;
             }else{
                 this.myADN.genres[genre] = 1;
             }
         })
         animeInfo.themes.forEach((theme, index, array) => {
             if(this.myADN.themes[theme]){
                 this.myADN.themes[theme] += 1;
             }else{
                 this.myADN.themes[theme] = 1;
             }
         })
         animeInfo.studios.forEach((studio, index, array) => {
             if(this.myADN.studios[studio]){
                 this.myADN.studios[studio] += 1;
             }else{
                 this.myADN.studios[studio] = 1;
             }
         })
         if(this.myADN.type[animeInfo.type]){
             this.myADN.type[animeInfo.type] += 1;
         }else{
             this.myADN.type[animeInfo.type] = 1;
         }
         if(this.myADN.rating[animeInfo.rating]){
             this.myADN.rating[animeInfo.rating] += 1;
         }else{
             this.myADN.rating[animeInfo.rating] = 1;
         }
         
     })
     
     return this.myADN;
    }

    calculateMatch(animePTW, miADN){
    let scoreMatch = 0;
    const total = miADN.totalItems || 1;

    // 1. Juicio de Rating (Peso x300)
    if (animePTW.rating && miADN.rating[animePTW.rating]) {
        scoreMatch += (miADN.rating[animePTW.rating] / total) * 300;
    }

    // 2. Demografía (Peso x200)
    animePTW.demographics?.forEach(demo => {
        if (miADN.demographics[demo]) {
            scoreMatch += (miADN.demographics[demo] / total) * 200;
        }
    });

    // 3. Análisis de Temas (Peso x200)
    animePTW.themes?.forEach(tema => {
        if (miADN.themes[tema]) {
            scoreMatch += (miADN.themes[tema] / total) * 200; 
        }
    });

    // 4. Géneros (Peso x100)
    animePTW.genres?.forEach(genero => {
        if (miADN.genres[genero]) {
            scoreMatch += (miADN.genres[genero] / total) * 100;
        }
    });

    // 5. Origen (Peso x100)
    if (animePTW.source && miADN.source[animePTW.source]) {
        scoreMatch += (miADN.source[animePTW.source] / total) * 100;
    }

    // 6. Tipo (Peso x100)
    if (animePTW.type && miADN.type[animePTW.type]) {
        scoreMatch += (miADN.type[animePTW.type] / total) * 100;
    }

    return scoreMatch;
}
    getRanking(list, myADN){
        return list.map(anime => ({
         titulo: anime.title,
         matchScore: this.calculateMatch(anime, myADN)
    })).sort((a, b) => b.matchScore - a.matchScore);
    
    }
    
}

export default new adnProcessor();