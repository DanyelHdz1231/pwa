#!/usr/bin/env node

/**
 * Script de verificación PWA
 * Verifica que todos los componentes PWA estén correctamente implementados
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando implementación PWA...\n');

// Verificar archivos requeridos
const requiredFiles = [
  'manifest.json',
  'public/service-worker.js',
  'public/icons/icon-192x192.svg',
  'public/icons/icon-512x512.svg',
  'src/App.tsx',
  'index.html'
];

let allFilesExist = true;

console.log('📁 Verificando archivos requeridos:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Verificar manifest.json
console.log('\n📄 Verificando manifest.json:');
try {
  const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  console.log(`✅ name: "${manifest.name}"`);
  console.log(`✅ short_name: "${manifest.short_name}"`);
  console.log(`✅ start_url: "${manifest.start_url}"`);
  console.log(`✅ display: "${manifest.display}"`);
  console.log(`✅ icons: ${manifest.icons.length} iconos configurados`);
} catch (e) {
  console.log('❌ Error leyendo manifest.json:', e.message);
  allFilesExist = false;
}

// Verificar Service Worker
console.log('\n⚙️ Verificando Service Worker:');
try {
  const sw = fs.readFileSync('public/service-worker.js', 'utf8');
  console.log(`✅ Service Worker encontrado (${sw.length} caracteres)`);
  console.log(`✅ ${sw.includes('install') ? 'Evento install' : '❌ Sin evento install'}`);
  console.log(`✅ ${sw.includes('fetch') ? 'Evento fetch' : '❌ Sin evento fetch'}`);
  console.log(`✅ ${sw.includes('activate') ? 'Evento activate' : '❌ Sin evento activate'}`);
} catch (e) {
  console.log('❌ Error leyendo Service Worker:', e.message);
  allFilesExist = false;
}

// Verificar index.html
console.log('\n🌐 Verificando index.html:');
try {
  const html = fs.readFileSync('index.html', 'utf8');
  console.log(`✅ ${html.includes('manifest.json') ? 'Manifest vinculado' : '❌ Manifest no vinculado'}`);
  console.log(`✅ ${html.includes('service-worker') ? 'Service Worker registrado' : '❌ Service Worker no registrado'}`);
  console.log(`✅ ${html.includes('theme-color') ? 'Theme color configurado' : '❌ Theme color no configurado'}`);
  console.log(`✅ ${html.includes('splash-screen') ? 'Splash screen incluido' : '❌ Splash screen no incluido'}`);
} catch (e) {
  console.log('❌ Error leyendo index.html:', e.message);
  allFilesExist = false;
}

// Verificar iconos
console.log('\n🎨 Verificando iconos:');
const iconSizes = ['72x72', '96x96', '128x128', '144x144', '152x152', '192x192', '384x384', '512x512'];
iconSizes.forEach(size => {
  const iconPath = `public/icons/icon-${size}.svg`;
  const exists = fs.existsSync(iconPath);
  console.log(`${exists ? '✅' : '❌'} icon-${size}.svg`);
  if (!exists) allFilesExist = false;
});

// Resumen final
console.log('\n📊 Resumen de verificación:');
if (allFilesExist) {
  console.log('🎉 ¡PWA completamente implementada!');
  console.log('\n📋 Para probar:');
  console.log('1. npm run dev');
  console.log('2. Abrir http://localhost:3000');
  console.log('3. DevTools > Application > Manifest');
  console.log('4. DevTools > Application > Service Workers');
  console.log('5. Probar instalación y funcionalidad offline');
} else {
  console.log('⚠️ Algunos componentes PWA faltan o tienen errores');
  console.log('Revisa los elementos marcados con ❌');
}

console.log('\n🚀 ¡Listo para usar!');