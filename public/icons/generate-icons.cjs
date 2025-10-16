// Script para generar íconos PNG desde SVG
// Ejecutar: node public/icons/generate-icons.js

const fs = require('fs');
const path = require('path');

// Íconos necesarios (en orden de tamaño)
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// SVG base - Ícono simple para PWA
const generateSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo -->
  <rect width="${size}" height="${size}" fill="#1976d2" rx="${size * 0.15}"/>
  
  <!-- Círculo central -->
  <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.3}" fill="#ffffff"/>
  
  <!-- Decoración (forma de diamante) -->
  <path d="M ${size / 2} ${size * 0.3} L ${size * 0.65} ${size / 2} L ${size / 2} ${size * 0.7} L ${size * 0.35} ${size / 2} Z" fill="#1976d2"/>
  
  <!-- Texto PWA (solo en íconos grandes) -->
  ${size >= 192 ? `
  <text x="${size / 2}" y="${size * 0.9}" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.1}" 
        font-weight="bold"
        fill="#ffffff" 
        text-anchor="middle">PWA</text>
  ` : ''}
</svg>`;

// Crear directorio si no existe
const iconsDir = path.join(__dirname);
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('🎨 Generando íconos SVG...\n');

// Generar cada tamaño
sizes.forEach(size => {
    const filename = `icon-${size}x${size}.svg`;
    const filepath = path.join(iconsDir, filename);
    const svg = generateSVG(size);
    
    fs.writeFileSync(filepath, svg, 'utf8');
    console.log(`✅ Creado: ${filename}`);
});

console.log('\n✨ ¡Íconos SVG generados exitosamente!');
console.log('\n⚠️  NOTA IMPORTANTE para Android:');
console.log('Android NO soporta íconos SVG en notificaciones.');
console.log('Debes convertir estos SVG a PNG usando una de estas opciones:\n');
console.log('1. Herramienta online: https://realfavicongenerator.net/');
console.log('2. ImageMagick: magick convert icon-192x192.svg icon-192x192.png');
console.log('3. Abrir en navegador y "Guardar como PNG"');
console.log('\nArchivos críticos para Android:');
console.log('  - icon-192x192.png (notificaciones)');
console.log('  - icon-512x512.png (pantalla de inicio)');
