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
Cada vista es un `<section class="view" id="view-*">` dentro de `<main>`; `navigate(id)` ejecuta el renderizador de la vista (`onEnter`), muestra una sola, mueve el foco y sincroniza `history` (el botón atrás del navegador funciona).
- `#view-home`: Hero con CTA, buscador, categorías, 6 trabajadores destacados (mejor calificación), "Cómo funciona", formulario "Publicá tu solicitud", cupón y footer.
- `#view-search`: Buscador + chips por categoría (Jardinería deshabilitado: sin trabajadores) + listado de 11 trabajadores.
- `#view-profile`: Perfil del trabajador con bloque de **reputación**: verificación, calificación calculada y reseñas (incluye las que deja el usuario).
- `#view-solicitud`: Detalle dinámico de la solicitud elegida: fotos (se pueden agregar, máximo 4), estado y propuestas con "Chatear" y "Ver propuesta".
- `#view-chat`: Chat por trabajador con respuestas simuladas, indicador "escribiendo…", envío de fotos y menú de opciones.
- `#view-contratar`: Resumen con presupuesto, forma de pago y cupón; botón deshabilitado hasta aceptar términos.
- `#view-trabajo`: Seguimiento con 4 estados; el trabajador "llega" a los 7 s y recién ahí se habilita "Confirmar que el trabajo terminó". Estado vacío si no hay trabajos.
- `#view-calificar`: Calificación con estrellas y reseña; si ya estaba calificado, permite actualizarla.
- `#view-solicitudes`: Lista dinámica con pestañas Activas / Finalizadas / Canceladas y orden por fecha.
- `#view-mi-perfil` (**Mi cuenta**): datos, direcciones y zona, pagos y cupones, notificaciones, seguridad y ajustes, ayuda; cerrar e iniciar sesión.

Paneles (`<dialog id="panel-modal">`, definidos en `PANELS` de `app.js`): `datos`, `direcciones`, `pagos`, `notificaciones`, `seguridad`, `ayuda`, `zona`, `terminos`, `privacidad`, `chat-menu`.

Barra inferior (mobile): **Inicio · Solicitudes · Buscar · Mi cuenta**. Por el card sorting, el chat ya no es una pestaña: se abre desde cada propuesta, el perfil o el seguimiento.

## 4. Modelo de datos y persistencia (`localStorage`)
Una solicitud pasa por `abierta → contratada → finalizada`, o termina en `cancelada`:
```
{ id, title, category, desc, urgent, when, zone, createdAt, photos[], status,
  proposals[{providerId, price, when}], hired{providerId, price, when, discount, total},
  step (2 en camino · 3 en curso · 4 finalizado), rating, review }
```

| Clave | Contenido |
| :--- | :--- |
| `mc_theme` | `"light"` / `"dark"` |
| `mc_requests_v2` | Todas las solicitudes y su estado |
| `mc_chats_v2` | Conversaciones por trabajador |
| `mc_user_reviews` | Reseñas que dejó el usuario (se suman a la calificación) |
| `mc_session` | Usuario y si tiene sesión iniciada |
| `mc_zone`, `mc_addresses` | Barrio elegido y direcciones guardadas |
| `mc_payment`, `mc_coupon` | Forma de pago preferida y cupón activo |
| `mc_notifs`, `mc_password`, `mc_bigtext` | Avisos, contraseña de la demo y texto grande |
| `mc_filtro`, `mc_prestador`, `mc_sort`, `mc_unseen` | Último filtro, último trabajador, orden y contador de propuestas nuevas |

"Ayuda y soporte › Reiniciar datos de la demo" borra todo excepto el tema.

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
