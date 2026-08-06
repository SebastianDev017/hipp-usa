# HiPP USA — estado del proyecto

Medido, no recordado. Fecha del corte: **6 de agosto de 2026**, commit `4d4d0f0`.
Deadline: **15 de agosto de 2026**.

Las trampas técnicas del tema base están en [NOTAS-TECNICAS.md](NOTAS-TECNICAS.md).
Este archivo es el backlog.

---

## 0. Rebrand tipográfico y de color (6-ago-2026)

Diagnóstico de Andrés: el combo **crema + serif + clay/terracota** es uno de los
patrones más repetidos del diseño generado por IA ahora mismo. Era eso lo que se
notaba. Se cambió sin tocar un solo paso del flujo de compra.

### Tipografía

Banana Grotesk (texto) + Advert Bold (encabezados), las fuentes reales de HiPP,
que ya venían en el tema. Se redeclaran en `hipp-fonts.liquid` con **solo woff2**
y por `asset_url`; las `@font-face` de `css-base.css` traen otra query string y
precargar esas hacía bajar cada archivo dos veces.

- **66 KB** contra los 112 KB de Inter + Fraunces.
- **2.173 KB borrados**: los 7 `.svg` de ~139 KB, más `.eot`, `.ttf`, `.woff`, más
  Fraunces e Inter que quedaron sin uso. Se conservan los 9 `.woff2` porque
  `css-base.css` los declara y no se puede editar.
- Se quitaron **11 itálicas sintéticas**: ninguna de las dos fuentes tiene
  itálica real. Ojo: hace falta `font-style: normal` **explícito**, porque `<em>`
  la trae del user-agent stylesheet.

### Color — HiPP es una marca VERDE

Primera pasada equivocada, corregida el 6-ago: leí los colores del **empaque**
(magenta / naranja / azul) como si fueran los de la marca. No lo son, son la
codificación por etapa de la lata. La identidad es el verde del nav y del footer.

Los hex de la versión buena salen de recorrer el DOM de **hipp.mx en vivo**
acumulando área por color de fondo y caracteres por color de texto. El color de
texto dominante del sitio es `#125b4e` por lejos (2.186 caracteres), y los fondos
que más superficie cubren son `#ebf3e3` y `#e2ecd4`.

| Rol | Token | Antes | Ahora |
|---|---|---|---|
| Acento (CTA, kickers, badges) | `--clay` | magenta `#d50c75` | **verde profundo `#125b4e`** |
| Texto y campos oscuros | `--ink` | navy `#15226a` | verde casi negro `#10403a` |
| Base neutra | `--cream` | blanco `#ffffff` | crema `#faf8f3` |
| Bandas de sección | `--warm` / `--sand` | durazno `#fff2e8` / `#ffd9be` | salvia `#ebf3e3` / `#e2ecd4` |
| Quiebre | `--hipp-navy` | en todo el texto | **solo** en la promesa de las 3am |
| Único acento cálido | `--gold` | — | dorado apagado `#b8862a`, en 2 lugares |

Los nombres de token no cambiaron, solo los valores: 3.200 líneas de CSS y 28
secciones usan `var(--clay)` y `var(--cream)`. Por eso `--clay` sigue llamándose
así aunque hoy sea verde: es el **rol** "acento", no el color.

Fuera el magenta del CTA del nav, los kickers, la marquesina, los tags de bundle
y el bloque entero de la promesa de 2 días. Los tres colores por fórmula pasan a
tres tonos de la misma familia — verde profundo, verde hoja, dorado — en vez de
tres colores ajenos a la marca.

**Contraste verificado en vivo, con los reveals disparados** (medir sin scrollear
mide contenido en `opacity: 0` y da falsos OK): **0 fallos** en home, producto,
colección y carrito, en desktop y en 390px. También **0 elementos rosados/magenta**
en las cuatro rutas.

| Sobre `--cream` / `--warm` / `--sand` | | | |
|---|---|---|---|
| `--ink` | 10.89 | 10.04 | 9.48 |
| `--clay` | 7.52 | 7.01 | 4.74 |
| `--ink-soft` | 5.54 | 5.17 | 4.82 |
| `--gold-ink` | 5.95 | 5.55 | 5.18 |
| blanco sobre `--clay` | 7.98 | | |

El verde hoja y el dorado **no** llegan a 4.5:1 como texto: quedan para rellenos y
gráfica, donde el mínimo es 3. Para texto existen `--hipp-leaf-ink` y `--gold-ink`.

### Colinas como hilo visual

Dejaron de ser un adorno del hero. Ahora marcan cada cambio de banda:

- entrada y salida de la sección navy;
- entrada y salida de la banda de envío;
- entrada a fórmulas y a FAQ;
- la cabecera de **todas** las páginas internas es una banda salvia que baja al
  contenido por una colina (colección, página, blog, búsqueda, 404);
- el carrito suma la banda de envío con sus dos colinas.

La colina de salida va **después** de `</section>` y con `above` en el color de la
sección: dibujada adentro, el padding inferior vuelve a pintar el fondo por debajo
de la curva y el corte queda a mitad de camino.

La ilustración del hero pasó de durazno a campo: cuatro capas de verde con el sol
en dorado apagado.

### Un bug de móvil que apareció al verificar

La regla sin modificador de la sección 25 (`.hp-bundles`) apuntaba a la misma
clase que usa `bundle-tiers` en la home. Al estar declarada más abajo en el
archivo le ganaba a la media query que apila en móvil: las tres tarjetas quedaban
en 107px y **la tercera se cortaba fuera de la pantalla** en 390px. Ahora la regla
pide el modificador `--3`, que el PDP ya emite siempre.

**Fotos**: siguen las de HiPP México como placeholder, hasta que Andrés mande las
suyas o confirme que usemos esas.

---

## 1. Qué está hecho y verificado en vivo

Las ocho rutas devuelven el diseño nuevo, con **cero markup del tema mexicano**:

| Ruta | Estado |
|---|---|
| `/` | home completa, 9 secciones |
| `/collections/*` | catálogo con orden nativo sin JS |
| `/products/*` | PDP con tamaños, suscripción y ATC sin JS |
| `/cart` | página propia, funciona sin JS |
| `/search` | buscador propio |
| `/pages/*` | plantilla genérica + contacto |
| `/blogs/*` y artículos | listado y artículo |
| 404 | página propia con atajos |

Más el **cart drawer** (add-to-cart AJAX, que el tema base no tenía) y el CTA fijo móvil.

**22 secciones nuevas** (`-usa` y compañía), capa `hipp-tokens.css` + `hipp-usa.css` +
`hipp-cart.css`, y `hipp-usa.js` / `hipp-cart.js` / `hipp-product.js` en vanilla.

Estado de calidad: **theme-check 32 ofensas, 0 errores, 0 en archivos nuevos**
(las 32 son todas heredadas). `validate_theme` de Shopify en verde.
Cero errores de consola. Cero overflow horizontal a 390px.

---

## 2. Bloqueantes para lanzar

Ninguno es del tema. Los tres se resuelven en el admin de Shopify.

1. **La tienda solo puede enviar a México.** En el checkout el selector de país
   tiene una sola opción. Un cliente en Estados Unidos no puede terminar una
   compra. → Configuración → Envíos y entregas, y Mercados.
   *(La moneda ya está en USD.)*

2. **Las políticas no están escritas.** `/policies/*` cae en la 404. →
   Configuración → Políticas.

3. **Fotografía de producto.** Las imágenes actuales son las **cajas mexicanas**:
   dicen "ORGÁNICO", "CONT. NETO 600g" y el texto legal en español. Se ven en el
   catálogo, el buscador, el PDP y el carrito.

---

## 3. Decisiones de negocio pendientes

Planteadas, sin resolver. El tema ya soporta cualquiera de las dos salidas.

1. ~~**Cadencias.**~~ **RESUELTO.** El sitio ya muestra las cadencias reales:

   | Producto | Cadencias | Qué muestra su PDP |
   |---|---|---|
   | HiPP Combiotik | 3 / 4 / 5 semanas | 3 / 4 / 5 |
   | HiPP Comfort | 4 / 5 / 6 semanas | 4 / 5 / 6 |
   | HiPP AR | 4 / 5 / 6 semanas | 4 / 5 / 6 |

   En el PDP la sección lee el producto de la página, así que **no puede volver a
   desincronizarse**. La home apunta a Combiotik y su copy dice "every 3 to 6
   weeks, depending on the formula", que es el rango real del catálogo.

2. **Suscripción por variante.** Los planes aplican a los tres tamaños. El copy
   decía *"the only bundle available as a subscription"* sobre el pack de 8, lo
   que contradecía a la propia FAQ; se alineó con lo que la tienda hace de
   verdad. **Si se decide restringir la suscripción al pack de 8, son dos
   strings en `templates/index.json` más el cambio en los planes.**

3. **Precio de la caja suelta.** El CSV
   `Downloads\hipp-usa-caja-suelta-import.csv` la deja en **$29.00**, igual que
   dentro de los packs, para no romper la promesa de "$29 per box". Si se quiere
   que el bundle tenga ventaja real, es cambiar una columna. **Todavía no está
   importado, y hasta que lo esté la caja suelta no aparece en el PDP.**

   El tema ya la soporta: si existe una variante de 1 caja, sale como una línea
   discreta debajo de los packs (`Just getting started? Try a single box`), no
   como una cuarta tarjeta. Es deliberado: darle el mismo peso visual que al pack
   de 8 pone a competir de igual a igual la opción que menos le sirve al cliente
   y a la marca, y parte la grilla de 3 en una de 4. Hay un setting por si se
   prefiere como tarjeta. **Sin la variante, no se renderiza nada** — riesgo cero
   mientras tanto, pero tampoco se puede verificar en vivo todavía.

4. **Cuentas de redes sociales de USA.** Las heredadas eran de hipp.mx y quedaron
   vacías; el footer las oculta mientras estén así.

---

## 4. Para pulir

Ordenado por relación valor / riesgo.

### 4.1 Dejar de cargar `js-commons.js` — el más rentable

`snippets/theme-js.liquid` carga y `theme-preconnects.liquid` **precarga** el
bundle de webpack en modo desarrollo: **794 KB en disco, 167 KB transferidos**,
en **todas** las páginas. La home mueve hoy **570 KB de JavaScript**, y ese
archivo es el más pesado de todos.

Ninguna sección nueva lo usa: todo el JS propio es vanilla. Sus únicos
consumidores son las secciones MX huérfanas (ver 5.1). Se puede dejar de cargar
sin borrar el archivo — **borrarlo sí rompe todo en silencio**, porque los
entries de webpack lo referencian por `deferredModules`.

Requiere probar las rutas una por una antes de dar por bueno.

### 4.2 ~~Quitar el `preconnect` a `cdn.judge.me`~~ HECHO

La app no está instalada. Ya se condicionó el `<script>`, pero el `preconnect`
sigue abriendo una conexión inútil en cada carga. Una línea.

### 4.3 Nota bajo los tamaños del PDP

Dice *"$29 per box on every bundle"*. Ahora cada tarjeta calcula su propio precio
por caja, así que la frase es redundante — y si la caja suelta pasa a costar más,
además es falsa. Conviene decidirla junto con el punto 3.3 (precio de la caja suelta).

### 4.4 Comentario obsoleto en `theme-js.liquid`

Dice que `main-cart.liquid` carga `js-main-cart.js`. Esa sección ya no se usa.

### 4.5 Verificar Lighthouse

Nunca se corrió: la tienda está detrás de contraseña. Conviene hacerlo en
incógnito antes de entregar.

---

## 5. Para eliminar

### 5.0 HECHO: el tema mexicano ya no está — 288 archivos, 1,6 MB

Dos pasadas. Primero 52 assets sueltos (113 KB). Después un **barrido en
cascada**: plantillas huérfanas → las secciones que solo existían para ellas →
los snippets que solo usaban esas secciones → los assets que quedaron sin
referencia. Cuatro rondas hasta que no apareció nada nuevo.

| | antes | después |
|---|---|---|
| plantillas | 32 | **14** |
| secciones | 120 | **28** |
| snippets | 60 | **19** |
| assets | 223 | **86** |
| theme-check | 199 ofensas | **33** |

**Verificado antes de borrar, no asumido:** los 14 handles de páginas mexicanas
devuelven 404 en la tienda y los 3 productos usan `product.json`. Ninguna página
publicada dependía de nada de esto.

**Verificado después:** las 9 rutas responden, sin errores de Liquid, sin
recursos fallidos y sin errores de consola; add-to-cart y drawer siguen bien
(`8 boxes`, $232.00, cantidad 2 en el servidor).

El orden importa y es el de NOTAS-TECNICAS §1: **primero las plantillas**. Al
revés, una plantilla queda apuntando a un `type` inexistente y Shopify descarta
el archivo entero en silencio.

> **Dos correcciones a estimaciones previas mías.** (1) Dije 2.211 KB liberables
> escaneando solo `.liquid`: falso. (2) El primer barrido en cascada daba por
> huérfanas las fuentes de la marca mexicana — tampoco: `css-base.css` las
> referencia con `@font-face`, donde Liquid no corre, y borrarlas dejaba 404 en
> cada carga. El simulacro lo mostró a tiempo. Ver 5.2.

### 5.1 Referencia rota heredada

`sections/main-list-collections.liquid` pide `assets/component-card.css`, que
**nunca estuvo en el repo** — viene así del tema base. Es la única sección que
todavía es markup mexicano, y solo se ve en `/collections` (el índice de
colecciones, que hoy no está enlazado desde ningún lado).

### 5.2 Fuentes de la marca mexicana — NO borrar todavía

- **Banana Grotesk**: 35 archivos, 2.012 KB (siete `.svg` de ~139 KB cada uno,
  un formato que ningún navegador actual necesita).
- **Advert**: 4 archivos, 57 KB.

`css-base.css` las declara con `@font-face`, y **el navegador descarga tres de
verdad**: `BananaGrotesk-Medium.woff2`, `BananaGrotesk-Bold.woff2` y
`AdvertBold.woff2`, **48 KB en cada carga de página**. Borrarlas hoy da 404.

Lo raro: **nada en el DOM final las resuelve.** Se buscó exhaustivamente —
reglas CSS (incluidas las de dentro de `@media`), pseudo-elementos y estilos
computados de todos los elementos: cero coincidencias. La descarga la inicia el
CSS durante el render inicial, así que el sospechoso es markup legado que existe
mientras la página se pinta y después desaparece.

Conviene atacarlo **junto con `js-commons.js` (4.1)**, que es cuando se toca el
JS y el DOM legado. Premio combinado: ~215 KB por página.

### 5.3 `templates/customers/*.liquid` — 7 archivos

**Código muerto.** La tienda usa las cuentas de cliente nuevas de Shopify: el
ícono del header lleva a una pantalla hospedada por ellos. Esas plantillas no se
renderizan nunca. El branding de esa pantalla se cambia en el admin.

### 5.4 Lo que NO hay que borrar

- **`assets/css-base.css`** — 146 KB, read-only, sigue sosteniendo estilos base.
- **`assets/js-commons.js`** — dejar de cargarlo sí, borrarlo no (4.1).
- Las tres `hipp-formula-*.png` — son el fallback de `formula-cards`.

---

## 6. Riesgo del calendario

Lo que falta del lado del tema es pulido y limpieza: nada bloquea.
Los tres bloqueantes de la sección 2 son de configuración y contenido, y **no
dependen de mí**. Si la fotografía de producto tarda, es lo que más puede correr
la fecha del 15 de agosto.
