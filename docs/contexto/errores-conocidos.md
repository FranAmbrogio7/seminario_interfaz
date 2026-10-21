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
