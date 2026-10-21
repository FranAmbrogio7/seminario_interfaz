# REPORTE DE VERIFICACIÓN SDD — ManoCerca

> Bitácora del ciclo adaptativo de desarrollo (Spec-Driven Development) aplicado para cerrar el Desafío Integrador.
> Reglas aplicadas: `.agents/rules/antigravity_rules.md` (always-on). Contexto: `docs/contexto/`.

| Dato | Valor |
| :--- | :--- |
| Proyecto | ManoCerca — SPA de servicios del hogar |
| Fecha del ciclo | 2026-10-21 |
| Modalidad | **SDD completo** (el cambio involucra más de 2 archivos) |
| Archivos tocados | `index.html`, `style.css`, `app.js`, `.agents/rules/antigravity_rules.md`, `docs/contexto/{arquitectura,decisiones,errores-conocidos}.md`, este reporte |

---

## Fase 1 · Explore
Se auditó el repositorio contra el Blueprint Técnico y la rúbrica de 100 puntos.

| Requisito | Estado inicial | Hallazgo |
| :--- | :--- | :--- |
| Navbar fija con logo, enlaces y Dark/Light | ⚠️ Parcial | Botón de tema sin lógica; "Cómo funciona" sin destino; header oculto en mobile. |
| Hero con título, subtítulo y CTA | ⚠️ Parcial | Sin CTA primario. |
| Catálogo 4–6 tarjetas (imagen, badge, precio, botón) | ⚠️ Parcial | 4 tarjetas sin badge de categoría ni `<img>`; tarjeta con dos paradas de foco. |
| Formulario ≥ 3 campos validados + modal accesible | ❌ Falta | No existía formulario ni modal; se usaba `window.confirm()`. |
| 5 estados en todos los controles | ⚠️ Parcial | Faltaban Active/Disabled en chips, íconos, estrellas, enlaces. |
| Teclado: Tab / Enter / Esc | ⚠️ Parcial | Sin `Esc`, sin skip-link, sin gestión de foco al cambiar de vista. |
| Contraste AA en ambos modos + `.force-text-white` | ❌ Falta | `text-slate-400` sobre blanco 2.6:1; badges ≈ 3:1; sin modo oscuro; sin la clase. |
| Semántica HTML5 + `alt` | ⚠️ Parcial | Ningún `<img>`; `role="listitem"` sobre botones. |
| `localStorage` | ⚠️ Parcial | Solo guardaba una sesión simulada. |
| `docs/contexto/` (6 docs) | ✅ | Desactualizados respecto del código (vistas inexistentes). |
| `antigravity_rules.md` always-on | ⚠️ | Decía "Vite + TypeScript", contradiciendo ADR-003. |
| `REPORTE_VERIFICACION_SDD.md` | ❌ Falta | — |

## Fase 2 · Propose
1. Sistema de **tokens CSS** (`:root` / `html.dark`) para que un solo cambio de clase invierta toda la paleta manteniendo AA (ADR-007).
2. **`<dialog>` nativo** para modales: foco atrapado y `Esc` gratis, reforzados por JS (ADR-008).
3. **Formulario de 4 campos** en el inicio que persiste en `localStorage` y abre el modal de éxito (ADR-009).
4. **Header visible en mobile** con menú hamburguesa (ADR-010).
5. Corregir las **reglas always-on** al stack real (ADR-011).

Restricciones respetadas: sin backend, sin frameworks, Tailwind solo por CDN, tres archivos de código.

## Fase 3 · Tasks
- [x] T1 — Tokens de diseño y modo oscuro en `style.css`; toggle + persistencia en `app.js`.
- [x] T2 — Foco `:focus-visible` único de 3 px y alto contraste; skip-link.
- [x] T3 — 5 estados (Default/Hover/Active/Focus/Disabled) en `.btn*`, `.btn-icon`, `.filter-chip`, `.cat-chip`, `.nav-link`, `.bnav-btn`, `.star-rate`, `.settings-row`, `.input`.
- [x] T4 — Estados Disabled reales: "Confirmar y contratar", "Enviar calificación", botón de enviar chat, chip "Jardinería" sin prestadores.
- [x] T5 — Hero con CTA primario y secundario; enlaces de salto suave (`data-scroll`).
- [x] T6 — Catálogo dinámico de 6 tarjetas con `<img alt>`, badge de categoría, disponibilidad, precio y botón.
- [x] T7 — Perfil y contratación se cargan según el prestador elegido.
- [x] T8 — Formulario validado (título, servicio, teléfono, descripción) con `aria-invalid` y mensajes en lenguaje natural.
- [x] T9 — Modal de éxito y modal de confirmación reutilizable (reemplaza `confirm()`).
- [x] T10 — Menú mobile con `aria-expanded` y cierre con `Esc`.
- [x] T11 — Pestañas de "Mis solicitudes" que filtran (flechas ← →) e incluyen las solicitudes publicadas.
- [x] T12 — Contraste: tokens AA, clase `.force-text-white` en todos los botones de acento.
- [x] T13 — Router: foco en la vista nueva y botón "atrás" del navegador funcional.
- [x] T14 — Actualizar `docs/contexto/`, reglas y este reporte.

## Fase 4 · Apply
Implementado en `index.html`, `style.css` y `app.js` (ver diff del commit). Decisiones registradas como ADR-007 a ADR-011 en `docs/contexto/decisiones.md`; nuevos gotchas en `docs/contexto/errores-conocidos.md` §5.

## Fase 5 · Verify (Definition of Done)
Verificación automatizada con Chromium headless (Playwright) a 1280 px y 375 px, en modo claro y oscuro, recorriendo las 10 vistas.

| Verificación | Resultado |
| :--- | :--- |
| Errores en consola | ✅ 0 |
| Scroll horizontal (375 px y 1280 px) | ✅ No hay |
| Contraste de todo texto visible ≥ 4.5:1 (≥ 3:1 en texto grande), 10 vistas × 2 temas × 2 anchos | ✅ 0 fallos (tras corregir íconos del footer) |
| Primer `Tab` → skip-link; anillo de foco | ✅ `outline: 3px solid` |
| Envío vacío del formulario | ✅ 4 mensajes de error y foco en el primer campo inválido |
| Envío válido | ✅ Modal abierto, foco dentro del modal |
| Trampa de foco (6 × `Tab`) | ✅ El foco no sale del modal |
| `Esc` cierra el modal | ✅ y devuelve el foco a "Publicar solicitud" |
| Persistencia | ✅ Solicitud guardada en `mc_solicitudes` y visible en "Mis solicitudes"; tema guardado en `mc_theme` |
| Modal de confirmación (cancelar trabajo) | ✅ Abre con foco en "Volver"; `Esc` devuelve el foco al botón |
| Botón "atrás" del navegador | ✅ Vuelve a la vista anterior |
| Disabled real en chips | ✅ "Jardinería" |
| Selección de prestador | ✅ El perfil muestra al prestador elegido |
| `<img>` sin `alt` | ✅ 0 |
| Menú mobile por teclado | ✅ `Enter` abre y enfoca el primer link; `Esc` cierra y devuelve el foco |

**Resultado del ciclo: APROBADO.**

---

## Memoria Engram
Al cerrar el ciclo se persisten estas observaciones con `mem_save` (proyecto `manocerca`):

| # | Título | Tipo | Contenido |
| :--- | :--- | :--- | :--- |
| 1 | Tema Dark/Light con tokens | decision | Tokens en `:root`/`html.dark`, persistencia `mc_theme`, script anti-parpadeo en `<head>` (ADR-007). |
| 2 | Modales con `<dialog>` | decision | `showModal()` + trampa de foco + devolución del foco; reemplaza `confirm()` (ADR-008). |
| 3 | Formulario Publicar solicitud | decision | 4 campos validados, guarda en `mc_solicitudes`, abre modal de éxito (ADR-009). |
| 4 | Preflight Tailwind CDN vs `.btn-primary` | bugfix | `[type=submit]` pisa el fondo; usar `.btn.btn-primary`. |
| 5 | Contraste mínimo | pattern | Texto ≥ `slate-500` sobre claro; badges con tokens AA; `.force-text-white` en acentos. |
| 6 | Cierre ciclo SDD 2026-10-21 | session | Ciclo aprobado; pendientes del equipo: link de Figma y video demo. |

Para recuperarlas en una sesión nueva: `mem_search "manocerca"`.

## Pendientes del equipo (fuera del código)
- [ ] Enlace o capturas del wireframe en Figma.
- [ ] Video demo de 2–3 minutos: navegación SPA, modal, prueba por teclado y cambio de tema.
