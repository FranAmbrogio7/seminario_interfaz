# Registro de Decisiones de Arquitectura (ADR)

Este documento contiene la bitácora cronológica y numérica de todas las decisiones tomadas en **ManoCerca**.

> ⚠️ **REGLA DE GUARDIA Y CONTROL DE CAMBIOS**:
> Si una instrucción del usuario implica un cambio importante o estructural (arquitectura, paleta semántica, cambio de framework, borrado de archivos), la IA DEBE solicitar autorización explícita antes de aplicarlo y registrar la decisión aquí tras su aprobación.

---

### [ADR-001] · [2026-09-29 17:58] Adopción del Operating System Gentle-AI
- **Estado**: Aprobado.
- **Contexto**: Definir reglas globales, estándares de ingeniería y flujo SDD.
- **Decisión**: Configurar reglas `always_on` en `.agents/rules/antigravity_rules.md` y documentos de contexto centralizados.

### [ADR-002] · [2026-09-29 19:00] Definición del Producto ManoCerca (MVP)
- **Estado**: Aprobado.
- **Contexto**: Desarrollar la aplicación web para conectar clientes con prestadores de servicios del hogar.
- **Decisión**: Priorizar el núcleo funcional: Publicar solicitud ➔ Evaluar prestadores ➔ Cotizar ➔ Chat ➔ Calificar.

### [ADR-003] · [2026-09-29 19:01] Definición del Stack Técnico Frontend
- **Estado**: Aprobado.
- **Contexto**: Seleccionar tecnologías ágiles para maquetado e interacción dinámica de la SPA.
- **Decisión**: Usar HTML5 semántico, Tailwind CSS (v3 vía CDN) y JS Vanilla SPA. Se excluyen frameworks complejos (React/Vue) y backend remoto.

### [ADR-004] · [2026-09-29 19:02] Definición del Sistema de Diseño UI y Accesibilidad
- **Estado**: Aprobado.
- **Contexto**: Asegurar consistencia visual y accesibilidad en dispositivos móviles y escritorio.
- **Decisión**: Adoptar paleta semántica (Azul/Celeste/Verde/Rojo), escala tipográfica Inter, cumplimiento estricto de los 5 estados UI (`Default`, `Hover`, `Active`, `Focus`, `Disabled`) y WCAG AA ($\ge 4.5:1$).

### [ADR-005] · [2026-09-29 21:19] Protocolo de Autorización Previa para Cambios Estructurales
- **Estado**: Aprobado.
- **Contexto**: Prevenir modificaciones destructivas no coordinadas en la arquitectura del proyecto.
- **Decisión**: Requerir confirmación del usuario antes de ejecutar cualquier cambio en el stack, paleta de colores, framework o estructura de archivos.

### [ADR-006] · [2026-10-21 17:55] Poda Inteligente de Skills — De 2.644 a 53
- **Estado**: Aprobado.
- **Contexto**: Se descargaron 2.644 skills del repositorio `agentic-awesome-skills`. La mayoría eran incompatibles con el stack (React, Vue, Node.js, Python, mobile nativo, SQL, Docker, etc.).
- **Decisión**: Conservar únicamente 53 skills relevantes al stack ManoCerca (Tailwind CSS, HTML5, JS Vanilla, UX/accesibilidad, SDD). Se eliminaron ~2.591 skills incompatibles y los ~374 MB del repositorio clonado.

### [ADR-007] · [2026-10-21 19:30] Modo Dark/Light con tokens CSS
- **Estado**: Aprobado.
- **Contexto**: La consigna exige conmutador Dark/Light con contraste limpio y persistencia. El botón existía pero no tenía lógica.
- **Decisión**: Definir tokens en `:root` y redefinirlos en `html.dark` (`style.css`); mapear las utilidades Tailwind usadas a esos tokens con mayor especificidad. El tema se guarda en `localStorage` (`mc_theme`) y respeta `prefers-color-scheme` la primera vez. Un script mínimo en `<head>` aplica la clase antes del primer pintado para evitar parpadeo.

### [ADR-008] · [2026-10-21 19:30] Modales con `<dialog>` nativo
- **Estado**: Aprobado.
- **Contexto**: Se usaban `window.confirm()`, no estilizables ni coherentes con el diseño, y no existía el modal de éxito.
- **Decisión**: Usar `<dialog>` + `showModal()` (fondo inerte, `Esc` nativo) reforzado en `app.js` con trampa de foco y devolución del foco al disparador. Un modal de éxito y uno de confirmación reutilizable (cancelar trabajo, cerrar sesión).

### [ADR-009] · [2026-10-21 19:30] Formulario "Publicá tu solicitud"
- **Estado**: Aprobado.
- **Contexto**: Requisito de formulario con ≥ 3 campos validados en cliente.
- **Decisión**: 4 campos obligatorios (título ≥ 8, categoría, teléfono 8–13 dígitos, descripción ≥ 20) con mensajes en lenguaje natural, `aria-invalid` y `aria-describedby`. Al enviar: se guarda en `mc_solicitudes`, aparece en "Mis solicitudes" y se abre el modal de éxito.

### [ADR-010] · [2026-10-21 19:30] Navbar visible en mobile con menú hamburguesa
- **Estado**: Aprobado.
- **Contexto**: En mobile el header se ocultaba por completo, dejando sin acceso al selector de tema.
- **Decisión**: Mostrar el header en todas las resoluciones y agregar menú desplegable (`aria-expanded`, cierre con `Esc`). La barra inferior se mantiene como acceso rápido.

### [ADR-011] · [2026-10-21 19:30] Alineación del stack en las reglas always-on
- **Estado**: Aprobado.
- **Contexto**: `antigravity_rules.md` indicaba Vite + TypeScript, en contradicción con ADR-003.
- **Decisión**: Corregir las reglas a HTML5 + Tailwind CDN + JS Vanilla en tres archivos.
