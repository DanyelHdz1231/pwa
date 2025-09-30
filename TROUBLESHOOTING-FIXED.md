# 🔧 Solución de Problemas - Deploy Netlify

## ❌ Error: Failed to Parse Configuration (SOLUCIONADO)

### Problema Reciente

```
Error: Failed to parse configuration on line 9
Build failed with configuration parsing error
```

### ✅ Solución Implementada

**Causa**: Sintaxis inválida en `netlify.toml` - configuraciones anidadas no soportadas

**Fix**: Simplificamos `netlify.toml` con configuración básica y válida:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "20"

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
```

---

## ❌ Error: Node.js Version Incompatible (SOLUCIONADO)

### Problema Original

```
Error: Vite requires Node.js version 20.19+ or 22.12+
Current version: 18.20.8
crypto.hash is not a function
```

### ✅ Soluciones Implementadas

#### 1. Node.js 20+ en Netlify

```toml
[build.environment]
  NODE_VERSION = "20"
```

#### 2. Package.json engines requirement

```json
{
  "engines": {
    "node": ">=20.19.0",
    "npm": ">=10.0.0"
  }
}
```

#### 3. .nvmrc para consistencia

```
20
```

---

## 🚀 Deploy Después de Fixes

### Método 1: GitHub Auto-Deploy

```bash
git add .
git commit -m "fix: simplified netlify.toml config"
git push origin main
```

### Método 2: Deploy Manual

1. Ve a [netlify.com](https://netlify.com)
2. Arrastra carpeta `dist/` al deploy area
3. ✅ Funciona inmediatamente

---

## 🔍 Validación Post-Deploy

### URLs a verificar:

- `https://tu-sitio.netlify.app/` - App principal
- `https://tu-sitio.netlify.app/manifest.json` - Manifest PWA
- `https://tu-sitio.netlify.app/service-worker.js` - Service Worker

### DevTools check:

1. **Lighthouse PWA**: Debe ser 100/100
2. **Application > Manifest**: Datos correctos
3. **Application > Service Workers**: Activated
4. **Network offline**: Funciona sin conexión

---

## 🔧 Troubleshooting Adicional

### Si Build sigue fallando:

#### 1. Verificar sintaxis TOML

```bash
# Online TOML validator
# https://www.toml-lint.com/
```

#### 2. Netlify.toml mínimo

```toml
[build]
  publish = "dist"
  command = "npm run build"
```

#### 3. Build command alternativo

```toml
[build]
  command = "npm ci && npm run build"
```

### Si PWA no funciona:

#### 1. Verificar HTTPS

- Netlify enable HTTPS automáticamente
- Sin HTTPS = No PWA

#### 2. Verificar Headers

```bash
curl -I https://tu-sitio.netlify.app/manifest.json
# Debe incluir: Content-Type: application/manifest+json
```

#### 3. Service Worker scope

```bash
curl -I https://tu-sitio.netlify.app/service-worker.js
# Debe incluir: Cache-Control: no-cache
```

---

## 📊 Configuración Final Validada

### ✅ netlify.toml (Simplificado)

- ✅ Sintaxis válida
- ✅ Node 20 especificado
- ✅ SPA redirects configurados
- ✅ Headers mínimos para PWA

### ✅ Build Process

- ✅ `npm run build` funciona local
- ✅ Dist generado correctamente
- ✅ Manifest.json en raíz
- ✅ Service Worker incluido

### ✅ PWA Requirements

- ✅ HTTPS (automático en Netlify)
- ✅ Manifest válido
- ✅ Service Worker registrado
- ✅ Iconos disponibles

---

## 🎯 Next Steps

1. **Deploy**: Push cambios o deploy manual
2. **Test**: Verificar URLs post-deploy
3. **PWA**: Confirmar instalación funciona
4. **Monitor**: Check build logs en Netlify

---

**✅ Con estos fixes, el deploy debería ser exitoso!** 🚀
