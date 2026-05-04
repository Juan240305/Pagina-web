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
    title: 'NOMBRE ÁREA 01',
    description: 'Descripción breve del área 01. Contexto narrativo, nivel de peligro y tipo de enemigos.',
    coverImage: '',
    zones: [
      { id: 'z-01-01', name: 'NOMBRE ZONA 1', description: 'Descripción de qué tienes que hacer en esta zona, qué encontrarás, enemigos, puzzles, items importantes, etc.', photos: [] },
      { id: 'z-01-02', name: 'NOMBRE ZONA 2', description: 'Descripción de la zona 2 dentro del área 01.', photos: [] },
      { id: 'z-01-03', name: 'NOMBRE ZONA 3', description: 'Descripción de la zona 3 dentro del área 01.', photos: [] }
    ]
  },
  {
    id: 'area-02',
    title: 'NOMBRE ÁREA 02',
    description: 'Descripción breve del área 02.',
    coverImage: '',
    zones: [
      { id: 'z-02-01', name: 'NOMBRE ZONA 1', description: 'Descripción de la zona 1 dentro del área 02.', photos: [] },
      { id: 'z-02-02', name: 'NOMBRE ZONA 2', description: 'Descripción de la zona 2 dentro del área 02.', photos: [] }
    ]
  },
  {
    id: 'area-03',
    title: 'NOMBRE ÁREA 03',
    description: 'Descripción breve del área 03.',
    coverImage: '',
    zones: [
      { id: 'z-03-01', name: 'NOMBRE ZONA 1', description: 'Descripción de la zona 1 dentro del área 03.', photos: [] },
      { id: 'z-03-02', name: 'NOMBRE ZONA 2', description: 'Descripción de la zona 2 dentro del área 03.', photos: [] },
      { id: 'z-03-03', name: 'NOMBRE ZONA 3', description: 'Descripción de la zona 3 dentro del área 03.', photos: [] }
    ]
  },
  {
    id: 'area-04',
    title: 'NOMBRE ÁREA 04',
    description: 'Descripción breve del área 04.',
    coverImage: '',
    zones: [
      { id: 'z-04-01', name: 'NOMBRE ZONA 1', description: 'Descripción de la zona 1 dentro del área 04.', photos: [] },
      { id: 'z-04-02', name: 'NOMBRE ZONA 2', description: 'Descripción de la zona 2 dentro del área 04.', photos: [] }
    ]
  },
  {
    id: 'area-05',
    title: 'NOMBRE ÁREA 05',
    description: 'Descripción breve del área 05.',
    coverImage: '',
    zones: [
      { id: 'z-05-01', name: 'NOMBRE ZONA 1', description: 'Descripción de la zona 1 dentro del área 05.', photos: [] },
      { id: 'z-05-02', name: 'NOMBRE ZONA 2', description: 'Descripción de la zona 2 dentro del área 05.', photos: [] },
      { id: 'z-05-03', name: 'NOMBRE ZONA 3', description: 'Descripción de la zona 3 dentro del área 05.', photos: [] }
    ]
  },
  {
    id: 'area-06',
    title: 'NOMBRE ÁREA 06',
    description: 'Descripción breve del área 06.',
    coverImage: '',
    zones: [
      { id: 'z-06-01', name: 'NOMBRE ZONA 1', description: 'Descripción de la zona 1 dentro del área 06.', photos: [] },
      { id: 'z-06-02', name: 'NOMBRE ZONA 2', description: 'Descripción de la zona 2 dentro del área 06.', photos: [] }
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

  showMainContent();

  btnText.style.display   = 'inline';
  btnLoader.style.display = 'none';
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

function handleLogout() {
  sessionStorage.removeItem('re_requiem_user');
  currentUser = null;
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
}

function closeAreaModal() {
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
