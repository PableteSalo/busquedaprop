const fs = require('fs');
const csv = require('csv-parser');

const propiedades = [];

fs.createReadStream('propiedades.csv')
  .pipe(csv())
  .on('data', (row) => { propiedades.push(row); })
  .on('end', () => {
    propiedades.forEach((propiedad, index) => {
      const nombreFotoReal = propiedad.Ruta_Foto ? propiedad.Ruta_Foto.replace('fotos/', '') : `propiedad_${index}.jpg`;
      const titulo = propiedad.Titulo || "Propiedad en Venta";
      const precio = propiedad.Precio || "Consultar";
      
      // Intentamos extraer datos del título si no hay columnas específicas
      const ambientes = titulo.match(/\d+ amb/i) || ["--"];
      const dormitorios = titulo.match(/\d+ dorm/i) || ["--"];
      
      // Creamos un link de Google Maps basado en el título (limpiando el texto)
      const direccionMapa = encodeURIComponent(titulo.split('-')[0] + " La Plata");
      const googleMapsIframe = `https://www.google.com/maps/embed/v1/place?key=PEGA_AQUI_TU_API_KEY&q=${direccionMapa}`;
      // Nota: Como no tenemos API Key, usaremos el link directo que es más fácil:
      const linkGoogleMaps = `https://www.google.com/maps?q=${direccionMapa}&output=embed`;

      const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titulo}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; margin: 0; display: flex; justify-content: center; padding: 20px; }
        .container { background: white; max-width: 480px; width: 100%; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .foto-principal { width: 100%; height: 320px; position: relative; background: #eee; }
        .foto-principal img { width: 100%; height: 100%; object-fit: cover; }
        .badge-precio { position: absolute; top: 20px; right: 20px; background: #25D366; color: white; padding: 8px 15px; border-radius: 8px; font-weight: bold; font-size: 18px; }
        .content { padding: 25px; }
        h1 { font-size: 20px; color: #1c1e21; margin: 0 0 15px 0; line-height: 1.4; }
        .stats { display: flex; justify-content: space-around; background: #f8f9fa; padding: 15px; border-radius: 12px; margin-bottom: 20px; }
        .stat-item { text-align: center; font-size: 12px; color: #65676b; }
        .stat-item i { display: block; font-size: 18px; color: #1c1e21; margin-bottom: 5px; }
        .mapa-frame { width: 100%; height: 200px; border-radius: 12px; border: none; margin-bottom: 20px; }
        .btns { display: flex; flex-direction: column; gap: 12px; }
        .btn { border: none; padding: 16px; border-radius: 10px; font-weight: bold; text-decoration: none; text-align: center; font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .btn-wa { background: #25D366; color: white; }
        .btn-no { background: #f0f2f5; color: #4b4b4b; font-size: 14px; }
        .legal { font-size: 10px; color: #8a8d91; text-align: center; margin-top: 20px; line-height: 1.4; }
    </style>
</head>
<body>
    <div class="container">
        <div class="foto-principal">
            <img src="fotos/${nombreFotoReal}" onerror="this.src='https://via.placeholder.com/500x320?text=Foto+Inmobiliaria'" alt="Propiedad">
            <div class="badge-precio">${precio}</div>
        </div>
        <div class="content">
            <h1>${titulo}</h1>
            
            <div class="stats">
                <div class="stat-item"><i class="fa-solid fa-bed"></i>${dormitorios[0]} Dorm.</div>
                <div class="stat-item"><i class="fa-solid fa-expand"></i>-- m²</div>
                <div class="stat-item"><i class="fa-solid fa-bath"></i>-- Baños</div>
            </div>

            <iframe class="mapa-frame" src="${linkGoogleMaps}"></iframe>

            <div class="btns">
                <a href="https://wa.me/5492215551234?text=Hola! Me interesa visitar: ${encodeURIComponent(titulo)}" class="btn btn-wa">
                    <i class="fa-brands fa-whatsapp"></i> QUIERO VISITARLA
                </a>
                <a href="https://wa.me/5492215551234?text=No me interesa esta opción: ${encodeURIComponent(titulo)}" class="btn btn-no">
                    ❌ No me gusta / Descartar
                </a>
            </div>

            <p class="legal">⚠️ La información gráfica y escrita contenida es ilustrativa. Las medidas definitivas surgirán del título de propiedad.</p>
        </div>
    </div>
</body>
</html>`;
      fs.writeFileSync(`docs/propiedad_${index}.html`, htmlContent);
    });
    console.log('✅ Fichas con Mapa e Inteligencia de Título generadas.');
  });