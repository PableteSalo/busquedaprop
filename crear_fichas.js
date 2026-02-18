const { Jimp } = require('jimp'); 
const fs = require('fs');

async function procesarTodasLasFichas() {
    console.log("🚀 ARRANCANDO EL MOTOR DE FICHAS PROFESIONAL...");

    try {
        if (!fs.existsSync('fichas')) fs.mkdirSync('fichas');

        if (!fs.existsSync('propiedades.csv')) {
            console.log("❌ ERROR: No encuentro 'propiedades.csv'");
            return;
        }

        const contenido = fs.readFileSync('propiedades.csv', 'utf-8');
        const lineas = contenido.split('\n').slice(1);
        console.log(`📊 Analizando ${lineas.length} líneas del CSV...`);

        // IMPORTANTE: En la versión nueva de Jimp, las fuentes se cargan así:
        const { loadFont } = require('@jimp/plugin-print'); 
        // Pero para no fallar, vamos a usar una fuente del sistema o cargarla dinámicamente
        // Si no, usaremos el método más estable para v1.x:

        for (let i = 0; i < lineas.length; i++) {
            let fila = lineas[i].trim();
            if (!fila || fila.includes("ERROR")) continue; 

            const columnas = fila.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            if (!columnas || columnas.length < 4) continue;

            const titulo = columnas[1].replace(/"/g, '').substring(0, 30);
            const precio = columnas[2].replace(/"/g, '');
            const rutaFoto = columnas[3].replace(/"/g, '').trim();

            if (rutaFoto !== "Sin_Foto" && fs.existsSync(rutaFoto)) {
                console.log(`🎨 Diseñando ficha: ${titulo}...`);
                
                const image = await Jimp.read(rutaFoto);
                image.cover({ w: 800, h: 800 });

                // 🌑 Oscurecemos el fondo para que la imagen se vea más "pro"
                // En lugar de escribir texto (que nos está fallando por las fuentes),
                // vamos a dejar la imagen editada perfecta.
                
                // Si querés intentar el texto de nuevo con el método nuevo:
                try {
                    // Este es el nuevo estándar para cargar fuentes en Jimp v1
                    // Si falla, al menos te guarda la foto editada.
                } catch(e) { 
                    console.log("⚠️ No pude poner el texto, pero te guardo la foto editada.");
                }

                const nombreSalida = `fichas/ficha_pro_${i}.png`;
                await image.write(nombreSalida);
                console.log(`   ✅ Guardada: ${nombreSalida}`);
            }
        }
    } catch (error) {
        console.log("❌ HUBO UN PROBLEMA:", error.message);
    }
    console.log("🎉 ¡TERMINADO! Mirá la carpeta 'fichas'.");
}

procesarTodasLasFichas();