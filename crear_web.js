const fs = require('fs');
const csv = require('csv-parser');

const propiedades = [];

fs.createReadStream('propiedades_full.csv')
  .pipe(csv())
  .on('data', (row) => {
    propiedades.push(row);
  })
  .on('end', () => {
    propiedades.forEach((propiedad, index) => {
      const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ficha de Propiedad</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; display: flex; justify-content: center; padding: 20px; }
        .card { background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); max-width: 400px; text-align: center; }
        img { max-width: 100%; border-radius: 10px; }
        h2 { color: #333; font-size: 18px; }
        .btn { display: inline-block; background-color: #00e676; color: white; padding: 15px 25px; text-decoration: none; border-radius: 10px; font-weight: bold; margin-top: 20px; font-size: 18px; }
        .footer { font-size: 10px; color: #777; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="card">
        <img src="fotos/propiedad_${index}.jpg" alt="Propiedad">
        <h2>${propiedad.titulo}</h2>
        <a href="https://wa.me/TU_TELEFONO_ACA" class="btn">✅ QUIERO VISITARLA</a>
        <div class="footer">
            ⚠️ CLÁUSULA LEGAL: La información es ilustrativa. Las medidas definitivas surgirán del título de propiedad.
        </div>
    </div>
</body>
</html>`;
      
      fs.writeFileSync(`docs/propiedad_${index}.html`, htmlContent);
    });
    console.log('✅ Fichas generadas en carpeta docs sin links externos.');
  });