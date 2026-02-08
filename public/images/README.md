# Images and Logos

Esta carpeta contiene las imágenes y logos utilizados en CarePilot.

## Estructura Recomendada

```
public/images/
├── logos/
│   ├── carepilot-logo.svg      # Logo principal
│   ├── carepilot-icon.svg       # Icono para favicon
│   └── whatsapp-icon.svg       # Icono de WhatsApp
├── icons/
│   ├── hero-bg.svg             # Fondo de hero section
│   ├── dashboard-bg.svg          # Fondo de dashboard
│   └── patterns/
│       ├── dots.svg              # Patrón de puntos
│       └── waves.svg             # Patrón de ondas
└── screenshots/
    ├── dashboard.png            # Captura de dashboard
    ├── mobile-view.png          # Vista móvil
    └── whatsapp-ui.png         # Interfaz WhatsApp
```

## Colores de Brand

Todos los logos deben usar la paleta de colores simplificada:

- **Azul Cielo** (#aee4ff) - Fondos
- **Azul Letras** (#0097b2) - Elementos principales
- **Amarillo Crema** (#fff8d7) - Acentos y tarjetas
- **Rojo** (#FF0000) - Botones y alertas

## Formatos Soportados

- **SVG**: Para logos e iconos (recomendado)
- **PNG**: Para capturas y fotografías
- **ICO**: Para favicon
- **WebP**: Para optimización web (opcional)

## Uso en Componentes

```tsx
// Logo principal
<Image 
  src="/images/logos/carepilot-logo.svg" 
  alt="CarePilot Logo"
  width={180}
  height={40}
  className="h-10 w-auto"
/>

// Icono WhatsApp
<Image 
  src="/images/logos/whatsapp-icon.svg"
  alt="WhatsApp"
  width={24}
  height={24}
/>
```

## Optimización

- Comprimir imágenes antes de subir
- Usar formatos modernos (WebP, AVIF)
- Incluir alt text para accesibilidad
- Tamaños responsivos con srcset
