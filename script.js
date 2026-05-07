/* ════════════════════════════════════════════════
   RESIDENT EVIL: REQUIEM — GUÍA
   script.js
════════════════════════════════════════════════ */

// ──────────────────────────────────────────────
// CONFIGURACIÓN EMAILJS
// Reemplaza con tus credenciales de emailjs.com
// ──────────────────────────────────────────────
const EMAILJS_PUBLIC_KEY  = 'TU_PUBLIC_KEY';
const EMAILJS_SERVICE_ID  = 'TU_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'Jady5h9Ss2Q6f6y_W';

// ──────────────────────────────────────────────
// CONFIGURACIÓN DISCORD WEBHOOK
// En Discord: Canal → Configuración → Integraciones → Crear Webhook
// Copia la URL generada y pégala aquí
// ──────────────────────────────────────────────
const DISCORD_WEBHOOK_URL = 'TU_DISCORD_WEBHOOK_URL';

// ──────────────────────────────────────────────
// DATOS — ÁREAS Y ZONAS
// Sustituye títulos, descripciones y rutas de fotos.
// ──────────────────────────────────────────────
const AREAS = [
  {
    id: 'area-01',
    title: 'WRENWOOD HOTEL',
    description: 'Capítulo tutorial. Ritmo lento, peligros mínimos y controles explicados de forma natural. Dos secciones diferenciadas: Grace explora el hotel mientras Leon se enfrenta a las calles infestadas de Elbridge.',
    coverImage: 'img/Capitulo1.webp',
    zones: [
      {
        id: 'z-01-01',
        name: 'GRACE — HOTEL WRENWOOD',
        description: 'Activa la linterna al entrar (D-Pad arriba). En la recepción, rota la foto de Grace para obtener la Llave Antigua que abre la habitación 204. Las Tenazas (Wire Cutters) están en la mesa de billar de la segunda planta: úsalas en la puerta del pasillo. En la habitación 204 activa el flashback e interactúa con la pintura recordada. El capítulo termina con un QTE: mantén X y muévete para liberarte. Explora con calma antes de subir, no hay vuelta atrás.',
        photos: ['img/Cap1im1.webp', 'img/Cap1im2.webp']
      },
      {
        id: 'z-01-02',
        name: 'LEON — ELBRIDGE',
        description: 'Avanza siguiendo el flujo de civiles que huyen en dirección contraria. Elimina los enemigos del camino: es el momento ideal para aprender el sistema de combate. Usa el hacha (hatchet) para rematar enemigos caídos sin gastar munición — es de uso ilimitado y esencial para gestionar recursos a lo largo de todo el juego. Sigue la calle hasta la cinemática final del capítulo.',
        photos: ['img/Cap1im3.webp', 'img/Cap1im4.webp']
      }
    ]
  },
  {
    id: 'area-02',
    title: 'RHODES HILL 1',
    description: 'El survival horror en estado puro. Rhodes Hill es un antiguo centro psiquiátrico y el escenario más denso del juego. La mecánica central es la evasión de La Chica, un monstruo perseguidor que no puede ser eliminado. Quédate en zonas iluminadas o vendrá a por ti.',
    coverImage: 'img/Capitulo2.webp',
    zones: [
      {
        id: 'z-02-01',
        name: 'GRACE — CENTRO DE ATENCIÓN',
        description: 'Grace se despierta atada en una silla. Recoge las Progress Notes y localiza la Cherub Key en un cajón cercano. Necesitas el destornillador de la caja de herramientas de la enfermería. Al entrar, La Chica rompe la pared y fuerza la huida. Regla fundamental: no corras innecesariamente, el ruido la atrae. Con el destornillador, ve a la puerta blanca junto a la estatua del caballo. Espera a que La Chica se aleje, cruza rápido, obtén el fusible y corre a la puerta metálica para escapar.',
        photos: ['img/Cap2im1.webp', 'img/Cap2im2.webp']
      },
      {
        id: 'z-02-02',
        name: 'LEON — PRIMERA SECCIÓN',
        description: 'Sección de acción directa frente a un grupo de enemigos armados. Localiza al enemigo con la motosierra (chainsaw) y elimínalo primero: tiene alta resistencia pero es el objetivo prioritario. Una vez caído, recoge la motosierra y úsala para cortar el bloqueo del camino principal. Es un ítem de progresión, no un arma permanente: úsala solo en el obstáculo indicado para no desperdiciarla.',
        photos: ['img/Cap2im3.webp', 'img/Cap2im4.webp']
      }
    ]
  },
  {
    id: 'area-03',
    title: 'RHODES HILL 2',
    description: 'El capítulo más amplio y complejo del juego. Grace debe localizar tres piezas de cuarzo (Moon, Sun y Star) en las alas Este y Oeste del Centro de Atención. Leon recorre el edificio en paralelo hacia el Despacho de Victor con combates más intensos.',
    coverImage: 'img/Capitulo3.webp',
    zones: [
      {
        id: 'z-03-01',
        name: 'GRACE — ALA OESTE',
        description: 'Grace comienza con el revólver de Leon pero con una sola bala: resérvala para emergencias. En la Oficina de Guardia hay una máquina de escribir para guardar. La pulsera ID Wristband Nivel 1 abre las puertas del Ala Oeste. El cuarzo Moon está en la Oficina del Chairman: resuelve el puzle de objetos de la sala. Deposita en el cofre lo que no necesites antes de continuar hacia el Ala Este.',
        photos: ['img/Cap3im1.webp', 'img/Cap3im2.webp']
      },
      {
        id: 'z-03-02',
        name: 'GRACE — ALA ESTE Y APERTURA',
        description: 'El Ala Este requiere una pulsera ID de nivel superior. Explora la Sala de Examinación y el Laboratorio de Sangre. El cuarzo Sun está en la Oficina del Investigador Principal (segunda planta). Código de la caja fuerte: 30-derecha, 10-izquierda, 50-derecha (Insanity: 50, 30, 90). El cuarzo Star se obtiene en el Ático (3ª planta) — es missable. Con las tres piezas, vuelve al Salón Central y colócalas en la puerta.',
        photos: ['img/Cap3im3.webp', 'img/Cap3im4.webp']
      },
      {
        id: 'z-03-03',
        name: 'LEON — DESPACHO DE VICTOR',
        description: 'Leon avanza hacia el Despacho de Victor Gideon en el Ala Oeste. Usa el frigorífico y las palancas del entorno para crear ventaja táctica. El monstruo Tyrant al final de esta sección requiere varias cargas del Requiem más disparos de pistola para caer. Mantén la distancia y aprovecha los marcos de puertas estrechos: el enemigo no puede flanquearte en espacios angostos.',
        photos: ['img/Cap3im5.webp', 'img/Cap3im6.webp']
      }
    ]
  },
  {
    id: 'area-04',
    title: 'RHODES HILL 3',
    description: 'Descenso al sótano. Zona completamente lineal, oscura y hostil con celdas cuyos ocupantes pueden romper los barrotes si te acercas. Grace busca a Emily mientras Leon proporciona cobertura desde el exterior.',
    coverImage: 'img/Capitulo4.webp',
    zones: [
      {
        id: 'z-04-01',
        name: 'GRACE — EL SÓTANO',
        description: 'Activa la linterna de inmediato. El sótano funciona con Joint Plugs: recógelos y colócalos en paneles de distribución para abrir puertas y encender zonas. Avanza por los laterales del pasillo para ignorar a los enemigos en celdas. El agua electrificada en el suelo es letal: rodea los charcos siempre que sea posible. Objetivo final: liberar a Emily activando todos los paneles de energía. Una vez activos, corre al ascensor antes de que La Chica intervenga.',
        photos: ['img/Cap4im1.webp', 'img/Cap4im2.webp']
      },
      {
        id: 'z-04-02',
        name: 'LEON — COBERTURA Y ESCAPE',
        description: 'Leon proporciona cobertura mientras Grace transporta a Emily. Despeja el camino desde posición ventajosa disparando a los enemigos que bloquean la ruta de huida. Apunta siempre a la cabeza para conservar munición y prioriza los zombis directamente en el trayecto de Grace. Sección breve pero que exige precisión y buena gestión de los recursos disponibles.',
        photos: ['img/Cap4im3.webp', 'img/Cap4im4.webp']
      }
    ]
  },
  {
    id: 'area-05',
    title: 'RHODES HILL 4',
    description: 'El capítulo final de Rhodes Hill. Exteriores e zona industrial subterránea. La Chica regresa más agresiva y esta vez Grace tiene el Requiem para contrarrestarla. Recoge las balas 12.7x55mm antes de la Planta de Tratamiento: las necesitarás.',
    coverImage: 'img/Capitulo5.webp',
    zones: [
      {
        id: 'z-05-01',
        name: 'GRACE — HELIPUERTO',
        description: 'Deja a Emily con Harry en el helipuerto y explora la casa adyacente. La Suite VIP tiene un puzle con objetos del entorno que debes resolver para obtener un ítem clave. Recoge el Visitor Record del armario junto a las botellas de vino antes de entrar al laboratorio. Más allá del patio hay un laboratorio privado accesible con la pulsera ID de mayor nivel, con documentos y objetos de mejora.',
        photos: ['img/Cap5im1.webp', 'img/Cap5im2.webp']
      },
      {
        id: 'z-05-02',
        name: 'LEON — FRANCOTIRADOR',
        description: 'Leon despliega su rifle desde las azoteas para cubrir a Grace en los exteriores. Elimina los grupos de zombis en el jardín antes de que alcancen a Grace. Hay un Mr. Raccoon Memoriam sobre uno de los postes del jardín, visible desde la posición del rifle. No abandones la posición hasta que Grace haya cruzado al otro lado.',
        photos: ['img/Cap5im3.webp', 'img/Cap5im4.webp']
      },
      {
        id: 'z-05-03',
        name: 'GRACE — PLANTA DE TRATAMIENTO',
        description: 'El momento más tenso del capítulo. Activa tres distribuidores de energía mientras La Chica patrulla el área central. Los puntos de luz la aturden temporalmente pero se queman tras el primer uso: resérvalos para momentos críticos. Espera a que La Chica se aleje antes de avanzar por el camino que deja libre. Si te atrapa en el Crank Lever, dispara el Requiem para aturdirla (dos disparos en Insanity). Con los tres interruptores activos, usa los Roof Hatch Controls: la luz solar la debilita definitivamente.',
        photos: ['img/Cap5im5.webp', 'img/Cap5im6.webp']
      }
    ]
  },
  {
    id: 'area-06',
    title: 'EAST RACCOON CITY',
    description: 'El capítulo más largo de Leon. Espacio abierto, combate intenso y varias zonas de misión entrelazadas. El campamento BSAA es el hub central: vuelve siempre que necesites gestionar inventario o comprar mejoras. Leon no tiene cofre en campo: lo que llevas es lo que tienes.',
    coverImage: 'img/Capitulo6.webp',
    zones: [
      {
        id: 'z-06-01',
        name: 'ORIENTACIÓN & CAMPAMENTO BSAA',
        description: 'Al llegar, recoge el Raccoon City Incident Newspaper junto a unas bolsas de basura. Hay un Mr. Raccoon Memoriam detrás del mostrador del Café Oasis. El campamento BSAA tiene máquina de escribir, cofre y tienda de mejoras. Prioriza munición, granadas y hierbas verdes al comprar. Usa los binoculares desde la azotea del almacén para localizar los tres puntos de interés del mapa.',
        photos: ['img/Cap6im1.webp', 'img/Cap6im2.webp']
      },
      {
        id: 'z-06-02',
        name: 'ALMACÉN & ARAÑA GIGANTE',
        description: 'En el Almacén Logístico los enemigos emergen del suelo: elimínalos, no intentes esquivarlos. El Distributor (pieza del detonador) está en la azotea. La Araña Gigante aparece al forzar la puerta giratoria del Applegate Hotel. Su punto débil está en la espalda: circula alrededor y dispara solo con ángulo trasero limpio. Las granadas y botellas de ácido son muy efectivas cuando trae refuerzos de arañas pequeñas.',
        photos: ['img/Cap6im3.webp', 'img/Cap6im4.webp']
      },
      {
        id: 'z-06-03',
        name: 'DETONADOR, GENERADORES & MOTO',
        description: 'Consigue el bidón de gasolina en la gasolinera y llénalo en el surtidor del fondo (desencadena un combate amplio). Llévalo a los generadores del mapa para activar los sistemas del detonador. En el edificio volcado (Willis Tower derribado) la navegación es peculiar: busca tablones con cinta amarilla y dispáralos para abrirte paso. El capítulo termina con una persecución en moto: esquiva obstáculos y dispara a los enemigos montados de los laterales.',
        photos: ['img/Cap6im5.webp', 'img/Cap6im6.webp']
      }
    ]
  },
  {
    id: 'area-07',
    title: 'RACCOON CITY CENTER',
    description: 'El capítulo más nostálgico. Leon visita el RPD por primera vez desde RE2. Grace explora el Orfanato con recursos muy limitados. Prioriza siempre la evasión sobre el combate en el Orfanato: cada bala cuenta para el tramo final del juego.',
    coverImage: 'img/Capitulo7.webp',
    zones: [
      {
        id: 'z-07-01',
        name: 'LEON — EL RPD',
        description: 'Al entrar al centro, gira al oeste para encontrar un Mr. Raccoon Memoriam sobre los escombros. En el RPD: el Mechanic Jack está en la biblioteca de la segunda planta (ítem clave) y hay un Mr. Raccoon Memoriam en el lado sureste de la estantería grande. Antes de usar el ascensor, recoge todo: algunas zonas quedan inaccesibles después. El Tyrant no puede derrotarse aquí: corre al Vestíbulo Principal alternando extremos del pasillo hasta la zona de prensa. Usa el Requiem para aturdirlo.',
        photos: ['img/Cap7im1.webp', 'img/Cap7im2.webp']
      },
      {
        id: 'z-07-02',
        name: 'GRACE — EL ORFANATO',
        description: 'Sección de survival horror con munición muy escasa. El Orfanato está distribuido en varias plantas con habitaciones intercomunicadas y archivos importantes sobre el pasado de Grace. Los enemigos tienen comportamientos distintos a los zombis habituales: obsérvalos antes de actuar. La exploración es más libre que en el Centro de Atención pero igualmente tensa. Objetivo: encontrar información sobre el pasado de Grace y avanzar hasta reunirse con Leon.',
        photos: ['img/Cap7im3.webp', 'img/Cap7im4.webp']
      }
    ]
  },
  {
    id: 'area-08',
    title: 'ARK',
    description: 'El capítulo final. Instalación secreta de Umbrella bajo las ruinas de Raccoon City. Más corto que los anteriores pero las decisiones aquí determinan el final que obtienes. Recarga todas las armas antes de bajar: no hay respiro entre secuencias de acción.',
    coverImage: 'img/Capitulo8.webp',
    zones: [
      {
        id: 'z-08-01',
        name: 'PRIMERAS SALAS',
        description: 'ARK comienza de forma lineal. La sala de personal a la izquierda funciona como punto de guardado con máquina de escribir. La progresión principal está a la derecha. Al bajar las escaleras encontrarás la sala de servidores y el terminal que activa la siguiente fase. Recarga todas las armas antes de continuar.',
        photos: ['img/Cap8im1.webp', 'img/Cap8im2.webp']
      },
      {
        id: 'z-08-02',
        name: 'EXPLORACIÓN PROFUNDA',
        description: 'Secciones alternadas entre Leon y Grace que convergen hacia el núcleo. Leon enfrenta una horda al recoger el Animus Orb: usa cócteles molotov y botellas de ácido para controlar la sala. Coloca el orbe en la puerta roja para acceder al Sistema Central de Refinado. Grace desciende a la cámara central donde está Elpis, culminando en el momento de decisión del juego.',
        photos: ['img/Cap8im3.webp', 'img/Cap8im4.webp']
      },
      {
        id: 'z-08-03',
        name: 'DECISIÓN FINAL & JEFE',
        description: 'La única decisión narrativa del juego. Destruir Elpis: final malo, Leon muere. Liberar Elpis (escribe HOPE en el terminal): final canónico y batalla final. Puedes ver ambos sin perder progreso. Jefe Final Victor Gideon/Nemesis: dispara a los puntos luminosos de su cuerpo. En la segunda fase retrocede cuando salte a la plataforma y espera a que baje. Golpe final con el Requiem apuntando al núcleo central expuesto. Los objetos de la arena se regeneran entre fases.',
        photos: ['img/Cap8im5.webp', 'img/Cap8im6.webp']
      }
    ]
  }
];


// ══════════════════════════════════════════════
// ESTADO GLOBAL
// ══════════════════════════════════════════════
let currentUser        = null;
let currentDeathZoneId = null;


// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  emailjs.init(EMAILJS_PUBLIC_KEY);

  const savedUser = sessionStorage.getItem('re_requiem_user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showMainContent();
  }

  renderAreas();
  bindEvents();
});


// ══════════════════════════════════════════════
// DISCORD WEBHOOK
// Envía una notificación al canal de Discord
// configurado cuando ocurre un evento en la web.
// ══════════════════════════════════════════════
async function sendDiscordNotification(content) {
  if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL === 'TU_DISCORD_WEBHOOK_URL') return;
  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
  } catch (err) {
    console.error('Discord webhook error:', err);
  }
}


// ══════════════════════════════════════════════
// PROGRESS TRACKER
// Guarda y recupera las zonas completadas
// usando localStorage. Actualiza la barra del header.
// ══════════════════════════════════════════════
function loadProgress() {
  return JSON.parse(localStorage.getItem('re_requiem_progress') || '[]');
}

function saveProgress(completedIds) {
  localStorage.setItem('re_requiem_progress', JSON.stringify(completedIds));
}

function updateProgressBar() {
  const totalZones    = AREAS.reduce((sum, area) => sum + area.zones.length, 0);
  const completedIds  = loadProgress();
  const pct           = totalZones ? Math.round((completedIds.length / totalZones) * 100) : 0;

  const fill  = document.getElementById('progress-bar-fill');
  const label = document.getElementById('progress-label');
  if (fill)  fill.style.width     = pct + '%';
  if (label) label.textContent    = `PROGRESO: ${pct}%`;
}


// ══════════════════════════════════════════════
// BUSCADOR DE ÁREAS
// Filtra las tarjetas en tiempo real por título.
// ══════════════════════════════════════════════
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
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    const emptyMsg = document.getElementById('search-empty');
    if (emptyMsg) emptyMsg.classList.toggle('hidden', visible > 0);
  });
}


// ══════════════════════════════════════════════
// SCROLL REVEAL
// IntersectionObserver: añade .visible cuando
// el elemento entra en el viewport.
// ══════════════════════════════════════════════
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}


// ══════════════════════════════════════════════
// REGISTRO
// ══════════════════════════════════════════════
function bindEvents() {
  document.getElementById('register-form').addEventListener('submit', handleRegister);

  document.getElementById('modal-close').addEventListener('click', closeAreaModal);
  document.getElementById('death-modal-close').addEventListener('click', closeDeathModal);
  document.getElementById('area-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeAreaModal();
  });
  document.getElementById('death-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeDeathModal();
  });

  document.getElementById('death-form').addEventListener('submit', handleDeathReport);
  document.getElementById('logout-btn').addEventListener('click', handleLogout);

  initSearch();
}

async function handleRegister(e) {
  e.preventDefault();

  const emailInput = document.getElementById('user-email');
  const nameInput  = document.getElementById('user-name');
  const errorEl    = document.getElementById('form-error');
  const btnText    = document.querySelector('#register-btn .btn-text');
  const btnLoader  = document.querySelector('#register-btn .btn-loader');

  const email = emailInput.value.trim();
  const name  = nameInput.value.trim();

  if (!email || !name) {
    errorEl.textContent = '⚠ Todos los campos son obligatorios.';
    return;
  }
  if (!isValidEmail(email)) {
    errorEl.textContent = '⚠ Introduce un correo electrónico válido.';
    return;
  }

  errorEl.textContent = '';
  btnText.style.display  = 'none';
  btnLoader.style.display = 'inline';

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      user_name:  name,
      user_email: email,
      message:    `${name} se ha registrado en la Guía de Resident Evil: Requiem.`
    });
  } catch (err) {
    console.error('EmailJS error:', err);
  }

  currentUser = { name, email };
  sessionStorage.setItem('re_requiem_user', JSON.stringify(currentUser));

  // Notificar al servidor de Discord
  sendDiscordNotification(`🧟 **Nuevo operativo registrado:** ${name} | ${email}`);

  btnText.style.display   = 'inline';
  btnLoader.style.display = 'none';

  triggerDoorTransition();
}

function showMainContent() {
  document.getElementById('register-screen').style.display = 'none';
  document.getElementById('main-content').classList.remove('hidden');

  if (currentUser) {
    document.getElementById('header-user-name').textContent =
      currentUser.name.toUpperCase();
  }

  updateProgressBar();
  initScrollReveal();
}

// ── Transición puerta Umbrella ──────────────────
// Cierra los paneles sobre el registro, intercambia
// las pantallas y los abre para revelar la guía.
function triggerDoorTransition() {
  const registerScreen = document.getElementById('register-screen');
  const doorOverlay    = document.getElementById('door-overlay');

  doorOverlay.style.pointerEvents = 'all';
  doorOverlay.classList.add('closing');

  setTimeout(() => {
    registerScreen.style.display = 'none';
    showMainContent();

    setTimeout(() => {
      doorOverlay.classList.remove('closing');
      setTimeout(() => {
        doorOverlay.style.pointerEvents = 'none';
      }, 700);
    }, 320);
  }, 650);
}

function handleLogout() {
  sessionStorage.removeItem('re_requiem_user');
  currentUser = null;
  const doorOverlay = document.getElementById('door-overlay');
  doorOverlay.classList.remove('closing');
  doorOverlay.style.pointerEvents = 'none';
  document.getElementById('register-screen').style.display = 'flex';
  document.getElementById('main-content').classList.add('hidden');
  document.getElementById('register-form').reset();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// ══════════════════════════════════════════════
// RENDER ÁREAS
// ══════════════════════════════════════════════
function renderAreas() {
  const grid = document.getElementById('areas-grid');
  grid.innerHTML = '';

  AREAS.forEach((area, index) => {
    const card = document.createElement('div');
    card.className = 'area-card';
    card.setAttribute('data-area-id', area.id);

    const imgHtml = area.coverImage
      ? `<img src="${area.coverImage}" alt="${area.title}" class="area-card-img" loading="lazy" />`
      : `<div class="area-card-img-placeholder"></div>`;

    card.innerHTML = `
      ${imgHtml}
      <div class="area-card-body">
        <div class="area-card-number">ÁREA ${String(index + 1).padStart(2, '0')}</div>
        <div class="area-card-title">${area.title}</div>
        <p class="area-card-desc">${area.description}</p>
        <div class="area-card-footer">
          <span class="area-zone-count">${area.zones.length} ZONA${area.zones.length !== 1 ? 'S' : ''}</span>
          <span class="area-card-cta">ACCEDER →</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openAreaModal(area, index + 1));
    grid.appendChild(card);
  });
}


// ══════════════════════════════════════════════
// MODAL — ÁREAS Y ZONAS
// ══════════════════════════════════════════════
function openAreaModal(area, areaNumber) {
  document.getElementById('modal-area-tag').textContent =
    `ÁREA ${String(areaNumber).padStart(2, '0')}`;
  document.getElementById('modal-title').textContent  = area.title;
  document.getElementById('modal-area-desc').textContent = area.description;

  renderZones(area.zones);

  const modal = document.getElementById('area-modal');
  modal.classList.remove('hidden');
  modal.scrollTop = 0;
  document.body.style.overflow = 'hidden';

  playScanEffect();
}

function playScanEffect(reverse = false) {
  const el = document.createElement('div');
  el.className = 'zone-scan-overlay' + (reverse ? ' reverse' : '');
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
}

function closeAreaModal() {
  playScanEffect(true);
  document.getElementById('area-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

function renderZones(zones) {
  const list         = document.getElementById('zones-list');
  const completedIds = loadProgress();
  list.innerHTML = '';

  zones.forEach((zone, index) => {
    const item      = document.createElement('div');
    item.className  = 'zone-item';
    const isCompleted = completedIds.includes(zone.id);
    const photosHtml  = buildPhotosHtml(zone.photos);

    item.innerHTML = `
      <div class="zone-info">
        <div class="zone-number">ZONA ${String(index + 1).padStart(2, '0')}</div>
        <div class="zone-name">${zone.name}</div>
        <p class="zone-desc">${zone.description}</p>
        <div class="zone-actions">
          <button class="zone-death-btn" data-zone-id="${zone.id}" data-zone-name="${zone.name}">
            💀 MARCAR MUERTE AQUÍ
          </button>
          <label class="zone-complete-label ${isCompleted ? 'completed' : ''}">
            <input type="checkbox" class="zone-complete-check" data-zone-id="${zone.id}" ${isCompleted ? 'checked' : ''} />
            ZONA COMPLETADA
          </label>
        </div>
      </div>
      <div class="zone-photos">${photosHtml}</div>
    `;

    list.appendChild(item);
  });

  // Bind botones de muerte
  list.querySelectorAll('.zone-death-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openDeathModal(
        btn.getAttribute('data-zone-id'),
        btn.getAttribute('data-zone-name')
      );
    });
  });

  // Bind checkboxes de progreso
  list.querySelectorAll('.zone-complete-check').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const zoneId = checkbox.getAttribute('data-zone-id');
      let ids = loadProgress();

      if (checkbox.checked) {
        if (!ids.includes(zoneId)) ids.push(zoneId);
        checkbox.parentElement.classList.add('completed');
      } else {
        ids = ids.filter(id => id !== zoneId);
        checkbox.parentElement.classList.remove('completed');
      }

      saveProgress(ids);
      updateProgressBar();
    });
  });
}

function buildPhotosHtml(photos) {
  if (!photos || photos.length === 0) {
    return `
      <div class="zone-photo-placeholder"><span>📷</span><span>SIN FOTO</span></div>
      <div class="zone-photo-placeholder"><span>📷</span><span>SIN FOTO</span></div>
    `;
  }
  return photos.map(src =>
    `<img src="${src}" alt="Foto de zona" class="zone-photo" loading="lazy" />`
  ).join('');
}


// ══════════════════════════════════════════════
// MODAL — REPORTAR MUERTE
// ══════════════════════════════════════════════
function openDeathModal(zoneId, zoneName) {
  currentDeathZoneId = zoneId;
  document.getElementById('death-zone-name').textContent = `Zona: ${zoneName}`;
  document.getElementById('death-message').value = '';
  document.getElementById('death-success').classList.add('hidden');

  const modal = document.getElementById('death-modal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeDeathModal() {
  document.getElementById('death-modal').classList.add('hidden');
  currentDeathZoneId = null;
  document.body.style.overflow = '';
}

async function handleDeathReport(e) {
  e.preventDefault();

  const message   = document.getElementById('death-message').value.trim();
  const successEl = document.getElementById('death-success');

  if (!message) {
    successEl.textContent = '⚠ Escribe cómo ocurrió la muerte.';
    successEl.style.color = 'var(--red)';
    successEl.classList.remove('hidden');
    return;
  }

  const zoneName = document.getElementById('death-zone-name').textContent.replace('Zona: ', '');

  // Guardar en localStorage
  const deaths = JSON.parse(localStorage.getItem('re_requiem_deaths') || '[]');
  deaths.push({
    zoneId:    currentDeathZoneId,
    zoneName,
    message,
    user:      currentUser?.name || 'Desconocido',
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('re_requiem_deaths', JSON.stringify(deaths));

  // Notificar por EmailJS
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      user_name:  currentUser ? currentUser.name : 'Operativo',
      user_email: currentUser ? currentUser.email : '',
      message:    `MUERTE REGISTRADA\nZona: ${zoneName}\n\nDescripción:\n${message}`
    });
  } catch (err) {
    console.error('EmailJS death report error:', err);
  }

  // Notificar al servidor de Discord
  sendDiscordNotification(
    `💀 **${currentUser?.name || 'Operativo'}** murió en **${zoneName}**:\n> ${message}`
  );

  successEl.textContent = '✔ Muerte registrada en el archivo.';
  successEl.style.color = '#00e676';
  successEl.classList.remove('hidden');

  setTimeout(() => closeDeathModal(), 2000);
}
