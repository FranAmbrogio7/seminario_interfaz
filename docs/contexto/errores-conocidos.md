# Bitácora de Errores Conocidos y Gotchas (ManoCerca)

## 1. Gotchas de Usabilidad
- **Exposición Prematura de Datos Sensibles**: Mostrar dirección exacta del cliente en listas públicas genera desconfianza.
  - *Solución*: Mostrar únicamente la zona aproximada (ej: `📍 Bariloche, a 2.4 km`) hasta que el trabajo sea aceptado.
- **Acciones Destructivas sin Confirmación**: Cancelar o denunciar por toque accidental.
  - *Solución*: Implementar modales de confirmación para acciones críticas.

## 2. Soluciones de Contraste en Modo Claro
- **Texto Inlegible en Botones Primarios/Semánticos**: Usar texto oscuro o poco contrastado sobre fondos azules (`bg-blue-700`), verdes (`bg-green-600`) o rojos (`bg-red-600`).
  - *Solución*: Forzar texto blanco puro (`text-white`) asegurando una relación de contraste $\ge 4.5:1$ conforme a WCAG AA.

## 3. Problemas de Foco en Teclado
- **Remover el Foco del Navegador sin Reemplazo**: Aplicar `outline-none` sin anillo alternativo.
  - *Solución*: Utilizar siempre la clase utilitaria `focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`.
- **Uso de `<div>` Clickeables**: `<div>` o `<span>` con evento `onclick` pero sin `tabindex` ni escucha de tecla `Enter`.
  - *Solución*: Sustituir por etiquetas semánticas `<button type="button">`.

## 4. Ajustes de Responsive Móvil
- **Desborde Horizontal en Celulares**: Elementos rígidos provocan scroll horizontal no deseado.
  - *Solución*: Aplicar `overflow-x: hidden` en la etiqueta contenedora principal y asegurar `w-full max-w-full`.
- **Botones Difíciles de Tocar**: Botones pequeños en pantallas táctiles.
  - *Solución*: Garantizar tamaño mínimo del área interactiva de $44\text{px} \times 44\text{px}$ en celulares (`min-h-[44px]`).

## 5. Hallazgos del ciclo SDD del 2026-10-21
- **`text-slate-400` sobre blanco (2.6:1)**: no cumple AA.
  - *Solución*: usar `text-slate-500` (4.8:1) como mínimo para texto; en fondos oscuros, `text-slate-400` o más claro.
- **Badges verdes/rojos/ámbar con poco contraste**: `#16A34A` sobre `#f0fdf4` ≈ 3.1:1.
  - *Solución*: tokens `--c-success: #15803d`, `--c-danger: #b91c1c`, `--c-warn: #b45309`.
- **`role="listitem"` en un `<button>`**: pisa el rol de botón para lectores de pantalla.
  - *Solución*: no poner roles de estructura sobre controles; usar `<ul>/<li>` envolviendo el botón.
- **Tarjeta con `tabindex` que contiene un botón**: dos paradas de `Tab` por tarjeta.
  - *Solución*: un único control enfocable por tarjeta (el botón "Ver perfil").
- **Preflight de Tailwind CDN pisa el fondo de `button[type=submit]`**: el selector `[type='submit']` tiene la misma especificidad que `.btn-primary` y se inyecta después.
  - *Solución*: selectores `.btn.btn-primary` (mayor especificidad).
- **`history.pushState` también dentro de `popstate`**: rompía el botón "atrás".
  - *Solución*: `navigate(id, { push: false })` al responder a `popstate`.
- **Texto heredado en íconos del footer**: "f" y "▶" heredaban `text-slate-900` sobre navy (1.3:1).
  - *Solución*: `text-white` explícito en los enlaces sociales.

## 6. Hallazgos del ciclo SDD del 2026-11-09
- **`hidden` no ocultaba elementos con `.flex`**: la utilidad de Tailwind gana sobre el estilo del navegador para `[hidden]`; la fila del cupón aparecía con "−$0".
  - *Solución*: `[hidden] { display: none !important; }` en `style.css`.
- **Seguimiento mostraba un trabajo ya cancelado**: el contexto guardaba el id aunque el estado hubiera cambiado.
  - *Solución*: `trackedRequest()` solo devuelve solicitudes en estado `contratada`.
- **Listeners duplicados al volver a dibujar un panel**: borrar una dirección eliminaba dos.
  - *Solución*: cada `renderPanel()` reemplaza `#panel-body` por un nodo nuevo.
- **Avatar tapado por la portada en Perfil y Mi cuenta**: la portada es `position: relative` y se pinta encima.
  - *Solución*: `relative z-10` en el contenedor del avatar.

## 7. Mobile first: celulares chicos (2026-11-09)
- **Scroll horizontal en 320 px**: el header sumaba logo + tema + cuenta + menú con `px-6 gap-6` y empujaba la hamburguesa fuera de pantalla.
  - *Solución*: `px-4 gap-3` en mobile y el botón de cuenta del header se oculta debajo de 768 px, porque "Mi cuenta" ya está en la barra inferior.
- **Botón del buscador del inicio cortado**: un `<input>` dentro de un flex no se achica por debajo de su ancho intrínseco.
  - *Solución*: `min-w-0 w-full` en el input y en su contenedor. Regla general: todo hijo flexible que tenga texto o un input lleva `min-w-0`.
- **Títulos de solicitudes reducidos a "Pérdida …"**: el badge de estado competía con el título en la misma línea.
  - *Solución*: título con `line-clamp-2` y badge que pasa abajo con `flex-wrap`.
- **Pestañas de Mis solicitudes desbordadas**: ahora la fila se desplaza horizontalmente.
- **Zoom automático en iOS al tocar un campo**: pasa con fuentes menores a 16 px. Todos los campos usan 16 px en mobile.
- **Áreas de toque chicas**: links del footer, "Ver todas", "Eliminar", adjuntar en el chat e interruptores llevados a 44 px o más.
- *Verificación*: auditoría automática a 320, 360, 375, 390, 414, 768, 1024 y 1280 px sin scroll horizontal ni textos cortados; recorrido E2E 82/82; contraste AA sin fallos también a 320 px.
