const fs = require('fs');

function generarFichasWeb() {
    console.log("🌐 GENERANDO FICHAS WEB PROFESIONALES...");

    if (!fs.existsSync('propiedades.csv')) return;
    if (!fs.existsSync('web')) fs.mkdirSync('web'); // Carpeta donde irán las páginas

    const contenido = fs.readFileSync('propiedades.csv', 'utf-8');
    const lineas = contenido.split('\n').slice(1);

    lineas.forEach((linea, i) => {
        if (!linea.trim() || linea.includes("ERROR")) return;
        const columnas = linea.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!columnas) return;

        const titulo = columnas[1].replace(/"/g, '');
        const precio = columnas[2].replace(/"/g, '');
        const urlOriginal = columnas[0].replace(/"/g, '');
        const rutaFotoLocal = `../fotos/propiedad_${i}.jpg`; // Buscamos la foto que ya bajamos

        // Link de WhatsApp para el botón
        const miTelefono = "5492214959216"; // Usé el de tu captura
        const msjWa = encodeURIComponent(`¡Hola! Me interesa visitar: ${titulo}`);
        const linkWa = `https://wa.me/${miTelefono}?text=${msjWa}`;

        // DISEÑO DE LA PÁGINA (HTML + CSS)
        const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${titulo}</title>
            <style>
                body { font-family: sans-serif; margin: 0; background: #f4f4f4; text-align: center; }
                .container { max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
                img { width: 100%; border-radius: 10px; }
                h1 { font-size: 20px; color: #333; }
                .price { font-size: 24px; color: #2ecc71; font-weight: bold; }
                .btn { display: block; background: #25d366; color: white; padding: 15px; text-decoration: none; border-radius: 10px; margin-top: 20px; font-weight: bold; font-size: 18px; }
                .legal { font-size: 10px; color: #999; margin-top: 30px; text-align: justify; }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="${rutaFotoLocal}" alt="Propiedad">
                <h1>${titulo}</h1>
                <p class="price">${precio}</p>
                <a href="${linkWa}" class="btn">✅ QUIERO VISITARLA</a>
                <a href="${urlOriginal}" style="display:block; margin-top:15px; color:#3498db;">Ver ficha original</a>
                <div class="legal">⚠️ CLÁUSULA LEGAL: La información es ilustrativa. Las medidas definitivas surgirán del título de propiedad.</div>
            </div>
        </body>
        </html>`;

        fs.writeFileSync(`web/propiedad_${i}.html`, html);
    });

    console.log("✅ ¡Páginas web creadas en la carpeta 'web'!");
}

generarFichasWeb();