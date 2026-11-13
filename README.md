# ManoCerca — seminario_interfaz

SPA para encontrar prestadores de servicios del hogar cerca tuyo. HTML5 semántico + Tailwind CSS (CDN) + JavaScript Vanilla, sin backend.

## Cómo ejecutarla
Abrí `index.html` en el navegador (requiere conexión para el CDN de Tailwind y la fuente Inter). También podés servirla con `python3 -m http.server` y entrar a `http://localhost:8000`.

## Qué incluye
- Navegación SPA entre 10 vistas, con botón "atrás" del navegador funcional.
- Recorrido completo del cliente: publicar → recibir propuestas → chatear → contratar → seguir el trabajo → calificar.
- Respuestas simuladas en el navegador (sin backend): propuestas, chat, llegada del trabajador.
- Mi cuenta con 6 paneles funcionales, cupón de descuento, zona por barrio y sesión.
- Modo Dark/Light y texto grande, persistidos en `localStorage`.
- Mobile first: probada desde 320 px (celulares chicos) hasta escritorio, sin scroll horizontal y con áreas de toque de 44 px.
- Accesibilidad WCAG AA: contraste ≥ 4.5:1 en ambos temas, foco visible, operable 100% con `Tab`, `Enter`, `Espacio` y `Esc`.

## Créditos
- Íconos: [Lucide](https://lucide.dev) (licencia ISC).
- Foto del inicio: [Unsplash](https://unsplash.com/photos/a-man-working-on-a-pipe-in-a-cabinet-wzIjLL4KB-4) (licencia Unsplash).

## Antes de presentar
Abrí **Mi cuenta › Ayuda y soporte › Reiniciar datos de la demo** para empezar con los datos de ejemplo.

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
