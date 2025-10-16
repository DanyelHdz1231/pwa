# Script para generar íconos PNG desde SVG

## Usando ImageMagick (Recomendado)

```bash
# Instalar ImageMagick
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# Generar todos los tamaños
magick convert icon-base.svg -resize 72x72 icon-72x72.png
magick convert icon-base.svg -resize 96x96 icon-96x96.png
magick convert icon-base.svg -resize 128x128 icon-128x128.png
magick convert icon-base.svg -resize 144x144 icon-144x144.png
magick convert icon-base.svg -resize 152x152 icon-152x152.png
magick convert icon-base.svg -resize 192x192 icon-192x192.png
magick convert icon-base.svg -resize 384x384 icon-384x384.png
magick convert icon-base.svg -resize 512x512 icon-512x512.png
```

## Usando herramienta online (Más fácil)

1. Ir a: https://realfavicongenerator.net/
2. Subir icon-base.svg
3. Descargar pack de íconos
4. Copiar archivos PNG a esta carpeta

## Usando Node.js (Automatizado)

```bash
npm install -g sharp-cli

sharp -i icon-base.svg -o icon-72x72.png resize 72 72
sharp -i icon-base.svg -o icon-96x96.png resize 96 96
sharp -i icon-base.svg -o icon-128x128.png resize 128 128
sharp -i icon-base.svg -o icon-144x144.png resize 144 144
sharp -i icon-base.svg -o icon-152x152.png resize 152 152
sharp -i icon-base.svg -o icon-192x192.png resize 192 192
sharp -i icon-base.svg -o icon-384x384.png resize 384 384
sharp -i icon-base.svg -o icon-512x512.png resize 512 512
```

## Íconos requeridos para Android:

- [x] icon-72x72.png
- [x] icon-96x96.png
- [x] icon-128x128.png
- [x] icon-144x144.png
- [x] icon-152x152.png
- [x] icon-192x192.png (CRÍTICO para notificaciones)
- [x] icon-384x384.png
- [x] icon-512x512.png
