# Convenciones de Diseño y Sistema UI (ManoCerca)

## 1. Paleta de Colores Semántica
- **Primario (Confianza)**: Azul `#1D4ED8` (`bg-blue-700`, `text-blue-700`).
- **Secundario (Acción)**: Celeste `#0EA5E9` (`bg-sky-500`).
- **Éxito**: Verde `#16A34A` (`bg-green-600`).
- **Advertencia**: Amarillo/Ámbar `#F59E0B` (`bg-amber-500`).
- **Error**: Rojo `#DC2626` (`bg-red-600`).
- **Fondo (Modo Claro)**: Slate `#F8FAFC` (`bg-slate-50`).
- **Texto Principal**: Slate `#0F172A` (`text-slate-900`).

## 2. Escala Tipográfica Modular (`Inter`)
- `H1`: 32px – 36px (`font-bold`) — Títulos principales y hero.
- `H2`: 24px – 28px (`font-semibold`) — Títulos de sección y modales.
- `H3`: 18px – 20px (`font-medium`) — Títulos de tarjetas.
- `Body`: 16px (`font-normal`) — Lectura general.
- `Body 2`: 14px (`text-slate-600`) — Detalles de tarjeta.
- `Caption`: 12px – 13px (`text-slate-500`) — Badges y etiquetas.

## 3. Los 5 Estados OBLIGATORIOS de Componentes
Todos los componentes interactivos (`button`, `input`, `select`, `card clickeable`) deben soportar:
1. `Default`: Estado inicial visible con buen contraste.
2. `Hover`: Cambio visual al posicionar el cursor (`hover:bg-blue-800`).
3. `Active`: Feedback de presión táctil al hacer click (`active:scale-95`).
4. `Focus`: Anillo de foco visible de alto contraste para teclado (`focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`).
5. `Disabled`: Opacidad al 50%, sin eventos y cursor `not-allowed` (`disabled:opacity-50 disabled:cursor-not-allowed`).

## 4. Espaciado Gestalt & Accesibilidad WCAG AA
- **Leyes de Gestalt**: Proximidad y semejanza en tarjetas agrupadas mediante paddings y márgenes consistentes (`gap-4`, `p-5`).
- **Contraste WCAG AA**: Mínimo de 4.5:1 en texto sobre fondo en toda la aplicación.
- **Tamaño Táctil Mínimo**: Área interactiva de al menos $44\text{px} \times 44\text{px}$ en botones e inputs móviles.
