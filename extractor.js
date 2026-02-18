const Jimp = require('jimp');
const fs = require('fs');

async function procesarTodasLasFichas() {
    console.log("🎨 BusquedaProp: Generando fichas personalizadas...");

    // 📂 Crear carpeta de salida si no existe
    if (!fs.existsSync('fichas')) {
        fs.mkdirSync('fichas');
        console.log("📁 Carpeta 'fichas' creada.");
    }

    // 📖 Leer el CSV que generó el bot anterior
    if (!fs.existsSync('propiedades.csv')) {
        console.log("❌ Error: No se encontró 'propiedades.csv'. Primero debés correr el extractor.");
        return;
    }

    const contenido = fs.readFileSync('propiedades.csv', 'utf-8');
    const lineas = contenido.split('\n').slice(1); // Saltamos el encabezado

    for (let i = 0; i < lineas.length; i++) {
        const linea = linea.trim();
        if (!linea) continue;

        // Separar columnas: Link, Titulo, Precio, Ruta_Foto
        const columnas = linea.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        
        if (!columnas || columnas.length < 4) continue;

        const titulo = columnas[1].replace(/"/g, '');
        const precio = columnas[2].replace(/"/g, '');
        const rutaFoto = columnas[3].replace(/"/g, '');

        // 🛠️ DATOS DEL AGENTE (Cambiá esto a tu gusto)
        const nombreAgente = "PABLETE PROPIEDADES"; 
        const contacto = "WA: 221-555-1234";

        if (rutaFoto !== "Sin_Foto" && fs.existsSync(rutaFoto)) {
            try {
                const image = await Jimp.read(rutaFoto);
                
                // Cargamos fuentes estándar de Jimp
                const fontGrande = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
                const fontChica = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);

                // 1. Formato cuadrado (ideal para Instagram/WhatsApp)
                image.cover(800, 800);

                // 2. Barra inferior elegante (negro traslúcido)
                const h = 140;
                const barra = new Jimp(800, h, '#000000cc'); 
                image.composite(barra, 0, 800 - h);

                // 3. Precio (en grande)
                image.print(fontGrande, 30, 800 - 115, precio);

                // 4. Título de la casa
                image.print(fontChica, 30, 800 - 65, titulo.substring(0, 50).toUpperCase());

                // 5. Firma del Agente
                image.print(fontChica, 550, 800 - 95, nombreAgente);
                image.print(fontChica, 550, 800 - 70, contacto);

                // 6. Guardar el resultado
                const nombreArchivo = `fichas/ficha_${i}.jpg`;
                await image.writeAsync(nombreArchivo);
                console.log(`✅ Ficha creada con éxito: ${nombreArchivo}`);

            } catch (err) {
                console.log(`❌ Error con la imagen ${rutaFoto}: ${err.message}`);
            }
        } else {
            console.log(`⏭️ Saltando ${i}: Sin foto disponible.`);
        }
    }
    console.log("🎉 ¡Terminado! Ya podés ver tus fichas en la carpeta 'fichas'.");
}

procesarTodasLasFichas();