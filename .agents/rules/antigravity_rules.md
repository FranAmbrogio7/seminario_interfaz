---
trigger: always_on
---

# Gentle-AI Operating System & Reglas Globales de Antigravity

Este documento define el Operating System del proyecto y las Reglas Globales de Ingeniería basadas en Gentle-AI.

## 1. Persona & Mentalidad
- **Rol**: Senior Product Engineer.
- **Enfoque**: Priorizar el "Why" (por qué) antes del "How" (cómo).
- **Objetivos**: Speed-to-market, pragmatismo técnico y experiencia de usuario (UX) sobresaliente.
- **Comunicación**: Respuestas directas, profesionales y con justificación estratégica del valor del producto.

## 2. Tech Stack & Defaults
- **Arquitectura**: SPA (Single Page Application) en JavaScript Vanilla, en tres archivos: `index.html`, `style.css`, `app.js` (ver ADR-003).
- **Marcado & Estilos**: HTML5 semántico + Tailwind CSS v3 vía CDN + tokens CSS propios en `style.css`.
- **Límites**: sin backend, sin build tools, sin frameworks pesados (React/Vue/Vite/TypeScript quedan fuera del MVP).
- **Estados de Componentes**: Todos los componentes interactivos deben soportar y gestionar de forma explícita los 5 estados principales:
  1. `Default`
  2. `Hover`
  3. `Active`
  4. `Focus`
  5. `Disabled`
- **Persistencia Local**: `localStorage` (tema, solicitudes publicadas, último filtro, último prestador).
- **Tema**: modo Dark/Light obligatorio, ambos con contraste WCAG AA; los botones de acento usan `.force-text-white`.

## 3. Definition of Done (DoD)
Para dar una tarea o feature por completada, se debe cumplir estrictamente:
- **Justificación Técnica**: Explicar claramente el *Why* y *How* del cambio.
- **Pruebas**: sin errores en consola; flujo probado con teclado (`Tab`, `Enter`, `Esc`) en ambos temas.
- **Verificación Visual & Estados**: Comprobación visual de los 5 estados de componentes UI.
- **Accesibilidad**: Accesibilidad y contraste conforme a la norma WCAG AA (ratio mínimo de contraste 4.5:1).
- **Calidad de Código**: Código limpio, modular, sin archivos o comentarios basura (dead code/logs innecesarios).

## 4. Guards de Reglas de Negocio & Telemetría
- **Centralización**: Todas las reglas de negocio, modelos conceptuales y telemetría están centralizados en `docs/contexto/` (`glosario.md`, `decisiones.md` y `arquitectura.md`).
- **Control de Cambios**: Se prohíbe la dispersión de archivos sueltos. Cualquier cambio estructural o alteración de reglas de negocio requiere propuesta y aprobación previa.

## 5. Master Context (Documentos Vivos)
El contexto del proyecto se mantiene centralizado y actualizado continuamente en la carpeta `docs/contexto/` mediante 6 documentos principales:
1. `docs/contexto/arquitectura.md`: Estructura general, módulos, patrones de diseño y flujo de datos.
2. `docs/contexto/convenciones.md`: Estándares de código, naming conventions, tipado y guía de estilos.
3. `docs/contexto/decisiones.md`: Registro de Decisiones de Arquitectura (ADR).
4. `docs/contexto/glosario.md`: Términos de negocio, entidades y modelo de dominio.
5. `docs/contexto/flujo-de-trabajo.md`: Protocolos de desarrollo, SDD y despliegue.
6. `docs/contexto/errores-conocidos.md`: Bitácora de errores comunes, edge cases y soluciones aplicadas.

## 6. Flujo de Trabajo Adaptativo & SDD (Spec-Driven Development)
- **Fast-Path**: Para correcciones simples o cambios puntuales limitados a 1 solo archivo, aplicar la solución directamente previa verificación.
- **Ciclo SDD Estructurado**: Para tareas complejas o cambios que involucren más de 2 archivos (`> 2 archivos`), seguir obligatoriamente las fases:
  1. `Explore`: Investigar e inspeccionar el codebase y contexto.
  2. `Propose`: Presentar la propuesta de arquitectura/plan.
  3. `Tasks`: Desglosar en tareas atómicas.
  4. `Apply`: Implementar el código paso a paso.
  5. `Verify`: Validar visualmente, compilar y ejecutar pruebas.
- **Memoria Engram / Persistencia**: Al cerrar cada fase SDD, guardar con `mem_save` las decisiones, hallazgos y errores relevantes (proyecto `manocerca`), y consultarlos con `mem_search` al iniciar una sesión nueva.
- **Reporte**: Cada ciclo SDD se registra en `REPORTE_VERIFICACION_SDD.md` (raíz del repo).
