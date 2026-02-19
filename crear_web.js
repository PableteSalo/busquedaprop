const fs = require('fs');
const csv = require('csv-parser');

const propiedades = [];

fs.createReadStream('propiedades.csv')
  .pipe(csv())
  .on('data', (row) => { propiedades.push(row); })
  .on('end', () => {
    propiedades.forEach((propiedad, index) => {
      // Soporte para múltiples fotos separadas por coma
      const fotosRaw = propiedad.Ruta_Foto || "";
      const listaFotos = fotosRaw.includes(',') ? fotosRaw.split(',') : [fotosRaw];
      
      const titulo = propiedad.Titulo || "Propiedad en Venta";
      const precio = propiedad.Precio || "Consultar";
      
      // Limpiamos el título para el mapa (quitamos "ERROR" y textos raros)
      const direccionLimpia = titulo.replace(/ERROR:.*satisfied/gi, '').split('-')[0].trim() + ", La Plata";

      let htmlFotos = "";
      listaFotos.forEach((foto, i) => {
        const rutaLimpia = foto.trim().replace('fotos/', 'fotos/');
        htmlFotos += `<div class="mySlides ${i === 0 ? 'active' : ''}"><img src="${rutaLimpia}" onerror="this.src='https://via.placeholder.com/500x320?text=Foto+Inmobiliaria'"></div>`;
      });

      const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titulo}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { font-family: 'Segoe UI', sans-serif; background-color: #f4f4f7; margin: 0; padding: 0; display: flex; justify-content: center; }
        .container { background: white; max-width: 480px; width: 100%; min-height: 100vh; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .slider-container { width: 100%; height: 350px; position: relative; background: #000; }
        .mySlides { display: none; width: 100%; height: 100%; }
        .mySlides.active { display: block; }
        .mySlides img { width: 100%; height: 100%; object-fit: cover; }
        .badge-precio { position: absolute; bottom: 20px; left: 20px; background: #25D366; color: white; padding: 8px 15px; border-radius: 8px; font-weight: bold; font-size: 22px; z-index: 10; }
        .content { padding: 20px; }
        h1 { font-size: 20px; color: #333; line-height: 1.3; margin-bottom: 20px; }
        .mapa-frame { width: 100%; height: 250px; border-radius: 15px; border: none; margin: 20px 0; background: #eee; }
        .btn { display: flex; align-items: center; justify-content: center; padding: 18px; border-radius: 12px; font-weight: bold; text-decoration: none; margin-bottom: 12px; font-size: 16px; gap: 10px; }
        .btn-wa { background: #25D366; color: white; }
        .btn-no { background: #ff4757; color: white; }
        .legal { font-size: 11px; color: #999; text-align: center; margin-top: 30px; padding: 20px; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="slider-container">
            ${htmlFotos}
            <div class="badge-precio">${precio}</div>
        </div>
        <div class="content">
            <h1>${titulo}</h1>
            
            <iframe class="mapa-frame" src="https://maps.google.com/maps?q=${encodeURIComponent(direccionLimpia)}&t=&z=15&ie=UTF8&iwloc=&output=embed"></iframe>

            <a href="https://wa.me/5492215551234?text=Interesado en: ${encodeURIComponent(titulo)}" class="btn btn-wa">✅ QUIERO VISITARLA</a>
            <a href="https://wa.me/5492215551234?text=DESCARTAR: ${encodeURIComponent(titulo)}" class="btn btn-no">❌ No me gusta</a>
        </div>
        <div class="legal">⚠️ La información gráfica y escrita contenida es ilustrativa. Las medidas definitivas surgirán del título de propiedad y de la liquidación de expensas definitiva.</div>
    </div>

    <script>
        let current = 0;
        const slides = document.querySelectorAll('.mySlides');
        if(slides.length > 1) {
            setInterval(() => {
                slides[current].classList.remove('active');
                current = (current + 1) % slides.length;
                slides[current].classList.add('active');
            }, 3000);
        }
    </script>
</body>
</html>`;
      fs.writeFileSync(`docs/propiedad_${index}.html`, htmlContent);
    });
    console.log('✅ Web Actualizada.');
  });