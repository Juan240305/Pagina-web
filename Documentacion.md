# Documentación Técnica — Resident Evil: Requiem · Guía Oficial

## 1. Descripción del proyecto

Landing page temática basada en el videojuego *Resident Evil: Requiem*. Funciona como guía de supervivencia interactiva con acceso restringido por registro, seguimiento de progreso, sistema de reportes y vinculación con comunidades externas.

Desarrollada íntegramente con **HTML5, CSS3 y JavaScript vanilla** (sin frameworks ni librerías de UI).

---

## 2. Tecnologías y librerías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica |
| CSS3 | Estilos, variables, animaciones y responsive |
| JavaScript ES6+ | Lógica, manipulación del DOM y llamadas a APIs |
| [EmailJS](https://www.emailjs.com/) | Envío de emails desde el front-end sin servidor |
| Discord Webhooks API | Notificaciones automáticas al canal de Discord |
| Google Fonts | Tipografías externas vía CDN |
| `localStorage` | Persistencia de progreso y muertes entre sesiones |
| `sessionStorage` | Gestión de la sesión del usuario activo |

---

## 3. Estructura de archivos

```
Pagina_Web/
├── index.html          # Estructura y marcado HTML
├── styles.css          # Estilos, animaciones y responsive
├── script.js           # Lógica, datos y back-end
├── Documentacion.md    # Este documento
└── img/
    ├── Capitulo1–8.webp      # Portadas de cada área
    └── Cap1im1–Cap8im6.webp  # Capturas de zona (40 imágenes)
```

---

## 4. Tipografías

Tres familias con roles diferenciados cargadas desde Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono
  &family=Bebas+Neue&family=Crimson+Text:ital,wght@0,400;0,600;1,400
  &display=swap" rel="stylesheet"/>
```

Asignadas mediante variables CSS para uso consistente en todo el proyecto:

```css
:root {
  --font-title: 'Bebas Neue', sans-serif;   /* Títulos y cabeceras */
  --font-mono:  'Share Tech Mono', monospace; /* Etiquetas, botones y UI */
  --font-body:  'Crimson Text', serif;        /* Descripciones y textos */
}
```

| Variable | Familia | Uso |
|---|---|---|
| `--font-title` | Bebas Neue | Títulos de área, nombres de zona, headings principales |
| `--font-mono` | Share Tech Mono | Etiquetas, botones, labels del formulario, header |
| `--font-body` | Crimson Text | Descripciones de área y zona, textos narrativos |

---

## 5. Diseño Responsive

Cinco breakpoints cubriendo todos los formatos requeridos:

```css
/* Tablet landscape */
@media (max-width: 1024px) {
  .areas-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
}

/* Tablet portrait */
@media (max-width: 768px) {
  .community-grid { grid-template-columns: 1fr; }
  .header-center  { max-width: 140px; }
}

/* Móvil portrait */
@media (max-width: 480px) {
  .header-center { display: none; }
  .areas-grid    { grid-template-columns: 1fr; }
  .zone-item     { grid-template-columns: 1fr; }
}

/* Móvil landscape */
@media (max-width: 900px) and (orientation: landscape) and (max-height: 500px) {
  .hero-banner { padding: 2rem 1.5rem; }
  #register-screen { align-items: flex-start; overflow-y: auto; }
}
```

---

## 6. Funcionalidades

---

### 6.1 Sistema de registro y sesión

**Descripción:** Pantalla de acceso restringido que valida el formulario, guarda la sesión en `sessionStorage` y bloquea el contenido principal hasta que el usuario se identifica.

**Métodos principales:** `handleRegister()`, `isValidEmail()`, `showMainContent()`, `handleLogout()`

**Fragmento clave — validación y guardado de sesión:**

```javascript
async function handleRegister(e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const name  = nameInput.value.trim();

  // Validación de campos obligatorios
  if (!email || !name) {
    errorEl.textContent = '⚠ Todos los campos son obligatorios.';
    return;
  }
  // Validación de formato de email con expresión regular
  if (!isValidEmail(email)) {
    errorEl.textContent = '⚠ Introduce un correo electrónico válido.';
    return;
  }

  // Guardar usuario en sessionStorage para persistir la sesión
  currentUser = { name, email };
  sessionStorage.setItem('re_requiem_user', JSON.stringify(currentUser));

  triggerDoorTransition(); // Lanzar animación de acceso
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

Al recargar la página, la sesión se recupera automáticamente:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const savedUser = sessionStorage.getItem('re_requiem_user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showMainContent(); // Salta el registro si ya hay sesión
  }
});
```

---

### 6.2 Integración EmailJS — envío de email al registrarse

**Descripción:** Al completar el registro se envía un email de notificación al administrador usando la API de EmailJS. La llamada se hace directamente desde el navegador sin necesidad de servidor propio.

**Método principal:** `emailjs.send()`

**Credenciales configuradas:**

```javascript
const EMAILJS_PUBLIC_KEY  = 'Jady5h9Ss2Q6f6y_W';
const EMAILJS_SERVICE_ID  = 'service_kwl0sk9';
const EMAILJS_TEMPLATE_ID = 'template_e27mswe';
```

**Fragmento clave — llamada a la API:**

```javascript
// Inicialización con la clave pública en el arranque
emailjs.init(EMAILJS_PUBLIC_KEY);

// Envío del email con los datos del operativo registrado
try {
  await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    from_name:  name,       // Rellena {{from_name}} en la plantilla
    name:       name,       // Rellena {{name}} en la plantilla
    user_email: email,      // Rellena {{user_email}} en la plantilla
    message:    `${name} se ha registrado en la Guía de Resident Evil: Requiem.`
  });
} catch (err) {
  console.error('EmailJS error:', err);
  // El registro continúa aunque falle el email
}
```

El bloque `try/catch` garantiza que un fallo en el envío no bloquee el acceso del usuario.

---

### 6.3 Integración Discord Webhook — notificaciones en tiempo real

**Descripción:** Cada vez que un usuario se registra o reporta una muerte, se envía una notificación automática al canal de Discord configurado mediante una petición `fetch` a la URL del webhook.

**Método principal:** `sendDiscordNotification(content)`

**Fragmento clave:**

```javascript
const DISCORD_WEBHOOK_URL = 'https://discordapp.com/api/webhooks/...';

async function sendDiscordNotification(content) {
  // Protección: no ejecutar si la URL es el placeholder
  if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL === 'TU_DISCORD_WEBHOOK_URL') return;

  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }) // Formato requerido por la API de Discord
    });
  } catch (err) {
    console.error('Discord webhook error:', err);
  }
}
```

**Puntos de llamada:**

```javascript
// Al registrarse
sendDiscordNotification(`🧟 **Nuevo operativo registrado:** ${name} | ${email}`);

// Al reportar una muerte
sendDiscordNotification(`💀 **${name}** murió en **${zoneName}**:\n> ${message}`);
```

---

### 6.4 Progress Tracker — seguimiento de zonas completadas

**Descripción:** Barra de progreso en el header que muestra el porcentaje de zonas completadas. Cada zona tiene un checkbox que al marcarse guarda su ID en `localStorage`. El estado persiste entre sesiones y se recalcula en tiempo real.

**Métodos principales:** `loadProgress()`, `saveProgress()`, `updateProgressBar()`

**Fragmento clave:**

```javascript
function loadProgress() {
  return JSON.parse(localStorage.getItem('re_requiem_progress') || '[]');
}

function saveProgress(completedIds) {
  localStorage.setItem('re_requiem_progress', JSON.stringify(completedIds));
}

function updateProgressBar() {
  const totalZones   = AREAS.reduce((sum, area) => sum + area.zones.length, 0); // 20 zonas
  const completedIds = loadProgress();
  const pct          = totalZones ? Math.round((completedIds.length / totalZones) * 100) : 0;

  document.getElementById('progress-bar-fill').style.width = pct + '%';
  document.getElementById('progress-label').textContent    = `PROGRESO: ${pct}%`;
}
```

**Binding del checkbox en cada zona:**

```javascript
checkbox.addEventListener('change', () => {
  const zoneId = checkbox.getAttribute('data-zone-id');
  let ids = loadProgress();

  if (checkbox.checked) {
    if (!ids.includes(zoneId)) ids.push(zoneId); // Añadir si no está
    checkbox.parentElement.classList.add('completed');
  } else {
    ids = ids.filter(id => id !== zoneId);        // Eliminar si se desmarca
    checkbox.parentElement.classList.remove('completed');
  }

  saveProgress(ids);
  updateProgressBar(); // Actualizar barra inmediatamente
});
```

---

### 6.5 Buscador de áreas en tiempo real

**Descripción:** Campo de búsqueda que filtra las tarjetas del grid por título mientras el usuario escribe, sin recargar la página. Muestra un mensaje si ningún área coincide.

**Método principal:** `initSearch()`

**Fragmento clave:**

```javascript
function initSearch() {
  const input = document.getElementById('areas-search');
  if (!input) return;

  input.addEventListener('input', () => {
    const query   = input.value.trim().toLowerCase();
    const cards   = document.querySelectorAll('.area-card');
    let   visible = 0;

    cards.forEach((card, i) => {
      const title = (AREAS[i]?.title || '').toLowerCase();
      const show  = title.includes(query);
      card.style.display = show ? '' : 'none'; // Mostrar u ocultar la tarjeta
      if (show) visible++;
    });

    // Mostrar mensaje si ninguna tarjeta es visible
    const emptyMsg = document.getElementById('search-empty');
    if (emptyMsg) emptyMsg.classList.toggle('hidden', visible > 0);
  });
}
```

El evento `input` se dispara en cada pulsación de tecla, lo que produce el efecto de filtrado instantáneo.

---

### 6.6 Modal de áreas y zonas con capturas

**Descripción:** Al hacer clic en una tarjeta de área se abre un modal con las zonas del capítulo, cada una con descripción, capturas de pantalla, botón de reporte y checkbox de progreso. El scroll del body se bloquea mientras el modal está abierto.

**Métodos principales:** `openAreaModal()`, `renderZones()`, `buildPhotosHtml()`

**Fragmento clave — apertura y renderizado:**

```javascript
function openAreaModal(area, areaNumber) {
  document.getElementById('modal-area-tag').textContent    = `ÁREA ${String(areaNumber).padStart(2, '0')}`;
  document.getElementById('modal-title').textContent       = area.title;
  document.getElementById('modal-area-desc').textContent   = area.description;

  renderZones(area.zones);

  const modal = document.getElementById('area-modal');
  modal.classList.remove('hidden');
  modal.scrollTop = 0;
  document.body.style.overflow = 'hidden'; // Bloquear scroll del fondo
  playScanEffect();                         // Lanzar animación de entrada
}
```

**Fragmento clave — generación de fotos de zona:**

```javascript
function buildPhotosHtml(photos) {
  if (!photos || photos.length === 0) {
    return `<div class="zone-photo-placeholder"><span>📷</span><span>SIN FOTO</span></div>`;
  }
  return photos.map(src =>
    `<img src="${src}" alt="Foto de zona" class="zone-photo" loading="lazy" />`
  ).join('');
}
```

El atributo `loading="lazy"` aplaza la carga de imágenes hasta que el usuario las necesita, mejorando el rendimiento.

---

### 6.7 Sistema de reporte de muerte

**Descripción:** Dentro de cada zona hay un botón que abre un modal donde el usuario describe cómo murió su personaje. El reporte se guarda en `localStorage` con zona, mensaje, nombre y timestamp. Se envía también una notificación a Discord.

**Método principal:** `handleDeathReport()`

**Fragmento clave:**

```javascript
async function handleDeathReport(e) {
  e.preventDefault();

  const message  = document.getElementById('death-message').value.trim();
  const zoneName = document.getElementById('death-zone-name')
                     .textContent.replace('Zona: ', '');

  // Guardar en localStorage
  const deaths = JSON.parse(localStorage.getItem('re_requiem_deaths') || '[]');
  deaths.push({
    zoneId:    currentDeathZoneId,
    zoneName,
    message,
    user:      currentUser?.name || 'Desconocido',
    timestamp: new Date().toISOString() // Marca temporal ISO 8601
  });
  localStorage.setItem('re_requiem_deaths', JSON.stringify(deaths));

  // Notificación a Discord
  sendDiscordNotification(
    `💀 **${currentUser?.name}** murió en **${zoneName}**:\n> ${message}`
  );
}
```

---

### 6.8 Scroll Reveal con IntersectionObserver

**Descripción:** Los elementos con clase `.scroll-reveal` aparecen animados (opacidad 0→1 con traslación vertical) cuando entran en el viewport, usando la API nativa `IntersectionObserver`.

**Método principal:** `initScrollReveal()`

**Fragmento JS:**

```javascript
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible'); // Activa la animación CSS
        }
      });
    },
    { threshold: 0.1 } // Se activa cuando el 10% del elemento es visible
  );

  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}
```

**Fragmento CSS — animación al añadir `.visible`:**

```css
.scroll-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}
.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
/* Retraso escalonado para elementos consecutivos */
.scroll-reveal:nth-child(2) { transition-delay: 0.12s; }
.scroll-reveal:nth-child(3) { transition-delay: 0.24s; }
```

---

### 6.9 Comunidad — WhatsApp y Discord

**Descripción:** Sección con dos tarjetas que enlazan al grupo de WhatsApp y al servidor de Discord. Los botones abren los enlaces externos en pestaña nueva de forma segura.

**Fragmento HTML:**

```html
<a href="https://chat.whatsapp.com/Fr9mTbPsY0t3OEArk7zftu"
   target="_blank" rel="noopener"
   class="community-btn community-btn-whatsapp">
  UNIRSE AL GRUPO →
</a>

<a href="https://discord.gg/hXSVwHxD3"
   target="_blank" rel="noopener"
   class="community-btn community-btn-discord">
  ACCEDER AL SERVIDOR →
</a>
```

El atributo `rel="noopener"` previene que la página de destino acceda al objeto `window` de la página original (buena práctica de seguridad).

---

## 7. Animaciones CSS

---

### 7.1 Transición — Puerta Umbrella

**Descripción:** Al completar el registro, dos paneles metálicos se deslizan desde los laterales cubriendo la pantalla. Con el logo de Umbrella visible en el centro, la pantalla de registro desaparece y la guía se carga detrás. Luego los paneles se abren revelando el contenido.

**Fragmento CSS — paneles y estado cerrado:**

```css
.door-left  { transform: translateX(-100%); }  /* Panel izquierdo fuera de pantalla */
.door-right { transform: translateX(100%); }   /* Panel derecho fuera de pantalla */

.door-panel {
  width: 50%;
  height: 100%;
  background: #080808;
  transition: transform 0.65s cubic-bezier(0.77, 0, 0.175, 1);
}

/* Al añadir .closing: paneles se deslizan al centro */
#door-overlay.closing .door-left  { transform: translateX(0); }
#door-overlay.closing .door-right { transform: translateX(0); }

/* El logo aparece cuando la puerta está cerrada */
#door-overlay.closing .door-logo  { opacity: 1; }
```

**Fragmento JS — secuencia de la transición:**

```javascript
function triggerDoorTransition() {
  const doorOverlay = document.getElementById('door-overlay');

  doorOverlay.style.pointerEvents = 'all';
  doorOverlay.classList.add('closing');        // 1. Cerrar paneles (0.65s)

  setTimeout(() => {
    document.getElementById('register-screen').style.display = 'none';
    showMainContent();                         // 2. Intercambiar pantallas

    setTimeout(() => {
      doorOverlay.classList.remove('closing'); // 3. Abrir paneles (0.65s)
      setTimeout(() => {
        doorOverlay.style.pointerEvents = 'none';
      }, 700);
    }, 320);
  }, 650);
}
```

---

### 7.2 Animación — Líneas de acceso a zona

**Descripción:** Al abrir y cerrar el modal de un área, tres franjas diagonales rojas barren la pantalla. La dirección es izquierda→derecha al abrir y derecha→izquierda al cerrar. El elemento se crea y destruye dinámicamente en el DOM.

**Fragmento CSS:**

```css
@keyframes diagonalSweep {
  0%   { left: -65%; opacity: 1; }
  100% { left: 110%; opacity: 0; }
}

@keyframes diagonalSweepReverse {
  0%   { left: 110%; opacity: 1; }
  100% { left: -65%; opacity: 0; }
}

.zone-scan-overlay {
  position: fixed;
  top: -10%; height: 120%;
  left: -65%; width: 65%;
  transform: skewX(-15deg);          /* Inclinación diagonal */
  background: linear-gradient(
    90deg,
    transparent 8%,
    rgba(200,0,30,0.65) 8%,  rgba(200,0,30,0.65) 26%,   /* Línea 1 */
    transparent 26%,          transparent 44%,
    rgba(200,0,30,0.55) 44%, rgba(200,0,30,0.55) 61%,   /* Línea 2 */
    transparent 61%,          transparent 78%,
    rgba(200,0,30,0.42) 78%, rgba(200,0,30,0.42) 93%    /* Línea 3 */
  );
  animation: diagonalSweep 0.5s cubic-bezier(0.4, 0, 0.6, 1) forwards;
}

.zone-scan-overlay.reverse {
  left: 110%;
  transform: skewX(15deg);            /* Skew invertido para dirección contraria */
  animation-name: diagonalSweepReverse;
}
```

**Fragmento JS — creación y limpieza dinámica:**

```javascript
function playScanEffect(reverse = false) {
  const el = document.createElement('div');
  el.className = 'zone-scan-overlay' + (reverse ? ' reverse' : '');
  document.body.appendChild(el);
  // El elemento se elimina automáticamente al terminar la animación
  el.addEventListener('animationend', () => el.remove(), { once: true });
}

// Llamadas
openAreaModal()  → playScanEffect();        // Izquierda → derecha al abrir
closeAreaModal() → playScanEffect(true);    // Derecha → izquierda al cerrar
```

---

### 7.3 Otras animaciones CSS

| Nombre | Elemento | Código clave |
|---|---|---|
| `fade-up` | Tarjetas, modal | `from { opacity:0; transform:translateY(30px) }` |
| `rotate-slow` | Logo Umbrella | `from { transform:rotate(0deg) } to { transform:rotate(360deg) }` |
| `pulse-bg` | Fondo registro | `from { opacity:0.6 } to { opacity:1 }` |
| `blink` | Punto de estado | `50% { opacity:0.4 }` |
| `pulse-skull` | Icono muerte | `50% { transform:scale(1.1) }` |
| `modal-in` | Overlay modales | `from { opacity:0 } to { opacity:1 }` |

---

## 8. Almacenamiento de datos

| Mecanismo | Clave | Contenido | Duración |
|---|---|---|---|
| `sessionStorage` | `re_requiem_user` | `{ name, email }` del usuario activo | Hasta cerrar el navegador |
| `localStorage` | `re_requiem_progress` | Array de IDs de zonas completadas | Permanente |
| `localStorage` | `re_requiem_deaths` | Array de objetos de muertes reportadas | Permanente |

---

## 9. Estructura de datos — array AREAS

Todos los datos del juego se definen en el array `AREAS` de `script.js`:

```javascript
const AREAS = [
  {
    id: 'area-01',
    title: 'WRENWOOD HOTEL',
    description: 'Capítulo tutorial...',
    coverImage: 'img/Capitulo1.webp',
    zones: [
      {
        id: 'z-01-01',
        name: 'GRACE — HOTEL WRENWOOD',
        description: 'Activa la linterna al entrar...',
        photos: ['img/Cap1im1.webp', 'img/Cap1im2.webp']
      },
      // ...más zonas
    ]
  },
  // ...7 áreas más
];
```

**Total: 8 áreas · 20 zonas · 40 capturas de pantalla.**
