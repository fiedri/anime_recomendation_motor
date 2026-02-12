class Formatter{
    static formatInfo(animeInfo){
        const formattedInfoList = animeInfo.map((animeInfo, index, array) =>{
         // estudios (studios)
         // genero (genres)
         // temas (themes)
         // type
         // rating
         // source
         // demographics
         // score
         // status
         return {
             title: animeInfo.data.title,
             studios: animeInfo.data.studios.map((studio, index, array) => studio.name),
             genres: animeInfo.data.genres.map((genre, index, array) => genre.name),
             themes: animeInfo.data.themes.map((theme, index, array) => theme.name),
             type: animeInfo.data.type,
             rating: animeInfo.data.rating,
             source: animeInfo.data.source,
             demographics: animeInfo.data.demographics.map((demographic, index, array) => demographic.name),
             score: animeInfo.data.score,
             status: animeInfo.data.status,
         }     
     })
     return formattedInfoList;
    }
}

export default Formatter;