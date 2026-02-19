const fs = require('fs');
const csv = require('csv-parser');

const propiedades = [];

fs.createReadStream('propiedades.csv')
  .pipe(csv())
  .on('data', (row) => { propiedades.push(row); })
  .on('end', () => {
    propiedades.forEach((propiedad, index) => {
      // 1. Manejo de fotos
      const fotosRaw = propiedad.Ruta_Foto || "";
      const listaFotos = fotosRaw.split(',').map(f => f.trim());
      
      const titulo = propiedad.Titulo || "Propiedad en Venta";
      const precio = propiedad.Precio || "Consultar";
      
      // 2. LIMPIEZA DE DIRECCIÓN PARA EL MAPA
      // Quitamos "Casa en venta", "10 ambientes", etc., para dejar solo la calle
      let direccionMapa = titulo.toLowerCase()
        .replace(/casa en venta|departamento en venta|en venta|ambientes|dormitorios/gi, '')
        .split(',')[0].trim(); 
      
      const linkGoogleMaps = `https://maps.google.com/maps?q=${encodeURIComponent(direccionMapa + " La Plata")}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

      let htmlFotos = "";
      listaFotos.forEach((foto, i) => {
        htmlFotos += `<div class="mySlides ${i === 0 ? 'active' : ''}"><img src="${foto}" onerror="this.src='https://via.placeholder.com/500x320?text=Foto+Propiedad'"></div>`;
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
        body { font-family: 'Segoe UI', sans-serif; background-color: #f8f9fa; margin: 0; display: flex; justify-content: center; }
        .container { background: white; max-width: 480px; width: 100%; min-height: 100vh; position: relative; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .slider-container { width: 100%; height: 350px; position: relative; background: #333; overflow: hidden; }
        .mySlides { display: none; width: 100%; height: 100%; }
        .mySlides.active { display: block; animation: fade 0.8s; }
        @keyframes fade { from {opacity: 0.5} to {opacity: 1} }
        .mySlides img { width: 100%; height: 100%; object-fit: cover; }
        .badge-precio { position: absolute; bottom: 20px; left: 20px; background: #25D366; color: white; padding: 10px 18px; border-radius: 12px; font-weight: bold; font-size: 22px; z-index: 10; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
        .content { padding: 25px; }
        h1 { font-size: 22px; color: #1c1e21; line-height: 1.3; margin: 0 0 20px 0; font-weight: 700; }
        .mapa-container { width: 100%; height: 250px; border-radius: 15px; overflow: hidden; margin-bottom: 25px; border: 1px solid #eee; }
        .mapa-frame { width: 100%; height: 100%; border: none; }
        .btns { display: flex; flex-direction: column; gap: 12px; }
        .btn { display: flex; align-items: center; justify-content: center; padding: 18px; border-radius: 15px; font-weight: bold; text-decoration: none; font-size: 16px; gap: 10px; transition: 0.3s; }
        .btn-wa { background: #25D366; color: white; }
        .btn-no { background: #ff4757; color: white; }
        .btn:active { transform: scale(0.96); }
        .legal { font-size: 11px; color: #999; text-align: center; margin-top: 30px; padding: 20px; border-top: 1px dotted #ccc; line-height: 1.5; }
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
            <div class="mapa-container">
                <iframe class="mapa-frame" src="${linkGoogleMaps}"></iframe>
            </div>
            <div class="btns">
                <a href="https://wa.me/5492215551234?text=Me interesa visitar: ${encodeURIComponent(titulo)}" class="btn btn-wa">
                    <i class="fa-brands fa-whatsapp"></i> ✅ QUIERO VISITARLA
                </a>
                <a href="https://wa.me/5492215551234?text=NO ME GUSTA esta opción: ${encodeURIComponent(titulo)}" class="btn btn-no">
                    <i class="fa-solid fa-xmark"></i> ❌ No me gusta
                </a>
            </div>
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
            }, 3500);
        }
    </script>
</body>
</html>`;
      fs.writeFileSync(`docs/propiedad_${index}.html`, htmlContent);
    });
    console.log('✅ Fichas actualizadas con limpieza de mapa y slider inteligente.');
  });