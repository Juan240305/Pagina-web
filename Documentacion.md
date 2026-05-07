# Documentación Técnica — Resident Evil: Requiem · Guía Oficial

## 1. Descripción del proyecto

Landing page temática basada en el videojuego *Resident Evil: Requiem*. Funciona como guía de supervivencia interactiva con acceso restringido por registro, seguimiento de progreso, sistema de reportes y vinculación con comunidades externas.

Desarrollada íntegramente con **HTML5, CSS3 y JavaScript vanilla** (sin frameworks).

---

## 2. Tecnologías y librerías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura y semántica |
| CSS3 | Estilos, animaciones y responsive |
| JavaScript ES6+ | Lógica, DOM, APIs del navegador |
| [EmailJS](https://www.emailjs.com/) | Envío de emails desde el front-end |
| Discord Webhooks | Notificaciones en tiempo real al servidor |
| Google Fonts | Tipografías externas |
| localStorage / sessionStorage | Persistencia de datos en el navegador |

---

## 3. Estructura de archivos

```
Pagina_Web/
├── index.html          # Estructura principal
├── styles.css          # Todos los estilos y animaciones
├── script.js           # Lógica, datos y back-end
├── Documentacion.md    # Este documento
└── img/
    ├── Capitulo1.webp … Capitulo8.webp   # Portadas de área
    ├── Cap1im1.webp … Cap1im4.webp       # Capturas Capítulo 1
    ├── Cap2im1.webp … Cap2im4.webp       # Capturas Capítulo 2
    ├── Cap3im1.webp … Cap3im6.webp       # Capturas Capítulo 3
    ├── Cap4im1.webp … Cap4im4.webp       # Capturas Capítulo 4
    ├── Cap5im1.webp … Cap5im6.webp       # Capturas Capítulo 5
    ├── Cap6im1.webp … Cap6im6.webp       # Capturas Capítulo 6
    ├── Cap7im1.webp … Cap7im4.webp       # Capturas Capítulo 7
    └── Cap8im1.webp … Cap8im6.webp       # Capturas Capítulo 8
```

---

## 4. Tipografías

Se utilizan tres familias tipográficas cargadas desde Google Fonts:

| Familia | Uso |
|---|---|
| **Bebas Neue** | Títulos, cabeceras y nombres de área |
| **Share Tech Mono** | Etiquetas UI, labels, botones y elementos de interfaz |
| **Crimson Text** | Descripciones, textos de cuerpo y párrafos narrativos |

---

## 5. Diseño responsive

La página se adapta a cinco escenarios mediante media queries:

| Breakpoint | Dispositivo | Cambios principales |
|---|---|---|
| > 1024px | Desktop | Layout completo, grid de 4 columnas |
| ≤ 1024px | Tablet landscape | Grid reducido, comunidad más compacta |
| ≤ 768px | Tablet portrait | Comunidad en columna única, header reducido |
| ≤ 480px | Móvil portrait | Grid de 1 columna, header-center oculto |
| ≤ 900px + landscape + h ≤ 500px | Móvil landscape | Hero y formulario compactados |

---

## 6. Funcionalidades

### 6.1 Sistema de registro y sesión

El acceso a la guía está restringido mediante una pantalla de registro. Al enviar el formulario se valida el formato del email con una expresión regular y se comprueban los campos obligatorios. Una vez verificado, el usuario queda registrado en `sessionStorage` con su nombre y correo, persistiendo la sesión mientras el navegador permanezca abierto. Un botón de cierre de sesión en el header permite salir en cualquier momento.

**Archivos:** `index.html` (formulario), `script.js` (`handleRegister`, `showMainContent`, `handleLogout`)

### 6.2 Integración EmailJS (back-end)

Al completar el registro se envía automáticamente un email de notificación al administrador usando la API de EmailJS. El envío se realiza desde el front-end sin servidor propio mediante `emailjs.send()`.

Variables enviadas a la plantilla:
- `from_name` — nombre del operativo
- `name` — nombre del operativo (duplicado para compatibilidad con la plantilla)
- `user_email` — correo del operativo
- `message` — texto de confirmación de registro

**Credenciales configuradas en** `script.js`:
```js
const EMAILJS_PUBLIC_KEY  = 'Jady5h9Ss2Q6f6y_W';
const EMAILJS_SERVICE_ID  = 'service_kwl0sk9';
const EMAILJS_TEMPLATE_ID = 'template_e27mswe';
```

### 6.3 Integración Discord Webhook (back-end)

Cada vez que ocurre un evento relevante se envía una notificación automática al canal de Discord configurado mediante una petición `fetch` con método POST y `Content-Type: application/json`.

Eventos notificados:
- **Nuevo registro:** `🧟 Nuevo operativo registrado: [nombre] | [email]`
- **Muerte reportada:** `💀 [nombre] murió en [zona]: [descripción]`

**Archivo:** `script.js` (función `sendDiscordNotification`)

### 6.4 Progress Tracker

La barra de progreso del header muestra el porcentaje de zonas completadas sobre el total (20 zonas). Cada zona dispone de un checkbox que al marcarse guarda el ID de la zona en `localStorage`. El porcentaje se recalcula y la barra se actualiza en tiempo real. El progreso persiste entre sesiones.

**Almacenamiento:** `localStorage` → clave `re_requiem_progress` (array de IDs)

**Archivo:** `script.js` (`loadProgress`, `saveProgress`, `updateProgressBar`)

### 6.5 Buscador en tiempo real

Campo de búsqueda sobre el grid de áreas que filtra las tarjetas por título mientras el usuario escribe, usando el evento `input`. Las tarjetas no coincidentes se ocultan con `display: none` y se muestra un mensaje si ninguna coincide.

**Archivo:** `script.js` (función `initSearch`)

### 6.6 Modal de áreas y zonas

Al hacer clic en una tarjeta de área se abre un modal que muestra las zonas del capítulo, cada una con nombre, descripción detallada, capturas de pantalla, botón de reporte de muerte y checkbox de progreso. El modal bloquea el scroll del body y puede cerrarse con el botón o haciendo clic fuera.

**Archivo:** `script.js` (`openAreaModal`, `closeAreaModal`, `renderZones`)

### 6.7 Sistema de reporte de muerte

Dentro de cada zona hay un botón que abre un modal secundario donde el usuario puede describir cómo murió su personaje. El reporte se guarda en `localStorage` con zona, mensaje, nombre del operativo y timestamp. Simultáneamente se envía una notificación al canal de Discord.

**Almacenamiento:** `localStorage` → clave `re_requiem_deaths` (array de objetos)

**Archivo:** `script.js` (`openDeathModal`, `handleDeathReport`)

### 6.8 Comunidad — WhatsApp y Discord

Sección con dos tarjetas que enlazan al grupo de WhatsApp y al servidor de Discord de la comunidad. Los botones abren los enlaces en una pestaña nueva con `target="_blank" rel="noopener"`.

### 6.9 Scroll Reveal

Los elementos con clase `.scroll-reveal` se animan (opacidad 0→1 + traslación vertical) cuando entran en el viewport. Se implementa con `IntersectionObserver` con un umbral de 0.1 (10% visible). Una vez animado el elemento no vuelve a ocultarse.

**Archivo:** `script.js` (función `initScrollReveal`)

---

## 7. Animaciones CSS

### 7.1 Transición — Puerta Umbrella

Al completar el registro, dos paneles metálicos oscuros se deslizan desde los laterales de la pantalla cubriéndola por completo (0.65 s). Con los paneles cerrados y el logo de Umbrella visible en el centro, la pantalla de registro desaparece y la guía se carga detrás. Pasados 320 ms los paneles se abren revelando el contenido.

La animación se controla mediante la clase CSS `.closing` aplicada al elemento `#door-overlay` desde JavaScript.

**Archivos:** `styles.css` (`#door-overlay`, `.door-panel`, `@keyframes` implícito via transition), `script.js` (`triggerDoorTransition`)

### 7.2 Animación — Líneas de acceso a zona

Al abrir y cerrar el modal de un área, tres franjas diagonales rojas barren la pantalla. La dirección es izquierda→derecha al abrir (`skewX(-15deg)`) y derecha→izquierda al cerrar (`skewX(15deg)`). La duración es de 0.5 s y el elemento se elimina del DOM al finalizar la animación.

**Archivos:** `styles.css` (`@keyframes diagonalSweep`, `@keyframes diagonalSweepReverse`, `.zone-scan-overlay`), `script.js` (`playScanEffect`)

### 7.3 Otras animaciones

| Animación | Elemento | Descripción |
|---|---|---|
| `fade-up` | Tarjetas de área, modal, hero | Aparición con traslación vertical |
| `rotate-slow` | Logo Umbrella (registro) | Rotación continua de 20 s |
| `pulse-bg` | Fondo de registro | Pulso de opacidad en el overlay |
| `blink` | Punto de estado (header) | Parpadeo del indicador de conexión |
| `pulse-skull` | Icono muerte | Escala pulsante en el modal de muerte |
| `modal-in` | Modales | Fundido de entrada del overlay |
| `page-reveal` | Contenido principal | Fundido al mostrarse la guía |
| Scroll Reveal | `.scroll-reveal` | Aparición al entrar en viewport |

---

## 8. Almacenamiento local

| Mecanismo | Clave | Contenido |
|---|---|---|
| `sessionStorage` | `re_requiem_user` | Objeto `{ name, email }` del usuario activo |
| `localStorage` | `re_requiem_progress` | Array de IDs de zonas completadas |
| `localStorage` | `re_requiem_deaths` | Array de objetos de muertes reportadas |

---

## 9. Datos del juego — Estructura AREAS

El array `AREAS` en `script.js` contiene los 8 capítulos del juego con la siguiente estructura:

```js
{
  id: 'area-01',
  title: 'WRENWOOD HOTEL',
  description: '...',
  coverImage: 'img/Capitulo1.webp',
  zones: [
    {
      id: 'z-01-01',
      name: 'GRACE — HOTEL WRENWOOD',
      description: '...',
      photos: ['img/Cap1im1.webp', 'img/Cap1im2.webp']
    }
  ]
}
```

Total: **8 áreas**, **20 zonas**, **40 capturas de pantalla**.
