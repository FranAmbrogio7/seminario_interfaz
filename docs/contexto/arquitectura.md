# Arquitectura del Sistema (ManoCerca)

## 1. Stack Tecnológico
- **Marcado**: HTML5 semántico.
- **Estilos**: Tailwind CSS (v3 vía CDN) con sistema de utilidades y paleta semántica.
- **Lógica & Enrutado**: JavaScript Vanilla (Single Page Application - SPA).

## 2. Archivos y Responsabilidades
| Archivo | Responsabilidad |
| :--- | :--- |
| `index.html` | Estructura semántica completa de la SPA (`header`, `nav`, `main`, `section`, `footer`, `dialog`). |
| `style.css` | Tokens de diseño (`:root` / `html.dark`), componentes custom, 5 estados UI, foco `:focus-visible`, `.force-text-white`. |
| `app.js` | Router, tema, catálogo dinámico, filtros, formulario validado, modales, pestañas, chat y `localStorage`. |

## 3. Router y Navegación SPA
Cada vista es un `<section class="view" id="view-*">` dentro de `<main>`; `navigate(id)` muestra una sola, mueve el foco a la vista y sincroniza `history` (botón atrás del navegador funcional).
- `#view-home`: Hero con CTA, buscador, categorías, catálogo (6 tarjetas), "Cómo funciona", formulario "Publicá tu solicitud", cupón y footer.
- `#view-search`: Buscador + chips de filtro por categoría + listado de prestadores.
- `#view-profile`: Perfil del prestador elegido (badge de verificación, servicios).
- `#view-solicitud`: Detalle de una solicitud y propuestas recibidas.
- `#view-chat`: Mensajería con el prestador.
- `#view-contratar`: Confirmación de contratación (botón disabled hasta aceptar términos).
- `#view-trabajo`: Seguimiento del trabajo en curso (cancelar con modal de confirmación).
- `#view-calificar`: Calificación con estrellas (envío disabled hasta elegir estrellas).
- `#view-solicitudes`: Mis solicitudes con pestañas Activas / Finalizadas / Canceladas.
- `#view-mi-perfil`: Datos del usuario y cierre de sesión (modal de confirmación).

Las anclas internas del inicio (`#servicios`, `#como-funciona`, `#publicar`) usan `data-scroll` y desplazamiento suave.

## 4. Persistencia (`localStorage`)
| Clave | Contenido |
| :--- | :--- |
| `mc_theme` | `"light"` / `"dark"` |
| `mc_solicitudes` | Array de solicitudes publicadas desde el formulario |
| `mc_filtro` | Último filtro de categoría |
| `mc_prestador` | Id del último prestador visto |
| `mc_session` | Usuario simulado |

## 5. Mapeo con Frames de Figma
- **Frame 1 (Portada & Buscador)**: Hero, buscador de servicios y acceso rápido por oficio.
- **Frame 2 (Catálogo & Tarjetas)**: Grilla de prestadores (`⭐ 4,8 · 37 trabajos · 📍 2.4 km`) y tarjetas de solicitudes.
- **Frame 3 (Formulario de Publicación)**: Formulario de 4 campos con validación en cliente que abre un modal accesible (*✓ Solicitud publicada*).
- **Frame 4 (Mensajería & Cotización)**: Vista de Chat para coordinar horario, presupuesto y confirmación.
- **Frame 5 (Reseñas & Calificación)**: Vista de evaluación con estrellas al finalizar el servicio.

## 6. Qué NO Existe (Límites del MVP)
- **NO Backend de Servidor**: Sin Node.js, Express ni Python.
- **NO Bases de Datos Remotas**: Sin MySQL, PostgreSQL ni Firebase (persistencia simulada en LocalStorage/IndexedDB).
- **NO Pasarelas de Pago Reales**: Sin integración bancaria ni MercadoPago.
- **NO Geolocalización en Tiempo Real**: Coordenadas y distancias simuladas.
- **NO Apps Nativas**: Exclusivamente web accesible mediante navegador.
