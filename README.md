# GLOWLY

Plataforma para descubrir salones de uñas y pedicure en **Iquitos, Loreto, Perú**. Muestra establecimientos reales, sus servicios y precios, con mapa interactivo y búsqueda.

Los datos provienen de **Supabase** (proyecto `ocwnfnothrgfvnlvdrkw`) en modo **solo lectura**, con las políticas RLS del proyecto. No hay datos de demostración escritos en el código.

---

## Requisitos

- Node.js 20 o superior (probado con Node 24)
- npm 10 o superior

## Puesta en marcha

```bash
npm install
npm run dev
```

La app queda en <http://localhost:5173>.

### Variables de entorno

Crea un archivo `.env` en la raíz (hay una plantilla en `.env.example`):

```dotenv
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key pública>
```

Notas:

- Usa **solo** la `anon key` (pública). **Nunca** la `service_role`.
- `.env` está en `.gitignore`; `.env.example` documenta los nombres sin valores.
- Si faltan las variables, la app muestra un aviso en lugar de romperse.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Verifica tipos y genera `dist/` |
| `npm run preview` | Sirve la build de producción |
| `npm run typecheck` | Solo verificación de TypeScript |

---

## Estructura

```text
src/
├── components/        # Header, chips, tarjetas, mapa, panel de detalle…
├── hooks/
│   ├── useSalones.ts  # Carga única del directorio, servicios y fuentes
│   ├── useFiltros.ts  # Búsqueda (debounce 300 ms), chips y filtros avanzados
│   └── useAhora.ts    # Hora de Lima que se refresca cada minuto
├── lib/
│   ├── env.ts         # Lectura y validación de variables de entorno
│   ├── supabase.ts    # Cliente Supabase tipado
│   ├── normalize.ts   # Búsqueda sin acentos ni mayúsculas
│   ├── horario.ts     # Parser conservador de horarios y estado abierto/cerrado
│   ├── mappers.ts     # Unión de tablas → modelo Salon
│   └── format.ts      # Precios, iniciales y enlaces
├── pages/
│   └── Explorador.tsx # Ruta `/`: lista + mapa sincronizados
├── styles/
│   └── map.css        # Tiles atenuados y marcadores personalizados
├── types/
│   ├── database.ts    # Tipos generados desde el esquema real (no editar a mano)
│   └── domain.ts      # Modelo de dominio: Salon, SalonService, PriceStatus…
├── App.tsx            # Router
├── index.css          # Tailwind + estilos base y utilidades del sistema
└── main.tsx
```

## Datos

Esquema público expuesto por Supabase:

| Objeto | Tipo | Filas |
|---|---|---|
| `pedicure_providers` | tabla | 29 |
| `pedicure_services` | tabla | 33 |
| `pedicure_sources` | tabla | 39 |
| `pedicure_directory` | vista | 29 |
| `pedicure_map` | vista | 3 |

`pedicure_directory` añade `lowest_advertised_price_pen`, calculado solo con servicios cuyo `price_status = 'anunciado'`.

Cobertura real de los datos: 3 de 29 salones tienen coordenadas, 8 tienen horario en texto libre, 12 teléfono, 4 WhatsApp y 3 un precio "desde". **No existen** calificaciones, reseñas ni fotos en la base; por eso la interfaz no los inventa.

### RLS

Las tablas y vistas son legibles con la llave anónima (política `directory_read` con `USING (true)` más `GRANT SELECT` a `anon` y `authenticated`). El esquema `pedicure_internal` no es accesible.

### Regenerar los tipos

`src/types/database.ts` se generó con `generate_typescript_types` del MCP de Supabase. Si el esquema cambia, vuelve a generarlo y reemplaza el archivo completo.

---

## Diseño

Identidad **GLOWLY · Modern Blush**. Los tokens viven en `tailwind.config.js`:

- `porcelain` `#FFF7F8` — fondo principal
- `nude` `#F4DDE5` — fondos secundarios, bordes y rellenos pasivos
- `blush` `#E6A8BE` — detalles, chips activos y elementos visuales
- `berry` `#C66D91` — acentos, anillo de foco y estados activos
- `plum` `#633B53` — textos, isotipo, botones principales y marcadores
- `wine`, `rose`, `canvas` e `ink` se conservan como alias y apuntan a la paleta nueva, para no duplicar hex en los componentes.
- Las superficies (`surface-container-*`) son tintes de Porcelana y Rosa nude para mantener la jerarquía sin introducir tonos nuevos.
- `emerald` se reserva para estados funcionales (abierto / en el mapa); no forma parte de la paleta decorativa.
- Radios: 4 / 8 / 12 / 16 / 24 px y full
- Sombras: `e1`–`e4` con tinte ciruela, según los cuatro niveles de elevación
- Tipografía: Playfair Display (títulos) y Plus Jakarta Sans (interfaz)

### Contraste

Los botones principales usan ciruela sobre porcelana (≈8.5:1) en lugar de berry sobre blanco (≈3.5:1), que no alcanza AA. Berry queda para acentos, foco visible y elementos gráficos (≥3:1).

## Recursos de marca

```text
public/
├── brand/
│   ├── glowly-logo.png             # lockup completo: símbolo + GLOWLY + descriptor
│   ├── glowly-logo-compact.png     # lockup del header: símbolo + GLOWLY
│   ├── glowly-isotipo.png
│   ├── glowly-logo-dark.png        # versiones para fondos oscuros
│   ├── glowly-logo-compact-dark.png
│   ├── glowly-isotipo-dark.png
│   ├── glowly-favicon.png          # 512 × 512
│   └── glowly-favicon-192.png
├── favicon-32.png
└── apple-touch-icon.png
```

Los PNG se obtuvieron de la lámina de referencia: recorte del lockup, fondo transparente y recoloreado de las versiones oscuras. **No existe un archivo vectorial maestro** en el proyecto; si se dispone del SVG oficial, conviene sustituir estos archivos por la misma ruta para ganar nitidez en tamaños grandes.

## Estado por etapas

- [x] **Etapa 1** — Vite + React + TS + Tailwind, `.env`, cliente Supabase y tipos reales
- [x] **Etapa 2** — Explorador desktop con mapa Leaflet, búsqueda y filtros en cliente
- [ ] **Etapa 3** — Vista de detalle `/salon/:id`
- [ ] **Etapa 4** — Hoja inferior móvil
- [ ] **Etapa 5** — Estados, accesibilidad y pulido

### Etapa 2 en práctica

- Carga los datos una sola vez y filtra en el navegador: búsqueda con debounce de 300 ms, sin acentos ni mayúsculas.
- Chips reales: **Todos · Pedicure · A domicilio · Con precio**, más filtros avanzados de precio, servicio y “abierto ahora”.
- Solo los 3 salones con coordenadas participan en el mapa y en la sincronía lista ↔ mapa; el resto muestra **Sin mapa** y se contacta desde la tarjeta.
- Horarios: si el texto no se puede interpretar, se muestra **Horario por consultar**, nunca un “Cerrado” inventado.
- Favoritos y “Soy un negocio” están visibles pero muestran **Próximamente**.
- Mapa con tiles de OpenStreetMap atenuados por CSS y atribución visible; los marcadores muestran el precio “desde” cuando existe.
