import fs from "fs";
import xml2js from "xml2js";
const parser = new xml2js.Parser();
class fileHandler{
    static async readXML(filepath){
        try{
            const data = fs.readFileSync(filepath);
            return new Promise((resolve, reject) => {
            parser.parseString(data, (err, result) => {
                if (err) {
                    console.error("Error al parsear el XML, Rey.");
                    reject(err);
                }
                
                resolve(result.myanimelist.anime);
            });
        });
        }catch(err){
            console.error("Error al leer el archivo XML:", err);
            throw err;
        }
    }
    static async writeJSON(filepath, data){
        try{
            fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
        }catch(err){
            console.error("Error al escribir el archivo JSON:", err);
            throw err;}
    }
}

export default fileHandler;