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
      
      // 📝 FRASE LEGAL ACTUALIZADA
      const fraseLegalDefinitiva = "La información gráfica y escrita contenida es ilustrativa. Las medidas definitivas surgirán del título de propiedad y de la liquidación de expensas definitiva.";

      const direccionMapa = encodeURIComponent(titulo.split('-')[0] + " La Plata");
      const linkGoogleMaps = `https://maps.google.com/maps?q=${direccionMapa}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

      const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titulo}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body { font-family: 'Segoe UI', sans-serif; background-color: #f0f2f5; margin: 0; display: flex; justify-content: center; padding: 20px; }
        .container { background: white; max-width: 480px; width: 100%; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .foto-principal { width: 100%; height: 320px; position: relative; background: #eee; }
        .foto-principal img { width: 100%; height: 100%; object-fit: cover; }
        .badge-precio { position: absolute; bottom: 20px; left: 20px; background: #25D366; color: white; padding: 10px 20px; border-radius: 10px; font-weight: bold; font-size: 20px; }
        .content { padding: 25px; }
        h1 { font-size: 20px; color: #1c1e21; margin: 0 0 15px 0; line-height: 1.4; }
        .mapa-frame { width: 100%; height: 180px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 20px; }
        .btns { display: flex; flex-direction: column; gap: 12px; }
        .btn { border: none; padding: 18px; border-radius: 12px; font-weight: bold; text-decoration: none; text-align: center; font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.2s; }
        .btn-wa { background: #25D366; color: white; box-shadow: 0 4px 10px rgba(37, 211, 102, 0.3); }
        .btn-no { background: #ff4757; color: white; box-shadow: 0 4px 10px rgba(255, 71, 87, 0.3); } /* BOTÓN ROJO */
        .btn:active { transform: scale(0.98); }
        .legal { font-size: 11px; color: #777; text-align: center; margin-top: 25px; padding-top: 15px; border-top: 2px dashed #eee; line-height: 1.5; font-style: italic; }
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
            
            <iframe class="mapa-frame" src="${linkGoogleMaps}"></iframe>

            <div class="btns">
                <a href="https://wa.me/5492215551234?text=Hola! Me interesa visitar: ${