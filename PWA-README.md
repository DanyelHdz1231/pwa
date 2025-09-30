# Mi Aplicación Progresiva (PWA)

Una Progressive Web App completa construida con React, TypeScript y Vite.

## 🚀 Características PWA Implementadas

### ✅ Web App Manifest

- Configuración completa con nombre, iconos y colores de tema
- Soporte para instalación en dispositivos móviles y desktop
- Iconos adaptativos para diferentes tamaños de pantalla

### ✅ Service Worker

- **Cache First** para App Shell y assets estáticos
- **Network First** para contenido dinámico
- Funcionamiento offline completo
- Estrategias de cacheo optimizadas

### ✅ App Shell Architecture

- Estructura HTML/CSS/JS que carga rápidamente
- Splash Screen personalizado con animaciones
- Interfaz de usuario responsiva

### ✅ Funcionalidades Adicionales

- Detección de estado de conexión (online/offline)
- Prompt de instalación automático
- Indicadores visuales de estado PWA
- Diseño mobile-first y responsive

## 🛠️ Instalación y Desarrollo

### Prerequisitos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo en puerto 3000

# Construcción
npm run build        # Construir para producción
npm run preview      # Preview de la build

# Linting
npm run lint         # Ejecutar ESLint
```

## 📱 Probando la PWA

### En Desarrollo

1. Ejecuta `npm run dev`
2. Abre Chrome/Edge y navega a `http://localhost:3000`
3. Abre DevTools > Application > Manifest para verificar la configuración
4. Ve a Service Workers para ver el SW registrado

### Prueba de Instalación

1. En Chrome, verás un ícono de instalación en la barra de direcciones
2. También aparecerá un botón "📲 Instalar App" en la interfaz
3. Haz clic para instalar la PWA en tu sistema

### Prueba Offline

1. Con la aplicación abierta, ve a DevTools > Network
2. Activa "Offline" para simular pérdida de conexión
3. Recarga la página - debería funcionar sin problemas
4. El indicador de estado mostrará "🔴 Offline"

### Prueba en Móvil

1. Asegúrate de que tu dispositivo móvil esté en la misma red
2. Usa la IP local (ej: `http://192.168.1.100:3000`)
3. En Safari/Chrome móvil, usa "Agregar a pantalla de inicio"

## 🏗️ Estructura del Proyecto

```
my-pwa/
├── public/
│   ├── icons/                    # Iconos PWA en varios tamaños
│   ├── service-worker.js         # Service Worker principal
│   └── manifest.json            # Web App Manifest
├── src/
│   ├── App.tsx                  # Componente principal con funcionalidades PWA
│   ├── App.css                  # Estilos modernos y responsivos
│   └── main.tsx                 # Punto de entrada
├── index.html                   # HTML principal con configuración PWA
└── vite.config.ts              # Configuración optimizada para PWA
```

## 🔧 Componentes Técnicos

### Service Worker (`/public/service-worker.js`)

- **App Shell Caching**: Cachea archivos críticos durante la instalación
- **Cache First**: Para assets estáticos y App Shell
- **Network First**: Para contenido dinámico
- **Fallbacks Offline**: Página y assets de respaldo cuando no hay conexión

### Manifest (`/public/manifest.json`)

- Configuración completa para instalación
- Iconos adaptativos y maskables
- Colores de tema personalizados
- Modo standalone para experiencia nativa

### App Shell (`/index.html` + `/src/App.tsx`)

- Splash Screen con animaciones CSS
- Detección de estado de red
- Prompt de instalación automático
- Registro automático del Service Worker

## 📊 Métricas y Optimización

### Lighthouse PWA Score

La aplicación está optimizada para obtener 100/100 en:

- ✅ Progressive Web App
- ✅ Performance (optimizado para carga rápida)
- ✅ Accessibility (accesible)
- ✅ Best Practices (mejores prácticas)

### Estrategias de Cacheo

- **App Shell**: Cache First (archivos críticos)
- **Assets Estáticos**: Cache First (imágenes, CSS, JS)
- **API Calls**: Network First (contenido dinámico)
- **Fallbacks**: Páginas offline para mejor UX

## 🚀 Despliegue en Producción

### Build para Producción

```bash
npm run build
```

### Verificar PWA

1. Usa `npm run preview` para probar la build
2. Verifica en DevTools > Application que todo funcione
3. Testa la funcionalidad offline
4. Confirma que la instalación funcione

### Hosting Recomendado

- **Vercel**: Configuración automática para PWAs
- **Netlify**: Soporte nativo para Service Workers
- **GitHub Pages**: Requiere configuración adicional para SW
- **Firebase Hosting**: Excelente para PWAs

## 🔍 Debugging y Herramientas

### Chrome DevTools

- **Application > Manifest**: Verificar configuración PWA
- **Application > Service Workers**: Debug del SW
- **Application > Storage**: Ver caches y storage
- **Network**: Simular offline y revisar cacheo

### Herramientas Útiles

- **Lighthouse**: Auditoría PWA completa
- **PWA Builder**: Herramientas de Microsoft para PWAs
- **Workbox**: Framework avanzado para Service Workers

## 📝 Próximos Pasos

### Funcionalidades Avanzadas

- [ ] Push Notifications
- [ ] Background Sync
- [ ] Add to Home Screen banner personalizado
- [ ] Update prompts para nuevas versiones
- [ ] Integración con Web Share API
- [ ] Soporte para shortcuts en manifest

### Optimizaciones

- [ ] Lazy loading de componentes
- [ ] Image optimization
- [ ] Critical CSS inlining
- [ ] Preload de recursos críticos

---

Desarrollado con ❤️ usando React + TypeScript + Vite
