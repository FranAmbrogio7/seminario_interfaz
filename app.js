/* ================================================================
   ManoCerca — app.js
   SPA Router + Datos simulados + Interactividad DOM
   Stack: JavaScript Vanilla / LocalStorage
   ================================================================ */

'use strict';

// ── DATOS SIMULADOS ─────────────────────────────────────────────
const PROVIDERS = [
  {
    id: 1, initials: 'JP', avClass: 'av-blue',
    name: 'Juan Pérez', profession: 'Plomero', category: 'Plomería',
    rating: 4.8, reviews: 42, jobs: 37,
    distance: '2.4 km', verified: true, available: 'hoy',
    price: 25000,
  },
  {
    id: 2, initials: 'ML', avClass: 'av-violet',
    name: 'Martín López', profession: 'Electricista', category: 'Electricidad',
    rating: 4.7, reviews: 36, jobs: 28,
    distance: '3.1 km', verified: true, available: 'hoy',
    price: 20000,
  },
  {
    id: 3, initials: 'CG', avClass: 'av-green',
    name: 'Carlos Gómez', profession: 'Gasista', category: 'Gas',
    rating: 4.9, reviews: 58, jobs: 56,
    distance: '1.8 km', verified: true, available: 'mañana',
    price: 28000,
  },
  {
    id: 4, initials: 'LT', avClass: 'av-orange',
    name: 'Lucía Torres', profession: 'Limpieza', category: 'Limpieza',
    rating: 4.6, reviews: 31, jobs: 24,
    distance: '4.2 km', verified: true, available: 'hoy',
    price: 18000,
  },
];

// ── ROUTER ──────────────────────────────────────────────────────
const views = {};

function navigate(viewId, options = {}) {
  // Collect all views lazily
  if (!Object.keys(views).length) {
    document.querySelectorAll('.view').forEach(el => {
      views[el.id.replace('view-', '')] = el;
    });
  }

  // Hide all
  Object.values(views).forEach(v => {
    v.classList.remove('active');
    v.style.display = '';
  });

  const target = views[viewId];
  if (!target) { console.warn(`Vista no encontrada: ${viewId}`); return; }

  target.classList.add('active');

  // Chat special: needs flex-col
  if (viewId === 'chat') {
    target.style.display = 'flex';
    target.style.flexDirection = 'column';
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update bottom nav
  document.querySelectorAll('.bnav-btn').forEach(btn => {
    const matches = btn.dataset.view === viewId;
    btn.classList.toggle('active', matches);
    btn.setAttribute('aria-current', matches ? 'page' : 'false');
  });

  // Update desktop nav links
  document.querySelectorAll('.nav-link[data-view]').forEach(link => {
    link.classList.toggle('active', link.dataset.view === viewId);
  });

  // Store in history
  history.pushState({ view: viewId }, '', `#${viewId}`);
}

// ── BIND NAVIGATION (Event Delegation) ──────────────────────────
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-view]');
  if (!trigger) return;
  e.preventDefault();
  const viewId = trigger.dataset.view;
  if (viewId) navigate(viewId);
});

// Back/forward browser navigation
window.addEventListener('popstate', (e) => {
  const view = e.state?.view || 'home';
  navigate(view);
});

// ── RENDER: HOME PROVIDERS GRID ──────────────────────────────────
function renderHomeProviders() {
  const grid = document.getElementById('home-providers-grid');
  if (!grid) return;

  grid.innerHTML = PROVIDERS.map(p => `
    <article class="card card-hover p-5" tabindex="0" role="article"
             data-view="profile" aria-label="Ver perfil de ${p.name}, ${p.profession}">
      <!-- Avatar + Name -->
      <div class="flex flex-col items-center text-center mb-4">
        <div class="avatar avatar-lg ${p.avClass} ${p.verified ? 'avatar-verified' : ''} mb-3"
             aria-label="${p.name}${p.verified ? ', identidad verificada' : ''}">${p.initials}</div>
        <h3 class="font-bold text-slate-900 text-base">${p.name}</h3>
        <p class="text-sm font-semibold text-brand mt-0.5">${p.profession}</p>
      </div>

      <!-- Stats -->
      <div class="flex items-center gap-1.5 justify-center text-sm text-slate-500 mb-1">
        <span class="text-amber-400">⭐</span>
        <strong class="text-slate-700">${p.rating}</strong>
        <span>·</span>
        <span>${p.reviews} reseñas</span>
      </div>
      <div class="flex items-center gap-1 justify-center text-xs text-slate-400 mb-4">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        ${p.distance}
      </div>

      <!-- Badges -->
      <div class="flex flex-wrap gap-1.5 justify-center mb-4">
        ${p.verified ? `<span class="badge badge-blue">✓ Identidad verificada</span>` : ''}
        <span class="badge ${p.available === 'hoy' ? 'badge-green' : 'badge-violet'}">
          ${p.available === 'hoy' ? '🟢 Disponible hoy' : '🟣 Disponible mañana'}
        </span>
      </div>

      <!-- Price -->
      <p class="text-center text-xs text-slate-400 mb-3">Desde <strong class="text-slate-800 text-sm">$${p.price.toLocaleString('es-AR')}</strong></p>

      <!-- CTA Button -->
      <button class="btn btn-primary text-sm" data-view="profile"
              aria-label="Ver perfil de ${p.name}">
        Ver perfil
      </button>
    </article>
  `).join('');
}

// ── RENDER: SEARCH LIST ──────────────────────────────────────────
function renderSearchList(filter = 'Todos', query = '') {
  const list   = document.getElementById('search-list');
  const count  = document.getElementById('search-results-count');
  if (!list) return;

  let filtered = PROVIDERS;
  if (filter !== 'Todos') filtered = filtered.filter(p => p.category === filter);
  if (query) filtered = filtered.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.profession.toLowerCase().includes(query.toLowerCase())
  );

  if (count) count.textContent = `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="text-center py-12">
        <div class="text-5xl mb-3">🔍</div>
        <p class="font-semibold text-slate-700 mb-1">Sin resultados</p>
        <p class="text-sm text-slate-400">Probá con otra categoría o término de búsqueda.</p>
      </div>`;
    return;
  }

  list.innerHTML = filtered.map(p => `
    <article class="card card-hover p-4 flex items-center gap-4" tabindex="0" role="listitem"
             data-view="profile" aria-label="${p.name}, ${p.profession}. Calificación ${p.rating}">
      <div class="avatar avatar-md ${p.avClass} ${p.verified ? 'avatar-verified' : ''} flex-shrink-0"
           aria-hidden="true">${p.initials}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-0.5">
          <p class="font-bold text-slate-900 text-sm">${p.name}</p>
        </div>
        <p class="text-xs text-brand font-semibold mb-1">${p.profession}</p>
        <div class="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
          <span class="flex items-center gap-0.5">
            <span class="text-amber-400">★</span>
            <strong class="text-slate-600">${p.rating}</strong>
            (${p.reviews} reseñas)
          </span>
          <span>·</span>
          <span>📍 ${p.distance}</span>
        </div>
        <div class="flex gap-1.5 mt-2 flex-wrap">
          ${p.verified ? `<span class="badge badge-blue text-[10px]">✓ Verificado</span>` : ''}
          <span class="badge ${p.available === 'hoy' ? 'badge-green' : 'badge-violet'} text-[10px]">
            ${p.available === 'hoy' ? 'Disponible hoy' : 'Disponible mañana'}
          </span>
        </div>
      </div>
      <div class="text-right flex-shrink-0">
        <p class="text-xs text-slate-400">Estimado</p>
        <p class="font-bold text-slate-900">$${p.price.toLocaleString('es-AR')}</p>
      </div>
    </article>
  `).join('');
}

// ── FILTER CHIPS ─────────────────────────────────────────────────
function initFilterChips() {
  const searchView = document.getElementById('view-search');
  if (!searchView) return;

  searchView.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip[data-filter]');
    if (!chip) return;

    searchView.querySelectorAll('.filter-chip[data-filter]').forEach(c => {
      c.classList.remove('active');
      c.setAttribute('aria-pressed', 'false');
    });
    chip.classList.add('active');
    chip.setAttribute('aria-pressed', 'true');

    const query = document.getElementById('search-input')?.value || '';
    renderSearchList(chip.dataset.filter, query);
  });

  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeFilter = searchView.querySelector('.filter-chip.active')?.dataset.filter || 'Todos';
      renderSearchList(activeFilter, e.target.value);
    });
  }
}

// ── SOLICITUDES TABS ─────────────────────────────────────────────
function initSolicitudesTabs() {
  const solicitudesView = document.getElementById('view-solicitudes');
  if (!solicitudesView) return;

  solicitudesView.addEventListener('click', (e) => {
    const tab = e.target.closest('.filter-chip[data-tab]');
    if (!tab) return;

    solicitudesView.querySelectorAll('.filter-chip[data-tab]').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
  });
}

// ── CONFIRM HIRE — Checkbox enable/disable ───────────────────────
function initConfirmHire() {
  const checkbox = document.getElementById('terms-check');
  const btn      = document.getElementById('confirm-hire-btn');
  if (!checkbox || !btn) return;

  checkbox.addEventListener('change', () => {
    btn.disabled = !checkbox.checked;
    btn.setAttribute('aria-disabled', String(!checkbox.checked));
  });

  btn.addEventListener('click', () => {
    if (btn.disabled) return;
    navigate('trabajo');
    showToast('✅ ¡Contratación confirmada! Juan Pérez está en camino.');
  });
}

// ── CANCEL JOB confirmation ──────────────────────────────────────
function initCancelJob() {
  const cancelBtn = document.getElementById('cancel-job-btn');
  if (!cancelBtn) return;

  cancelBtn.addEventListener('click', () => {
    if (confirm('¿Estás seguro que querés cancelar este trabajo? Esta acción no se puede deshacer.')) {
      navigate('solicitudes');
      showToast('Trabajo cancelado correctamente.');
    }
  });
}

// ── STAR RATING ──────────────────────────────────────────────────
function initStarRating() {
  const starsContainer = document.getElementById('star-rating');
  if (!starsContainer) return;

  let selectedRating = 0;

  starsContainer.addEventListener('click', (e) => {
    const star = e.target.closest('.star-rate');
    if (!star) return;
    selectedRating = parseInt(star.dataset.star, 10);
    updateStars(selectedRating);
  });

  starsContainer.addEventListener('mouseover', (e) => {
    const star = e.target.closest('.star-rate');
    if (!star) return;
    updateStars(parseInt(star.dataset.star, 10));
  });

  starsContainer.addEventListener('mouseleave', () => {
    updateStars(selectedRating);
  });

  function updateStars(count) {
    starsContainer.querySelectorAll('.star-rate').forEach(s => {
      const n = parseInt(s.dataset.star, 10);
      s.classList.toggle('lit', n <= count);
      s.setAttribute('aria-pressed', String(n === selectedRating));
    });
  }
}

// ── SUBMIT REVIEW ────────────────────────────────────────────────
function initSubmitReview() {
  const btn = document.getElementById('submit-review-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    navigate('solicitudes');
    showToast('⭐ ¡Gracias por tu calificación!');
  });
}

// ── CHAT SEND ────────────────────────────────────────────────────
function initChat() {
  const sendBtn   = document.getElementById('chat-send-btn');
  const chatInput = document.getElementById('chat-input');
  const messages  = document.getElementById('chat-messages');
  if (!sendBtn || !chatInput || !messages) return;

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    const bubble = document.createElement('div');
    bubble.className = 'flex flex-col items-end';
    bubble.innerHTML = `
      <div class="chat-bubble chat-sent">${escapeHtml(text)}</div>
      <span class="chat-time chat-time-sent">${currentTime()}</span>
    `;
    messages.appendChild(bubble);
    chatInput.value = '';
    messages.scrollTop = messages.scrollHeight;
    chatInput.focus();
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

// ── LOGOUT ───────────────────────────────────────────────────────
function initLogout() {
  const btn = document.getElementById('logout-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (confirm('¿Querés cerrar sesión?')) {
      navigate('home');
      showToast('Sesión cerrada correctamente.');
    }
  });
}

// ── HERO SEARCH ──────────────────────────────────────────────────
function initHeroSearch() {
  const searchBtn = document.getElementById('hero-search-btn');
  const searchInput = document.getElementById('hero-search');

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      navigate('search');
      if (searchInput?.value) {
        setTimeout(() => {
          const si = document.getElementById('search-input');
          if (si) {
            si.value = searchInput.value;
            si.dispatchEvent(new Event('input'));
          }
        }, 100);
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') navigate('search');
    });
  }
}

// ── TOAST ────────────────────────────────────────────────────────
function showToast(msg, duration = 2800) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ── KEYBOARD NAVIGATION for cards ───────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    const el = document.activeElement;
    if (el && el.classList.contains('card-hover') && el.dataset.view) {
      e.preventDefault();
      navigate(el.dataset.view);
    }
  }
});

// ── UTILS ────────────────────────────────────────────────────────
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function currentTime() {
  const now = new Date();
  return now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

// ── INIT ─────────────────────────────────────────────────────────
function init() {
  // Render dynamic content
  renderHomeProviders();
  renderSearchList();

  // Wire up interactions
  initFilterChips();
  initSolicitudesTabs();
  initConfirmHire();
  initCancelJob();
  initStarRating();
  initSubmitReview();
  initChat();
  initLogout();
  initHeroSearch();

  // Check URL hash on load
  const hash = location.hash.replace('#', '');
  if (hash && document.getElementById(`view-${hash}`)) {
    navigate(hash);
  }

  // Persist data to LocalStorage
  try {
    const stored = localStorage.getItem('mc_session');
    if (!stored) {
      localStorage.setItem('mc_session', JSON.stringify({
        user: { name: 'María González', email: 'maria@email.com' },
        lastLogin: new Date().toISOString(),
      }));
    }
  } catch (e) { /* localStorage no disponible */ }

  console.info('✅ ManoCerca SPA inicializada correctamente.');
}

document.addEventListener('DOMContentLoaded', init);
