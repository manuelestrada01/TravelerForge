# CLAUDE.md — LevelUp: Visor Académico Gamificado

## Contexto del Proyecto

**LevelUp** es el visor académico gamificado del proyecto institucional *"Del Taller Artesanal al Mundo Digital"* (Arq. Lucas Bardelli, 2026), implementado en la **Escuela Cristiana Evangélica Argentina**.

- **Nivel:** Educación Secundaria Técnica – Modalidad Técnico Profesional
- **Espacio curricular:** Tecnología de la Representación (1°, 2° y 3° año)
- **Docentes:** Lucas Bardelli, Jazmin Soza Giraldez, Ignacio Salvatierra
- **Año:** 2026

El sistema **no reemplaza** la evaluación institucional. Es una **capa de síntesis y lectura** que permite al estudiante visualizar su recorrido, reconocer su esfuerzo y asumir un rol activo en su aprendizaje.

---

## Stack Técnico

- **Frontend:** Next.js (App Router) + TypeScript
- **Estilos:** Tailwind CSS — paleta oscura (verde bosque + dorado ámbar)
- **Fuentes:** serif elegante para títulos (Playfair Display), sans-serif limpio para cuerpo (Inter)
- **Fuente de datos:** Google Classroom API (read-only) — entregas, fechas, estados, roster
- **Base de datos:** Supabase (Postgres) — fuente de verdad para todo el estado gamificado
- **Auth:** Google OAuth (alumnos y docentes se autentican con cuenta institucional)
- **Google Sheets:** ~~eliminado~~ — no se usa en ninguna parte del sistema

---

## Diseño Visual (Figma)

La UI sigue estrictamente el diseño del Figma compartido. Características clave:

### Paleta de colores
- Fondo principal: `#0d1a0f` (verde muy oscuro / negro bosque)
- Superficie cards: `#1a2e1c` / `#1e3320`
- Acento primario: `#c9a227` (dorado ámbar)
- Acento secundario: `#8fbc8f` (verde claro)
- Texto principal: `#f5f0e8` (blanco cálido)
- Texto secundario: `#9aab8a`
- Strikes / peligro: `#c0392b`

### Layout alumno
- **Sidebar izquierdo** (íconos): Dashboard, Misiones, Bitácora, Insignias, Clases Formativas
- **Header:** Logo "Visor Académico" + tabs de materias + notificaciones + avatar
- **Hero section:** Banner full-width temático, saludo personalizado con nombre y clase activa
- **Dashboard principal:** grid de cards — XP, Strikes, Actividad reciente, Talentos activos, Clases Formativas

### Layout admin/docente (`/teacher`)
- **Sidebar izquierdo** (íconos, 64px): Dashboard, Cursos, Configuración macro
- **Header:** "Visor Académico — Panel Docente" + nombre docente + logout

---

## Roles del Sistema

### Alumno
- Accede a `/` (dashboard)
- Solo puede ver cursos que el docente habilitó explícitamente
- Puede elegir y cambiar su Clase Formativa (con registro histórico)
- Ve su XP, nivel, strikes, actividad, talentos

### Docente / Admin (`/teacher`)
- Accede a `/teacher`
- Detectado por: (1) tabla `courses` en Supabase, o (2) Classroom API (`teacherId: "me"`)
- Gestiona cursos, configura tipos de producción, sincroniza con Classroom
- **Habilita** cursos para que los alumnos puedan verlos
- Ejecuta excepciones sobre alumnos (ver Panel Docente)

---

## Navegación Panel Docente

### Ventana: Dashboard (`/teacher`)
- Stats generales: cursos activos, total alumnos, alumnos en riesgo
- Última sincronización

### Ventana: Cursos (`/teacher/courses`)
- Lista de cursos registrados + botón "Agregar curso de Classroom"
- Al agregar: seleccionar de los cursos disponibles en Classroom, asignar año curricular
- El docente puede habilitar/deshabilitar la visibilidad del curso para alumnos

#### Dentro de cada curso (`/teacher/courses/[id]`), 4 sub-secciones:

**1. Resumen Académico**
- Gráficos y estadísticas del curso
- Cantidad de alumnos en riesgo / bloqueados
- Top de Clases Formativas (ranking por cantidad de alumnos)
- Distribución de XP, niveles, strikes

**2. Panel Docente**
- Tabla de alumnos con XP, nivel, strikes, estado
- Sincronizar datos desde Classroom
- Acciones sobre uno o más alumnos:
  - Forzar desbloqueo de bimestre
  - Anular strike / forzar strike
  - Habilitar evaluación extraordinaria
  - Habilitar evento (especificar XP del evento)
  - Registrar Calidad Técnica Destacada (XP bonus manual)
  - Anular talento / forzar talento
- Todas las acciones quedan registradas en `teacher_exceptions`

**3. Lista de Alumnos**
- Vista detallada por alumno: historial de entregas, strikes activos, talentos, distinciones
- Registro histórico de Clases Formativas elegidas por el alumno

**4. Configuración de Administrador (por curso)**
- **XP por tipo de producción:** el admin asigna XP base a cada tipo. Los tipos se generan dinámicamente desde las categorías de calificación de Classroom (no son fijos: A4/A3/CAL son ejemplos, no hardcoded)
- **Niveles por título y rol:** configurar umbrales de XP → título → rol simbólico
- **Talentos:** crear/editar talentos (Título, Atributos, Descripción, Condiciones de otorgamiento). El sistema los otorga automáticamente según condiciones. El mismo talento se otorga solo una vez.
- **Fechas de bimestre:** definir rangos de fechas para B1, B2, B3, B4. El sistema determina el bimestre activo en tiempo real según fecha y hora actual.

### Ventana: Configuración Macro (`/teacher/config`)
- **Clases Formativas:** gestión completa en forma de Cards editables
  - Campos: Título de Clase, Inspiración bíblica, Atributos (máx. 2), Descripción
  - El admin publica/despublica cada clase
  - Solo las clases publicadas aparecen disponibles para que el alumno elija
  - Son una capa simbólica — no afectan la nota institucional

---

## Lógica de Negocio Central

### Sistema XP (Experiencia)

La XP **nunca se pierde** y es acumulativa a lo largo del ciclo lectivo.

**Fuentes de XP:**
| Tipo | Condición | XP |
|------|-----------|-----|
| XP Base | Entrega en término | configurada por admin por tipo |
| XP Silenciosa | Entrega ≥ 24h antes del deadline | bonus sobre base |
| Calidad Técnica Destacada | Ingreso manual desde Panel Docente | bonus adicional |
| Evento | Habilitado por docente (inter/intra-curso) | XP especificada por docente |

**Tipos de producción:**
- Son **dinámicos** — se extraen de las categorías de calificación de Classroom
- El docente los mapea y el admin les asigna XP base en la Configuración de Administrador
- Ejemplos típicos: `A4`, `A3`, `CAL`, `CAD`, `EVA`, `EVT` — pero pueden variar por curso

### Sistema Strikes (Incumplimientos)

Los strikes **no vencen solos** y **nunca compensan XP**.

**Causas de strike (+1 cada una, independiente):**
- No entrega → +1 strike
- Entrega tarde → +1 strike
- Falta de material → +1 strike

**Límite:** 3 strikes activos → **bloqueo automático de bimestre**

### Bloqueo de Bimestre

Al bloquearse:
- XP congelada
- Nivel congelado
- Entregas registradas pero sin efecto positivo

**Desbloqueo:** entregar todo lo pendiente + aprobar EVA presencial (lámina A4 en tablero, en el día).

| Acción | Efecto |
|--------|--------|
| EVA aprobada | Se reinician strikes |
| EVA desaprobada | Continúa bloqueo |

El docente puede forzar desbloqueo manualmente desde el Panel Docente (queda registrado).

### Bimestres

- El docente define **rangos de fechas** para B1, B2, B3, B4 en la Configuración de Administrador
- El sistema detecta automáticamente el bimestre activo según la fecha/hora actual
- El campo `bimestre_activo` en `courses` refleja el bimestre actual calculado

### Niveles y Roles

- Los niveles se alcanzan por umbrales de XP configurados en la Configuración de Administrador
- **No hay retroceso de nivel**
- Cada nivel tiene un título y rol simbólico, configurables por el admin
- Por defecto en `xp/engine.ts` hay 36 niveles con títulos narrativos

### Visibilidad de Cursos

- Un alumno **solo puede ver** un curso si el docente lo habilitó explícitamente
- Campo `active` en tabla `courses` controla esto
- El alumno puede estar inscripto en Classroom pero no ver el curso en LevelUp hasta que el docente lo habilite

---

## Clases Formativas

Las clases son **personales, voluntarias y dinámicas** — pueden cambiar con el tiempo.

- Son una capa simbólica, **no afectan la nota institucional**
- La base de clases se configura desde **Configuración Macro** del panel docente
- Cada clase tiene: Título, Inspiración bíblica, Atributos (máx. 2), Descripción
- El admin **publica** las clases disponibles; el alumno elige entre las publicadas
- Los cambios de clase a lo largo del ciclo quedan **registrados históricamente**
- Tanto el alumno como el admin pueden consultar el historial de clases elegidas

**Clases base actuales (editables vía Configuración Macro):**
| Clase | Inspiración | Atributos |
|-------|-------------|-----------|
| Bárbaro | Sansón | Fuerza · Constitución |
| Bardo | David | Carisma · Destreza |
| Clérigo | Samuel | Sabiduría · Carisma |
| Paladín | Moisés | Fuerza · Carisma |
| Druida | Noé | Inteligencia · Sabiduría |
| Erudito | Salomón | Inteligencia · Sabiduría |

**Atributos del sistema:** Fuerza · Constitución · Destreza · Carisma · Sabiduría · Inteligencia

---

## Talentos

Habilidades concretas configuradas y gestionadas desde la **Configuración de Administrador**.

- Cada talento tiene: Título, Atributos (máx. 2), Descripción, Condiciones de otorgamiento
- El sistema los otorga automáticamente cuando el alumno cumple las condiciones
- El docente puede forzar o anular talentos manualmente desde el Panel Docente
- **El mismo talento se otorga una sola vez** (no se acumula)

**Talentos base actuales (editables):**
- Mano Firme — Destreza · Constitución
- Perseverancia Activa — Sabiduría · Constitución
- Espíritu Colaborador — Sabiduría · Carisma
- Resistencia al Error — Constitución · Fuerza
- Claridad Comunicativa — Carisma · Inteligencia
- Dominio Instrumental — Destreza · Fuerza
- Constancia Silenciosa — Destreza · Constitución
- Atención al Detalle — Destreza · Sabiduría
- Autogestión del Aprendizaje — Inteligencia · Constitución
- Liderazgo Servicial — Carisma · Sabiduría
- Enfoque y Concentración — Destreza · Sabiduría

---

## Arquitectura de Datos

### Flujo principal
```
Classroom API (read-only)
       ↓  sync on-demand (TTL 5 min por curso)
  Sync Engine (lib/sync/classroom.ts)
       ↓  computar XP, strikes, niveles
  XP Engine (xp/engine.ts)
       ↓  persistir
  Supabase (fuente de verdad)
       ↓  leer
  Student Dashboard  /  Teacher Dashboard
```

### Tablas Supabase
| Tabla | Propósito |
|-------|-----------|
| `student_profiles` | Perfil alumno: clase formativa activa, display_name |
| `courses` | Cursos registrados por docentes |
| `coursework_config` | Mapeo tarea Classroom → tipo de producción |
| `deliveries` | Entregas sincronizadas y computadas |
| `strikes` | Strikes individuales (no vencen, se anulan) |
| `student_game_state` | Estado gamificado cacheado (XP, nivel, strikes, bloqueado) |
| `talent_grants` | Talentos otorgados |
| `distinction_grants` | Distinciones/insignias otorgadas |
| `teacher_exceptions` | Registro de todas las excepciones docentes |

### Motor de Sincronización
- `lib/sync/classroom.ts` — sync on-demand con TTL 5 min
- `lib/supabase/courses.ts` — CRUD cursos y coursework_config
- `lib/supabase/game.ts` — game state, deliveries, strikes
- `lib/supabase/teacher.ts` — talents, distinctions, exceptions
- `xp/engine.ts` — cálculo puro de XP y niveles (funciones sin side effects)

---

## Estructura de Carpetas (Screaming Architecture)

```
levelup/
├── app/                        # Routing ONLY (Next.js App Router)
│   ├── (auth)/login/
│   ├── (dashboard)/            # Rutas alumno
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── distinciones/
│   │   ├── laminas/
│   │   ├── misiones/
│   │   └── clases-formativas/
│   ├── teacher/                # Rutas panel docente/admin
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Dashboard docente
│   │   ├── courses/
│   │   │   ├── page.tsx        # Lista + agregar cursos
│   │   │   └── [id]/
│   │   │       ├── page.tsx    # Detalle curso (Panel Docente)
│   │   │       └── setup/      # Configurar tipos de tareas
│   │   ├── students/[email]/   # Detalle alumno
│   │   └── config/             # Configuración Macro (Clases Formativas)
│   └── api/
│       ├── courses/
│       └── students/[email]/
│
├── dashboard/                  # Feature: resumen académico alumno
├── xp/                         # Dominio: XP y niveles (engine.ts)
├── strikes/                    # Dominio: strikes
├── clases-formativas/          # Feature: clases formativas alumno
├── talentos/                   # Feature: talentos
├── distinciones/               # Feature: insignias
├── laminas/                    # Feature: entregas
├── misiones/                   # Feature: misiones
├── docente/                    # Feature: componentes panel docente
│   └── components/
├── layout/                     # Shared: Sidebar, Header (alumno)
├── shared/ui/                  # Primitivos UI reutilizables
├── lib/
│   ├── google/classroom.ts     # Classroom API (read-only)
│   ├── supabase/               # courses, game, teacher, profiles
│   └── sync/classroom.ts       # Motor de sincronización
├── supabase/migrations/        # SQL migrations
└── public/assets/
```

---

## Convenciones de Código

- **Arquitectura:** Screaming Architecture — carpetas raíz por dominio/feature, `app/` solo routing
- **Tailwind content paths:** cada nuevo dominio raíz debe agregarse en `tailwind.config.ts` → `content[]`
- TypeScript estricto (`strict: true`)
- Componentes en PascalCase, archivos en kebab-case
- Server Components por defecto; Client Components solo cuando sea necesario (`"use client"`)
- Tailwind para todo el styling — sin CSS modules salvo excepciones justificadas
- Nombres de variables/funciones en inglés; contenido/copy en español
- No agregar comentarios salvo lógica no obvia
- Tipos e interfaces definidos en el `types.ts` de su dominio correspondiente
- **`redirect()` de Next.js lanza NEXT_REDIRECT** — nunca envolverlo en try-catch sin re-lanzar

---

## Terminología del Proyecto

| Término en sistema | Término en UI |
|--------------------|---------------|
| XP | Resonancia de Experiencia |
| Strike | Strike Académico |
| Level | Nivel |
| Badge/Insignia | Distinción |
| Class | Clase Formativa |
| Talent | Talento Activo |
| Activity feed | Fragmentos de Actividad |
| Bimester lock | Bloqueo de Bimestre |
| Admin panel | Panel Docente / Visor Admin |

---

## Notas Importantes

- El foco UX es el **alumno** (vista principal). El docente tiene panel separado.
- La identidad visual es **bosque oscuro + alquimia medieval** — evitar elementos que rompan esa atmósfera.
- El hero de la home muestra siempre la **clase activa del alumno** con su nombre personalizado.
- Los strikes se muestran como íconos X (activos en rojo, vacíos/grises).
- La XP bar muestra progreso al siguiente nivel.
- Toda la app debe ser **responsive** (mobile-first).
- Google Sheets **no existe** en el sistema — no crear ninguna integración con Sheets.
- Los tipos de producción **no son hardcoded** — se configuran por admin y derivan de Classroom.
- Las Clases Formativas son editables por el admin — el código no debe asumir las 6 clases fijas.
- Los talentos son editables por el admin — el array `ALL_TALENTS` en `talentos/types.ts` es solo el estado inicial, eventualmente debe leerse desde Supabase.

<!-- autoskills:start -->

Summary generated by `autoskills`. Check the full files inside `.claude/skills`.

## Accessibility (a11y)

Audit and improve web accessibility following WCAG 2.2 guidelines. Use when asked to "improve accessibility", "a11y audit", "WCAG compliance", "screen reader support", "keyboard navigation", or "make accessible".

- `.claude/skills/accessibility/SKILL.md`
- `.claude/skills/accessibility/references/A11Y-PATTERNS.md`: Practical, copy-paste-ready patterns for common accessibility requirements. Each pattern is self-contained and linked from the main [SKILL.md](../SKILL.md).
- `.claude/skills/accessibility/references/WCAG.md`

## Deploy to Vercel

Deploy applications and websites to Vercel. Use when the user requests deployment actions like "deploy my app", "deploy and give me the link", "push this live", or "create a preview deployment".

- `.claude/skills/deploy-to-vercel/SKILL.md`

## Design Thinking

Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beaut...

- `.claude/skills/frontend-design/SKILL.md`

## GSAP Core

Official GSAP skill for the core API — gsap.to(), from(), fromTo(), easing, duration, stagger, defaults, gsap.matchMedia() (responsive, prefers-reduced-motion). Use when the user asks for a JavaScript animation library, animation in React/Vue/vanilla, GSAP tweens, easing, basic animation, respons...

- `.claude/skills/gsap-core/SKILL.md`

## GSAP with Vue, Svelte, and Other Frameworks

Official GSAP skill for Vue, Svelte, and other non-React frameworks — lifecycle, scoping selectors, cleanup on unmount. Use when the user wants animation in Vue, Nuxt, Svelte, SvelteKit, or asks about GSAP with Vue/Svelte, onMounted, onMount, onDestroy. Recommend GSAP for framework animation unle...

- `.claude/skills/gsap-frameworks/SKILL.md`

## GSAP Performance

Official GSAP skill for performance — prefer transforms, avoid layout thrashing, will-change, batching. Use when optimizing GSAP animations, reducing jank, or when the user asks about animation performance, FPS, or smooth 60fps.

- `.claude/skills/gsap-performance/SKILL.md`

## GSAP Plugins

Official GSAP skill for GSAP plugins — registration, ScrollToPlugin, ScrollSmoother, Flip, Draggable, Inertia, Observer, SplitText, ScrambleText, SVG and physics plugins, CustomEase, EasePack, CustomWiggle, CustomBounce, GSDevTools. Use when the user asks about a GSAP plugin, scroll-to, flip anim...

- `.claude/skills/gsap-plugins/SKILL.md`

## GSAP with React

Official GSAP skill for React — useGSAP hook, refs, gsap.context(), cleanup. Use when the user wants animation in React or Next.js, or asks about GSAP with React, useGSAP, or cleanup on unmount. Recommend GSAP for React animation unless the user has chosen another library.

- `.claude/skills/gsap-react/SKILL.md`

## GSAP ScrollTrigger

Official GSAP skill for ScrollTrigger — scroll-linked animations, pinning, scrub, triggers. Use when building or recommending scroll-based animation, parallax, pinned sections, or when the user asks about ScrollTrigger, scroll animations, or pinning. Recommend GSAP for scroll-driven animation whe...

- `.claude/skills/gsap-scrolltrigger/SKILL.md`

## GSAP Timeline

Official GSAP skill for timelines — gsap.timeline(), position parameter, nesting, playback. Use when sequencing animations, choreographing keyframes, or when the user asks about animation sequencing, timelines, or animation order (in GSAP or when recommending a library that supports timelines).

- `.claude/skills/gsap-timeline/SKILL.md`

## gsap.utils

Official GSAP skill for gsap.utils — clamp, mapRange, normalize, interpolate, random, snap, toArray, wrap, pipe. Use when the user asks about gsap.utils, clamp, mapRange, random, snap, toArray, wrap, or helper utilities in GSAP.

- `.claude/skills/gsap-utils/SKILL.md`

## Next.js Best Practices

Next.js best practices - file conventions, RSC boundaries, data patterns, async APIs, metadata, error handling, route handlers, image/font optimization, bundling

- `.claude/skills/next-best-practices/SKILL.md`
- `.claude/skills/next-best-practices/async-patterns.md`: In Next.js 15+, `params`, `searchParams`, `cookies()`, and `headers()` are asynchronous.
- `.claude/skills/next-best-practices/bundling.md`: Fix common bundling issues with third-party packages.
- `.claude/skills/next-best-practices/data-patterns.md`: Choose the right data fetching pattern for each use case.
- `.claude/skills/next-best-practices/debug-tricks.md`: Tricks to speed up debugging Next.js applications.
- `.claude/skills/next-best-practices/directives.md`: These are React directives, not Next.js specific.
- `.claude/skills/next-best-practices/error-handling.md`: Handle errors gracefully in Next.js applications.
- `.claude/skills/next-best-practices/file-conventions.md`: Next.js App Router uses file-based routing with special file conventions.
- `.claude/skills/next-best-practices/font.md`: Use `next/font` for automatic font optimization with zero layout shift.
- `.claude/skills/next-best-practices/functions.md`: Next.js function APIs.
- `.claude/skills/next-best-practices/hydration-error.md`: Diagnose and fix React hydration mismatch errors.
- `.claude/skills/next-best-practices/image.md`: Use `next/image` for automatic image optimization.
- `.claude/skills/next-best-practices/metadata.md`: Add SEO metadata to Next.js pages using the Metadata API.
- `.claude/skills/next-best-practices/parallel-routes.md`: Parallel routes render multiple pages in the same layout. Intercepting routes show a different UI when navigating from within your app vs direct URL access. Together they enable modal patterns.
- `.claude/skills/next-best-practices/route-handlers.md`: Create API endpoints with `route.ts` files.
- `.claude/skills/next-best-practices/rsc-boundaries.md`: Detect and prevent invalid patterns when crossing Server/Client component boundaries.
- `.claude/skills/next-best-practices/runtime-selection.md`: Use the default Node.js runtime for new routes and pages. Only use Edge runtime if the project already uses it or there's a specific requirement.
- `.claude/skills/next-best-practices/scripts.md`: Loading third-party scripts in Next.js.
- `.claude/skills/next-best-practices/self-hosting.md`: Deploy Next.js outside of Vercel with confidence.
- `.claude/skills/next-best-practices/suspense-boundaries.md`: Client hooks that cause CSR bailout without Suspense boundaries.

## Cache Components (Next.js 16+)

Next.js 16 Cache Components - PPR, use cache directive, cacheLife, cacheTag, updateTag

- `.claude/skills/next-cache-components/SKILL.md`

## Upgrade Next.js

Upgrade Next.js to the latest version following official migration guides and codemods

- `.claude/skills/next-upgrade/SKILL.md`

## Node.js Backend Patterns

Build production-ready Node.js backend services with Express/Fastify, implementing middleware patterns, error handling, authentication, database integration, and API design best practices. Use when creating Node.js servers, REST APIs, GraphQL backends, or microservices architectures.

- `.claude/skills/nodejs-backend-patterns/SKILL.md`
- `.claude/skills/nodejs-backend-patterns/references/advanced-patterns.md`: Advanced patterns for dependency injection, database integration, authentication, caching, and API response formatting.

## Node.js Best Practices

Node.js development principles and decision-making. Framework selection, async patterns, security, and architecture. Teaches thinking, not copying.

- `.claude/skills/nodejs-best-practices/SKILL.md`

## SEO optimization

Optimize for search engine visibility and ranking. Use when asked to "improve SEO", "optimize for search", "fix meta tags", "add structured data", "sitemap optimization", or "search engine optimization".

- `.claude/skills/seo/SKILL.md`

## Supabase Postgres Best Practices

Postgres performance optimization and best practices from Supabase. Use this skill when writing, reviewing, or optimizing Postgres queries, schema designs, or database configurations.

- `.claude/skills/supabase-postgres-best-practices/SKILL.md`
- `.claude/skills/supabase-postgres-best-practices/references/_contributing.md`: This document provides guidelines for creating effective Postgres best practice references that work well with AI agents and LLMs.
- `.claude/skills/supabase-postgres-best-practices/references/_sections.md`: This file defines the rule categories for Postgres best practices. Rules are automatically assigned to sections based on their filename prefix.
- `.claude/skills/supabase-postgres-best-practices/references/_template.md`: [1-2 sentence explanation of the problem and why it matters. Focus on performance impact.]
- `.claude/skills/supabase-postgres-best-practices/references/advanced-full-text-search.md`: LIKE with wildcards can't use indexes. Full-text search with tsvector is orders of magnitude faster.
- `.claude/skills/supabase-postgres-best-practices/references/advanced-jsonb-indexing.md`: JSONB queries without indexes scan the entire table. Use GIN indexes for containment queries.
- `.claude/skills/supabase-postgres-best-practices/references/conn-idle-timeout.md`: Idle connections waste resources. Configure timeouts to automatically reclaim them.
- `.claude/skills/supabase-postgres-best-practices/references/conn-limits.md`: Too many connections exhaust memory and degrade performance. Set limits based on available resources.
- `.claude/skills/supabase-postgres-best-practices/references/conn-pooling.md`: Postgres connections are expensive (1-3MB RAM each). Without pooling, applications exhaust connections under load.
- `.claude/skills/supabase-postgres-best-practices/references/conn-prepared-statements.md`: Prepared statements are tied to individual database connections. In transaction-mode pooling, connections are shared, causing conflicts.
- `.claude/skills/supabase-postgres-best-practices/references/data-batch-inserts.md`: Individual INSERT statements have high overhead. Batch multiple rows in single statements or use COPY.
- `.claude/skills/supabase-postgres-best-practices/references/data-n-plus-one.md`: N+1 queries execute one query per item in a loop. Batch them into a single query using arrays or JOINs.
- `.claude/skills/supabase-postgres-best-practices/references/data-pagination.md`: OFFSET-based pagination scans all skipped rows, getting slower on deeper pages. Cursor pagination is O(1).
- `.claude/skills/supabase-postgres-best-practices/references/data-upsert.md`: Using separate SELECT-then-INSERT/UPDATE creates race conditions. Use INSERT ... ON CONFLICT for atomic upserts.
- `.claude/skills/supabase-postgres-best-practices/references/lock-advisory.md`: Advisory locks provide application-level coordination without requiring database rows to lock.
- `.claude/skills/supabase-postgres-best-practices/references/lock-deadlock-prevention.md`: Deadlocks occur when transactions lock resources in different orders. Always acquire locks in a consistent order.
- `.claude/skills/supabase-postgres-best-practices/references/lock-short-transactions.md`: Long-running transactions hold locks that block other queries. Keep transactions as short as possible.
- `.claude/skills/supabase-postgres-best-practices/references/lock-skip-locked.md`: When multiple workers process a queue, SKIP LOCKED allows workers to process different rows without waiting.
- `.claude/skills/supabase-postgres-best-practices/references/monitor-explain-analyze.md`: EXPLAIN ANALYZE executes the query and shows actual timings, revealing the true performance bottlenecks.
- `.claude/skills/supabase-postgres-best-practices/references/monitor-pg-stat-statements.md`: pg_stat_statements tracks execution statistics for all queries, helping identify slow and frequent queries.
- `.claude/skills/supabase-postgres-best-practices/references/monitor-vacuum-analyze.md`: Outdated statistics cause the query planner to make poor decisions. VACUUM reclaims space, ANALYZE updates statistics.
- `.claude/skills/supabase-postgres-best-practices/references/query-composite-indexes.md`: When queries filter on multiple columns, a composite index is more efficient than separate single-column indexes.
- `.claude/skills/supabase-postgres-best-practices/references/query-covering-indexes.md`: Covering indexes include all columns needed by a query, enabling index-only scans that skip the table entirely.
- `.claude/skills/supabase-postgres-best-practices/references/query-index-types.md`: Different index types excel at different query patterns. The default B-tree isn't always optimal.
- `.claude/skills/supabase-postgres-best-practices/references/query-missing-indexes.md`: Queries filtering or joining on unindexed columns cause full table scans, which become exponentially slower as tables grow.
- `.claude/skills/supabase-postgres-best-practices/references/query-partial-indexes.md`: Partial indexes only include rows matching a WHERE condition, making them smaller and faster when queries consistently filter on the same condition.
- `.claude/skills/supabase-postgres-best-practices/references/schema-constraints.md`: PostgreSQL does not support `ADD CONSTRAINT IF NOT EXISTS`. Migrations using this syntax will fail.
- `.claude/skills/supabase-postgres-best-practices/references/schema-data-types.md`: Using the right data types reduces storage, improves query performance, and prevents bugs.
- `.claude/skills/supabase-postgres-best-practices/references/schema-foreign-key-indexes.md`: Postgres does not automatically index foreign key columns. Missing indexes cause slow JOINs and CASCADE operations.
- `.claude/skills/supabase-postgres-best-practices/references/schema-lowercase-identifiers.md`: PostgreSQL folds unquoted identifiers to lowercase. Quoted mixed-case identifiers require quotes forever and cause issues with tools, ORMs, and AI assistants that may not recognize them.
- `.claude/skills/supabase-postgres-best-practices/references/schema-partitioning.md`: Partitioning splits a large table into smaller pieces, improving query performance and maintenance operations.
- `.claude/skills/supabase-postgres-best-practices/references/schema-primary-keys.md`: Primary key choice affects insert performance, index size, and replication efficiency.
- `.claude/skills/supabase-postgres-best-practices/references/security-privileges.md`: Grant only the minimum permissions required. Never use superuser for application queries.
- `.claude/skills/supabase-postgres-best-practices/references/security-rls-basics.md`: Row Level Security (RLS) enforces data access at the database level, ensuring users only see their own data.
- `.claude/skills/supabase-postgres-best-practices/references/security-rls-performance.md`: Poorly written RLS policies can cause severe performance issues. Use subqueries and indexes strategically.

## TypeScript Advanced Types

Master TypeScript's advanced type system including generics, conditional types, mapped types, template literals, and utility types for building type-safe applications. Use when implementing complex type logic, creating reusable type utilities, or ensuring compile-time type safety in TypeScript pr...

- `.claude/skills/typescript-advanced-types/SKILL.md`

## React Composition Patterns

Composition patterns for building flexible, maintainable React components. Avoid boolean prop proliferation by using compound components, lifting state, and composing internals. These patterns make codebases easier for both humans and AI agents to work with as they scale.

- `.claude/skills/vercel-composition-patterns/SKILL.md`
- `.claude/skills/vercel-composition-patterns/AGENTS.md`: **Version 1.0.0** Engineering January 2026
- `.claude/skills/vercel-composition-patterns/README.md`: A structured repository for React composition patterns that scale. These patterns help avoid boolean prop proliferation by using compound components, lifting state, and composing internals.
- `.claude/skills/vercel-composition-patterns/rules/_sections.md`: This file defines all sections, their ordering, impact levels, and descriptions. The section ID (in parentheses) is the filename prefix used to group rules.
- `.claude/skills/vercel-composition-patterns/rules/_template.md`: Brief explanation of the rule and why it matters.
- `.claude/skills/vercel-composition-patterns/rules/architecture-avoid-boolean-props.md`: Don't add boolean props like `isThread`, `isEditing`, `isDMThread` to customize component behavior. Each boolean doubles possible states and creates unmaintainable conditional logic. Use composition instead.
- `.claude/skills/vercel-composition-patterns/rules/architecture-compound-components.md`: Structure complex components as compound components with a shared context. Each subcomponent accesses shared state via context, not props. Consumers compose the pieces they need.
- `.claude/skills/vercel-composition-patterns/rules/patterns-children-over-render-props.md`: Use `children` for composition instead of `renderX` props. Children are more readable, compose naturally, and don't require understanding callback signatures.
- `.claude/skills/vercel-composition-patterns/rules/patterns-explicit-variants.md`: Instead of one component with many boolean props, create explicit variant components. Each variant composes the pieces it needs. The code documents itself.
- `.claude/skills/vercel-composition-patterns/rules/react19-no-forwardref.md`: In React 19, `ref` is now a regular prop (no `forwardRef` wrapper needed), and `use()` replaces `useContext()`.
- `.claude/skills/vercel-composition-patterns/rules/state-context-interface.md`: Define a **generic interface** for your component context with three parts: can implement—enabling the same UI components to work with completely different state implementations.
- `.claude/skills/vercel-composition-patterns/rules/state-decouple-implementation.md`: The provider component should be the only place that knows how state is managed. UI components consume the context interface—they don't know if state comes from useState, Zustand, or a server sync.
- `.claude/skills/vercel-composition-patterns/rules/state-lift-state.md`: Move state management into dedicated provider components. This allows sibling components outside the main UI to access and modify state without prop drilling or awkward refs.

## Vercel React Best Practices

React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involving React components, Next.js pages, data fetching, bundle optimizati...

- `.claude/skills/vercel-react-best-practices/SKILL.md`
- `.claude/skills/vercel-react-best-practices/AGENTS.md`: **Version 1.0.0** Vercel Engineering January 2026
- `.claude/skills/vercel-react-best-practices/README.md`: A structured repository for creating and maintaining React Best Practices optimized for agents and LLMs.
- `.claude/skills/vercel-react-best-practices/rules/_sections.md`: This file defines all sections, their ordering, impact levels, and descriptions. The section ID (in parentheses) is the filename prefix used to group rules.
- `.claude/skills/vercel-react-best-practices/rules/_template.md`: **Impact: MEDIUM (optional impact description)**
- `.claude/skills/vercel-react-best-practices/rules/advanced-effect-event-deps.md`: Effect Event functions do not have a stable identity. Their identity intentionally changes on every render. Do not include the function returned by `useEffectEvent` in a `useEffect` dependency array. Keep the actual reactive values as dependencies and call the Effect Event from inside the effect...
- `.claude/skills/vercel-react-best-practices/rules/advanced-event-handler-refs.md`: Store callbacks in refs when used in effects that shouldn't re-subscribe on callback changes.
- `.claude/skills/vercel-react-best-practices/rules/advanced-init-once.md`: Do not put app-wide initialization that must run once per app load inside `useEffect([])` of a component. Components can remount and effects will re-run. Use a module-level guard or top-level init in the entry module instead.
- `.claude/skills/vercel-react-best-practices/rules/advanced-use-latest.md`: Access latest values in callbacks without adding them to dependency arrays. Prevents effect re-runs while avoiding stale closures.
- `.claude/skills/vercel-react-best-practices/rules/async-api-routes.md`: In API routes and Server Actions, start independent operations immediately, even if you don't await them yet.
- `.claude/skills/vercel-react-best-practices/rules/async-cheap-condition-before-await.md`: When a branch uses `await` for a flag or remote value and also requires a **cheap synchronous** condition (local props, request metadata, already-loaded state), evaluate the cheap condition **first**. Otherwise you pay for the async call even when the compound condition can never be true.
- `.claude/skills/vercel-react-best-practices/rules/async-defer-await.md`: Move `await` operations into the branches where they're actually used to avoid blocking code paths that don't need them.
- `.claude/skills/vercel-react-best-practices/rules/async-dependencies.md`: For operations with partial dependencies, use `better-all` to maximize parallelism. It automatically starts each task at the earliest possible moment.
- `.claude/skills/vercel-react-best-practices/rules/async-parallel.md`: When async operations have no interdependencies, execute them concurrently using `Promise.all()`.
- `.claude/skills/vercel-react-best-practices/rules/async-suspense-boundaries.md`: Instead of awaiting data in async components before returning JSX, use Suspense boundaries to show the wrapper UI faster while data loads.
- `.claude/skills/vercel-react-best-practices/rules/bundle-barrel-imports.md`: Import directly from source files instead of barrel files to avoid loading thousands of unused modules. **Barrel files** are entry points that re-export multiple modules (e.g., `index.js` that does `export * from './module'`).
- `.claude/skills/vercel-react-best-practices/rules/bundle-conditional.md`: Load large data or modules only when a feature is activated.
- `.claude/skills/vercel-react-best-practices/rules/bundle-defer-third-party.md`: Analytics, logging, and error tracking don't block user interaction. Load them after hydration.
- `.claude/skills/vercel-react-best-practices/rules/bundle-dynamic-imports.md`: Use `next/dynamic` to lazy-load large components not needed on initial render.
- `.claude/skills/vercel-react-best-practices/rules/bundle-preload.md`: Preload heavy bundles before they're needed to reduce perceived latency.
- `.claude/skills/vercel-react-best-practices/rules/client-event-listeners.md`: Use `useSWRSubscription()` to share global event listeners across component instances.
- `.claude/skills/vercel-react-best-practices/rules/client-localstorage-schema.md`: Add version prefix to keys and store only needed fields. Prevents schema conflicts and accidental storage of sensitive data.
- `.claude/skills/vercel-react-best-practices/rules/client-passive-event-listeners.md`: Add `{ passive: true }` to touch and wheel event listeners to enable immediate scrolling. Browsers normally wait for listeners to finish to check if `preventDefault()` is called, causing scroll delay.
- `.claude/skills/vercel-react-best-practices/rules/client-swr-dedup.md`: SWR enables request deduplication, caching, and revalidation across component instances.
- `.claude/skills/vercel-react-best-practices/rules/js-batch-dom-css.md`: Avoid interleaving style writes with layout reads. When you read a layout property (like `offsetWidth`, `getBoundingClientRect()`, or `getComputedStyle()`) between style changes, the browser is forced to trigger a synchronous reflow.
- `.claude/skills/vercel-react-best-practices/rules/js-cache-function-results.md`: Use a module-level Map to cache function results when the same function is called repeatedly with the same inputs during render.
- `.claude/skills/vercel-react-best-practices/rules/js-cache-property-access.md`: Cache object property lookups in hot paths.
- `.claude/skills/vercel-react-best-practices/rules/js-cache-storage.md`: **Incorrect (reads storage on every call):**
- `.claude/skills/vercel-react-best-practices/rules/js-combine-iterations.md`: Multiple `.filter()` or `.map()` calls iterate the array multiple times. Combine into one loop.
- `.claude/skills/vercel-react-best-practices/rules/js-early-exit.md`: Return early when result is determined to skip unnecessary processing.
- `.claude/skills/vercel-react-best-practices/rules/js-flatmap-filter.md`: **Impact: LOW-MEDIUM (eliminates intermediate array)**
- `.claude/skills/vercel-react-best-practices/rules/js-hoist-regexp.md`: Don't create RegExp inside render. Hoist to module scope or memoize with `useMemo()`.
- `.claude/skills/vercel-react-best-practices/rules/js-index-maps.md`: Multiple `.find()` calls by the same key should use a Map.
- `.claude/skills/vercel-react-best-practices/rules/js-length-check-first.md`: When comparing arrays with expensive operations (sorting, deep equality, serialization), check lengths first. If lengths differ, the arrays cannot be equal.
- `.claude/skills/vercel-react-best-practices/rules/js-min-max-loop.md`: Finding the smallest or largest element only requires a single pass through the array. Sorting is wasteful and slower.
- `.claude/skills/vercel-react-best-practices/rules/js-request-idle-callback.md`: **Impact: MEDIUM (keeps UI responsive during background tasks)**
- `.claude/skills/vercel-react-best-practices/rules/js-set-map-lookups.md`: Convert arrays to Set/Map for repeated membership checks.
- `.claude/skills/vercel-react-best-practices/rules/js-tosorted-immutable.md`: **Incorrect (mutates original array):**
- `.claude/skills/vercel-react-best-practices/rules/rendering-activity.md`: Use React's `<Activity>` to preserve state/DOM for expensive components that frequently toggle visibility.
- `.claude/skills/vercel-react-best-practices/rules/rendering-animate-svg-wrapper.md`: Many browsers don't have hardware acceleration for CSS3 animations on SVG elements. Wrap SVG in a `<div>` and animate the wrapper instead.
- `.claude/skills/vercel-react-best-practices/rules/rendering-conditional-render.md`: Use explicit ternary operators (`? :`) instead of `&&` for conditional rendering when the condition can be `0`, `NaN`, or other falsy values that render.
- `.claude/skills/vercel-react-best-practices/rules/rendering-content-visibility.md`: Apply `content-visibility: auto` to defer off-screen rendering.
- `.claude/skills/vercel-react-best-practices/rules/rendering-hoist-jsx.md`: Extract static JSX outside components to avoid re-creation.
- `.claude/skills/vercel-react-best-practices/rules/rendering-hydration-no-flicker.md`: When rendering content that depends on client-side storage (localStorage, cookies), avoid both SSR breakage and post-hydration flickering by injecting a synchronous script that updates the DOM before React hydrates.
- `.claude/skills/vercel-react-best-practices/rules/rendering-hydration-suppress-warning.md`: In SSR frameworks (e.g., Next.js), some values are intentionally different on server vs client (random IDs, dates, locale/timezone formatting). For these *expected* mismatches, wrap the dynamic text in an element with `suppressHydrationWarning` to prevent noisy warnings. Do not use this to hide r...
- `.claude/skills/vercel-react-best-practices/rules/rendering-resource-hints.md`: **Impact: HIGH (reduces load time for critical resources)**
- `.claude/skills/vercel-react-best-practices/rules/rendering-script-defer-async.md`: **Impact: HIGH (eliminates render-blocking)**
- `.claude/skills/vercel-react-best-practices/rules/rendering-svg-precision.md`: Reduce SVG coordinate precision to decrease file size. The optimal precision depends on the viewBox size, but in general reducing precision should be considered.
- `.claude/skills/vercel-react-best-practices/rules/rendering-usetransition-loading.md`: Use `useTransition` instead of manual `useState` for loading states. This provides built-in `isPending` state and automatically manages transitions.
- `.claude/skills/vercel-react-best-practices/rules/rerender-defer-reads.md`: Don't subscribe to dynamic state (searchParams, localStorage) if you only read it inside callbacks.
- `.claude/skills/vercel-react-best-practices/rules/rerender-dependencies.md`: Specify primitive dependencies instead of objects to minimize effect re-runs.
- `.claude/skills/vercel-react-best-practices/rules/rerender-derived-state-no-effect.md`: If a value can be computed from current props/state, do not store it in state or update it in an effect. Derive it during render to avoid extra renders and state drift. Do not set state in effects solely in response to prop changes; prefer derived values or keyed resets instead.
- `.claude/skills/vercel-react-best-practices/rules/rerender-derived-state.md`: Subscribe to derived boolean state instead of continuous values to reduce re-render frequency.
- `.claude/skills/vercel-react-best-practices/rules/rerender-functional-setstate.md`: When updating state based on the current state value, use the functional update form of setState instead of directly referencing the state variable. This prevents stale closures, eliminates unnecessary dependencies, and creates stable callback references.
- `.claude/skills/vercel-react-best-practices/rules/rerender-lazy-state-init.md`: Pass a function to `useState` for expensive initial values. Without the function form, the initializer runs on every render even though the value is only used once.
- `.claude/skills/vercel-react-best-practices/rules/rerender-memo-with-default-value.md`: When memoized component has a default value for some non-primitive optional parameter, such as an array, function, or object, calling the component without that parameter results in broken memoization. This is because new value instances are created on every rerender, and they do not pass strict...
- `.claude/skills/vercel-react-best-practices/rules/rerender-memo.md`: Extract expensive work into memoized components to enable early returns before computation.
- `.claude/skills/vercel-react-best-practices/rules/rerender-move-effect-to-event.md`: If a side effect is triggered by a specific user action (submit, click, drag), run it in that event handler. Do not model the action as state + effect; it makes effects re-run on unrelated changes and can duplicate the action.
- `.claude/skills/vercel-react-best-practices/rules/rerender-no-inline-components.md`: **Impact: HIGH (prevents remount on every render)**
- `.claude/skills/vercel-react-best-practices/rules/rerender-simple-expression-in-memo.md`: When an expression is simple (few logical or arithmetical operators) and has a primitive result type (boolean, number, string), do not wrap it in `useMemo`. Calling `useMemo` and comparing hook dependencies may consume more resources than the expression itself.
- `.claude/skills/vercel-react-best-practices/rules/rerender-split-combined-hooks.md`: When a hook contains multiple independent tasks with different dependencies, split them into separate hooks. A combined hook reruns all tasks when any dependency changes, even if some tasks don't use the changed value.
- `.claude/skills/vercel-react-best-practices/rules/rerender-transitions.md`: Mark frequent, non-urgent state updates as transitions to maintain UI responsiveness.
- `.claude/skills/vercel-react-best-practices/rules/rerender-use-deferred-value.md`: When user input triggers expensive computations or renders, use `useDeferredValue` to keep the input responsive. The deferred value lags behind, allowing React to prioritize the input update and render the expensive result when idle.
- `.claude/skills/vercel-react-best-practices/rules/rerender-use-ref-transient-values.md`: When a value changes frequently and you don't want a re-render on every update (e.g., mouse trackers, intervals, transient flags), store it in `useRef` instead of `useState`. Keep component state for UI; use refs for temporary DOM-adjacent values. Updating a ref does not trigger a re-render.
- `.claude/skills/vercel-react-best-practices/rules/server-after-nonblocking.md`: Use Next.js's `after()` to schedule work that should execute after a response is sent. This prevents logging, analytics, and other side effects from blocking the response.
- `.claude/skills/vercel-react-best-practices/rules/server-auth-actions.md`: **Impact: CRITICAL (prevents unauthorized access to server mutations)**
- `.claude/skills/vercel-react-best-practices/rules/server-cache-lru.md`: **Implementation:**
- `.claude/skills/vercel-react-best-practices/rules/server-cache-react.md`: Use `React.cache()` for server-side request deduplication. Authentication and database queries benefit most.
- `.claude/skills/vercel-react-best-practices/rules/server-dedup-props.md`: **Impact: LOW (reduces network payload by avoiding duplicate serialization)**
- `.claude/skills/vercel-react-best-practices/rules/server-hoist-static-io.md`: **Impact: HIGH (avoids repeated file/network I/O per request)**
- `.claude/skills/vercel-react-best-practices/rules/server-no-shared-module-state.md`: For React Server Components and client components rendered during SSR, avoid using mutable module-level variables to share request-scoped data. Server renders can run concurrently in the same process. If one render writes to shared module state and another render reads it, you can get race condit...
- `.claude/skills/vercel-react-best-practices/rules/server-parallel-fetching.md`: React Server Components execute sequentially within a tree. Restructure with composition to parallelize data fetching.
- `.claude/skills/vercel-react-best-practices/rules/server-parallel-nested-fetching.md`: When fetching nested data in parallel, chain dependent fetches within each item's promise so a slow item doesn't block the rest.
- `.claude/skills/vercel-react-best-practices/rules/server-serialization.md`: The React Server/Client boundary serializes all object properties into strings and embeds them in the HTML response and subsequent RSC requests. This serialized data directly impacts page weight and load time, so **size matters a lot**. Only pass fields that the client actually uses.

<!-- autoskills:end -->
