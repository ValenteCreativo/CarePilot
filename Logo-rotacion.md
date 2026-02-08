# Documentación del Diseño del Logo: CarePilot

Este documento detalla la estructura, composición y elementos visuales del logo principal de CarePilot, ubicado en `public/images/logos/CarePilot.jpg`. Se ha renombrado de `Logo-Rotación.md` a `Logo-Rotacion.md` para mejorar la compatibilidad.

## Análisis Visual

El logo presenta una composición armoniosa que combina elementos de la naturaleza con símbolos médicos tradicionales, transmitiendo un mensaje de cuidado, protección y salud.

### 1. Elementos Centrales
- **Nutrias (Otters):** Dos nutrias ilustradas dispuestas en una composición circular estilo *Yin-Yang*.
    - **Nutria Izquierda:** Orientada con la cabeza hacia la parte superior izquierda, el cuerpo se curva hacia abajo.
    - **Nutria Derecha:** Invertida con respecto a la primera, con la cabeza en la parte inferior derecha y la cola curvándose hacia arriba.
    - **Interacción:** Una pata de cada nutria se extiende hacia el centro del logo, pareciendo sostener o proteger los símbolos centrales.
- **Cruz Médica:** Una cruz robusta en color rojo vibrante situada en el centro exacto de la composición circular.
- **Corazón:** Un corazón negro sólido ubicado dentro de la cruz médica roja.

### 2. Paleta de Colores
- **Fondo:** Negro absoluto (`#000000`).
- **Nutrias:**
    - Pelaje principal: Marrón medio.
    - Vientre y hocico: Crema / Bronceado claro.
    - Detalles (ojos, nariz): Negro.
- **Símbolos:**
    - Cruz: Rojo vibrante.
    - Corazón: Negro.

### 3. Composición y Simetría
- **Simetría Rotacional:** El diseño utiliza una rotación de 180 grados para la segunda nutria, creando un movimiento fluido y circular que rodea el núcleo del servicio (salud y corazón).
- **Estilo:** Ilustrativo, con formas redondeadas y orgánicas que suavizan la estética técnica de la cruz médica.

### 4. Especificaciones Técnicas
- **Nombre de archivo:** `CarePilot.jpg`
- **Ruta del documento:** `Logo-Rotacion.md`
- **Resolución:** 2048 x 2048 píxeles.
- **Formato:** JPEG (fondo negro integrado).

## Funcionamiento e Interacción

El logo de CarePilot no es solo una imagen estática; tiene comportamientos dinámicos específicos dentro de la aplicación.

### 1. Animación de Rotación por Scroll
En la página principal (Landing Page), el logo utiliza un componente especializado llamado `ScrollRotatingLogo`. 
- **Mecánica:** Las nutrias (el anillo exterior) rotan dinámicamente según el desplazamiento vertical del usuario.
- **Lógica:** La rotación se calcula como `window.scrollY * 0.5`.
- **Implementación:** Se divide el logo en dos capas:
    - **Capa Estática:** La cruz médica central y el corazón.
    - **Capa Dinámica:** El anillo de nutrias que gira alrededor del centro.

### 2. Uso en Autenticación
En las páginas de Login y Registro, el logo se presenta de forma estática pero con un énfasis visual:
- **Estilo:** Utiliza bordes redondeados (`rounded-xl`) y una sombra profunda (`shadow-lg`) para resaltar sobre el fondo.
- **Propósito:** Refuerza la identidad de marca en los puntos críticos de entrada del usuario.

### 3. Accesibilidad y Rendimiento
- **Prioridad:** En las páginas de autenticación, el logo tiene la propiedad `priority` de Next.js para asegurar que se cargue instantáneamente (LCP).
- **Reducción de Movimiento:** La aplicación respeta las preferencias del sistema (`prefers-reduced-motion`), desactivando las transiciones de rotación si el usuario lo requiere.

## Implementación Técnica (Código)

El comportamiento dinámico se logra mediante la combinación de un componente de React y estilos CSS específicos.

### 1. Componente React (`ScrollRotatingLogo`)
Ubicado en `src/app/(marketing)/page.tsx`, este componente gestiona el estado de la rotación basado en el evento de scroll.

```tsx
function ScrollRotatingLogo() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calcula la rotación (0.5 grados por cada píxel de scroll)
      setRotation(window.scrollY * 0.5);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80">
      {/* CAPA ESTÁTICA: Cruz Médica */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <Image
          src={crossImage}
          alt="Medical cross"
          width={176}
          height={176}
          className="object-contain"
          style={{ width: "55%", height: "55%" }}
        />
      </div>
      {/* CAPA DINÁMICA: Anillo de Nutrias */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ 
          transform: `rotate(${rotation}deg)`, 
          transition: "transform 0.1s linear" 
        }}
      >
        <Image
          src={ottersImage}
          fill
          alt="Otters"
          className="object-contain"
        />
      </div>
    </div>
  );
}
```

### 2. Estilos Globales (`globals.css`)
Se definen utilidades para asegurar que la rotación sea fluida y respete la accesibilidad.

```css
@layer utilities {
  .logo-rotate {
    /* Mejora del rendimiento mediante hardware acceleration */
    transition: transform 0.1s ease-out;
    will-change: transform;
  }
  
  /* Soporte para usuarios con sensibilidad al movimiento */
  @media (prefers-reduced-motion: reduce) {
    .logo-rotate {
      transition: none;
      transform: none !important;
    }
  }
}
```

### 3. Optimización de Carga
En las vistas de autenticación (`src/app/login/page.tsx`), se utiliza la propiedad `priority` para evitar el retraso en el despliegue de la marca.

```tsx
<Image
  src="/images/logos/CarePilot.jpg"
  alt="CarePilot Logo"
  width={80}
  height={80}
  priority // Carga crítica de LCP
  className="rounded-xl shadow-lg"
/>
```

## Diseño y Estilizado (Código de Marca)

El logo se integra con el sistema de diseño de la aplicación mediante tokens de CSS y clases de utilidad de Tailwind.

### 1. Variables de Identidad (Tokens)
Definidas en `src/app/globals.css`, estas variables controlan el entorno visual donde vive el logo.

```css
:root {
  /* Paleta que complementa el logo */
  --primary: #0097b2;       /* Azul CarePilot */
  --background: #aee4ff;    /* Azul Cielo */
  --card: #fff8d7;          /* Amarillo Crema */
  
  /* Radios de contenedor para el logo */
  --radius: 1.5rem;         /* Base para clases rounded-* */
}
```

### 2. Clases de Diseño Aplicadas
El logo utiliza consistentemente las siguientes clases de Tailwind para mantener la jerarquía visual:

- **`rounded-xl`**: Aplica un radio de borde de 1.5rem (basado en `--radius`), suavizando la imagen cuadrada del `.jpg`.
- **`shadow-lg`**: Proporciona profundidad, separando el logo del fondo azul o crema de la interfaz.
- **`object-contain`**: Asegura que la relación de aspecto del logo se mantenga intacta sin importar el contenedor.

### 3. Adaptación a Modo Oscuro
El sistema de diseño ajusta automáticamente el contraste del logo mediante variables de entorno:

```css
.dark {
  --background: #003d5c;    /* Azul Profundo */
  --primary: #aee4ff;       /* Azul Claro para contraste */
}
```

---
*Documentación generada para asegurar la consistencia en futuras iteraciones de diseño.*
