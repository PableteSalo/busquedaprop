const fs = require('fs');
const csv = require('csv-parser');

const propiedades = [];

// Leemos el archivo CSV con los datos de las propiedades
fs.createReadStream('propiedades_full.csv')
  .pipe(csv())
  .on('data', (row) => {
    propiedades.push(row);
  })
  .on('end', () => {
    // Generamos un archivo HTML por cada propiedad
    propiedades.forEach((propiedad, index) => {
      const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ficha de Propiedad</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #e9ecef; display: flex; justify-content: center; padding: 20px; }
        .card { background: white; padding: 25px; border-radius: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.15); max-width: 450px; text-align: center; }
        img { max-width: 100%; border-radius: 15px; height: auto; }
        h2 { color: #343a40; font-size: 22px; margin-top: 15px; }
        .price { font-size: 20px; font-weight: bold; color: #2ecc71; margin: 10px 0; }
        .btn { display: inline-block; background-color: #25D366; color: white; padding: 18px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; margin-top: 25px; font-size: 18px; transition: background 0.3s; }
        .btn:hover { background-color: #128C7E; }
        .footer { font-size: 11px; color: #6c757d; margin-top: 30px; line-height: 1.4; border-top: 1px solid #eee; padding-top: 15px; }
    </style>
</head>
<body>
    <div class="card">
        <img src="fotos/propiedad_${index}.jpg" alt="Foto de la propiedad">
        <h2>${propiedad.titulo}</h2>
        <a href="https://wa.me/54911XXXXXXXX" class="btn">📲 CONSULTAR POR WHATSAPP</a>
        <div class="footer">
            ⚠️ CLÁUSULA LEGAL: La información es ilustrativa. Las medidas y precios definitivos surgirán del título de propiedad y tasación.
        </div>
    </div>
</body>
</html>`;
      
      // Guardamos el archivo en la carpeta docs
      fs.writeFileSync(`docs/propiedad_${index}.html`, htmlContent);
    });
    console.log('✅ Fichas generadas en carpeta docs sin links externos.');
  });