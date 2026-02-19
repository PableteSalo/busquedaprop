const fs = require('fs');
const csv = require('csv-parser');

const propiedades = [];

console.log("📝 Generando mensajes para WhatsApp con links de TU WEB...");

fs.createReadStream('propiedades.csv')
  .pipe(csv())
  .on('data', (row) => { propiedades.push(row); })
  .on('end', () => {
    let reporteFinal = "📋 PANEL DE CALIFICACIÓN DE PROPIEDADES\n\n";
    
    // ⚠️ CONFIGURACIÓN: Tu teléfono y URL de tu GitHub
    const miTelefono = "5492215551234"; 
    const urlBaseWeb = "https://pabletesalo.github.io/busquedaprop";

    propiedades.forEach((propiedad, i) => {
      const titulo = propiedad.Titulo || "Propiedad";
      const precio = propiedad.Precio || "Consultar";
      
      // Link a TU web generada
      const miLinkWeb = `${urlBaseWeb}/propiedad_${i}.html`;

      // Mensaje pre-armado para "Me gusta"
      const msjMeGusta = encodeURIComponent(`👍 ¡Me gustó esta propiedad! Quiero visitar: ${titulo} (${precio}).`);
      const linkMeGusta = `https://wa.me/${miTelefono}?text=${msjMeGusta}`;

      const posteo = `
🏠 *${titulo.toUpperCase()}*
💰 *PRECIO:* ${precio}
----------------------------------
¿QUÉ TE PARECE ESTA OPCIÓN? 👇

✅ *[ ME GUSTA / QUIERO VISITAR ]*
Tocá acá: ${linkMeGusta}

❌ *[ NO ME GUSTA / DESCARTAR ]*
Tocá acá: ${miLinkWeb} (Tocá "No me gusta" en la ficha)
----------------------------------
🔗 *Ver detalles y fotos:* ${miLinkWeb}
\n`;

      reporteFinal += posteo;
    });

    fs.writeFileSync('PUBLICAR_AQUI.txt', reporteFinal);
    console.log("✅ ¡Listo! Sistema de posteos generado en PUBLICAR_AQUI.txt");
  });