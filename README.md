# ManoCerca — seminario_interfaz

SPA para encontrar prestadores de servicios del hogar cerca tuyo. HTML5 semántico + Tailwind CSS (CDN) + JavaScript Vanilla, sin backend.

## Cómo ejecutarla
Abrí `index.html` en el navegador (requiere conexión para el CDN de Tailwind y la fuente Inter). También podés servirla con `python3 -m http.server` y entrar a `http://localhost:8000`.

## Qué incluye
- Navegación SPA entre 10 vistas, con botón "atrás" del navegador funcional.
- Modo Dark/Light persistido en `localStorage`.
- Catálogo dinámico de 6 prestadores con filtros por categoría y búsqueda.
- Formulario "Publicá tu solicitud" con 4 campos validados y modal accesible de confirmación.
- Accesibilidad WCAG AA: contraste ≥ 4.5:1 en ambos temas, foco visible, operable 100% con `Tab`, `Enter` y `Esc`.

## Prueba rápida por teclado
1. `Tab` → aparece "Saltar al contenido principal".
2. Navegá hasta "Publicar solicitud" y presioná `Enter` con el formulario vacío: se marcan los errores.
3. Completá los campos y enviá: se abre el modal; `Tab` queda atrapado dentro y `Esc` lo cierra.
4. Activá el botón de luna/sol para cambiar el tema y recargá: se mantiene.

## Estructura
```
index.html  style.css  app.js
docs/contexto/               Master Context (6 documentos)
.agents/rules/antigravity_rules.md   Reglas always-on
REPORTE_VERIFICACION_SDD.md  Bitácora del ciclo SDD
```
