# Arquitectura del Sistema (ManoCerca)

## 1. Stack Tecnológico
- **Marcado**: HTML5 semántico.
- **Estilos**: Tailwind CSS (v3 vía CDN) con sistema de utilidades y paleta semántica.
- **Lógica & Enrutado**: JavaScript Vanilla (Single Page Application - SPA).

## 2. Router y Navegación SPA
Navegación mediante renderizado condicional de vistas/secciones dentro de un único `index.html`:
- `#view-home`: Portada (Hero), buscador de oficios y categorías.
- `#view-search`: Grilla de solicitudes y tarjetas de prestadores.
- `#view-requests`: Gestión de "Mis Solicitudes" (Cliente) y "Trabajos Disponibles" (Prestador).
- `#view-chat`: Interfaz de mensajería y negociación directa.
- `#view-profile`: Perfil con historial, reputación y badge de verificación.

## 3. Mapeo con Frames de Figma
- **Frame 1 (Portada & Buscador)**: Hero, buscador de servicios y acceso rápido por oficio.
- **Frame 2 (Catálogo & Tarjetas)**: Grilla de prestadores (`⭐ 4,8 · 37 trabajos · 📍 2.4 km`) y tarjetas de solicitudes.
- **Frame 3 (Formulario de Publicación)**: Modal interactivo con validación inmediata y feedback (*✓ Solicitud publicada*).
- **Frame 4 (Mensajería & Cotización)**: Vista de Chat para coordinar horario, presupuesto y confirmación.
- **Frame 5 (Reseñas & Calificación)**: Modal de evaluación al finalizar el servicio.

## 4. Qué NO Existe (Límites del MVP)
- **NO Backend de Servidor**: Sin Node.js, Express ni Python.
- **NO Bases de Datos Remotas**: Sin MySQL, PostgreSQL ni Firebase (persistencia simulada en LocalStorage/IndexedDB).
- **NO Pasarelas de Pago Reales**: Sin integración bancaria ni MercadoPago.
- **NO Geolocalización en Tiempo Real**: Coordenadas y distancias simuladas.
- **NO Apps Nativas**: Exclusivamente web accesible mediante navegador.
