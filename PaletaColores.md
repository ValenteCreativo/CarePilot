# Paleta de Colores Simplificada - CarePilot

Esta paleta utiliza exclusivamente los 4 colores de marca para garantizar la calidez y el reconocimiento visual.

## 1. Configuración de Variables CSS (src/app/globals.css)

Sustituye tu bloque de :root por este. He mapeado tus colores HEX a las variables que usa Shadcn UI:

```css
@layer base {
  :root {
    /* Fondo General (Azul Cielo) */
    --background: #aee4ff;
    --foreground: #0097b2;

    /* Tarjetas y Contenedores (Amarillo Crema) */
    --card: #fff8d7;
    --card-foreground: #0097b2;
    
    --popover: #fff8d7;
    --popover-foreground: #0097b2;

    /* Color Primario (Azul de Letras e Iconos) */
    --primary: #0097b2;
    --primary-foreground: #ffffff;

    /* Color Secundario (Amarillo para elementos sutiles) */
    --secondary: #fff8d7;
    --secondary-foreground: #0097b2;

    /* Acentos y Muted */
    --muted: #fff8d7;
    --muted-foreground: #0097b2;
    --accent: #fff8d7;
    --accent-foreground: #0097b2;

    /* Alertas y Botón de Inicio (Rojo) */
    --destructive: #FF0000;
    --destructive-foreground: #ffffff;

    /* Bordes e Inputs (Usamos el azul de letras con opacidad) */
    --border: #0097b233; /* 20% de opacidad */
    --input: #0097b233;
    --ring: #0097b2;

    --radius: 1.5rem; /* Bordes muy redondeados como el PDF */
  }
}
```

## 2. Mapeo Semántico (Para tu código)

Para que sepas qué clase usar en cada momento según el diseño de Juliana:

- **Fondo de la página**: Usar `bg-background` (#aee4ff)
- **Títulos, Iconos y Texto Principal**: Usar `text-primary` (#0097b2)
- **Tarjetas, Cuadros de Chat o Fondo de Dashboard**: Usar `bg-card` (#fff8d7)
- **Botón de "START" o Errores Críticos**: Usar `bg-destructive` (#FF0000)

## 3. Ejemplo de Implementación en tus Componentes

### El Botón "START" (Hero)
```tsx
<Button className="bg-[#FF0000] text-white rounded-full font-ultra hover:scale-105 transition-transform">
  START
</Button>
```

### Tarjeta del Dashboard (Kanban)
```tsx
<div className="bg-[#fff8d7] border-2 border-[#0097b2]/20 rounded-3xl p-6 shadow-sm">
  <h3 className="text-[#0097b2] font-ultra">Llamar a Farmacia</h3>
  <p className="text-[#0097b2]/80 font-dm">Gestionado por CarePilot AI</p>
</div>
```

### Tarjeta con Texto de Alto Contraste (How It Works)
```tsx
<div className="bg-[#fff8d7]/90 backdrop-blur-md p-8 rounded-[2.5rem] border-2 border-[#0097b2]/20">
  <h3 className="text-xl font-display text-[#007a8f] mb-4 leading-tight">
    Tell Us Your Story
  </h3>
  <p className="text-[#006b7d] font-sans leading-relaxed text-sm">
    Share your loved one's context and your routine through WhatsApp...
  </p>
</div>
```

### Navbar / Logo
```tsx
<h1 className="text-[#0097b2] font-ultra text-2xl">
  CarePilot
</h1>
```

## 4. Tipografía Recomendada para Rogers

No olvides aplicar las fuentes que vimos antes para que estos colores brillen:

- **Ultra**: Para el logo y títulos en #0097b2
- **Parisienne**: Para frases de bienvenida sobre el fondo #aee4ff
- **DM Sans**: Para todos los formularios y textos de lectura

## 5. Variables CSS Completas

Referencia rápida de todas las variables de color:

```css
/* Sistema de Colores Simplificado */
--background: #aee4ff;              /* Azul Cielo - Fondo principal */
--foreground: #0097b2;              /* Azul Letras - Texto principal */
--card: #fff8d7;                    /* Amarillo Crema - Tarjetas */
--card-foreground: #0097b2;         /* Azul Letras - Texto en tarjetas */
--primary: #0097b2;                 /* Azul Letras - Elementos primarios */
--primary-foreground: #ffffff;         /* Blanco - Texto sobre primario */
--secondary: #fff8d7;               /* Amarillo Crema - Elementos secundarios */
--secondary-foreground: #0097b2;     /* Azul Letras - Texto sobre secundario */
--muted: #fff8d7;                   /* Amarillo Crema - Elementos atenuados */
--muted-foreground: #0097b2;        /* Azul Letras - Texto atenuado */
--accent: #fff8d7;                  /* Amarillo Crema - Acentos */
--accent-foreground: #0097b2;        /* Azul Letras - Texto sobre acentos */
--destructive: #FF0000;              /* Rojo - Alertas y errores */
--destructive-foreground: #ffffff;    /* Blanco - Texto sobre destructivo */
--border: #0097b233;               /* Azul con 20% opacidad - Bordes */
--input: #0097b233;                /* Azul con 20% opacidad - Inputs */
--ring: #0097b2;                   /* Azul Letras - Anillos de enfoque */
--radius: 1.5rem;                   /* Bordes muy redondeados */

/* Colores de Alto Contraste para Fondos Claros */
--text-dark-primary: #007a8f;       /* Azul verdoso oscuro - Títulos sobre fondos claros */
--text-dark-secondary: #006b7d;      /* Azul más oscuro - Descripciones sobre fondos claros */
```

## 6. Uso Semántico de Colores

### Botones
- **Primario**: `bg-primary text-primary-foreground` - Azul con texto blanco
- **Secundario**: `bg-secondary text-secondary-foreground` - Amarillo con texto azul
- **Destructivo**: `bg-destructive text-destructive-foreground` - Rojo con texto blanco

### Tarjetas y Contenedores
- **Fondo**: `bg-card` - Amarillo crema
- **Texto**: `text-card-foreground` - Azul
- **Borde**: `border-border` - Azul con 20% opacidad

### Jerarquía de Texto
- **Principal**: `text-foreground` - Azul brillante
- **Secundario**: `text-muted-foreground` - Azul para texto de apoyo
- **Texto sobre fondos claros**: Usar tonos oscuros derivados del primario
  - **Títulos**: `text-[#007a8f]` - Azul verdoso oscuro (máximo contraste)
  - **Descripciones**: `text-[#006b7d]` - Azul más oscuro (lectura cómoda)

### Bordes y Separadores
- **Estándar**: `border-border` - Azul transparente
- **Sutiles**: Usar opacidad `/20` para bordes muy suaves

---

*Esta paleta simplificada de 4 colores garantiza consistencia visual y reconocimiento de marca en toda la aplicación CarePilot.*
