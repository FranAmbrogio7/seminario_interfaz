---
name: tailwind-ui
description: >-
  Guía y buenas prácticas de maquetado con Tailwind CSS v3 para la plataforma ManoCerca,
  garantizando mobile-first, paleta semántica y 5 estados de componentes UI.
---

# Tailwind CSS UI Skill — ManoCerca

## 1. Paleta Semántica Configurada
- **Primario**: `bg-blue-700` (`#1D4ED8`), `text-blue-700`
- **Secundario**: `bg-sky-500` (`#0EA5E9`), `text-sky-500`
- **Éxito**: `bg-green-600` (`#16A34A`), `text-green-600`
- **Advertencia**: `bg-amber-500` (`#F59E0B`), `text-amber-500`
- **Error**: `bg-red-600` (`#DC2626`), `text-red-600`
- **Fondo**: `bg-slate-50` (`#F8FAFC`)
- **Texto**: `text-slate-900` (`#0F172A`)

## 2. Anatomía de Componentes (5 Estados)
```html
<button class="px-5 py-3 bg-blue-700 text-white font-medium rounded-lg shadow-sm
               hover:bg-blue-800
               active:scale-95 transition-all
               focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2
               disabled:opacity-50 disabled:cursor-not-allowed">
  Publicar solicitud
</button>
```

## 3. Grilla Responsive Mobile-First
- Mobile: `grid grid-cols-1 gap-4`
- Desktop: `md:grid-cols-2 lg:grid-cols-3 gap-6`
