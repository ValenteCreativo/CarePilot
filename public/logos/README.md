# Logos de CarePilot

Esta carpeta contiene los logos oficiales de CarePilot siguiendo la paleta de colores de marca.

## Logos Disponibles

### Logo Principal
- **carepilot-logo.svg** - Logo principal con texto "CarePilot"
  - Uso: Navbar, footer, página principal
  - Colores: Azul Letras (#0097b2)
  - Tipografía: Ultra font

### Iconos
- **carepilot-icon.svg** - Icono simplificado para favicon
  - Uso: Favicon, PWA
  - Colores: Azul Letras (#0097b2)
  - Formato: SVG optimizado

- **whatsapp-icon.svg** - Icono de WhatsApp
  - Uso: Sección de características, botones
  - Colores: Verde WhatsApp (#25D366) con contorno Azul Letras

## Especificaciones

### Logo Principal (carepilot-logo.svg)
```svg
<!-- Logo con tipografía Ultra y colores de marca -->
<svg width="180" height="40" viewBox="0 0 180 40">
  <!-- Fondo Amarillo Crema -->
  <rect width="180" height="40" fill="#fff8d7" rx="8"/>
  <!-- Texto "CarePilot" en Azul Letras -->
  <text x="90" y="25" font-family="Ultra" font-size="16" 
        fill="#0097b2" text-anchor="middle" dominant-baseline="middle">
    CarePilot
  </text>
</svg>
```

### Icono WhatsApp (whatsapp-icon.svg)
```svg
<!-- Icono circular estilo WhatsApp -->
<svg width="24" height="24" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="12" fill="#25D366"/>
  <path d="M..." fill="#0097b2" stroke="#0097b2"/>
</svg>
```

## Uso en Componentes

```tsx
// Logo en navbar
import Image from 'next/image';

export function Logo() {
  return (
    <Image 
      src="/logos/carepilot-logo.svg"
      alt="CarePilot Logo"
      width={180}
      height={40}
      className="h-10 w-auto"
      priority
    />
  );
}

// Favicon
export function Favicon() {
  return (
    <link 
      rel="icon" 
      href="/logos/carepilot-icon.svg" 
      type="image/svg+xml"
    />
  );
}
```

## Colores de Marca

- **Primario**: #0097b2 (Azul Letras)
- **Secundario**: #fff8d7 (Amarillo Crema)
- **Acento**: #25D366 (Verde WhatsApp)
- **Fondo**: #aee4ff (Azul Cielo)

## Optimización

- Todos los SVG están optimizados para web
- Incluyen viewBox para proper scaling
- Colores HEX consistentes con la paleta
- Sin metadatos innecesarios
