/* ================================================================
   ManoCerca — app.js
   SPA Router + Tema Dark/Light + Catálogo dinámico + Formulario
   validado + Modales accesibles + Persistencia en localStorage
   Stack: JavaScript Vanilla (sin frameworks)
   ================================================================ */

'use strict';

// ── CLAVES DE PERSISTENCIA ──────────────────────────────────────
const STORAGE = {
  theme:       'mc_theme',        // 'light' | 'dark'
  requests:    'mc_solicitudes',  // solicitudes publicadas por el usuario
  lastFilter:  'mc_filtro',       // último filtro de categoría
  provider:    'mc_prestador',    // último prestador visto
  session:     'mc_session',
};

const store = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage bloqueado */ }
  },
};

// ── DATOS SIMULADOS ─────────────────────────────────────────────
const PROVIDERS = [
  { id: 1, initials: 'JP', color: '#1D4ED8', name: 'Juan Pérez',      profession: 'Plomero',       category: 'Plomería',
    rating: 4.8, reviews: 42, jobs: 37, distance: '2.4 km', verified: true, available: 'hoy',    price: 25000,
    service: 'Reparación de cañería',
    bio: 'Técnico en plomería con más de 8 años de experiencia. Realizo instalaciones, reparaciones y mantenimiento en hogares y comercios.',
    services: [['💧', 'Reparación de cañerías'], ['🚿', 'Instalación de sanitarios'], ['🔧', 'Destapaciones']] },
  { id: 2, initials: 'ML', color: '#6d28d9', name: 'Martín López',    profession: 'Electricista',  category: 'Electricidad',
    rating: 4.7, reviews: 36, jobs: 28, distance: '3.1 km', verified: true, available: 'hoy',    price: 20000,
    service: 'Revisión de instalación eléctrica',
    bio: 'Electricista matriculado. Instalaciones domiciliarias, tableros, disyuntores y reparación de cortocircuitos.',
    services: [['⚡', 'Tableros y disyuntores'], ['💡', 'Instalación de luminarias'], ['🔌', 'Tomacorrientes y cableado']] },
  { id: 3, initials: 'CG', color: '#15803d', name: 'Carlos Gómez',    profession: 'Gasista',       category: 'Gas',
    rating: 4.9, reviews: 58, jobs: 56, distance: '1.8 km', verified: true, available: 'mañana', price: 28000,
    service: 'Revisión de calefón',
    bio: 'Gasista matriculado con 12 años de oficio. Instalación y mantenimiento de calefones, cocinas y estufas.',
    services: [['🔥', 'Instalación de calefones'], ['🍳', 'Conexión de cocinas'], ['🧯', 'Detección de pérdidas']] },
  { id: 4, initials: 'LT', color: '#c2410c', name: 'Lucía Torres',    profession: 'Limpieza',      category: 'Limpieza',
    rating: 4.6, reviews: 31, jobs: 24, distance: '4.2 km', verified: true, available: 'hoy',    price: 18000,
    service: 'Limpieza profunda',
    bio: 'Servicio de limpieza integral para casas y departamentos. Puntual, prolija y con productos propios.',
    services: [['🧹', 'Limpieza general'], ['🪟', 'Limpieza de vidrios'], ['🧽', 'Limpieza post obra']] },
  { id: 5, initials: 'SR', color: '#be123c', name: 'Sofía Ruiz',      profession: 'Pintora',       category: 'Pintura',
    rating: 4.8, reviews: 27, jobs: 33, distance: '2.9 km', verified: true, available: 'mañana', price: 35000,
    service: 'Pintura de ambiente',
    bio: 'Pintura de interiores y exteriores, enduido y tratamiento de humedad. Presupuesto sin cargo.',
    services: [['🎨', 'Pintura de interiores'], ['🏠', 'Frentes y exteriores'], ['🧱', 'Tratamiento de humedad']] },
  { id: 6, initials: 'DF', color: '#0369a1', name: 'Diego Fernández', profession: 'Albañil',       category: 'Albañilería',
    rating: 4.5, reviews: 19, jobs: 21, distance: '5.0 km', verified: false, available: 'hoy',   price: 40000,
    service: 'Reparación de revoque',
    bio: 'Albañilería en general: revoques, contrapisos, colocación de cerámicos y pequeñas ampliaciones.',
    services: [['🧱', 'Revoques y contrapisos'], ['🔲', 'Colocación de cerámicos'], ['🏗️', 'Pequeñas ampliaciones']] },
];

const CATEGORY_ICONS = {
  'Plomería': '💧', 'Electricidad': '⚡', 'Gas': '🔥', 'Pintura': '🎨', 'Albañilería': '🧱',
  'Jardinería': '🌱', 'Limpieza': '🧹', 'Electrodomésticos': '🔧',
};

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const formatARS = n => '$' + n.toLocaleString('es-AR');

let currentProvider = PROVIDERS.find(p => p.id === store.get(STORAGE.provider)) || PROVIDERS[0];

/* Avatar como imagen real (SVG en data URI) para tener <img alt> */
function avatarSrc(p) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><circle cx="48" cy="48" r="48" fill="${p.color}"/>` +
    `<text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="34" font-weight="700" fill="#fff">${p.initials}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// ════════════════════════════════════════════════════════════════
// 1. TEMA DARK / LIGHT (persistido en localStorage)
// ════════════════════════════════════════════════════════════════
function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  const btn = $('#theme-btn');
  if (btn) {
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
  }
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', isDark ? '#0b1220' : '#1D4ED8');
}

function initTheme() {
  const saved = store.get(STORAGE.theme);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));

  $('#theme-btn')?.addEventListener('click', () => {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next);
    store.set(STORAGE.theme, next);
    showToast(next === 'dark' ? '🌙 Modo oscuro activado' : '☀️ Modo claro activado');
  });
}

// ════════════════════════════════════════════════════════════════
// 2. ROUTER SPA
// ════════════════════════════════════════════════════════════════
const views = {};

function navigate(viewId, { push = true, focus = true } = {}) {
  if (!Object.keys(views).length) {
    $$('.view').forEach(el => { views[el.id.replace('view-', '')] = el; });
  }
  const target = views[viewId];
  if (!target) return;

  Object.values(views).forEach(v => v.classList.remove('active'));
  target.classList.add('active');
  closeMobileMenu(false);

  window.scrollTo({ top: 0, behavior: 'auto' });

  // Mover el foco a la vista nueva (lectores de pantalla + teclado)
  if (focus) {
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  $$('.bnav-btn').forEach(btn => {
    const on = btn.dataset.view === viewId;
    btn.classList.toggle('active', on);
    on ? btn.setAttribute('aria-current', 'page') : btn.removeAttribute('aria-current');
  });
  $$('.nav-link[data-view]').forEach(link => {
    const on = link.dataset.view === viewId;
    link.classList.toggle('active', on);
    on ? link.setAttribute('aria-current', 'page') : link.removeAttribute('aria-current');
  });

  if (push) history.pushState({ view: viewId }, '', `#${viewId}`);
}

/* Desplazamiento suave a una sección del inicio */
function scrollToSection(id) {
  const go = () => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const heading = el.querySelector('h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  };
  closeMobileMenu(false);
  if (!views.home?.classList.contains('active')) {
    navigate('home', { focus: false });
    requestAnimationFrame(() => setTimeout(go, 30));
  } else {
    go();
  }
}

// Delegación global de clicks: navegación, scroll y acciones
document.addEventListener('click', (e) => {
  const scrollTrigger = e.target.closest('[data-scroll]');
  if (scrollTrigger) {
    e.preventDefault();
    scrollToSection(scrollTrigger.dataset.scroll);
    return;
  }

  const actionTrigger = e.target.closest('[data-action]');
  if (actionTrigger) {
    e.preventDefault();
    runAction(actionTrigger.dataset.action, actionTrigger);
    return;
  }

  const trigger = e.target.closest('[data-view]');
  if (!trigger) return;
  e.preventDefault();

  if (trigger.dataset.provider) selectProvider(Number(trigger.dataset.provider));
  if (trigger.dataset.cat) setSearchFilter(trigger.dataset.cat);
  navigate(trigger.dataset.view);
});

window.addEventListener('popstate', (e) => {
  const fromHash = location.hash.slice(1);
  const view = e.state?.view || (document.getElementById(`view-${fromHash}`) ? fromHash : null);
  if (view) navigate(view, { push: false });   // anclas internas (#app, #publicar) no cambian de vista
});

// ── Acciones secundarias (botones sin vista propia) ─────────────
function runAction(action, el) {
  switch (action) {
    case 'coupon':
      navigator.clipboard?.writeText('MANOCERCA10').catch(() => {});
      showToast('🎁 Tu cupón: MANOCERCA10 (10% off) — copiado al portapapeles');
      break;
    case 'share':
      if (navigator.share) navigator.share({ title: 'ManoCerca', url: location.href }).catch(() => {});
      else { navigator.clipboard?.writeText(location.href).catch(() => {}); showToast('🔗 Enlace copiado'); }
      break;
    case 'location':
      showToast('📍 Por ahora operamos en Río Cuarto, Córdoba');
      break;
    case 'focus-filters':
      $('#view-search .filter-chip:not(:disabled)')?.focus();
      break;
    default:
      showToast('Función disponible próximamente');
  }
}

// ════════════════════════════════════════════════════════════════
// 3. MENÚ MOBILE (hamburguesa, Esc para cerrar)
// ════════════════════════════════════════════════════════════════
function openMobileMenu() {
  const btn = $('#menu-btn'), menu = $('#mobile-menu');
  if (!btn || !menu) return;
  menu.hidden = false;
  btn.setAttribute('aria-expanded', 'true');
  btn.setAttribute('aria-label', 'Cerrar menú');
  $('a', menu)?.focus();
}

function closeMobileMenu(returnFocus = true) {
  const btn = $('#menu-btn'), menu = $('#mobile-menu');
  if (!btn || !menu || menu.hidden) return;
  menu.hidden = true;
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Abrir menú');
  if (returnFocus) btn.focus();
}

function initMobileMenu() {
  $('#menu-btn')?.addEventListener('click', () => {
    $('#mobile-menu').hidden ? openMobileMenu() : closeMobileMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('#mobile-menu').hidden) closeMobileMenu();
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', () => closeMobileMenu(false));
}

// ════════════════════════════════════════════════════════════════
// 4. CATÁLOGO DINÁMICO + FILTROS
// ════════════════════════════════════════════════════════════════
function availabilityBadge(p) {
  return p.available === 'hoy'
    ? '<span class="badge badge-green">Disponible hoy</span>'
    : '<span class="badge badge-violet">Disponible mañana</span>';
}

function renderHomeProviders() {
  const grid = $('#home-providers-grid');
  if (!grid) return;

  grid.innerHTML = PROVIDERS.map(p => `
    <li>
      <article class="card card-hover h-full p-5 flex flex-col" data-view="profile" data-provider="${p.id}" aria-labelledby="prov-${p.id}-name">
        <div class="flex items-start justify-between mb-3">
          <span class="badge badge-slate"><span aria-hidden="true">${CATEGORY_ICONS[p.category] || ''}</span> ${p.category}</span>
          ${availabilityBadge(p)}
        </div>
        <div class="flex flex-col items-center text-center mb-4">
          <img src="${avatarSrc(p)}" alt="Foto de perfil de ${p.name}" width="72" height="72" class="avatar-img avatar-lg mb-3" loading="lazy" />
          <h3 id="prov-${p.id}-name" class="font-bold text-slate-900 text-base">${p.name}</h3>
          <p class="text-sm font-semibold text-brand mt-0.5">${p.profession}</p>
        </div>
        <div class="flex items-center gap-1.5 justify-center text-sm text-slate-600 mb-1">
          <span class="text-amber-400" aria-hidden="true">★</span>
          <strong class="text-slate-700">${p.rating}</strong>
          <span aria-hidden="true">·</span>
          <span>${p.reviews} reseñas</span>
          <span aria-hidden="true">·</span>
          <span>📍 ${p.distance}</span>
        </div>
        <p class="text-center text-xs mb-4 ${p.verified ? 'text-brand font-semibold' : 'text-slate-500'}">
          ${p.verified ? '✓ Identidad verificada' : 'Verificación en proceso'}
        </p>
        <p class="text-center text-sm text-slate-600 mb-4 mt-auto">Desde <strong class="text-slate-900 text-base">${formatARS(p.price)}</strong></p>
        <button class="btn btn-primary force-text-white text-sm" data-view="profile" data-provider="${p.id}"
                aria-label="Ver perfil de ${p.name}">Ver perfil</button>
      </article>
    </li>
  `).join('');
}

function renderSearchList(filter = 'Todos', query = '') {
  const list  = $('#search-list');
  const count = $('#search-results-count');
  if (!list) return;

  const q = query.trim().toLowerCase();
  let filtered = PROVIDERS;
  if (filter !== 'Todos') filtered = filtered.filter(p => p.category === filter);
  if (q) filtered = filtered.filter(p =>
    [p.name, p.profession, p.category].some(t => t.toLowerCase().includes(q)));

  if (count) count.textContent = `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}`;

  if (!filtered.length) {
    list.innerHTML = `
      <li class="text-center py-12">
        <div class="text-5xl mb-3" aria-hidden="true">🔍</div>
        <p class="font-semibold text-slate-700 mb-1">Sin resultados</p>
        <p class="text-sm text-slate-500">Probá con otra categoría o término de búsqueda.</p>
      </li>`;
    return;
  }

  list.innerHTML = filtered.map(p => `
    <li>
      <button class="card card-hover w-full text-left p-4 flex items-center gap-4" data-view="profile" data-provider="${p.id}"
              aria-label="${p.name}, ${p.profession}. Calificación ${p.rating}. Desde ${formatARS(p.price)}">
        <img src="${avatarSrc(p)}" alt="" width="56" height="56" class="avatar-img avatar-md" />
        <span class="flex-1 min-w-0">
          <span class="block font-bold text-slate-900 text-sm">${p.name}</span>
          <span class="block text-xs text-brand font-semibold mb-1">${p.profession}</span>
          <span class="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <span><span class="text-amber-400" aria-hidden="true">★</span> <strong class="text-slate-600">${p.rating}</strong> (${p.reviews} reseñas)</span>
            <span aria-hidden="true">·</span>
            <span>📍 ${p.distance}</span>
          </span>
          <span class="flex gap-1.5 mt-2 flex-wrap">
            ${p.verified ? '<span class="badge badge-blue">✓ Verificado</span>' : ''}
            ${availabilityBadge(p)}
          </span>
        </span>
        <span class="text-right flex-shrink-0">
          <span class="block text-xs text-slate-500">Desde</span>
          <span class="block font-bold text-slate-900">${formatARS(p.price)}</span>
        </span>
      </button>
    </li>
  `).join('');
}

function setSearchFilter(category) {
  const chips = $$('#view-search .filter-chip[data-filter]');
  let chip = chips.find(c => c.dataset.filter === category && !c.disabled);
  if (!chip) chip = chips.find(c => c.dataset.filter === 'Todos');
  chips.forEach(c => {
    const on = c === chip;
    c.classList.toggle('active', on);
    c.setAttribute('aria-pressed', String(on));
  });
  store.set(STORAGE.lastFilter, chip.dataset.filter);
  renderSearchList(chip.dataset.filter, $('#search-input')?.value || '');
}

function initFilters() {
  const view = $('#view-search');
  if (!view) return;

  // Estado Disabled real: categorías sin prestadores
  $$('.filter-chip[data-filter]', view).forEach(chip => {
    const cat = chip.dataset.filter;
    if (cat !== 'Todos' && !PROVIDERS.some(p => p.category === cat)) {
      chip.disabled = true;
      chip.title = 'Todavía no hay prestadores en esta categoría';
      chip.setAttribute('aria-label', `${cat} (sin prestadores por ahora)`);
    }
  });

  view.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip[data-filter]');
    if (chip && !chip.disabled) setSearchFilter(chip.dataset.filter);
  });

  $('#search-input')?.addEventListener('input', (e) => {
    const active = $('.filter-chip.active', view)?.dataset.filter || 'Todos';
    renderSearchList(active, e.target.value);
  });

  setSearchFilter(store.get(STORAGE.lastFilter, 'Todos'));
}

function initHeroSearch() {
  const input = $('#hero-search');
  const go = () => {
    const si = $('#search-input');
    if (si) si.value = input?.value || '';
    setSearchFilter('Todos');
    navigate('search');
  };
  $('#hero-search-btn')?.addEventListener('click', go);
  input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
}

// ════════════════════════════════════════════════════════════════
// 5. PERFIL / CONTRATACIÓN según el prestador elegido
// ════════════════════════════════════════════════════════════════
function selectProvider(id) {
  const p = PROVIDERS.find(x => x.id === id);
  if (!p) return;
  currentProvider = p;
  store.set(STORAGE.provider, id);
  renderProvider();
}

function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }

function renderProvider() {
  const p = currentProvider;
  ['profile-avatar', 'hire-avatar'].forEach(id => {
    const img = document.getElementById(id);
    if (img) { img.src = avatarSrc(p); img.alt = `Foto de perfil de ${p.name}`; }
  });
  setText('profile-name', p.name);
  setText('profile-profession', p.profession);
  setText('profile-rating', p.rating);
  setText('profile-reviews', p.reviews);
  setText('profile-jobs', p.jobs);
  setText('profile-distance', p.distance);
  setText('profile-bio', p.bio);

  const avail = $('#profile-available');
  if (avail) {
    avail.className = `badge ${p.available === 'hoy' ? 'badge-green' : 'badge-violet'}`;
    avail.textContent = p.available === 'hoy' ? 'Disponible hoy' : 'Disponible mañana';
  }
  const services = $('#profile-services');
  if (services) {
    services.innerHTML = p.services.map(([icon, label]) => `
      <li class="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
        <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-base" aria-hidden="true">${icon}</div>
        <span class="text-sm text-slate-700 font-medium">${label}</span>
      </li>`).join('');
  }
  $('#profile-contact')?.setAttribute('aria-label', `Contratar a ${p.name}`);

  setText('hire-name', p.name);
  setText('hire-profession', p.profession);
  setText('hire-rating', `${p.rating} (${p.reviews} reseñas)`);
  setText('hire-service', p.service);
  setText('hire-price', formatARS(p.price));
  setText('track-title', `${p.name} está en camino`);
}

function initConfirmHire() {
  const checkbox = $('#terms-check');
  const btn      = $('#confirm-hire-btn');
  const hint     = $('#hire-hint');
  if (!checkbox || !btn) return;

  checkbox.addEventListener('change', () => {
    btn.disabled = !checkbox.checked;
    if (hint) hint.textContent = checkbox.checked ? 'Todo listo para contratar.' : 'Aceptá los términos para habilitar la contratación.';
  });

  btn.addEventListener('click', () => {
    if (btn.disabled) return;
    navigate('trabajo');
    showToast(`✅ ¡Contratación confirmada! ${currentProvider.name} está en camino.`);
    checkbox.checked = false;
    btn.disabled = true;
  });
}

// ════════════════════════════════════════════════════════════════
// 6. MODALES ACCESIBLES (<dialog>)
// ════════════════════════════════════════════════════════════════
let lastTrigger = null;

function openModal(dialog, trigger = document.activeElement) {
  if (!dialog) return;
  lastTrigger = trigger;
  dialog.showModal();                      // foco atrapado + fondo inerte
  const first = $('[autofocus]', dialog) || $('button, [href], input, select, textarea', dialog);
  first?.focus();
}

function closeModal(dialog) {
  if (dialog?.open) dialog.close();
}

function initModals() {
  $$('dialog.modal').forEach(dialog => {
    // Botones con data-close
    dialog.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) closeModal(dialog);
      // Click fuera del panel (en el backdrop)
      if (e.target === dialog) closeModal(dialog);
    });
    // Esc dispara "cancel" nativo → cerramos y devolvemos foco
    dialog.addEventListener('close', () => {
      if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
      lastTrigger = null;
    });
    // Trampa de foco explícita (refuerzo del comportamiento nativo)
    dialog.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = $$('button:not(:disabled), [href], input:not(:disabled), select, textarea', dialog);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  });

  $('#success-go')?.addEventListener('click', () => {
    lastTrigger = null;
    closeModal($('#success-modal'));
    navigate('solicitudes');
    selectTab('activas');
  });
}

/* Confirmación reutilizable (reemplaza window.confirm) */
function confirmAction({ title, desc, okLabel = 'Confirmar' }, onConfirm) {
  const dialog = $('#confirm-modal');
  setText('confirm-title', title);
  setText('confirm-desc', desc);
  const ok = $('#confirm-ok');
  ok.textContent = okLabel;
  const trigger = document.activeElement;
  ok.onclick = () => {
    lastTrigger = null;
    closeModal(dialog);
    onConfirm();
  };
  openModal(dialog, trigger);
}

function initDestructiveActions() {
  $('#cancel-job-btn')?.addEventListener('click', () => {
    confirmAction({
      title: '¿Cancelar este trabajo?',
      desc: `Se le avisará a ${currentProvider.name}. Esta acción no se puede deshacer.`,
      okLabel: 'Sí, cancelar',
    }, () => {
      navigate('solicitudes');
      selectTab('canceladas');
      showToast('Trabajo cancelado correctamente.');
    });
  });

  $('#logout-btn')?.addEventListener('click', () => {
    confirmAction({ title: '¿Cerrar sesión?', desc: 'Vas a tener que volver a ingresar para ver tus solicitudes.', okLabel: 'Cerrar sesión' },
      () => { navigate('home'); showToast('Sesión cerrada correctamente.'); });
  });
}

// ════════════════════════════════════════════════════════════════
// 7. FORMULARIO "PUBLICAR SOLICITUD" — validación en cliente
// ════════════════════════════════════════════════════════════════
const VALIDATORS = {
  titulo: v => {
    if (!v.trim()) return 'Escribí un título para tu solicitud.';
    if (v.trim().length < 8) return `El título necesita al menos 8 caracteres (llevás ${v.trim().length}).`;
    return '';
  },
  categoria: v => (v ? '' : 'Elegí qué tipo de servicio necesitás.'),
  telefono: v => {
    const digits = v.replace(/\D/g, '');
    if (!digits) return 'Ingresá un teléfono para que el prestador te contacte.';
    if (digits.length < 8 || digits.length > 13) return 'Revisá el número: debe tener entre 8 y 13 dígitos.';
    return '';
  },
  descripcion: v => {
    if (!v.trim()) return 'Describí brevemente el problema.';
    if (v.trim().length < 20) return `Agregá un poco más de detalle: mínimo 20 caracteres (llevás ${v.trim().length}).`;
    return '';
  },
};

function validateField(field) {
  const rule = VALIDATORS[field.name];
  if (!rule) return true;
  const msg = rule(field.value);
  const errorEl = document.getElementById(`${field.id}-error`);
  if (errorEl) errorEl.textContent = msg ? `⚠ ${msg}` : '';
  field.setAttribute('aria-invalid', String(Boolean(msg)));
  field.classList.add('touched');
  return !msg;
}

function initRequestForm() {
  const form = $('#request-form');
  if (!form) return;
  const fields = $$('[name]', form).filter(f => VALIDATORS[f.name]);
  const desc = $('#f-descripcion');
  const counter = $('#f-descripcion-count');

  const updateCounter = () => { if (counter) counter.textContent = `${desc.value.length} / ${desc.maxLength}`; };
  desc?.addEventListener('input', updateCounter);

  fields.forEach(f => {
    f.addEventListener('blur', () => { if (f.value || f.classList.contains('touched')) validateField(f); });
    f.addEventListener('input', () => { if (f.classList.contains('touched')) validateField(f); });
    f.addEventListener('change', () => { if (f.tagName === 'SELECT') validateField(f); });
  });

  form.addEventListener('reset', () => {
    requestAnimationFrame(() => {
      fields.forEach(f => {
        f.removeAttribute('aria-invalid');
        f.classList.remove('touched');
        const err = document.getElementById(`${f.id}-error`);
        if (err) err.textContent = '';
      });
      updateCounter();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = fields.map(validateField);
    if (results.includes(false)) {
      fields[results.indexOf(false)].focus();
      showToast('Revisá los campos marcados');
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    const request = {
      id: Date.now(),
      titulo: data.titulo.trim(),
      categoria: data.categoria,
      descripcion: data.descripcion.trim(),
      urgente: Boolean(data.urgente),
      fecha: new Date().toISOString(),
    };
    const saved = store.get(STORAGE.requests, []);
    saved.unshift(request);
    store.set(STORAGE.requests, saved);
    renderPublishedRequests();

    setText('success-desc', `"${request.titulo}" ya está visible para prestadores de ${request.categoria}. Te avisaremos cuando lleguen propuestas.`);
    const submitBtn = form.querySelector('[type="submit"]');
    form.reset();
    openModal($('#success-modal'), submitBtn);
  });
}

function renderPublishedRequests() {
  const list = $('#solicitudes-list');
  if (!list) return;
  $$('[data-published]', list).forEach(el => el.remove());

  const saved = store.get(STORAGE.requests, []);
  const html = saved.map(r => {
    const fecha = new Date(r.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
    return `
      <div class="card p-4 flex items-center gap-4" data-status="activas" data-published>
        <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0" aria-hidden="true">${CATEGORY_ICONS[r.categoria] || '📝'}</div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-0.5 gap-2">
            <p class="font-bold text-sm text-slate-900 truncate">${escapeHtml(r.titulo)}</p>
            <span class="badge ${r.urgente ? 'badge-red' : 'badge-amber'} flex-shrink-0">${r.urgente ? 'Urgente' : 'Publicada'}</span>
          </div>
          <p class="text-xs text-slate-500">${escapeHtml(r.categoria)} · 📅 ${fecha}</p>
          <p class="text-xs text-slate-500 mt-1">Esperando propuestas…</p>
        </div>
      </div>`;
  }).join('');
  list.insertAdjacentHTML('afterbegin', html);
  applyTabFilter();
}

// ════════════════════════════════════════════════════════════════
// 8. PESTAÑAS "MIS SOLICITUDES" (flechas ← → como en un tablist)
// ════════════════════════════════════════════════════════════════
let activeTab = 'activas';

function applyTabFilter() {
  const items = $$('#solicitudes-list [data-status]');
  let visible = 0;
  items.forEach(it => {
    const show = it.dataset.status === activeTab;
    it.hidden = !show;
    if (show) visible++;
  });
  const empty = $('#solicitudes-empty');
  if (empty) empty.hidden = visible > 0;
}

function selectTab(name, focus = false) {
  activeTab = name;
  $$('#view-solicitudes [role="tab"]').forEach(t => {
    const on = t.dataset.tab === name;
    t.classList.toggle('active', on);
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    if (on && focus) t.focus();
  });
  applyTabFilter();
}

function initSolicitudesTabs() {
  const tabs = $$('#view-solicitudes [role="tab"]');
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab.dataset.tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      selectTab(next.dataset.tab, true);
    });
  });
  selectTab('activas');
}

// ════════════════════════════════════════════════════════════════
// 9. CALIFICACIÓN CON ESTRELLAS
// ════════════════════════════════════════════════════════════════
function initStarRating() {
  const container = $('#star-rating');
  const submit = $('#submit-review-btn');
  const hint = $('#review-hint');
  if (!container) return;
  let selected = 0;

  const paint = (n) => $$('.star-rate', container).forEach(s => {
    const v = Number(s.dataset.star);
    s.classList.toggle('lit', v <= n);
    s.setAttribute('aria-pressed', String(v === selected));
  });

  container.addEventListener('click', (e) => {
    const star = e.target.closest('.star-rate');
    if (!star) return;
    selected = Number(star.dataset.star);
    paint(selected);
    if (submit) submit.disabled = false;
    if (hint) hint.textContent = `Elegiste ${selected} de 5 estrellas.`;
  });
  container.addEventListener('mouseover', (e) => {
    const star = e.target.closest('.star-rate');
    if (star) paint(Number(star.dataset.star));
  });
  container.addEventListener('mouseleave', () => paint(selected));

  submit?.addEventListener('click', () => {
    if (!selected) return;
    navigate('solicitudes');
    selectTab('finalizadas');
    showToast(`⭐ ¡Gracias por tu calificación de ${selected} estrella${selected > 1 ? 's' : ''}!`);
    selected = 0;
    paint(0);
    submit.disabled = true;
    const review = $('#review-text');
    if (review) review.value = '';
    if (hint) hint.textContent = 'Elegí de 1 a 5 estrellas para poder enviar.';
  });
}

// ════════════════════════════════════════════════════════════════
// 10. CHAT
// ════════════════════════════════════════════════════════════════
function initChat() {
  const sendBtn = $('#chat-send-btn');
  const input   = $('#chat-input');
  const box     = $('#chat-messages');
  if (!sendBtn || !input || !box) return;

  const sync = () => { sendBtn.disabled = !input.value.trim(); };
  input.addEventListener('input', sync);

  function send() {
    const text = input.value.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    box.insertAdjacentHTML('beforeend', `
      <div class="flex flex-col items-end">
        <div class="chat-bubble chat-sent">${escapeHtml(text)}</div>
        <span class="chat-time chat-time-sent">${time}</span>
      </div>`);
    input.value = '';
    sync();
    box.scrollTop = box.scrollHeight;
    input.focus();
  }

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
}

// ════════════════════════════════════════════════════════════════
// 11. TOAST
// ════════════════════════════════════════════════════════════════
let toastTimer;
function showToast(msg, duration = 2800) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ════════════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════════════
function init() {
  initTheme();
  initMobileMenu();
  renderHomeProviders();
  initFilters();
  initHeroSearch();
  renderProvider();
  initConfirmHire();
  initModals();
  initDestructiveActions();
  initRequestForm();
  initSolicitudesTabs();
  renderPublishedRequests();
  initStarRating();
  initChat();

  if (!store.get(STORAGE.session)) {
    store.set(STORAGE.session, { user: { name: 'María González', email: 'maria@email.com' }, lastLogin: new Date().toISOString() });
  }

  // Vista inicial según el hash (permite recargar o compartir una vista)
  const hash = location.hash.replace('#', '');
  if (hash && document.getElementById(`view-${hash}`)) {
    history.replaceState({ view: hash }, '', `#${hash}`);
    navigate(hash, { push: false, focus: false });
  } else {
    history.replaceState({ view: 'home' }, '', location.pathname + location.search + (hash ? `#${hash}` : ''));
    if (hash && document.getElementById(hash)) setTimeout(() => scrollToSection(hash), 50);
  }
}

document.addEventListener('DOMContentLoaded', init);
