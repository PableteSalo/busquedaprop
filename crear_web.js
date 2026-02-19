const fs = require('fs');
const csv = require('csv-parser');

const propiedades = [];

fs.createReadStream('propiedades.csv')
  .pipe(csv())
  .on('data', (row) => {
    propiedades.push(row);
  })
  .on('end', () => {
    propiedades.forEach((propiedad, index) => {
      // Extraemos los datos (fijate que coincidan con los nombres de tus columnas en el CSV)
      const titulo = propiedad.Titulo || propiedad.titulo || "Propiedad en Venta";
      const precio = propiedad.Precio || propiedad.precio || "Consultar";
      const descripcion = propiedad.Descripcion || propiedad.descripcion || "Sin descripción disponible.";
      
      const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titulo}</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background-color: #f8f9fa; display: flex; justify-content: center; padding: 20px; line-height: 1.6; }
        .card { background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-width: 500px; text-align: center; }
        .foto-container { width: 100%; height: 300px; background-color: #eee; border-radius: 15px; overflow: hidden; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; }
        img { width: 100%; height: 100%; object-fit: cover; }
        h2 { color: #2c3e50; font-size: 24px; margin: 10px 0; }
        .precio { font-size: 22px; color: #27ae60; font-weight: bold; margin-bottom: 15px; }
        .descripcion { text-align: left; color: #555; font-size: 16px; margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 10px; }
        .btn { display: inline-block; background-color: #25D366; color: white; padding: 18px 35px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px; transition: transform 0.2s; }
        .btn:hover { transform: scale(1.05); }
        .footer { font-size: 11px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="foto-container">
            <img src="fotos/propiedad_${index}.jpg" onerror="this.src='https://via.placeholder.com/500x300?text=Cargando+Imagen...'" alt="Propiedad">
        </div>
        <h2>${titulo}</h2>
        <div class="precio">💰 ${precio}</div>
        <div class="descripcion">
            <strong>Descripción:</strong><br>
            ${descripcion}
        </div>
        <a href="https://wa.me/5492215551234" class="btn">✅ QUIERO VISITARLA</a>
        <div class="footer">
            ⚠️ La información es ilustrativa. Las medidas definitivas surgirán del título de propiedad.
        </div>
    </div>
</body>
</html>`;
      
      fs.writeFileSync(`docs/propiedad_${index}.html`, htmlContent);
    });
    console.log('✅ Fichas con descripción generadas en docs/');
  });