const fs = require('fs');

function generarContenidoParaRedes() {
    console.log("📝 Generando posteos con botones de interacción...");

    if (!fs.existsSync('propiedades.csv')) {
        console.log("❌ No se encontró propiedades.csv");
        return;
    }

    const contenido = fs.readFileSync('propiedades.csv', 'utf-8');
    const lineas = contenido.split('\n').slice(1);
    let reporteFinal = "📋 PANEL DE CALIFICACIÓN PARA EL CLIENTE\n\n";

    // --- CONFIGURACIÓN DEL AGENTE ---
    const nombreAgente = "PABLETE INMOBILIARIA";
    const miTelefono = "5492215551234"; // ⚠️ PONÉ TU CELULAR ACÁ (Sin el +)

    lineas.forEach((linea, i) => {
        if (!linea.trim() || linea.includes("ERROR")) return;

        const columnas = linea.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!columnas || columnas.length < 4) return;

        const urlOriginal = columnas[0].replace(/"/g, '');
        const titulo = columnas[1].replace(/"/g, '');
        const precio = columnas[2].replace(/"/g, '');

        // Crear los links de WhatsApp (Mensaje pre-armado)
        const msjMeGusta = encodeURIComponent(`👍 ¡Me gustó! Quiero visitar: ${titulo} (${precio}). Link: ${urlOriginal}`);
        const linkMeGusta = `https://wa.me/${miTelefono}?text=${msjMeGusta}`;

        const posteo = `
🏠 ${titulo.toUpperCase()}
💰 PRECIO: ${precio}
--------------------------------------------------
¿QUÉ TE PARECE ESTA OPCIÓN? 👇

✅ [ ME GUSTA / QUIERO VISITAR ]
Tocá acá: ${linkMeGusta}

❌ [ NO ME GUSTA ]
(Pasar a la siguiente)

--------------------------------------------------
🔗 Ver fotos originales: ${urlOriginal}

⚠️ CLÁUSULA LEGAL: "La información gráfica y escrita contenida es ilustrativa. Las medidas definitivas surgirán del título de propiedad. No nos responsabilizamos por errores de terceros."
--------------------------------------------------
\n`;

        reporteFinal += posteo;
    });

    fs.writeFileSync('PUBLICAR_AQUI.txt', reporteFinal);
    console.log("✅ ¡Listo! Sistema de 'Me Gusta' generado en PUBLICAR_AQUI.txt");
}

generarContenidoParaRedes();