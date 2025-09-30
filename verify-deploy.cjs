#!/usr/bin/env node

/**
 * Script de verificación pre-deploy para Netlify
 * Verifica que la build esté lista para deploy PWA
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificación Pre-Deploy para Netlify...\n');

const DIST_DIR = './dist';
const requiredFiles = [
  'index.html',
  'manifest.json', 
  'service-worker.js',
  'assets',
  'icons'
];

let deployReady = true;

// Verificar que dist/ existe
if (!fs.existsSync(DIST_DIR)) {
  console.log('❌ Directorio dist/ no encontrado. Ejecuta: npm run build');
  process.exit(1);
}

console.log('📁 Verificando archivos de build:');
requiredFiles.forEach(file => {
  const filePath = path.join(DIST_DIR, file);
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) deployReady = false;
});

// Verificar manifest.json en dist
console.log('\n📄 Verificando manifest.json en build:');
try {
  const manifestPath = path.join(DIST_DIR, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  console.log(`✅ name: "${manifest.name}"`);
  console.log(`✅ start_url: "${manifest.start_url}"`);
  console.log(`✅ display: "${manifest.display}"`);
  console.log(`✅ icons: ${manifest.icons?.length || 0} configurados`);
  
  if (!manifest.icons || manifest.icons.length === 0) {
    console.log('⚠️ Sin iconos configurados');
    deployReady = false;
  }
} catch (e) {
  console.log('❌ Error leyendo manifest.json:', e.message);
  deployReady = false;
}

// Verificar Service Worker en dist
console.log('\n⚙️ Verificando Service Worker en build:');
try {
  const swPath = path.join(DIST_DIR, 'service-worker.js');
  const sw = fs.readFileSync(swPath, 'utf8');
  
  console.log(`✅ Service Worker encontrado (${sw.length} caracteres)`);
  console.log(`✅ ${sw.includes('install') ? 'Evento install' : '❌ Sin evento install'}`);
  console.log(`✅ ${sw.includes('fetch') ? 'Evento fetch' : '❌ Sin evento fetch'}`);
} catch (e) {
  console.log('❌ Error leyendo Service Worker:', e.message);
  deployReady = false;
}

// Verificar netlify.toml
console.log('\n🌐 Verificando configuración Netlify:');
try {
  const netlifyConfig = fs.readFileSync('./netlify.toml', 'utf8');
  
  console.log(`✅ ${netlifyConfig.includes('publish = "dist"') ? 'Publish directory correcto' : '❌ Publish directory incorrecto'}`);
  console.log(`✅ ${netlifyConfig.includes('service-worker.js') ? 'Headers SW configurados' : '❌ Headers SW no configurados'}`);
  console.log(`✅ ${netlifyConfig.includes('manifest.json') ? 'Headers manifest configurados' : '❌ Headers manifest no configurados'}`);
  console.log(`✅ ${netlifyConfig.includes('redirects') ? 'SPA redirects configurados' : '❌ SPA redirects no configurados'}`);
} catch (e) {
  console.log('❌ netlify.toml no encontrado. El deploy automático podría fallar.');
  deployReady = false;
}

// Verificar iconos en dist
console.log('\n🎨 Verificando iconos en build:');
const iconsDir = path.join(DIST_DIR, 'icons');
if (fs.existsSync(iconsDir)) {
  const icons = fs.readdirSync(iconsDir);
  console.log(`✅ ${icons.length} iconos encontrados en build`);
  
  const requiredIcons = ['icon-192x192.svg', 'icon-512x512.svg'];
  requiredIcons.forEach(icon => {
    const exists = icons.includes(icon);
    console.log(`${exists ? '✅' : '❌'} ${icon}`);
    if (!exists) deployReady = false;
  });
} else {
  console.log('❌ Directorio icons/ no encontrado en build');
  deployReady = false;
}

// Verificar tamaño de build
console.log('\n📊 Estadísticas de build:');
const getDirectorySize = (dirPath) => {
  let size = 0;
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stats.size;
    }
  });
  
  return size;
};

const buildSize = getDirectorySize(DIST_DIR);
const buildSizeMB = (buildSize / (1024 * 1024)).toFixed(2);

console.log(`📦 Tamaño total: ${buildSizeMB} MB`);
console.log(`📁 Archivos: ${fs.readdirSync(DIST_DIR, {recursive: true}).length}`);

if (buildSize > 25 * 1024 * 1024) { // 25MB
  console.log('⚠️ Build muy grande (>25MB) - considera optimizar');
}

// Resultado final
console.log('\n📊 Resumen de verificación:');
if (deployReady) {
  console.log('🎉 ¡Build listo para deploy en Netlify!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. git add .');
  console.log('2. git commit -m "feat: ready for netlify deploy"');
  console.log('3. git push origin main');
  console.log('4. Conectar repositorio en netlify.com');
  console.log('5. Deploy automático iniciará');
  
  console.log('\n🔗 O deploy manual:');
  console.log('1. Ir a netlify.com');
  console.log('2. Arrastrar carpeta dist/ al área de deploy');
  
  console.log('\n✅ URLs a verificar post-deploy:');
  console.log('- https://tu-sitio.netlify.app/');
  console.log('- https://tu-sitio.netlify.app/manifest.json');
  console.log('- https://tu-sitio.netlify.app/service-worker.js');
  
} else {
  console.log('⚠️ Build no está listo para deploy');
  console.log('Corrige los elementos marcados con ❌ antes del deploy');
}

console.log('\n🚀 Happy deploying!');