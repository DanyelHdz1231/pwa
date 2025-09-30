# 🚀 Guía de Despliegue en Netlify - PWA

## 📋 Preparación Previa

### 1. Verificar que la PWA esté Lista
```bash
# Ejecutar verificación
node verify-pwa.cjs

# Build de producción
npm run build

# Preview local de la build
npm run preview
```

### 2. Archivos Necesarios para Netlify

#### Crear `netlify.toml` (Configuración de despliegue)
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/service-worker.js"
  [headers.values]
    Cache-Control = "no-cache"

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/icons/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## 🌐 Métodos de Despliegue

### Método 1: Conexión con GitHub (Recomendado)

#### Paso 1: Preparar Repositorio
```bash
# Si no tienes git inicializado
git init

# Agregar archivos
git add .
git commit -m "feat: PWA completa lista para deploy"

# Conectar con GitHub (reemplaza con tu repo)
git remote add origin https://github.com/DanyelHdz1231/pwa.git
git branch -M main
git push -u origin main
```

#### Paso 2: Conectar en Netlify
1. Ve a [netlify.com](https://netlify.com) y regístrate/inicia sesión
2. Click en "Add new site" > "Import an existing project"
3. Selecciona "GitHub" y autoriza Netlify
4. Busca tu repositorio "pwa"
5. Configuración automática:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18

#### Paso 3: Deploy Automático
- Netlify detectará `netlify.toml` automáticamente
- Deploy se iniciará automáticamente
- Cada push a `main` redesplegará automáticamente

### Método 2: Deploy Manual (Drag & Drop)

#### Paso 1: Generar Build
```bash
npm run build
```

#### Paso 2: Deploy Manual
1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta `dist/` completa al área de deploy
3. Netlify subirá todos los archivos
4. ⚠️ **Limitación**: No hay auto-deploy en cambios

## ⚙️ Configuración Específica para PWA

### Service Worker Headers
```toml
# En netlify.toml - Ya incluido arriba
[[headers]]
  for = "/service-worker.js"
  [headers.values]
    Cache-Control = "no-cache"
    Service-Worker-Allowed = "/"
```

### Manifest Headers
```toml
[[headers]]
  for = "/manifest.json"  
  [headers.values]
    Content-Type = "application/manifest+json"
    Access-Control-Allow-Origin = "*"
```

### SPA Redirect para PWA
```toml
# Importante para PWAs con routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🔧 Optimizaciones Post-Deploy

### 1. Configurar Dominio Personalizado
```bash
# En Netlify Dashboard
1. Site settings > Domain management
2. Add custom domain
3. Configure DNS records
4. Enable HTTPS automáticamente
```

### 2. Habilitar HTTPS (Requerido para PWA)
- ✅ Netlify habilita HTTPS automáticamente
- ✅ Certificado SSL gratuito incluido
- ✅ Force HTTPS redirect disponible

### 3. Optimizaciones de Performance
```toml
# En netlify.toml
[[headers]]
  for = "/"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
```

## 📱 Verificación Post-Deploy

### Checklist de Validación
- [ ] **PWA Score**: Lighthouse 100/100
- [ ] **HTTPS**: Certificado SSL activo
- [ ] **Service Worker**: Registrado correctamente
- [ ] **Manifest**: Accesible y válido
- [ ] **Iconos**: Cargando correctamente
- [ ] **Instalación**: Prompt aparece
- [ ] **Offline**: Funciona sin conexión

### Testing en Producción
```bash
# URLs a verificar
https://tu-sitio.netlify.app/
https://tu-sitio.netlify.app/manifest.json
https://tu-sitio.netlify.app/service-worker.js
```

### DevTools Verification
1. **Application > Manifest**: Verificar datos
2. **Application > Service Workers**: Estado "activated"
3. **Network**: Simular offline y verificar funcionamiento
4. **Lighthouse**: Ejecutar audit PWA

## 🚨 Troubleshooting Común

### Service Worker No Carga
```toml
# Agregar a netlify.toml
[[headers]]
  for = "/service-worker.js"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"
```

### Manifest No Detectado
```toml
[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"
```

### PWA No Instalable
1. Verificar HTTPS (debe estar activo)
2. Confirmar Service Worker registrado
3. Validar manifest.json sintaxis
4. Revisar iconos accessible

### Build Fails
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🔄 CI/CD con GitHub Actions (Opcional)

### `.github/workflows/deploy.yml`
```yaml
name: Deploy to Netlify
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm run build
    - run: npm run lint
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './dist'
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📊 Monitoring y Analytics

### Netlify Analytics
- **Pageviews**: Tráfico total
- **Unique visitors**: Usuarios únicos  
- **Top pages**: Páginas más visitadas
- **Bandwidth**: Uso de datos

### PWA Específico
```javascript
// En tu app - analytics.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data.type === 'PWA_INSTALLED') {
      // Track instalación PWA
      analytics.track('PWA Installed');
    }
  });
}
```

## 💰 Costos y Límites

### Plan Gratuito Netlify
- ✅ **100GB** bandwidth/mes
- ✅ **Sitios ilimitados**
- ✅ **HTTPS** incluido
- ✅ **Deploy** automático
- ✅ **300 build minutes**/mes

### Upgrade Recomendado Si:
- Más de 100GB bandwidth
- Necesitas más build minutes
- Requieres analytics avanzados
- Forms y functions serverless

---

## 🚀 Quick Start Commands

```bash
# 1. Crear configuración Netlify
echo '[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200' > netlify.toml

# 2. Build y test local
npm run build
npm run preview

# 3. Commit y push
git add .
git commit -m "feat: netlify config for PWA deploy"
git push origin main
```

¡Tu PWA estará live en Netlify en pocos minutos! 🎉