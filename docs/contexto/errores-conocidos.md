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
