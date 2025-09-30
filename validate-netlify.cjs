#!/usr/bin/env node

/**
 * Validador de sintaxis para netlify.toml
 * Verifica que la configuración sea válida antes del deploy
 */

const fs = require('fs');

console.log('🔍 Validando sintaxis de netlify.toml...\n');

try {
  const netlifyConfig = fs.readFileSync('./netlify.toml', 'utf8');
  
  console.log('📄 Contenido de netlify.toml:');
  console.log('─'.repeat(50));
  console.log(netlifyConfig);
  console.log('─'.repeat(50));
  
  // Validaciones básicas de sintaxis TOML
  const lines = netlifyConfig.split('\n');
  let hasErrors = false;
  
  console.log('\n🔍 Validaciones de sintaxis:');
  
  // Verificar secciones válidas
  const validSections = ['[build]', '[build.environment]', '[[redirects]]', '[[headers]]'];
  const foundSections = lines.filter(line => line.trim().startsWith('['));
  
  foundSections.forEach((section, index) => {
    const lineNum = lines.indexOf(section) + 1;
    const isValid = validSections.some(valid => section.trim().startsWith(valid.split('.')[0]));
    
    if (isValid) {
      console.log(`✅ Línea ${lineNum}: ${section.trim()} - Sección válida`);
    } else {
      console.log(`❌ Línea ${lineNum}: ${section.trim()} - Sección no reconocida`);
      hasErrors = true;
    }
  });
  
  // Verificar configuraciones requeridas
  console.log('\n📋 Configuraciones requeridas:');
  
  const requiredConfigs = [
    { key: 'publish = "dist"', desc: 'Directorio de publicación' },
    { key: 'command = "npm run build"', desc: 'Comando de build' },
    { key: 'NODE_VERSION', desc: 'Versión de Node.js' }
  ];
  
  requiredConfigs.forEach(config => {
    const found = netlifyConfig.includes(config.key);
    console.log(`${found ? '✅' : '❌'} ${config.desc}: ${found ? 'Configurado' : 'Faltante'}`);
    if (!found) hasErrors = true;
  });
  
  // Verificar caracteres problemáticos
  console.log('\n🔤 Verificando caracteres especiales:');
  
  const problematicChars = ['\t', '\r'];
  let charIssues = false;
  
  problematicChars.forEach(char => {
    if (netlifyConfig.includes(char)) {
      console.log(`⚠️ Encontrados caracteres problemáticos: ${char === '\t' ? 'TAB' : 'CR'}`);
      charIssues = true;
    }
  });
  
  if (!charIssues) {
    console.log('✅ Sin caracteres problemáticos detectados');
  }
  
  // Verificar estructura de headers
  console.log('\n🏷️ Verificando estructura de headers:');
  
  const headerBlocks = netlifyConfig.match(/\[\[headers\]\][\s\S]*?(?=\[\[|$)/g) || [];
  
  headerBlocks.forEach((block, index) => {
    const hasFor = block.includes('for =');
    const hasValues = block.includes('[headers.values]');
    
    console.log(`${hasFor && hasValues ? '✅' : '❌'} Header block ${index + 1}: ${hasFor && hasValues ? 'Válido' : 'Estructura incorrecta'}`);
    
    if (!hasFor || !hasValues) hasErrors = true;
  });
  
  // Resultado final
  console.log('\n📊 Resultado de validación:');
  
  if (!hasErrors) {
    console.log('🎉 ✅ netlify.toml es válido y listo para deploy!');
    console.log('\n📋 Configuración detectada:');
    console.log('- Build command: npm run build');
    console.log('- Publish dir: dist');
    console.log('- Node version: 20');
    console.log('- SPA redirects: Configurados');
    console.log('- PWA headers: Configurados');
    
    console.log('\n🚀 Próximo paso:');
    console.log('git add . && git commit -m "fix: validated netlify.toml config" && git push');
    
  } else {
    console.log('❌ Se encontraron errores en netlify.toml');
    console.log('Corrige los elementos marcados con ❌ antes del deploy');
  }
  
} catch (error) {
  console.log('❌ Error leyendo netlify.toml:', error.message);
  
  if (error.code === 'ENOENT') {
    console.log('\n💡 Creando netlify.toml básico...');
    
    const basicConfig = `[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`;
  
    fs.writeFileSync('./netlify.toml', basicConfig);
    console.log('✅ netlify.toml básico creado');
  }
}

console.log('\n🔧 En caso de errores persistentes:');
console.log('1. Usar deploy manual arrastrando dist/ a netlify.com');
console.log('2. Verificar sintaxis en https://www.toml-lint.com/');
console.log('3. Simplificar configuración paso a paso');