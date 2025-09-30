# 🔧 Solución de Problemas - Deploy Netlify

## ❌ Error: Node.js Version Incompatible

### Problema Original

```
Error: Vite requires Node.js version 20.19+ or 22.12+
Current version: 18.20.8
crypto.hash is not a function
```

### ✅ Soluciones Implementadas

#### 1. Configuración de Node.js en `netlify.toml`

```toml
[build.environment]
  NODE_VERSION = "20.19.0"
  NPM_VERSION = "10.2.4"
```

#### 2. Archivo `.nvmrc` para especificar versión

```
20
```

#### 3. Especificación en `package.json`

```json
{
  "engines": {
    "node": ">=20.19.0",
    "npm": ">=10.0.0"
  }
}
```

#### 4. Script de build mejorado

```json
{
  "scripts": {
    "build": "npm run build:clean && tsc -b && vite build",
    "build:clean": "rimraf dist"
  }
}
```

## 🚀 Verificación Post-Fix

### Ejecutar tests locales

```bash
# Verificar Node version local
node -v  # Debe ser >= 20.19.0

# Test build local
npm run build

# Verificar que todo funciona
node verify-deploy.cjs
```

### Deploy en Netlify

1. **Método GitHub (Recomendado)**:
   ```bash
   git add .
   git commit -m "fix: update node version for netlify deploy"
   git push origin main
   ```
2. **Método Manual**:
   - Ir a netlify.com
   - Arrastrar carpeta `dist/` al área de deploy

## 🔍 Debugging Adicional

### Si el error persiste en Netlify:

#### 1. Verificar Build Log

- Ve a Netlify Dashboard > Site > Deploys
- Click en el deploy fallido
- Revisa "Deploy log" completo
- Busca líneas que contengan "Node" o "crypto"

#### 2. Force Clear Cache

```toml
# Agregar a netlify.toml para limpiar cache
[build]
  command = "npm ci && npm run build"
```

#### 3. Alternativa: Usar Node 22

```toml
[build.environment]
  NODE_VERSION = "22.12.0"
```

### Si crypto.hash sigue fallando:

#### 1. Actualizar Vite

```bash
npm update vite @vitejs/plugin-react
```

#### 2. Lock Node modules

```bash
rm -rf node_modules package-lock.json
npm install
```

#### 3. Build command alternativo

```toml
[build]
  command = "npm ci --legacy-peer-deps && npm run build"
```

## 📊 Verificación de Versiones

### Versiones requeridas:

- ✅ **Node.js**: 20.19.0+ o 22.12.0+
- ✅ **npm**: 10.0.0+
- ✅ **Vite**: 7.1.6 (actual)
- ✅ **TypeScript**: Latest compatible

### Verificar en local:

```bash
node -v      # >= 20.19.0
npm -v       # >= 10.0.0
npx vite --version  # >= 7.0.0
```

## 🌐 Configuración Netlify Completa

### `netlify.toml` optimizado:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "20.19.0"
  NPM_VERSION = "10.2.4"
  NODE_ENV = "production"

# Headers para PWA
[[headers]]
  for = "/service-worker.js"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"
    Service-Worker-Allowed = "/"

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"

# SPA redirects
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🔄 Plan B: Deploy Manual

Si los problemas de Node persisten:

### 1. Build local

```bash
npm run build
```

### 2. Deploy manual

- Ir a [netlify.com](https://netlify.com)
- Click "Add new site" > "Deploy manually"
- Arrastrar carpeta `dist/`
- ✅ Funciona independiente de la versión de Node en Netlify

## 🎯 Próximos Pasos

1. **Deploy con fix**: Hacer push de los cambios
2. **Monitor build**: Verificar que use Node 20.19.0
3. **Test PWA**: Confirmar que funciona post-deploy
4. **Lighthouse audit**: Verificar PWA score 100/100

## 📞 Si Necesitas Ayuda Adicional

### Recursos útiles:

- [Netlify Node.js docs](https://docs.netlify.com/configure-builds/manage-dependencies/#node-js-and-javascript)
- [Vite troubleshooting](https://vitejs.dev/guide/troubleshooting.html)
- [PWA deployment guide](https://web.dev/progressive-web-apps/)

### Comandos de emergencia:

```bash
# Reset completo
rm -rf node_modules package-lock.json dist
npm install
npm run build

# Test local PWA
npm run preview
# Abrir http://localhost:4173
```

---

**✅ Con estos fixes, tu PWA debería deployar exitosamente en Netlify!**
