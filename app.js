/* ================================================================
   ManoCerca — app.js
   SPA vanilla: router, tema, catálogo, solicitudes con estados,
   propuestas, chat con respuestas, seguimiento, calificaciones,
   Mi cuenta y persistencia en localStorage. Sin backend: todo se
   simula en el navegador para poder probar cada función.
   ================================================================ */

'use strict';

// ════════════════════════════════════════════════════════════════
// 0. PERSISTENCIA
// ════════════════════════════════════════════════════════════════
const STORAGE = {
  theme:    'mc_theme',
  requests: 'mc_requests_v2',
  chats:    'mc_chats_v2',
  reviews:  'mc_user_reviews',
  filter:   'mc_filtro',
  provider: 'mc_prestador',
  session:  'mc_session',
  zone:     'mc_zone',
  addresses:'mc_addresses',
  payment:  'mc_payment',
  coupon:   'mc_coupon',
  notifs:   'mc_notifs',
  password: 'mc_password',
  bigText:  'mc_bigtext',
  sort:     'mc_sort',
  unseen:   'mc_unseen',
};

const store = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* almacenamiento lleno o bloqueado */ }
  },
};

// ════════════════════════════════════════════════════════════════
// 1. DATOS SIMULADOS
// ════════════════════════════════════════════════════════════════
const PROVIDERS = [
  { id: 1, initials: 'JP', color: '#1D4ED8', name: 'Juan Pérez', profession: 'Plomero', category: 'Plomería',
    rating: 4.8, reviews: 42, jobs: 37, distance: '2.4 km', verified: true, available: 'hoy', price: 25000,
    service: 'Reparación de cañería',
    bio: 'Técnico en plomería con más de 8 años de experiencia. Realizo instalaciones, reparaciones y mantenimiento en hogares y comercios.',
    services: [['droplets', 'Reparación de cañerías'], ['shower-head', 'Instalación de sanitarios'], ['wrench', 'Destapaciones']] },
  { id: 2, initials: 'ML', color: '#6d28d9', name: 'Martín López', profession: 'Electricista', category: 'Electricidad',
    rating: 4.7, reviews: 36, jobs: 28, distance: '3.1 km', verified: true, available: 'hoy', price: 20000,
    service: 'Revisión de instalación eléctrica',
    bio: 'Electricista matriculado. Instalaciones domiciliarias, tableros, disyuntores y reparación de cortocircuitos.',
    services: [['zap', 'Tableros y disyuntores'], ['lightbulb', 'Instalación de luminarias'], ['plug', 'Tomacorrientes y cableado']] },
  { id: 3, initials: 'CG', color: '#15803d', name: 'Carlos Gómez', profession: 'Gasista', category: 'Gas',
    rating: 4.9, reviews: 58, jobs: 56, distance: '1.8 km', verified: true, available: 'mañana', price: 28000,
    service: 'Revisión de calefón',
    bio: 'Gasista matriculado con 12 años de oficio. Instalación y mantenimiento de calefones, cocinas y estufas.',
    services: [['flame', 'Instalación de calefones'], ['cooking-pot', 'Conexión de cocinas'], ['fire-extinguisher', 'Detección de pérdidas']] },
  { id: 4, initials: 'LT', color: '#c2410c', name: 'Lucía Torres', profession: 'Limpieza', category: 'Limpieza',
    rating: 4.6, reviews: 31, jobs: 24, distance: '4.2 km', verified: true, available: 'hoy', price: 18000,
    service: 'Limpieza profunda',
    bio: 'Servicio de limpieza integral para casas y departamentos. Puntual, prolija y con productos propios.',
    services: [['sparkles', 'Limpieza general'], ['app-window', 'Limpieza de vidrios'], ['spray-can', 'Limpieza post obra']] },
  { id: 5, initials: 'SR', color: '#be123c', name: 'Sofía Ruiz', profession: 'Pintora', category: 'Pintura',
    rating: 4.8, reviews: 27, jobs: 33, distance: '2.9 km', verified: true, available: 'mañana', price: 35000,
    service: 'Pintura de ambiente',
    bio: 'Pintura de interiores y exteriores, enduido y tratamiento de humedad. Presupuesto sin cargo.',
    services: [['paint-roller', 'Pintura de interiores'], ['house', 'Frentes y exteriores'], ['brick-wall', 'Tratamiento de humedad']] },
  { id: 6, initials: 'DF', color: '#0369a1', name: 'Diego Fernández', profession: 'Albañil', category: 'Albañilería',
    rating: 4.5, reviews: 19, jobs: 21, distance: '5.0 km', verified: false, available: 'hoy', price: 40000,
    service: 'Reparación de revoque',
    bio: 'Albañilería en general: revoques, contrapisos, colocación de cerámicos y pequeñas ampliaciones.',
    services: [['brick-wall', 'Revoques y contrapisos'], ['grid-2x2', 'Colocación de cerámicos'], ['construction', 'Pequeñas ampliaciones']] },
  { id: 7, initials: 'ND', color: '#0f766e', name: 'Nicolás Díaz', profession: 'Plomero', category: 'Plomería',
    rating: 4.6, reviews: 23, jobs: 19, distance: '3.6 km', verified: true, available: 'hoy', price: 22000,
    service: 'Reparación de pérdidas',
    bio: 'Plomero y destapador. Atiendo urgencias en el día en toda la ciudad.',
    services: [['droplets', 'Pérdidas y filtraciones'], ['toilet', 'Arreglo de inodoros'], ['wrench', 'Destapaciones']] },
  { id: 8, initials: 'VS', color: '#a21caf', name: 'Valeria Sosa', profession: 'Electricista', category: 'Electricidad',
    rating: 4.7, reviews: 29, jobs: 25, distance: '2.2 km', verified: true, available: 'mañana', price: 21000,
    service: 'Instalación de luminarias',
    bio: 'Electricista matriculada. Me especializo en iluminación LED y puesta a tierra.',
    services: [['lightbulb', 'Iluminación LED'], ['zap', 'Puesta a tierra'], ['plug', 'Tomas y llaves']] },
  { id: 9, initials: 'HP', color: '#b45309', name: 'Hernán Paz', profession: 'Gasista', category: 'Gas',
    rating: 4.6, reviews: 21, jobs: 30, distance: '4.0 km', verified: true, available: 'hoy', price: 26000,
    service: 'Instalación de estufa',
    bio: 'Gasista matriculado. Instalación de estufas, calefactores y certificados de habilitación.',
    services: [['flame', 'Estufas y calefactores'], ['file-text', 'Certificados'], ['fire-extinguisher', 'Control de pérdidas']] },
  { id: 10, initials: 'RV', color: '#475569', name: 'Raúl Vega', profession: 'Técnico de electrodomésticos', category: 'Electrodomésticos',
    rating: 4.5, reviews: 17, jobs: 40, distance: '3.3 km', verified: true, available: 'mañana', price: 19000,
    service: 'Reparación de lavarropas',
    bio: 'Reparo lavarropas, heladeras y microondas de todas las marcas. Garantía de 90 días.',
    services: [['washing-machine', 'Lavarropas'], ['refrigerator', 'Heladeras'], ['microwave', 'Microondas']] },
  { id: 11, initials: 'RQ', color: '#1e40af', name: 'Ramiro Quiroga', profession: 'Plomero', category: 'Plomería',
    rating: 4.4, reviews: 12, jobs: 14, distance: '5.4 km', verified: false, available: 'mañana', price: 28000,
    service: 'Cambio de cañerías',
    bio: 'Plomería general y cambio de cañerías de agua por termofusión.',
    services: [['bolt', 'Termofusión'], ['shower-head', 'Griferías'], ['droplets', 'Pérdidas']] },
];

const SEED_REVIEWS = {
  1: [['Laura M.', 5, 'Vino en el horario que dijo y dejó todo limpio. Muy recomendable.', 'oct. 2026'],
      ['Pablo R.', 4, 'Buen trabajo y precio justo. Tardó un poco en responder el chat.', 'sept. 2026']],
  2: [['Graciela F.', 5, 'Me explicó todo antes de empezar. Excelente.', 'oct. 2026'],
      ['Tomás B.', 5, 'Rápido y prolijo con el tablero.', 'ago. 2026']],
  3: [['Ana P.', 5, 'Detectó la pérdida enseguida. Un profesional.', 'oct. 2026'],
      ['Jorge S.', 5, 'Muy responsable, trajo todos los repuestos.', 'sept. 2026']],
  4: [['Marcela D.', 5, 'La casa quedó impecable.', 'oct. 2026'],
      ['Santiago L.', 4, 'Muy buena atención, llegó 15 minutos tarde.', 'sept. 2026']],
  5: [['Valentina C.', 5, 'Pintó el living en un día y sin manchar nada.', 'oct. 2026'],
      ['Héctor G.', 4, 'Buen resultado, recomendable.', 'jul. 2026']],
  6: [['Rosa T.', 4, 'Buen trabajo de revoque.', 'sept. 2026'],
      ['Diego A.', 5, 'Cumplió con lo presupuestado.', 'jun. 2026']],
  7: [['Carla N.', 5, 'Vino en menos de una hora por una urgencia.', 'oct. 2026'],
      ['Martín V.', 4, 'Muy amable y rápido.', 'sept. 2026']],
  8: [['Florencia O.', 5, 'Instaló todas las luces LED, quedó hermoso.', 'oct. 2026'],
      ['Ricardo Z.', 4, 'Prolija y puntual.', 'ago. 2026']],
  9: [['Silvia K.', 5, 'Me gestionó el certificado sin vueltas.', 'sept. 2026'],
      ['Ezequiel H.', 4, 'Buen trabajo con la estufa.', 'jul. 2026']],
  10: [['Norma I.', 5, 'El lavarropas quedó como nuevo.', 'oct. 2026'],
       ['Lucas E.', 4, 'Cumplió con la garantía.', 'jun. 2026']],
  11: [['Patricia J.', 4, 'Cambió las cañerías del baño, todo bien.', 'ago. 2026'],
       ['Gonzalo U.', 4, 'Buen precio.', 'jul. 2026']],
};

/* Íconos: Lucide (lucide.dev, licencia ISC), la misma librería que lucide-react,
   embebida como SVG para no sumar dependencias ni framework. */
const ICONS = {"droplets": "<path d=\"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z\"/> <path d=\"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97\"/>","droplet": "<path d=\"M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z\"/>","zap": "<path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\"/>","flame": "<path d=\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\"/>","paintbrush": "<path d=\"m14.622 17.897-10.68-2.913\"/> <path d=\"M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z\"/> <path d=\"M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15\"/>","brick-wall": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/> <path d=\"M12 9v6\"/> <path d=\"M16 15v6\"/> <path d=\"M16 3v6\"/> <path d=\"M3 15h18\"/> <path d=\"M3 9h18\"/> <path d=\"M8 15v6\"/> <path d=\"M8 3v6\"/>","sprout": "<path d=\"M7 20h10\"/> <path d=\"M10 20c5.5-2.5.8-6.4 3-10\"/> <path d=\"M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z\"/> <path d=\"M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z\"/>","sparkles": "<path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\"/> <path d=\"M20 3v4\"/> <path d=\"M22 5h-4\"/> <path d=\"M4 17v2\"/> <path d=\"M5 18H3\"/>","wrench": "<path d=\"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z\"/>","ellipsis": "<circle cx=\"12\" cy=\"12\" r=\"1\"/> <circle cx=\"19\" cy=\"12\" r=\"1\"/> <circle cx=\"5\" cy=\"12\" r=\"1\"/>","shield-check": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/> <path d=\"m9 12 2 2 4-4\"/>","star": "<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\"/>","map-pin": "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\"/> <circle cx=\"12\" cy=\"10\" r=\"3\"/>","house": "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"/> <path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/>","gift": "<rect x=\"3\" y=\"8\" width=\"18\" height=\"4\" rx=\"1\"/> <path d=\"M12 8v13\"/> <path d=\"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7\"/> <path d=\"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5\"/>","instagram": "<rect width=\"20\" height=\"20\" x=\"2\" y=\"2\" rx=\"5\" ry=\"5\"/> <path d=\"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z\"/> <line x1=\"17.5\" x2=\"17.51\" y1=\"6.5\" y2=\"6.5\"/>","facebook": "<path d=\"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z\"/>","youtube": "<path d=\"M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17\"/> <path d=\"m10 15 5-3-5-3z\"/>","shower-head": "<path d=\"m4 4 2.5 2.5\"/> <path d=\"M13.5 6.5a4.95 4.95 0 0 0-7 7\"/> <path d=\"M15 5 5 15\"/> <path d=\"M14 17v.01\"/> <path d=\"M10 16v.01\"/> <path d=\"M13 13v.01\"/> <path d=\"M16 10v.01\"/> <path d=\"M11 20v.01\"/> <path d=\"M17 14v.01\"/> <path d=\"M20 11v.01\"/>","lightbulb": "<path d=\"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5\"/> <path d=\"M9 18h6\"/> <path d=\"M10 22h4\"/>","plug": "<path d=\"M12 22v-5\"/> <path d=\"M9 8V2\"/> <path d=\"M15 8V2\"/> <path d=\"M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z\"/>","cooking-pot": "<path d=\"M2 12h20\"/> <path d=\"M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8\"/> <path d=\"m4 8 16-4\"/> <path d=\"m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8\"/>","fire-extinguisher": "<path d=\"M15 6.5V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3.5\"/> <path d=\"M9 18h8\"/> <path d=\"M18 3h-3\"/> <path d=\"M11 3a6 6 0 0 0-6 6v11\"/> <path d=\"M5 13h4\"/> <path d=\"M17 10a4 4 0 0 0-8 0v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Z\"/>","app-window": "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\"/> <path d=\"M10 4v4\"/> <path d=\"M2 8h20\"/> <path d=\"M6 4v4\"/>","spray-can": "<path d=\"M3 3h.01\"/> <path d=\"M7 5h.01\"/> <path d=\"M11 7h.01\"/> <path d=\"M3 7h.01\"/> <path d=\"M7 9h.01\"/> <path d=\"M3 11h.01\"/> <rect width=\"4\" height=\"4\" x=\"15\" y=\"5\"/> <path d=\"m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2\"/> <path d=\"m13 14 8-2\"/> <path d=\"m13 19 8-2\"/>","paint-roller": "<rect width=\"16\" height=\"6\" x=\"2\" y=\"2\" rx=\"2\"/> <path d=\"M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2\"/> <rect width=\"4\" height=\"6\" x=\"8\" y=\"16\" rx=\"1\"/>","grid-2x2": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/> <path d=\"M3 12h18\"/> <path d=\"M12 3v18\"/>","construction": "<rect x=\"2\" y=\"6\" width=\"20\" height=\"8\" rx=\"1\"/> <path d=\"M17 14v7\"/> <path d=\"M7 14v7\"/> <path d=\"M17 3v3\"/> <path d=\"M7 3v3\"/> <path d=\"M10 14 2.3 6.3\"/> <path d=\"m14 6 7.7 7.7\"/> <path d=\"m8 6 8 8\"/>","file-text": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"/> <path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/> <path d=\"M10 9H8\"/> <path d=\"M16 13H8\"/> <path d=\"M16 17H8\"/>","washing-machine": "<path d=\"M3 6h3\"/> <path d=\"M17 6h.01\"/> <rect width=\"18\" height=\"20\" x=\"3\" y=\"2\" rx=\"2\"/> <circle cx=\"12\" cy=\"13\" r=\"5\"/> <path d=\"M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5\"/>","refrigerator": "<path d=\"M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z\"/> <path d=\"M5 10h14\"/> <path d=\"M15 7v6\"/>","microwave": "<rect width=\"20\" height=\"15\" x=\"2\" y=\"4\" rx=\"2\"/> <rect width=\"8\" height=\"7\" x=\"6\" y=\"8\" rx=\"1\"/> <path d=\"M18 8v7\"/> <path d=\"M6 19v2\"/> <path d=\"M18 19v2\"/>","bolt": "<path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"/> <circle cx=\"12\" cy=\"12\" r=\"4\"/>","toilet": "<path d=\"M7 12h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-.598a.5.5 0 0 0-.424.765l1.544 2.47a.5.5 0 0 1-.424.765H5.402a.5.5 0 0 1-.424-.765L7 18\"/> <path d=\"M8 18a5 5 0 0 1-5-5V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8\"/>","user": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"/> <circle cx=\"12\" cy=\"7\" r=\"4\"/>","credit-card": "<rect width=\"20\" height=\"14\" x=\"2\" y=\"5\" rx=\"2\"/> <line x1=\"2\" x2=\"22\" y1=\"10\" y2=\"10\"/>","bell": "<path d=\"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9\"/> <path d=\"M10.3 21a1.94 1.94 0 0 0 3.4 0\"/>","lock": "<rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"/> <path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/>","circle-help": "<circle cx=\"12\" cy=\"12\" r=\"10\"/> <path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\"/> <path d=\"M12 17h.01\"/>","clock": "<circle cx=\"12\" cy=\"12\" r=\"10\"/> <polyline points=\"12 6 12 12 16 14\"/>","wallet": "<path d=\"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1\"/> <path d=\"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4\"/>","search": "<circle cx=\"11\" cy=\"11\" r=\"8\"/> <path d=\"m21 21-4.3-4.3\"/>","briefcase": "<path d=\"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"/> <rect width=\"20\" height=\"14\" x=\"2\" y=\"6\" rx=\"2\"/>","calendar": "<path d=\"M8 2v4\"/> <path d=\"M16 2v4\"/> <rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\"/> <path d=\"M3 10h18\"/>","mail": "<rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\"/> <path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\"/>","clipboard-list": "<rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\"/> <path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"/> <path d=\"M12 11h4\"/> <path d=\"M12 16h4\"/> <path d=\"M8 11h.01\"/> <path d=\"M8 16h.01\"/>","circle-check": "<circle cx=\"12\" cy=\"12\" r=\"10\"/> <path d=\"m9 12 2 2 4-4\"/>","trash-2": "<path d=\"M3 6h18\"/> <path d=\"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6\"/> <path d=\"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\"/> <line x1=\"10\" x2=\"10\" y1=\"11\" y2=\"17\"/> <line x1=\"14\" x2=\"14\" y1=\"11\" y2=\"17\"/>","triangle-alert": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\"/> <path d=\"M12 9v4\"/> <path d=\"M12 17h.01\"/>","hammer": "<path d=\"m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9\"/> <path d=\"m18 15 4-4\"/> <path d=\"m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5\"/>","thermometer": "<path d=\"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z\"/>"};
function icon(name, size = 20, cls = '') {
  return `<svg class="ico ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name] || ICONS.wrench}</svg>`;
}

const CATEGORY_ICONS = {
  'Plomería': 'droplets', 'Electricidad': 'zap', 'Gas': 'flame', 'Pintura': 'paintbrush', 'Albañilería': 'brick-wall',
  'Jardinería': 'sprout', 'Limpieza': 'sparkles', 'Electrodomésticos': 'wrench',
};

const BARRIOS = ['Centro', 'Banda Norte', 'Alberdi', 'Bimaco', 'Barrio Universitario', 'Las Ferias', 'Abilene', 'Jardín Norte'];
const PAYMENT_METHODS = ['Efectivo', 'Mercado Pago', 'Transferencia bancaria', 'Tarjeta de débito o crédito'];
const COUPON_CODE = 'MANOCERCA10';
const DEMO_PASSWORD = 'manocerca';

function seedRequests() {
  const now = Date.now();
  return [
    { id: 'r-agua', title: 'Pérdida de agua en la cocina', category: 'Plomería', urgent: true,
      desc: 'Se rompió un caño debajo de la pileta y pierde bastante agua. Necesito que venga lo antes posible.',
      when: 'Hoy, 18:00 – 21:00', zone: 'Centro', createdAt: now - 45 * 60e3,
      photos: [{ kind: 'icon', v: 'droplets', alt: 'Foto de la pérdida debajo de la pileta' }, { kind: 'icon', v: 'bolt', alt: 'Foto del caño roto' }],
      status: 'abierta',
      proposals: [{ providerId: 1, price: 25000, when: 'Hoy, 19:00' }, { providerId: 7, price: 22000, when: 'Hoy, 18:30' }, { providerId: 11, price: 28000, when: 'Mañana, 9:00' }] },
    { id: 'r-ventilador', title: 'Instalación de ventilador de techo', category: 'Electricidad', urgent: false,
      desc: 'Instalar un ventilador de techo en el dormitorio, ya tengo el artefacto.', when: '12 oct, 10:00', zone: 'Centro',
      createdAt: Date.parse('2026-10-12T10:00:00-03:00'), photos: [], status: 'finalizada', proposals: [],
      hired: { providerId: 2, price: 18000, when: '12 oct, 10:00' }, rating: null, review: '' },
    { id: 'r-pintura', title: 'Pintar habitación', category: 'Pintura', urgent: false,
      desc: 'Pintar paredes y techo de una habitación de 3 × 4 m.', when: '5 oct, 9:00', zone: 'Centro',
      createdAt: Date.parse('2026-10-05T09:00:00-03:00'), photos: [], status: 'finalizada', proposals: [],
      hired: { providerId: 5, price: 35000, when: '5 oct, 9:00' }, rating: 5, review: 'Impecable, dejó todo limpio.' },
    { id: 'r-calefon', title: 'Reparación de calefón', category: 'Gas', urgent: false,
      desc: 'El calefón no enciende la llama piloto.', when: '28 sept, 15:00', zone: 'Centro',
      createdAt: Date.parse('2026-09-28T15:00:00-03:00'), photos: [], status: 'cancelada', proposals: [] },
  ];
}

function seedChats() {
  return {
    1: [
      { from: 'me', text: '¡Hola Juan! ¿Podés venir hoy a la tarde? Estoy en la zona centro.', time: '16:24' },
      { from: 'them', text: '¡Hola! Sí, puedo ir a las 19:00. ¿La pérdida es grande o es solo una filtración?', time: '16:36' },
      { from: 'me', text: 'Es una filtración, no es muy grande. Te paso una foto.', time: '16:37' },
      { from: 'me', icon: 'droplets', time: '16:38' },
      { from: 'them', text: 'Perfecto, con eso alcanza. Te paso el presupuesto: $25.000. ¿Te parece bien?', time: '16:52' },
    ],
  };
}

// ── Estado en memoria ──────────────────────────────────────────
let requests = store.get(STORAGE.requests) || seedRequests();
let chats    = store.get(STORAGE.chats) || seedChats();
let userReviews = store.get(STORAGE.reviews, {});
const saveRequests = () => store.set(STORAGE.requests, requests);
const saveChats    = () => store.set(STORAGE.chats, chats);

const ctx = {
  providerId: store.get(STORAGE.provider, 1),
  requestId: 'r-agua',
  hire: null,            // { providerId, price, when, requestId }
  trackId: null,
  rateId: null,
  chatProviderId: 1,
};

// ════════════════════════════════════════════════════════════════
// 2. UTILIDADES
// ════════════════════════════════════════════════════════════════
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const formatARS = n => '$' + Math.round(n).toLocaleString('es-AR');
const provider = id => PROVIDERS.find(p => p.id === Number(id));
const reqById = id => requests.find(r => r.id === id);
const nowTime = () => new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
const zone = () => store.get(STORAGE.zone, 'Centro');

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }

/* Avatar como imagen real (SVG en data URI) para tener <img alt> */
function avatarSrc(p) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><circle cx="48" cy="48" r="48" fill="${p.color}"/>` +
    `<text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="34" font-weight="700" fill="#fff">${p.initials}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/* Calificación real = base + calificaciones que dejó el usuario */
function ratingOf(p) {
  const mine = userReviews[p.id] || [];
  const total = p.rating * p.reviews + mine.reduce((a, r) => a + r.stars, 0);
  const count = p.reviews + mine.length;
  return { avg: Math.round(total / count * 10) / 10, count };
}

function starsText(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

function relDate(ts) {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Hoy, ' + d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* Achica una imagen elegida por el usuario para guardarla en localStorage */
function readImage(file, maxW = 480) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('tipo'));
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.72));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ════════════════════════════════════════════════════════════════
// 3. TEMA DARK / LIGHT Y TEXTO GRANDE
// ════════════════════════════════════════════════════════════════
function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  const btn = $('#theme-btn');
  if (btn) {
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
  }
  $('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#0b1220' : '#1D4ED8');
}
const isDark = () => document.documentElement.classList.contains('dark');
function setTheme(next, announce = true) {
  applyTheme(next);
  store.set(STORAGE.theme, next);
  if (announce) showToast(next === 'dark' ? '🌙 Modo oscuro activado' : '☀️ Modo claro activado');
}
function applyBigText(on) { document.documentElement.classList.toggle('big-text', on); }

function initTheme() {
  const saved = store.get(STORAGE.theme);
  applyTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  applyBigText(store.get(STORAGE.bigText, false));
  $('#theme-btn')?.addEventListener('click', () => setTheme(isDark() ? 'light' : 'dark'));
}

// ════════════════════════════════════════════════════════════════
// 4. ROUTER SPA
// ════════════════════════════════════════════════════════════════
const views = {};
const onEnter = {};   // renderizadores por vista

function navigate(viewId, { push = true, focus = true } = {}) {
  if (!Object.keys(views).length) $$('.view').forEach(el => { views[el.id.replace('view-', '')] = el; });
  const target = views[viewId];
  if (!target) return;

  onEnter[viewId]?.();
  Object.values(views).forEach(v => v.classList.remove('active'));
  target.classList.add('active');
  closeMobileMenu(false);
  window.scrollTo({ top: 0, behavior: 'auto' });

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

function scrollToSection(id) {
  const go = () => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const heading = el.querySelector('h2');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
  };
  closeMobileMenu(false);
  if (!views.home?.classList.contains('active')) {
    navigate('home', { focus: false });
    requestAnimationFrame(() => setTimeout(go, 30));
  } else go();
}

document.addEventListener('click', (e) => {
  const scrollTrigger = e.target.closest('[data-scroll]');
  if (scrollTrigger) { e.preventDefault(); scrollToSection(scrollTrigger.dataset.scroll); return; }

  const actionTrigger = e.target.closest('[data-action]');
  if (actionTrigger) { e.preventDefault(); runAction(actionTrigger.dataset.action, actionTrigger); return; }

  const trigger = e.target.closest('[data-view]');
  if (!trigger) return;
  e.preventDefault();
  if (trigger.dataset.provider) selectProvider(Number(trigger.dataset.provider));
  if (trigger.dataset.cat) setSearchFilter(trigger.dataset.cat);
  if (trigger.dataset.request) ctx.requestId = trigger.dataset.request;
  navigate(trigger.dataset.view);
});

window.addEventListener('popstate', (e) => {
  const fromHash = location.hash.slice(1);
  const view = e.state?.view || (document.getElementById(`view-${fromHash}`) ? fromHash : null);
  if (view) navigate(view, { push: false });
});

// ── Acciones ───────────────────────────────────────────────────
function runAction(action, el) {
  switch (action) {
    case 'coupon':
      navigator.clipboard?.writeText(COUPON_CODE).catch(() => {});
      showToast(`🎁 Tu cupón: ${COUPON_CODE} (10 % off). Activalo en Mi cuenta › Pagos y cupones.`, 3800);
      break;
    case 'share':
      if (navigator.share) navigator.share({ title: 'ManoCerca', url: location.href }).catch(() => {});
      else { navigator.clipboard?.writeText(location.href).catch(() => {}); showToast('🔗 Enlace copiado al portapapeles'); }
      break;
    case 'location':      openPanel('zona', el); break;
    case 'panel':         openPanel(el.dataset.panel, el); break;
    case 'info':          openPanel(el.dataset.info, el); break;
    case 'social':        showToast(`Abriríamos el ${el.dataset.net} de ManoCerca en una pestaña nueva (cuenta de demostración).`, 3400); break;
    case 'focus-filters': $('#view-search .filter-chip:not(:disabled)')?.focus(); break;
    case 'back':          history.length > 1 ? history.back() : navigate('home'); break;
    case 'hire-direct':   startHire({ providerId: ctx.providerId, price: provider(ctx.providerId).price, when: 'A coordinar por chat', requestId: null }); break;
    case 'hire-proposal': startHire({ providerId: Number(el.dataset.provider), price: Number(el.dataset.price), when: el.dataset.when, requestId: ctx.requestId }); break;
    case 'chat-provider': openChat(Number(el.dataset.provider) || ctx.chatProviderId || ctx.providerId); break;
    case 'chat-menu':     openPanel('chat-menu', el); break;
    case 'chat-attach':   $('#chat-file')?.click(); break;
    case 'add-photo':     $('#sol-photo-input')?.click(); break;
    case 'sort-requests': toggleSort(); break;
    case 'open-request':  openRequest(el.dataset.request); break;
    default: break;
  }
}

// ════════════════════════════════════════════════════════════════
// 5. MENÚ MOBILE
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
  $('#menu-btn')?.addEventListener('click', () => { $('#mobile-menu').hidden ? openMobileMenu() : closeMobileMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#mobile-menu').hidden) closeMobileMenu(); });
  matchMedia('(min-width: 768px)').addEventListener('change', () => closeMobileMenu(false));
}

// ════════════════════════════════════════════════════════════════
// 6. CATÁLOGO, BÚSQUEDA Y FILTROS
// ════════════════════════════════════════════════════════════════
function availabilityBadge(p) {
  return p.available === 'hoy'
    ? '<span class="badge badge-green">Disponible hoy</span>'
    : '<span class="badge badge-violet">Disponible mañana</span>';
}

function renderHomeProviders() {
  const grid = $('#home-providers-grid');
  if (!grid) return;
  const top = [...PROVIDERS].sort((a, b) => ratingOf(b).avg - ratingOf(a).avg).slice(0, 6);
  grid.innerHTML = top.map(p => {
    const r = ratingOf(p);
    return `
    <li>
      <article class="card card-hover h-full p-5 flex flex-col" data-view="profile" data-provider="${p.id}" aria-labelledby="prov-${p.id}-name">
        <div class="flex items-start justify-between mb-3">
          <span class="badge badge-slate inline-flex items-center gap-1">${icon(CATEGORY_ICONS[p.category], 13)} ${p.category}</span>
          ${availabilityBadge(p)}
        </div>
        <div class="flex flex-col items-center text-center mb-4">
          <img src="${avatarSrc(p)}" alt="Foto de perfil de ${p.name}" width="72" height="72" class="avatar-img avatar-lg mb-3" loading="lazy" />
          <h3 id="prov-${p.id}-name" class="font-bold text-slate-900 text-base">${p.name}</h3>
          <p class="text-sm font-semibold text-brand mt-0.5">${p.profession}</p>
        </div>
        <div class="flex items-center gap-1.5 justify-center text-sm text-slate-600 mb-1">
          <span class="text-amber-400" aria-hidden="true">★</span>
          <strong class="text-slate-700">${r.avg}</strong>
          <span aria-hidden="true">·</span><span>${r.count} reseñas</span>
          <span aria-hidden="true">·</span><span class="whitespace-nowrap">${icon('map-pin', 12, 'ico-inline')} ${p.distance}</span>
        </div>
        <p class="text-center text-xs mb-4 ${p.verified ? 'text-brand font-semibold' : 'text-slate-500'}">
          ${p.verified ? '✓ Identidad verificada' : 'Verificación en proceso'}
        </p>
        <p class="text-center text-sm text-slate-600 mb-4 mt-auto">Desde <strong class="text-slate-900 text-base">${formatARS(p.price)}</strong></p>
        <button class="btn btn-primary force-text-white text-sm" data-view="profile" data-provider="${p.id}" aria-label="Ver perfil de ${p.name}">Ver perfil</button>
      </article>
    </li>`;
  }).join('');
}

function renderSearchList(filter = 'Todos', query = '') {
  const list = $('#search-list'), count = $('#search-results-count');
  if (!list) return;
  const q = query.trim().toLowerCase();
  let filtered = PROVIDERS;
  if (filter !== 'Todos') filtered = filtered.filter(p => p.category === filter);
  if (q) filtered = filtered.filter(p => [p.name, p.profession, p.category, p.service].some(t => t.toLowerCase().includes(q)));
  filtered = [...filtered].sort((a, b) => ratingOf(b).avg - ratingOf(a).avg);

  if (count) count.textContent = `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}`;
  if (!filtered.length) {
    list.innerHTML = `
      <li class="text-center py-12">
        <div class="flex justify-center text-slate-400 mb-3" aria-hidden="true">${icon('search', 44)}</div>
        <p class="font-semibold text-slate-700 mb-1">Sin resultados</p>
        <p class="text-sm text-slate-500 mb-4">Probá con otra categoría o publicá tu solicitud y te avisamos cuando haya alguien.</p>
        <button class="btn btn-secondary !w-auto px-5" data-scroll="publicar">Publicar solicitud</button>
      </li>`;
    return;
  }
  list.innerHTML = filtered.map(p => {
    const r = ratingOf(p);
    return `
    <li>
      <button class="card card-hover w-full text-left p-3 sm:p-4 flex items-center gap-3 sm:gap-4" data-view="profile" data-provider="${p.id}"
              aria-label="${p.name}, ${p.profession}. Calificación ${r.avg}. Desde ${formatARS(p.price)}">
        <img src="${avatarSrc(p)}" alt="" width="56" height="56" class="avatar-img avatar-md avatar-list" />
        <span class="flex-1 min-w-0">
          <span class="block font-bold text-slate-900 text-sm">${p.name}</span>
          <span class="block text-xs text-brand font-semibold mb-1">${p.profession}</span>
          <span class="flex items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 flex-wrap">
            <span class="whitespace-nowrap"><span class="text-amber-400" aria-hidden="true">★</span> <strong class="text-slate-600">${r.avg}</strong> (${r.count} reseñas)</span>
            <span class="whitespace-nowrap">${icon('map-pin', 12, 'ico-inline')} ${p.distance}</span>
          </span>
          <span class="flex gap-1.5 mt-2 flex-wrap">
            ${p.verified ? '<span class="badge badge-blue">✓ Verificado</span>' : ''}
            ${availabilityBadge(p)}
          </span>
        </span>
        <span class="text-right flex-shrink-0 self-start sm:self-center">
          <span class="block text-xs text-slate-500">Desde</span>
          <span class="block font-bold text-slate-900 text-sm sm:text-base whitespace-nowrap">${formatARS(p.price)}</span>
        </span>
      </button>
    </li>`;
  }).join('');
}

function setSearchFilter(category) {
  const chips = $$('#view-search .filter-chip[data-filter]');
  let chip = chips.find(c => c.dataset.filter === category && !c.disabled) || chips.find(c => c.dataset.filter === 'Todos');
  chips.forEach(c => { const on = c === chip; c.classList.toggle('active', on); c.setAttribute('aria-pressed', String(on)); });
  store.set(STORAGE.filter, chip.dataset.filter);
  renderSearchList(chip.dataset.filter, $('#search-input')?.value || '');
}

function initFilters() {
  const view = $('#view-search');
  if (!view) return;
  $$('.filter-chip[data-filter]', view).forEach(chip => {
    const cat = chip.dataset.filter;
    if (cat !== 'Todos' && !PROVIDERS.some(p => p.category === cat)) {
      chip.disabled = true;
      chip.title = 'Todavía no hay trabajadores en esta categoría';
      chip.setAttribute('aria-label', `${cat} (sin trabajadores por ahora)`);
    }
  });
  view.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip[data-filter]');
    if (chip && !chip.disabled) setSearchFilter(chip.dataset.filter);
  });
  $('#search-input')?.addEventListener('input', (e) => {
    renderSearchList($('.filter-chip.active', view)?.dataset.filter || 'Todos', e.target.value);
  });
  setSearchFilter(store.get(STORAGE.filter, 'Todos'));
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

  const city = $('select[aria-label="Seleccionar zona"]');
  city?.addEventListener('change', () => {
    if (city.selectedIndex !== 0) {
      showToast(`Por ahora ManoCerca funciona solo en Río Cuarto. ¡Te avisamos cuando lleguemos a ${city.value}!`, 3800);
      city.selectedIndex = 0;
    }
  });
}

// ════════════════════════════════════════════════════════════════
// 7. PERFIL DEL TRABAJADOR (reputación)
// ════════════════════════════════════════════════════════════════
function selectProvider(id) {
  if (!provider(id)) return;
  ctx.providerId = id;
  store.set(STORAGE.provider, id);
}

function renderProfile() {
  const p = provider(ctx.providerId) || PROVIDERS[0];
  const r = ratingOf(p);
  const img = $('#profile-avatar');
  if (img) { img.src = avatarSrc(p); img.alt = `Foto de perfil de ${p.name}`; }
  setText('profile-name', p.name);
  setText('profile-profession', p.profession);
  setText('profile-rating', r.avg);
  setText('profile-reviews', r.count);
  setText('profile-jobs', p.jobs + (userReviews[p.id]?.length || 0));
  setText('profile-distance', p.distance);
  setText('profile-bio', p.bio);

  const ver = $('#profile-verified');
  if (ver) {
    ver.className = `badge ${p.verified ? 'badge-blue' : 'badge-amber'}`;
    ver.textContent = p.verified ? '✓ Identidad verificada' : 'Verificación en proceso';
  }
  const avail = $('#profile-available');
  if (avail) {
    avail.className = `badge ${p.available === 'hoy' ? 'badge-green' : 'badge-violet'}`;
    avail.textContent = p.available === 'hoy' ? 'Disponible hoy' : 'Disponible mañana';
  }
  const services = $('#profile-services');
  if (services) services.innerHTML = p.services.map(([ic, label]) => `
    <li class="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-brand" aria-hidden="true">${icon(ic, 16)}</div>
      <span class="text-sm text-slate-700 font-medium">${label}</span>
    </li>`).join('');

  const mine = (userReviews[p.id] || []).map(x => [`${x.author} (vos)`, x.stars, x.text || 'Sin comentario.', x.date, true]);
  const all = [...mine, ...(SEED_REVIEWS[p.id] || [])];
  setText('profile-reviews-summary', `★ ${r.avg} · ${r.count} reseñas`);
  const list = $('#profile-reviews-list');
  if (list) list.innerHTML = all.map(([author, stars, text, date, own]) => `
    <li class="border-b border-slate-100 last:border-0 pb-3 last:pb-0 ${own ? 'own-review' : ''}">
      <div class="flex items-center justify-between gap-2 mb-1">
        <span class="text-sm font-semibold text-slate-800">${escapeHtml(author)}</span>
        <span class="text-xs text-slate-500">${escapeHtml(date)}</span>
      </div>
      <p class="text-amber-500 text-sm" aria-label="${stars} de 5 estrellas">${starsText(stars)}</p>
      <p class="text-sm text-slate-600">${escapeHtml(text)}</p>
    </li>`).join('');

  $('#profile-contact')?.setAttribute('aria-label', `Contratar a ${p.name}`);
  const msg = $('#profile-message');
  if (msg) { msg.dataset.provider = p.id; msg.setAttribute('aria-label', `Enviar mensaje a ${p.name}`); }
}

// ════════════════════════════════════════════════════════════════
// 8. SOLICITUDES: LISTA, DETALLE, FOTOS Y PROPUESTAS
// ════════════════════════════════════════════════════════════════
let activeTab = 'activas';
const tabOf = r => (r.status === 'abierta' || r.status === 'contratada') ? 'activas' : r.status === 'finalizada' ? 'finalizadas' : 'canceladas';

function statusBadge(r) {
  if (r.status === 'contratada') return '<span class="badge badge-blue">En curso</span>';
  if (r.status === 'finalizada') return '<span class="badge badge-green">Finalizada</span>';
  if (r.status === 'cancelada')  return '<span class="badge badge-red">Cancelada</span>';
  if (r.urgent) return '<span class="badge badge-red"><span class="pulse-dot mr-1" aria-hidden="true"></span>Urgente</span>';
  return '<span class="badge badge-amber">Publicada</span>';
}

function requestLine(r) {
  if (r.status === 'abierta') {
    if (r.proposals.length) return `<span class="text-xs font-semibold text-brand inline-flex items-center gap-1">${icon('mail', 13)} ${r.proposals.length} propuesta${r.proposals.length > 1 ? 's' : ''}</span>`;
    if (r.noProviders) return '<span class="text-xs text-slate-500">Sin trabajadores en esta categoría todavía</span>';
    return '<span class="text-xs text-slate-500">Esperando propuestas…</span>';
  }
  const p = r.hired && provider(r.hired.providerId);
  if (r.status === 'contratada') return `<span class="text-xs text-slate-500">${p.name} · ${r.step >= 3 ? 'trabajando' : 'en camino'}</span><span class="text-sm font-bold text-slate-900">${formatARS(r.hired.total ?? r.hired.price)}</span>`;
  if (r.status === 'finalizada') return `<span class="text-xs ${r.rating ? 'text-amber-600' : 'text-brand font-semibold'}">${r.rating ? starsText(r.rating) : '⭐ Calificá este trabajo'}</span><span class="text-sm font-bold text-slate-900">${formatARS(r.hired.total ?? r.hired.price)}</span>`;
  return `<span class="text-xs text-slate-500">${p ? p.name : 'Sin asignar'}</span>`;
}

function renderRequests() {
  const list = $('#solicitudes-list');
  if (!list) return;
  const asc = store.get(STORAGE.sort, 'desc') === 'asc';
  const items = requests.filter(r => tabOf(r) === activeTab)
    .sort((a, b) => asc ? a.createdAt - b.createdAt : b.createdAt - a.createdAt);
  list.innerHTML = items.map(r => `
    <button class="card p-3 sm:p-4 flex items-center gap-3 sm:gap-4 text-left w-full card-hover" data-action="open-request" data-request="${r.id}"
            aria-label="${escapeHtml(r.title)}, ${r.status}">
      <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 flex items-center justify-center text-brand flex-shrink-0" aria-hidden="true">${icon(CATEGORY_ICONS[r.category] || 'clipboard-list', 22)}</div>
      <span class="flex-1 min-w-0">
        <span class="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
          <span class="font-bold text-sm text-slate-900 line-clamp-2 break-words">${escapeHtml(r.title)}</span>
          <span class="flex-shrink-0">${statusBadge(r)}</span>
        </span>
        <span class="block text-xs text-slate-500">${escapeHtml(r.category)} · ${icon('calendar', 12, 'ico-inline')} ${relDate(r.createdAt)}</span>
        <span class="flex flex-wrap items-center justify-between mt-1 gap-x-2 gap-y-1">${requestLine(r)}</span>
      </span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="text-slate-500 flex-shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
    </button>`).join('');
  const empty = $('#solicitudes-empty');
  if (empty) empty.hidden = items.length > 0;
}

function openRequest(id) {
  const r = reqById(id);
  if (!r) return;
  ctx.requestId = id;
  if (r.status === 'contratada') { ctx.trackId = id; navigate('trabajo'); }
  else if (r.status === 'finalizada') { ctx.rateId = id; navigate('calificar'); }
  else navigate('solicitud');
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
  renderRequests();
}

function initSolicitudesTabs() {
  const tabs = $$('#view-solicitudes [role="tab"]');
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab.dataset.tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      selectTab(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length].dataset.tab, true);
    });
  });
  selectTab('activas');
}

function toggleSort() {
  const next = store.get(STORAGE.sort, 'desc') === 'desc' ? 'asc' : 'desc';
  store.set(STORAGE.sort, next);
  $('#sort-btn')?.setAttribute('aria-label', next === 'desc' ? 'Ordenar: más recientes primero' : 'Ordenar: más antiguas primero');
  renderRequests();
  showToast(next === 'desc' ? '↓ Más recientes primero' : '↑ Más antiguas primero');
}

function setUnseen(n) {
  store.set(STORAGE.unseen, n);
  const b = $('#nav-badge');
  if (b) { b.hidden = !n; b.textContent = n; }
}

let showAllProposals = false;
function renderRequestDetail() {
  const r = reqById(ctx.requestId) || requests[0];
  if (!r) return;
  ctx.requestId = r.id;
  $('#sol-icon').innerHTML = icon(CATEGORY_ICONS[r.category] || 'clipboard-list', 24);
  setText('sol-title', r.title);
  $('#sol-badge').innerHTML = statusBadge(r);
  setText('sol-desc', r.desc);
  setText('sol-when', r.when);
  setText('sol-where', `Río Cuarto, Córdoba (${r.zone})`);
  const prices = r.proposals.map(x => x.price);
  setText('sol-budget', prices.length ? `Propuestas entre ${formatARS(Math.min(...prices))} y ${formatARS(Math.max(...prices))}` : 'Todavía no hay presupuestos');

  // Fotos
  const open = r.status === 'abierta';
  setText('sol-photos-title', `Fotos (${r.photos.length})`);
  const full = r.photos.length >= 4;
  $('#sol-photos').innerHTML = r.photos.map((ph, i) => ph.kind === 'img'
    ? `<img src="${ph.v}" alt="${escapeHtml(ph.alt || `Foto ${i + 1} del problema`)}" class="photo-thumb object-cover" />`
    : `<div class="photo-thumb text-blue-700" role="img" aria-label="${escapeHtml(ph.alt || `Foto ${i + 1}`)}">${ICONS[ph.v] ? icon(ph.v, 32) : icon('droplets', 32)}</div>`).join('') +
    (open ? `<button type="button" data-action="add-photo" class="photo-thumb photo-add" ${full ? 'disabled title="Máximo 4 fotos"' : ''}
               aria-label="${full ? 'Agregar foto (máximo 4 alcanzado)' : 'Agregar foto'}"><span class="text-slate-500 text-2xl" aria-hidden="true">+</span></button>` : '');

  // Estado
  const box = $('#sol-status-box');
  const hp = r.hired && provider(r.hired.providerId);
  if (r.status === 'contratada') box.innerHTML = `<div class="card tint p-4 flex flex-wrap items-center justify-between gap-3"><p class="text-sm">Contrataste a <b>${hp.name}</b>.</p><button class="btn btn-primary force-text-white !w-auto !py-2 px-4 text-sm whitespace-nowrap" data-action="open-request" data-request="${r.id}">Ver seguimiento</button></div>`;
  else if (r.status === 'cancelada') box.innerHTML = `<div class="card p-4"><p class="text-sm text-slate-600">Cancelaste esta solicitud. Podés publicar una nueva cuando quieras.</p></div>`;
  else if (r.status === 'finalizada') box.innerHTML = `<div class="card p-4"><p class="text-sm text-slate-600">Trabajo terminado por <b>${hp.name}</b>.</p></div>`;
  else if (r.noProviders) box.innerHTML = `<div class="card p-4"><p class="text-sm text-slate-600">Todavía no hay trabajadores de <b>${escapeHtml(r.category)}</b> en tu zona. Te avisamos cuando se sume alguien.</p></div>`;
  else if (!r.proposals.length) box.innerHTML = `<div class="card p-4 flex items-center gap-3"><span class="spinner" aria-hidden="true"></span><p class="text-sm text-slate-600">Avisamos a los trabajadores de ${escapeHtml(r.category)} cerca tuyo. Las propuestas llegan en unos segundos.</p></div>`;
  else box.innerHTML = '';

  // Propuestas
  const props = open ? r.proposals : [];
  setText('sol-proposals-title', `Propuestas (${props.length})`);
  $('#sol-proposals-title').parentElement.parentElement.hidden = !open || !props.length;
  const visible = showAllProposals ? props : props.slice(0, 2);
  const toggle = $('#sol-toggle-all');
  toggle.hidden = props.length <= 2;
  toggle.textContent = showAllProposals ? 'Ver menos' : `Ver todas (${props.length})`;
  toggle.setAttribute('aria-expanded', String(showAllProposals));
  const cheapest = Math.min(...props.map(x => x.price));
  $('#sol-proposals').innerHTML = visible.map(pr => {
    const p = provider(pr.providerId);
    const rt = ratingOf(p);
    return `
    <li class="card p-4">
      <div class="flex items-center gap-3">
        <button type="button" class="flex-shrink-0 rounded-full" data-view="profile" data-provider="${p.id}" aria-label="Ver perfil de ${p.name}">
          <img src="${avatarSrc(p)}" alt="" width="44" height="44" class="avatar-img" style="width:44px;height:44px" />
        </button>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-sm text-slate-900 break-words">${p.name} ${p.verified ? '<span class="text-brand" aria-label="verificado">✓</span>' : ''}</p>
          <p class="text-xs text-slate-500"><span class="text-amber-500" aria-hidden="true">★</span> ${rt.avg} (${rt.count}) · ${escapeHtml(pr.when)}</p>
        </div>
        <div class="text-right flex-shrink-0 self-start">
          <p class="font-bold text-slate-900 whitespace-nowrap">${formatARS(pr.price)}</p>
          ${pr.price === cheapest && props.length > 1 ? '<span class="badge badge-green">Más económica</span>' : ''}
        </div>
      </div>
      <div class="flex gap-2 mt-3">
        <button class="btn btn-secondary !py-2 !min-h-[44px] text-sm flex-1 whitespace-nowrap !px-3" data-action="chat-provider" data-provider="${p.id}">Chatear</button>
        <button class="btn btn-primary force-text-white !py-2 !min-h-[44px] text-sm flex-1 whitespace-nowrap !px-3" data-action="hire-proposal"
                data-provider="${p.id}" data-price="${pr.price}" data-when="${escapeHtml(pr.when)}" aria-label="Ver propuesta de ${p.name} por ${formatARS(pr.price)}">Ver propuesta</button>
      </div>
    </li>`;
  }).join('');
}

function initRequestDetail() {
  $('#sol-toggle-all')?.addEventListener('click', () => { showAllProposals = !showAllProposals; renderRequestDetail(); });
  $('#sol-photo-input')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    const r = reqById(ctx.requestId);
    if (!file || !r) return;
    try {
      const data = await readImage(file, 360);
      r.photos.push({ kind: 'img', v: data, alt: `Foto ${r.photos.length + 1} del problema` });
      saveRequests();
      renderRequestDetail();
      showToast('📷 Foto agregada. Los trabajadores ya la pueden ver.');
    } catch { showToast('⚠ Ese archivo no es una imagen. Probá con una foto JPG o PNG.'); }
  });
}

/* Simula que llegan propuestas a una solicitud recién publicada */
function generateProposals(r) {
  const pool = PROVIDERS.filter(p => p.category === r.category).slice(0, 3);
  if (!pool.length) { r.noProviders = true; return 0; }
  const slots = ['Hoy, 18:00', 'Hoy, 19:30', 'Mañana, 9:00'];
  r.proposals = pool.map((p, i) => ({ providerId: p.id, price: Math.round(p.price * (0.95 + i * 0.06) / 500) * 500, when: r.urgent ? slots[i % 2] : slots[(i + 1) % 3] }));
  return r.proposals.length;
}

function scheduleProposals(r, delay = 4000) {
  setTimeout(() => {
    const live = reqById(r.id);
    if (!live || live.status !== 'abierta' || live.proposals.length || live.noProviders) return;
    const n = generateProposals(live);
    saveRequests();
    renderRequests();
    if (views.solicitud?.classList.contains('active') && ctx.requestId === live.id) renderRequestDetail();
    if (n) {
      setUnseen((store.get(STORAGE.unseen, 0) || 0) + n);
      if (notifOn('propuestas')) showToast(`📩 Recibiste ${n} propuesta${n > 1 ? 's' : ''} para "${live.title}"`, 3600);
    } else showToast(`Todavía no hay trabajadores de ${live.category} en tu zona. Te avisamos cuando se sume uno.`, 3600);
  }, delay);
}

// ════════════════════════════════════════════════════════════════
// 9. CONTRATACIÓN
// ════════════════════════════════════════════════════════════════
function startHire(h) {
  ctx.hire = h;
  ctx.providerId = h.providerId;
  navigate('contratar');
}

function hireTotals() {
  const h = ctx.hire;
  const coupon = store.get(STORAGE.coupon, false);
  const discount = coupon ? Math.round(h.price * 0.1) : 0;
  return { discount, total: h.price - discount, coupon };
}

function renderHire() {
  if (!ctx.hire) ctx.hire = { providerId: ctx.providerId, price: provider(ctx.providerId).price, when: 'A coordinar por chat', requestId: null };
  const h = ctx.hire, p = provider(h.providerId), r = ratingOf(p);
  const img = $('#hire-avatar');
  if (img) { img.src = avatarSrc(p); img.alt = `Foto de perfil de ${p.name}`; }
  setText('hire-name', p.name);
  setText('hire-profession', p.profession);
  setText('hire-rating', `${r.avg} (${r.count} reseñas)`);
  const req = h.requestId && reqById(h.requestId);
  setText('hire-service', req ? req.title : p.service);
  setText('hire-price', formatARS(h.price));
  setText('hire-when', h.when);
  setText('hire-where', `Río Cuarto (${req ? req.zone : zone()})`);
  setText('hire-payment', store.get(STORAGE.payment, 'Efectivo'));
  const t = hireTotals();
  $('#hire-discount-row').hidden = !t.coupon;
  $('#hire-total-row').hidden = !t.coupon;
  setText('hire-discount', '−' + formatARS(t.discount));
  setText('hire-total', formatARS(t.total));
  const check = $('#terms-check'), btn = $('#confirm-hire-btn');
  if (check) check.checked = false;
  if (btn) btn.disabled = true;
  setText('hire-hint', 'Aceptá los términos para habilitar la contratación.');
}

function initConfirmHire() {
  const checkbox = $('#terms-check'), btn = $('#confirm-hire-btn');
  if (!checkbox || !btn) return;
  checkbox.addEventListener('change', () => {
    btn.disabled = !checkbox.checked;
    setText('hire-hint', checkbox.checked ? 'Todo listo para contratar.' : 'Aceptá los términos para habilitar la contratación.');
  });
  btn.addEventListener('click', () => {
    if (btn.disabled) return;
    const h = ctx.hire, p = provider(h.providerId), t = hireTotals();
    let r = h.requestId && reqById(h.requestId);
    if (!r) {
      r = { id: 'r-' + Date.now(), title: p.service, category: p.category, urgent: false,
            desc: `Contratación directa desde el perfil de ${p.name}.`, when: h.when, zone: zone(),
            createdAt: Date.now(), photos: [], proposals: [] };
      requests.unshift(r);
    }
    Object.assign(r, { status: 'contratada', step: 2, startedAt: Date.now(),
      hired: { providerId: p.id, price: h.price, when: h.when, discount: t.discount, total: t.total } });
    if (t.coupon) store.set(STORAGE.coupon, false);
    saveRequests();
    ctx.trackId = r.id;
    ctx.hire = null;
    navigate('trabajo');
    showToast(`✅ ¡Contratación confirmada! ${p.name} está en camino.${t.coupon ? ' Se aplicó tu cupón.' : ''}`, 3400);
  });
}

// ════════════════════════════════════════════════════════════════
// 10. SEGUIMIENTO DEL TRABAJO
// ════════════════════════════════════════════════════════════════
const ARRIVAL_MS = 7000;
const STEPS = ['Contratado', 'En camino', 'En curso', 'Finalizado'];

function trackedRequest() {
  const r = reqById(ctx.trackId);
  return (r && r.status === 'contratada') ? r : requests.find(x => x.status === 'contratada');
}

function renderTrack() {
  const r = trackedRequest();
  $('#trabajo-empty').hidden = !!r;
  $('#trabajo-content').hidden = !r;
  if (!r) return;
  ctx.trackId = r.id;
  if (r.step === 2 && Date.now() - r.startedAt >= ARRIVAL_MS) { r.step = 3; saveRequests(); }
  const p = provider(r.hired.providerId);

  $('#track-steps').innerHTML = STEPS.map((label, i) => {
    const n = i + 1, done = n < r.step, cur = n === r.step;
    return `<div class="step-item ${done ? 'completed' : ''}">
      <div class="step-dot ${done ? 'completed' : cur ? 'current' : ''}">${done ? '✓' : cur ? '→' : n}</div>
      <span class="step-text ${done ? 'completed' : cur ? 'current' : ''}">${label}</span></div>`;
  }).join('');
  $('#track-steps').setAttribute('aria-valuenow', String(r.step));
  $('#track-steps').setAttribute('aria-valuetext', STEPS[r.step - 1]);

  const img = $('#track-avatar');
  img.src = avatarSrc(p); img.alt = `Foto de perfil de ${p.name}`;
  const eta = new Date(r.startedAt + 25 * 60e3).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  if (r.step === 2) {
    setText('track-title', `${p.name} está en camino`);
    $('#track-eta').innerHTML = `${icon('clock', 13, 'ico-inline')} Llegada estimada: ${eta}`;
    $('#track-dist').innerHTML = `${icon('map-pin', 13, 'ico-inline')} A ${p.distance} de tu casa`;
    setText('track-status', 'Te avisamos cuando llegue.');
    $('#track-pin').style.transform = 'translate(-60px, 24px)';
  } else {
    setText('track-title', `${p.name} llegó y está trabajando`);
    $('#track-eta').innerHTML = `${icon('wrench', 13, 'ico-inline')} Trabajo en curso`;
    $('#track-dist').innerHTML = `${icon('map-pin', 13, 'ico-inline')} En tu domicilio`;
    setText('track-status', 'Cuando termine, confirmalo para poder calificar.');
    $('#track-pin').style.transform = 'none';
  }
  setText('track-zone', `Río Cuarto · ${r.zone}`);
  setText('track-service', r.title);
  setText('track-price', formatARS(r.hired.total ?? r.hired.price));
  $('#track-meta').innerHTML = `${icon('clock', 13, 'ico-inline')} ${escapeHtml(r.hired.when)} · ${icon('map-pin', 13, 'ico-inline')} ${escapeHtml(r.zone)}`;

  const fin = $('#finish-job-btn');
  fin.disabled = r.step < 3;
  setText('finish-hint', r.step < 3 ? 'Se habilita cuando el trabajador llega y empieza el trabajo.' : 'El trabajador ya está en tu casa.');
  $$('#view-trabajo [data-action="chat-provider"]').forEach(b => { b.dataset.provider = p.id; });

  if (r.step === 2) {
    clearTimeout(renderTrack.timer);
    renderTrack.timer = setTimeout(() => {
      const live = reqById(r.id);
      if (!live || live.status !== 'contratada' || live.step !== 2) return;
      live.step = 3; saveRequests();
      if (views.trabajo?.classList.contains('active')) renderTrack();
      if (notifOn('estado')) showToast(`🔧 ${p.name} llegó a tu domicilio y empezó el trabajo.`, 3400);
    }, Math.max(0, ARRIVAL_MS - (Date.now() - r.startedAt)));
  }
}

function initTrack() {
  $('#finish-job-btn')?.addEventListener('click', () => {
    const r = trackedRequest();
    if (!r || r.step < 3) return;
    Object.assign(r, { status: 'finalizada', step: 4, finishedAt: Date.now(), rating: null, review: '' });
    saveRequests();
    ctx.rateId = r.id;
    navigate('calificar');
    showToast('🎉 ¡Listo! Contanos cómo te fue.');
  });

  $('#cancel-job-btn')?.addEventListener('click', () => {
    const r = trackedRequest();
    if (!r) return;
    const p = provider(r.hired.providerId);
    confirmAction({ title: '¿Cancelar este trabajo?', desc: `Se le avisará a ${p.name}. Esta acción no se puede deshacer.`, okLabel: 'Sí, cancelar' }, () => {
      r.status = 'cancelada';
      saveRequests();
      navigate('solicitudes');
      selectTab('canceladas');
      showToast('Trabajo cancelado. Le avisamos al trabajador.');
    });
  });
}

// ════════════════════════════════════════════════════════════════
// 11. CALIFICACIÓN
// ════════════════════════════════════════════════════════════════
let selectedStars = 0;
function paintStars(n) {
  $$('#star-rating .star-rate').forEach(s => {
    const v = Number(s.dataset.star);
    s.classList.toggle('lit', v <= n);
    s.setAttribute('aria-pressed', String(v === selectedStars));
  });
}

function rateRequest() {
  return reqById(ctx.rateId) || requests.find(r => r.status === 'finalizada' && !r.rating) || requests.find(r => r.status === 'finalizada');
}

function renderRate() {
  const r = rateRequest();
  if (!r) return;
  ctx.rateId = r.id;
  const p = provider(r.hired.providerId);
  const img = $('#rate-avatar');
  img.src = avatarSrc(p); img.alt = `Foto de perfil de ${p.name}`;
  setText('rate-name', p.name);
  setText('rate-profession', p.profession);
  setText('rate-job', `${r.title} · ${formatARS(r.hired.total ?? r.hired.price)}`);
  setText('rate-heading', r.rating ? 'Tu calificación' : '¡Trabajo finalizado!');
  $('#rate-sub').innerHTML = r.rating ? 'Ya calificaste este trabajo. Podés cambiar tu calificación.' : 'El servicio se completó correctamente.<br>Ahora podés calificar al trabajador.';
  selectedStars = r.rating || 0;
  paintStars(selectedStars);
  $('#review-text').value = r.review || '';
  $('#submit-review-btn').disabled = !selectedStars;
  setText('submit-review-btn', r.rating ? 'Actualizar calificación' : 'Enviar calificación');
  setText('review-hint', selectedStars ? `Elegiste ${selectedStars} de 5 estrellas.` : 'Elegí de 1 a 5 estrellas para poder enviar.');
}

function initStarRating() {
  const container = $('#star-rating'), submit = $('#submit-review-btn');
  if (!container) return;
  container.addEventListener('click', (e) => {
    const star = e.target.closest('.star-rate');
    if (!star) return;
    selectedStars = Number(star.dataset.star);
    paintStars(selectedStars);
    submit.disabled = false;
    setText('review-hint', `Elegiste ${selectedStars} de 5 estrellas.`);
  });
  container.addEventListener('mouseover', (e) => { const s = e.target.closest('.star-rate'); if (s) paintStars(Number(s.dataset.star)); });
  container.addEventListener('mouseleave', () => paintStars(selectedStars));

  submit?.addEventListener('click', () => {
    const r = rateRequest();
    if (!selectedStars || !r) return;
    const text = $('#review-text').value.trim();
    const pid = r.hired.providerId;
    const author = (store.get(STORAGE.session)?.user?.name || 'María').split(' ')[0];
    const list = (userReviews[pid] || []).filter(x => x.requestId !== r.id);
    list.unshift({ requestId: r.id, author, stars: selectedStars, text, date: new Date().toLocaleDateString('es-AR', { month: 'short', year: 'numeric' }) });
    userReviews[pid] = list;
    store.set(STORAGE.reviews, userReviews);
    const updated = !!r.rating;
    r.rating = selectedStars; r.review = text;
    saveRequests();
    renderHomeProviders();
    navigate('solicitudes');
    selectTab('finalizadas');
    showToast(updated ? '⭐ Calificación actualizada.' : `⭐ ¡Gracias! Tu reseña ya aparece en el perfil de ${provider(pid).name}.`, 3400);
  });
}

// ════════════════════════════════════════════════════════════════
// 12. CHAT CON RESPUESTAS SIMULADAS
// ════════════════════════════════════════════════════════════════
function openChat(pid) {
  if (!provider(pid)) return;
  ctx.chatProviderId = pid;
  navigate('chat');
}

function bubble(m) {
  const mine = m.from === 'me';
  let body;
  if (m.img) body = `<img src="${m.img}" alt="Foto enviada" class="chat-photo" />`;
  else if (m.icon || m.emoji) body = `<div class="photo-thumb !w-48 !h-32 !rounded-xl border-0 text-blue-700" style="background:#dbeafe" role="img" aria-label="Foto enviada">${icon(m.icon || 'droplets', 40)}</div>`;
  else body = `<div class="chat-bubble ${mine ? 'chat-sent' : 'chat-received'}">${escapeHtml(m.text)}</div>`;
  return `<div class="flex flex-col ${mine ? 'items-end' : ''}">${body}<span class="chat-time ${mine ? 'chat-time-sent' : ''}">${m.time}</span></div>`;
}

function renderChat() {
  const p = provider(ctx.chatProviderId) || PROVIDERS[0];
  const img = $('#chat-avatar');
  img.src = avatarSrc(p); img.alt = `Foto de perfil de ${p.name}`;
  setText('chat-name', p.name);
  const box = $('#chat-messages');
  const thread = chats[p.id] || [];
  box.innerHTML = thread.length ? thread.map(bubble).join('')
    : `<p class="chat-intro">Empezá la conversación con ${p.name}. Suele responder en menos de 15 minutos.</p>`;
  box.scrollTop = box.scrollHeight;
  $$('#view-chat [data-action="chat-provider"]').forEach(b => { b.dataset.provider = p.id; });
}

function cannedReply(p, text, isPhoto) {
  const t = (text || '').toLowerCase();
  const req = requests.find(r => r.status === 'abierta' && r.proposals.some(x => x.providerId === p.id));
  const price = req ? req.proposals.find(x => x.providerId === p.id).price : p.price;
  if (isPhoto) return '¡Gracias por la foto! Con eso ya me doy una idea del trabajo.';
  if (/precio|presupuesto|cu[aá]nto|sale|cobr/.test(t)) return `El presupuesto es de ${formatARS(price)} con materiales básicos incluidos.`;
  if (/hora|cu[aá]ndo|hoy|ma[ñn]ana|venir|llega/.test(t)) return p.available === 'hoy' ? 'Hoy puedo pasar entre las 18 y las 20 h. ¿Te queda bien?' : 'Mañana a primera hora puedo ir, tipo 9 h.';
  if (/gracias|genial|perfecto|dale|ok/.test(t)) return '¡De nada! Cualquier cosa me escribís por acá. 👍';
  if (/hola|buen/.test(t)) return `¡Hola! Soy ${p.name.split(' ')[0]}. Contame qué necesitás y te paso un presupuesto.`;
  return 'Perfecto, lo tengo en cuenta. ¿Me pasás una foto para ver mejor el problema?';
}

function pushMessage(pid, msg) {
  (chats[pid] = chats[pid] || []).push(msg);
  saveChats();
  if (views.chat?.classList.contains('active') && ctx.chatProviderId === pid) renderChat();
}

function simulateReply(pid, text, isPhoto) {
  const p = provider(pid);
  const box = $('#chat-messages');
  setTimeout(() => {
    if (views.chat?.classList.contains('active') && ctx.chatProviderId === pid) {
      box.insertAdjacentHTML('beforeend', `<div class="typing" id="typing"><span></span><span></span><span></span><span class="sr-only">${p.name} está escribiendo</span></div>`);
      box.scrollTop = box.scrollHeight;
    }
  }, 500);
  setTimeout(() => {
    $('#typing')?.remove();
    pushMessage(pid, { from: 'them', text: cannedReply(p, text, isPhoto), time: nowTime() });
    if (!(views.chat?.classList.contains('active') && ctx.chatProviderId === pid) && notifOn('mensajes')) showToast(`💬 Nuevo mensaje de ${p.name}`);
  }, 1800);
}

function initChat() {
  const sendBtn = $('#chat-send-btn'), input = $('#chat-input');
  if (!sendBtn || !input) return;
  const sync = () => { sendBtn.disabled = !input.value.trim(); };
  input.addEventListener('input', sync);
  const send = () => {
    const text = input.value.trim();
    if (!text) return;
    const pid = ctx.chatProviderId;
    pushMessage(pid, { from: 'me', text, time: nowTime() });
    input.value = ''; sync(); input.focus();
    simulateReply(pid, text, false);
  };
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });

  $('#chat-file')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const data = await readImage(file, 320);
      const pid = ctx.chatProviderId;
      pushMessage(pid, { from: 'me', img: data, time: nowTime() });
      simulateReply(pid, '', true);
    } catch { showToast('⚠ Ese archivo no es una imagen. Probá con una foto JPG o PNG.'); }
  });
}

// ════════════════════════════════════════════════════════════════
// 13. MODALES ACCESIBLES (<dialog>)
// ════════════════════════════════════════════════════════════════
let lastTrigger = null;

function openModal(dialog, trigger = document.activeElement) {
  if (!dialog) return;
  lastTrigger = trigger;
  if (!dialog.open) dialog.showModal();
  const first = $('[autofocus]', dialog) || $('.panel-body button, .panel-body input, .panel-body select, .panel-body textarea, .panel-body summary', dialog) || $('button, [href], input, select, textarea', dialog);
  first?.focus();
}
function closeModal(dialog) { if (dialog?.open) dialog.close(); }

function initModals() {
  $$('dialog.modal').forEach(dialog => {
    dialog.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) closeModal(dialog);
      if (e.target === dialog) closeModal(dialog);
    });
    dialog.addEventListener('close', () => {
      if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
      lastTrigger = null;
    });
    dialog.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = $$('button:not(:disabled), [href], input:not(:disabled), select, textarea, summary', dialog).filter(x => x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
  });
  $('#success-go')?.addEventListener('click', () => {
    lastTrigger = null;
    closeModal($('#success-modal'));
    navigate('solicitudes');
    selectTab('activas');
  });
}

function confirmAction({ title, desc, okLabel = 'Confirmar' }, onConfirm) {
  const dialog = $('#confirm-modal');
  setText('confirm-title', title);
  setText('confirm-desc', desc);
  const ok = $('#confirm-ok');
  ok.textContent = okLabel;
  const trigger = document.activeElement;
  ok.onclick = () => { lastTrigger = null; closeModal(dialog); onConfirm(); };
  openModal(dialog, trigger);
}

// ════════════════════════════════════════════════════════════════
// 14. PANELES: MI CUENTA, ZONA, TÉRMINOS, CHAT
// ════════════════════════════════════════════════════════════════
const session = () => store.get(STORAGE.session) || { user: { name: 'María González', email: 'maria@email.com', phone: '358 412-3456' }, loggedIn: true };
const notifs  = () => store.get(STORAGE.notifs, { propuestas: true, mensajes: true, estado: true, promos: false });
const notifOn = k => notifs()[k] !== false;

function field(id, label, input, hint = '') {
  return `<div class="field mb-4">
    <label for="${id}" class="field-label">${label}</label>
    ${input}
    ${hint ? `<p id="${id}-hint" class="field-hint">${hint}</p>` : ''}
    <p id="${id}-error" class="field-error" aria-live="polite"></p>
  </div>`;
}

function setError(id, msg) {
  const el = document.getElementById(id);
  const err = document.getElementById(`${id}-error`);
  if (err) err.textContent = msg ? `⚠ ${msg}` : '';
  if (el) { el.setAttribute('aria-invalid', String(!!msg)); el.classList.add('touched'); }
  return !msg;
}

function switchRow(key, label, desc, on) {
  return `<div class="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
    <div><p class="text-sm font-semibold text-slate-800" id="sw-${key}-label">${label}</p><p class="text-xs text-slate-500">${desc}</p></div>
    <button type="button" class="switch" role="switch" aria-checked="${on}" aria-labelledby="sw-${key}-label" data-switch="${key}"><span></span></button>
  </div>`;
}

const PANELS = {
  datos: {
    title: 'Mis datos', sub: 'Así te ven los trabajadores cuando les escribís.',
    html: () => {
      const u = session().user;
      return `<form id="pf" novalidate>
        ${field('pd-name', 'Nombre y apellido', `<input id="pd-name" class="input" autocomplete="name" value="${escapeHtml(u.name)}" aria-describedby="pd-name-error" />`)}
        ${field('pd-email', 'Email', `<input id="pd-email" type="email" class="input" autocomplete="email" value="${escapeHtml(u.email)}" aria-describedby="pd-email-error" />`)}
        ${field('pd-phone', 'Teléfono', `<input id="pd-phone" type="tel" class="input" autocomplete="tel" value="${escapeHtml(u.phone || '')}" aria-describedby="pd-phone-hint pd-phone-error" />`, 'Solo lo ve el trabajador que contrates.')}
        <button type="submit" class="btn btn-primary force-text-white">Guardar cambios</button>
      </form>`;
    },
    bind: (body) => $('#pf', body).addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#pd-name').value.trim(), email = $('#pd-email').value.trim(), phone = $('#pd-phone').value.trim();
      const ok = [
        setError('pd-name', name.length < 3 ? 'Escribí tu nombre y apellido.' : !/^[a-záéíóúñü\s'.-]+$/i.test(name) ? 'El nombre solo puede tener letras.' : ''),
        setError('pd-email', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? '' : 'Revisá el email: falta la @ o el dominio (ej: nombre@mail.com).'),
        setError('pd-phone', (d => d.length >= 8 && d.length <= 13)(phone.replace(/\D/g, '')) ? '' : 'El teléfono debe tener entre 8 y 13 números.'),
      ];
      if (ok.includes(false)) { $('[aria-invalid="true"]', body)?.focus(); return; }
      const s = session(); s.user = { name, email, phone }; store.set(STORAGE.session, s);
      renderAccount(); closeModal($('#panel-modal'));
      showToast('✓ Tus datos se guardaron.');
    }),
  },

  direcciones: {
    title: 'Direcciones y zona', sub: 'Elegí dónde necesitás los trabajos.',
    html: () => {
      const list = store.get(STORAGE.addresses, [{ alias: 'Casa', street: 'Sobremonte 1250', barrio: 'Centro' }]);
      const only = list.length === 1;
      return `<ul class="flex flex-col gap-2 mb-5" id="addr-list">${list.map((a, i) => `
        <li class="flex items-center justify-between gap-3 card p-3">
          <div><p class="text-sm font-semibold text-slate-800">${escapeHtml(a.alias)}</p><p class="text-xs text-slate-500">${escapeHtml(a.street)} · ${escapeHtml(a.barrio)}</p></div>
          <button type="button" class="btn btn-danger !w-auto !min-h-[44px] !py-1 px-3 text-xs" data-del="${i}" ${only ? 'disabled title="Tenés que tener al menos una dirección"' : ''} aria-label="Eliminar ${escapeHtml(a.alias)}">Eliminar</button>
        </li>`).join('')}</ul>
        <form id="af" novalidate class="border-t border-slate-200 pt-4">
          <p class="text-sm font-bold text-slate-800 mb-3">Agregar dirección</p>
          ${field('ad-alias', 'Nombre', `<select id="ad-alias" class="input"><option>Casa</option><option>Trabajo</option><option>Casa de mis padres</option><option>Otra</option></select>`)}
          ${field('ad-street', 'Calle y número', `<input id="ad-street" class="input" autocomplete="street-address" placeholder="Ej: Constitución 850" aria-describedby="ad-street-error" />`)}
          ${field('ad-barrio', 'Barrio', `<select id="ad-barrio" class="input">${BARRIOS.map(b => `<option>${b}</option>`).join('')}</select>`)}
          <button type="submit" class="btn btn-primary force-text-white">Guardar dirección</button>
        </form>`;
    },
    bind: (body) => {
      body.addEventListener('click', (e) => {
        const del = e.target.closest('[data-del]');
        if (!del || del.disabled) return;
        const list = store.get(STORAGE.addresses, [{ alias: 'Casa', street: 'Sobremonte 1250', barrio: 'Centro' }]);
        const [gone] = list.splice(Number(del.dataset.del), 1);
        store.set(STORAGE.addresses, list);
        renderPanel('direcciones');
        showToast(`Eliminaste "${gone.alias}".`);
      });
      $('#af', body).addEventListener('submit', (e) => {
        e.preventDefault();
        const street = $('#ad-street').value.trim();
        if (!setError('ad-street', street.length < 5 ? 'Escribí la calle y el número (ej: Constitución 850).' : !/\d/.test(street) ? 'Falta el número de la calle.' : '')) { $('#ad-street').focus(); return; }
        const list = store.get(STORAGE.addresses, [{ alias: 'Casa', street: 'Sobremonte 1250', barrio: 'Centro' }]);
        list.push({ alias: $('#ad-alias').value, street, barrio: $('#ad-barrio').value });
        store.set(STORAGE.addresses, list);
        renderPanel('direcciones');
        showToast('📍 Dirección guardada.');
      });
    },
  },

  pagos: {
    title: 'Pagos y cupones', sub: 'El pago se arregla con el trabajador; acá elegís tu forma preferida.',
    html: () => {
      const cur = store.get(STORAGE.payment, 'Efectivo');
      const coupon = store.get(STORAGE.coupon, false);
      return `<fieldset class="mb-5"><legend class="text-sm font-bold text-slate-800 mb-2">Forma de pago preferida</legend>
        ${PAYMENT_METHODS.map((m, i) => `<label class="radio-row"><input type="radio" name="pay" value="${m}" ${m === cur ? 'checked' : ''} /> <span>${m}</span></label>`).join('')}
        </fieldset>
        <div class="border-t border-slate-200 pt-4">
          <p class="text-sm font-bold text-slate-800 mb-2">Cupón de descuento</p>
          ${coupon
            ? `<div class="card tint p-3 flex flex-wrap items-center justify-between gap-3"><p class="text-sm"><b>✓ ${COUPON_CODE} activo:</b> 10 % en tu próxima contratación.</p><button type="button" id="cp-remove" class="btn btn-secondary !w-auto !min-h-[44px] !py-1 px-3 text-xs">Quitar</button></div>`
            : `<form id="cf" novalidate class="flex gap-2 items-start">
                 <div class="flex-1 min-w-0">${field('cp-code', 'Código', `<input id="cp-code" class="input uppercase placeholder:normal-case" placeholder="Tu código" autocomplete="off" aria-describedby="cp-code-error" />`)}</div>
                 <button type="submit" class="btn btn-primary force-text-white !w-auto flex-shrink-0 px-4 sm:px-5 mt-[26px]">Aplicar</button>
               </form>`}
        </div>`;
    },
    bind: (body) => {
      $$('input[name="pay"]', body).forEach(r => r.addEventListener('change', () => {
        store.set(STORAGE.payment, r.value);
        showToast(`💳 Forma de pago preferida: ${r.value}`);
      }));
      $('#cp-remove', body)?.addEventListener('click', () => { store.set(STORAGE.coupon, false); renderPanel('pagos'); showToast('Quitaste el cupón.'); });
      $('#cf', body)?.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = $('#cp-code').value.trim().toUpperCase();
        if (!setError('cp-code', !code ? 'Escribí el código del cupón.' : code !== COUPON_CODE ? 'Ese cupón no existe o ya venció.' : '')) { $('#cp-code').focus(); return; }
        store.set(STORAGE.coupon, true);
        renderPanel('pagos');
        showToast('🎁 ¡Cupón aplicado! Vas a ver el descuento al contratar.', 3200);
      });
    },
  },

  notificaciones: {
    title: 'Notificaciones', sub: 'Elegí qué avisos querés recibir.',
    html: () => {
      const n = notifs();
      return switchRow('propuestas', 'Nuevas propuestas', 'Cuando un trabajador responde tu solicitud.', n.propuestas) +
             switchRow('mensajes', 'Mensajes', 'Cuando te escriben por el chat.', n.mensajes) +
             switchRow('estado', 'Estado del trabajo', 'Cuando el trabajador sale, llega o termina.', n.estado) +
             switchRow('promos', 'Promociones', 'Cupones y novedades de ManoCerca.', n.promos);
    },
    bind: (body) => body.addEventListener('click', (e) => {
      const sw = e.target.closest('[data-switch]');
      if (!sw) return;
      const n = notifs(); const k = sw.dataset.switch;
      n[k] = !n[k]; store.set(STORAGE.notifs, n);
      sw.setAttribute('aria-checked', String(n[k]));
      showToast(`${n[k] ? '🔔 Activaste' : '🔕 Desactivaste'} los avisos de ${$(`#sw-${k}-label`).textContent.toLowerCase()}.`);
    }),
  },

  seguridad: {
    title: 'Seguridad y ajustes', sub: 'Cambiá tu contraseña y ajustá cómo se ve la app.',
    html: () => `${switchRow('dark', 'Modo oscuro', 'Fondo oscuro, mismo contraste AA.', isDark())}
      ${switchRow('big', 'Texto más grande', 'Aumenta el tamaño de toda la app.', store.get(STORAGE.bigText, false))}
      <form id="sf" novalidate class="border-t border-slate-200 pt-4 mt-2">
        <p class="text-sm font-bold text-slate-800 mb-3">Cambiar contraseña</p>
        ${field('sc-cur', 'Contraseña actual', `<input id="sc-cur" type="password" class="input" autocomplete="current-password" aria-describedby="sc-cur-hint sc-cur-error" />`, `Contraseña de la demo: <b>${store.get(STORAGE.password, DEMO_PASSWORD)}</b>`)}
        ${field('sc-new', 'Nueva contraseña', `<input id="sc-new" type="password" class="input" autocomplete="new-password" aria-describedby="sc-new-hint sc-new-error" />`, 'Mínimo 8 caracteres y al menos un número.')}
        ${field('sc-rep', 'Repetí la nueva contraseña', `<input id="sc-rep" type="password" class="input" autocomplete="new-password" aria-describedby="sc-rep-error" />`)}
        <button type="submit" class="btn btn-primary force-text-white">Cambiar contraseña</button>
      </form>`,
    bind: (body) => {
      body.addEventListener('click', (e) => {
        const sw = e.target.closest('[data-switch]');
        if (!sw) return;
        if (sw.dataset.switch === 'dark') { setTheme(isDark() ? 'light' : 'dark'); sw.setAttribute('aria-checked', String(isDark())); }
        if (sw.dataset.switch === 'big') {
          const on = !store.get(STORAGE.bigText, false);
          store.set(STORAGE.bigText, on); applyBigText(on); sw.setAttribute('aria-checked', String(on));
          showToast(on ? '🔠 Texto grande activado' : 'Texto en tamaño normal');
        }
      });
      $('#sf', body).addEventListener('submit', (e) => {
        e.preventDefault();
        const cur = $('#sc-cur').value, nw = $('#sc-new').value, rep = $('#sc-rep').value;
        const ok = [
          setError('sc-cur', cur !== store.get(STORAGE.password, DEMO_PASSWORD) ? 'La contraseña actual no es correcta.' : ''),
          setError('sc-new', nw.length < 8 ? 'Tiene que tener al menos 8 caracteres.' : !/\d/.test(nw) ? 'Agregá al menos un número.' : nw === cur ? 'Tiene que ser distinta de la actual.' : ''),
          setError('sc-rep', rep !== nw || !rep ? 'Las contraseñas no coinciden.' : ''),
        ];
        if (ok.includes(false)) { $('[aria-invalid="true"]', body)?.focus(); return; }
        store.set(STORAGE.password, nw);
        closeModal($('#panel-modal'));
        showToast('🔒 Contraseña actualizada.');
      });
    },
  },

  ayuda: {
    title: 'Ayuda y soporte', sub: 'Preguntas frecuentes y contacto con el equipo.',
    html: () => `<div class="flex flex-col gap-2 mb-5">
        <details class="faq"><summary>¿Cómo sé que un trabajador es confiable?</summary><p>Todos validan su identidad con DNI. Además ves sus reseñas, su calificación y cuántos trabajos hizo antes de contratar.</p></details>
        <details class="faq"><summary>¿Cuánto cuesta usar ManoCerca?</summary><p>Publicar una solicitud es gratis. Solo pagás el trabajo, al precio que aceptaste en la propuesta.</p></details>
        <details class="faq"><summary>¿Cómo cancelo un trabajo?</summary><p>Entrá a Mis solicitudes, abrí el trabajo en curso y tocá "Cancelar trabajo". Te vamos a pedir que lo confirmes.</p></details>
        <details class="faq"><summary>¿Quién ve mi dirección y mi teléfono?</summary><p>Solo el trabajador que contratás. Antes de eso, los demás ven únicamente tu barrio.</p></details>
      </div>
      <form id="hf" novalidate class="border-t border-slate-200 pt-4">
        <p class="text-sm font-bold text-slate-800 mb-3">¿No encontraste la respuesta? Escribinos</p>
        ${field('hp-topic', 'Motivo', `<select id="hp-topic" class="input"><option value="">Elegí un motivo</option><option>Problema con un trabajo</option><option>Pagos y cupones</option><option>Mi cuenta</option><option>Otro</option></select>`)}
        ${field('hp-msg', 'Mensaje', `<textarea id="hp-msg" class="input" rows="3" aria-describedby="hp-msg-error"></textarea>`)}
        <button type="submit" class="btn btn-primary force-text-white">Enviar consulta</button>
        <p id="hp-ok" class="text-sm text-green-700 font-semibold mt-3" role="status"></p>
      </form>
      <div class="border-t border-slate-200 pt-4 mt-5">
        <p class="text-sm font-bold text-slate-800 mb-1">Datos de la demo</p>
        <p class="text-xs text-slate-500 mb-3">Vuelve la app al estado inicial: solicitudes, chats, reseñas y ajustes de ejemplo.</p>
        <button type="button" id="reset-demo" class="btn btn-danger">Reiniciar datos de la demo</button>
      </div>`,
    bind: (body) => {
      $('#hf', body).addEventListener('submit', (e) => {
        e.preventDefault();
        const topic = $('#hp-topic').value, msg = $('#hp-msg').value.trim();
        const ok = [setError('hp-topic', topic ? '' : 'Elegí el motivo de tu consulta.'),
                    setError('hp-msg', msg.length < 15 ? `Contanos un poco más: mínimo 15 caracteres (llevás ${msg.length}).` : '')];
        if (ok.includes(false)) { $('[aria-invalid="true"]', body)?.focus(); return; }
        const n = 'MC-' + String(Date.now()).slice(-4);
        $('#hf', body).reset();
        setText('hp-ok', `✓ Recibimos tu consulta (caso #${n}). Te respondemos en menos de 24 h a tu email.`);
      });
      $('#reset-demo', body).addEventListener('click', () => {
        closeModal($('#panel-modal'));
        confirmAction({ title: '¿Reiniciar la demo?', desc: 'Se borran las solicitudes, chats, reseñas y ajustes que cargaste. El tema claro u oscuro se mantiene.', okLabel: 'Sí, reiniciar' }, () => {
          Object.entries(STORAGE).forEach(([k, key]) => { if (k !== 'theme') { try { localStorage.removeItem(key); } catch {} } });
          location.hash = '';
          location.reload();
        });
      });
    },
  },

  zona: {
    title: 'Cambiar mi zona', sub: 'Te mostramos trabajadores y propuestas cerca de este barrio de Río Cuarto.',
    html: () => `<fieldset><legend class="sr-only">Barrio</legend>
      ${BARRIOS.map(b => `<label class="radio-row"><input type="radio" name="zona" value="${b}" ${b === zone() ? 'checked' : ''} /> <span>${b}</span></label>`).join('')}
      </fieldset>
      <button type="button" id="zona-save" class="btn btn-primary force-text-white mt-4">Usar este barrio</button>`,
    bind: (body) => $('#zona-save', body).addEventListener('click', () => {
      const v = $('input[name="zona"]:checked', body)?.value || 'Centro';
      store.set(STORAGE.zone, v);
      renderZone();
      closeModal($('#panel-modal'));
      showToast(`📍 Zona actualizada: ${v}, Río Cuarto.`);
    }),
  },

  terminos: {
    title: 'Términos y condiciones', sub: 'Resumen en lenguaje simple.',
    html: () => `<div class="prose-mc">
      <p><b>1. Qué es ManoCerca.</b> Una plataforma que conecta a vecinos con trabajadores independientes. El trabajo lo acuerdan entre ustedes.</p>
      <p><b>2. Precios.</b> El precio es el de la propuesta que aceptás. No hay costos ocultos por usar la app.</p>
      <p><b>3. Cancelaciones.</b> Podés cancelar antes de que el trabajador llegue sin cargo.</p>
      <p><b>4. Reseñas.</b> Solo puede calificar quien contrató el trabajo, para que las reseñas sean reales.</p>
      <p><b>5. Datos.</b> Tu dirección y teléfono se comparten solo con el trabajador que contratás.</p>
      <p class="text-xs text-slate-500">Texto de ejemplo para el prototipo académico.</p></div>
      <button type="button" class="btn btn-primary force-text-white mt-2" data-close>Entendido</button>`,
  },

  privacidad: {
    title: 'Política de privacidad', sub: 'Qué datos guardamos y para qué.',
    html: () => `<div class="prose-mc">
      <p><b>Qué guardamos.</b> Nombre, email, teléfono, direcciones y el historial de solicitudes.</p>
      <p><b>Para qué.</b> Para conectarte con trabajadores y mostrarte tu historial. No vendemos datos.</p>
      <p><b>En este prototipo.</b> Todo se guarda solo en tu navegador (localStorage). Podés borrarlo desde Ayuda › Reiniciar datos de la demo.</p></div>
      <button type="button" class="btn btn-primary force-text-white mt-2" data-close>Entendido</button>`,
  },

  'chat-menu': {
    title: 'Opciones del chat', sub: '',
    html: () => {
      const p = provider(ctx.chatProviderId);
      return `<div class="flex flex-col gap-2">
        <button type="button" class="menu-row" data-go="profile"><span class="inline-flex items-center gap-3">${icon('user', 18)} Ver perfil de ${p.name}</span></button>
        <button type="button" class="menu-row" data-go="hire"><span class="inline-flex items-center gap-3">${icon('circle-check', 18)} Contratar a ${p.name}</span></button>
        <button type="button" class="menu-row" data-go="clear"><span class="inline-flex items-center gap-3">${icon('trash-2', 18)} Vaciar conversación</span></button>
        <button type="button" class="menu-row text-red-700" data-go="report"><span class="inline-flex items-center gap-3">${icon('triangle-alert', 18)} Reportar un problema</span></button>
      </div>`;
    },
    bind: (body) => body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-go]');
      if (!b) return;
      const p = provider(ctx.chatProviderId);
      closeModal($('#panel-modal'));
      if (b.dataset.go === 'profile') { selectProvider(p.id); navigate('profile'); }
      if (b.dataset.go === 'hire') {
        const req = requests.find(r => r.status === 'abierta' && r.proposals.some(x => x.providerId === p.id));
        const pr = req?.proposals.find(x => x.providerId === p.id);
        startHire(pr ? { providerId: p.id, price: pr.price, when: pr.when, requestId: req.id } : { providerId: p.id, price: p.price, when: 'A coordinar por chat', requestId: null });
      }
      if (b.dataset.go === 'clear') confirmAction({ title: '¿Vaciar la conversación?', desc: `Se borran los mensajes con ${p.name} en este dispositivo.`, okLabel: 'Sí, vaciar' }, () => {
        chats[p.id] = []; saveChats(); renderChat(); showToast('Conversación vaciada.');
      });
      if (b.dataset.go === 'report') showToast('Recibimos tu reporte. El equipo de ManoCerca lo revisa en menos de 24 h.', 3400);
    }),
  },
};

function renderPanel(key) {
  const def = PANELS[key];
  if (!def) return;
  setText('panel-title', def.title);
  setText('panel-sub', def.sub);
  $('#panel-sub').hidden = !def.sub;
  // contenedor nuevo en cada dibujado: así no se acumulan listeners
  const old = $('#panel-body');
  const body = old.cloneNode(false);
  old.replaceWith(body);
  body.innerHTML = def.html();
  def.bind?.(body);
}

function openPanel(key, trigger) {
  if (!PANELS[key]) return;
  renderPanel(key);
  openModal($('#panel-modal'), trigger);
}

// ════════════════════════════════════════════════════════════════
// 15. MI CUENTA Y SESIÓN
// ════════════════════════════════════════════════════════════════
function renderAccount() {
  const s = session();
  const u = s.user;
  const initials = u.name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  setText('account-avatar', initials);
  $('#account-avatar')?.setAttribute('aria-label', `Avatar de ${u.name}`);
  setText('account-name', s.loggedIn ? u.name : 'Invitado');
  setText('account-email', s.loggedIn ? u.email : 'Sin sesión iniciada');
  $('#account-loggedout').hidden = s.loggedIn;
  $('#account-options').hidden = !s.loggedIn;
}

function renderZone() {
  setText('location-label', `Río Cuarto · ${zone()}`);
}

function initSession() {
  if (!store.get(STORAGE.session)) store.set(STORAGE.session, { ...session(), loggedIn: true });
  $('#logout-btn')?.addEventListener('click', () => {
    confirmAction({ title: '¿Cerrar sesión?', desc: 'Vas a tener que volver a ingresar para ver tus solicitudes.', okLabel: 'Cerrar sesión' }, () => {
      const s = session(); s.loggedIn = false; store.set(STORAGE.session, s);
      renderAccount();
      showToast('Sesión cerrada correctamente.');
      $('#login-btn')?.focus();
    });
  });
  $('#login-btn')?.addEventListener('click', () => {
    const s = session(); s.loggedIn = true; store.set(STORAGE.session, s);
    renderAccount();
    showToast(`👋 ¡Hola de nuevo, ${s.user.name.split(' ')[0]}!`);
  });
}

// ════════════════════════════════════════════════════════════════
// 16. FORMULARIO "PUBLICAR SOLICITUD"
// ════════════════════════════════════════════════════════════════
const VALIDATORS = {
  titulo: v => !v.trim() ? 'Escribí un título para tu solicitud.' : v.trim().length < 8 ? `El título necesita al menos 8 caracteres (llevás ${v.trim().length}).` : '',
  categoria: v => (v ? '' : 'Elegí qué tipo de servicio necesitás.'),
  telefono: v => {
    const d = v.replace(/\D/g, '');
    if (!d) return 'Ingresá un teléfono para que el trabajador te contacte.';
    if (d.length < 8 || d.length > 13) return 'Revisá el número: debe tener entre 8 y 13 dígitos.';
    return '';
  },
  descripcion: v => !v.trim() ? 'Describí brevemente el problema.' : v.trim().length < 20 ? `Agregá un poco más de detalle: mínimo 20 caracteres (llevás ${v.trim().length}).` : '',
};

function validateField(f) {
  const rule = VALIDATORS[f.name];
  if (!rule) return true;
  const msg = rule(f.value);
  const err = document.getElementById(`${f.id}-error`);
  if (err) err.textContent = msg ? `⚠ ${msg}` : '';
  f.setAttribute('aria-invalid', String(Boolean(msg)));
  f.classList.add('touched');
  return !msg;
}

function initRequestForm() {
  const form = $('#request-form');
  if (!form) return;
  const fields = $$('[name]', form).filter(f => VALIDATORS[f.name]);
  const desc = $('#f-descripcion'), counter = $('#f-descripcion-count');
  const updateCounter = () => { if (counter) counter.textContent = `${desc.value.length} / ${desc.maxLength}`; };
  desc?.addEventListener('input', updateCounter);

  fields.forEach(f => {
    f.addEventListener('blur', () => { if (f.value || f.classList.contains('touched')) validateField(f); });
    f.addEventListener('input', () => { if (f.classList.contains('touched')) validateField(f); });
    f.addEventListener('change', () => { if (f.tagName === 'SELECT') validateField(f); });
  });

  form.addEventListener('reset', () => requestAnimationFrame(() => {
    fields.forEach(f => { f.removeAttribute('aria-invalid'); f.classList.remove('touched'); const e = document.getElementById(`${f.id}-error`); if (e) e.textContent = ''; });
    updateCounter();
  }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = fields.map(validateField);
    if (results.includes(false)) { fields[results.indexOf(false)].focus(); showToast('Revisá los campos marcados'); return; }
    const data = Object.fromEntries(new FormData(form));
    const r = {
      id: 'r-' + Date.now(), title: data.titulo.trim(), category: data.categoria, desc: data.descripcion.trim(),
      urgent: Boolean(data.urgente), when: data.urgente ? 'Hoy, lo antes posible' : 'A coordinar', zone: zone(),
      createdAt: Date.now(), photos: [], status: 'abierta', proposals: [],
    };
    requests.unshift(r);
    saveRequests();
    ctx.requestId = r.id;
    scheduleProposals(r);
    renderRequests();
    setText('success-desc', `"${r.title}" ya está visible para trabajadores de ${r.category} en ${r.zone}. Las propuestas llegan en unos segundos.`);
    const submitBtn = form.querySelector('[type="submit"]');
    form.reset();
    openModal($('#success-modal'), submitBtn);
  });
}

// ════════════════════════════════════════════════════════════════
// 17. TOAST
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
  initConfirmHire();
  initModals();
  initRequestForm();
  initRequestDetail();
  initSolicitudesTabs();
  initStarRating();
  initChat();
  initTrack();
  initSession();
  renderAccount();
  renderZone();
  setUnseen(store.get(STORAGE.unseen, 0));

  onEnter.profile     = renderProfile;
  onEnter.solicitud   = () => { showAllProposals = false; renderRequestDetail(); };
  onEnter.solicitudes = () => { renderRequests(); setUnseen(0); };
  onEnter.contratar   = renderHire;
  onEnter.trabajo     = renderTrack;
  onEnter.calificar   = renderRate;
  onEnter.chat        = renderChat;
  onEnter['mi-perfil'] = renderAccount;

  // Solicitudes publicadas antes de recargar que todavía esperan propuestas
  requests.filter(r => r.status === 'abierta' && !r.proposals.length && !r.noProviders)
    .forEach(r => scheduleProposals(r, Math.max(0, 4000 - (Date.now() - r.createdAt))));
  saveRequests();

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
