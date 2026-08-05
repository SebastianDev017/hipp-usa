# HiPP USA — estado del proyecto

Medido, no recordado. Fecha del corte: **4 de agosto de 2026**, commit `36cd0c3`.
Deadline: **15 de agosto de 2026**.

Las trampas técnicas del tema base están en [NOTAS-TECNICAS.md](NOTAS-TECNICAS.md).
Este archivo es el backlog.

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

Estado de calidad: **theme-check 199 ofensas, 0 errores, 0 en archivos nuevos**
(las 199 son todas del legado MX). `validate_theme` de Shopify en verde.
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

### 4.2 Quitar el `preconnect` a `cdn.judge.me`

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

### 5.0 Ya hecho: 52 assets, 113 KB

Borrados tras re-verificar uno por uno contra **todos** los archivos del tema:
42 imágenes del tema viejo, 6 hojas CSS, 3 JS y un LICENSE. Cero recursos
fallidos y cero errores de consola después. Quedan **171 assets**.

> **Corrección a una estimación previa.** Antes dije 2.211 KB liberables. Estaba
> mal: solo había escaneado archivos `.liquid`. Las fuentes de la marca mexicana
> (~2 MB) están referenciadas por `@font-face` **dentro de `css-base.css`**,
> donde Liquid no corre. Ver 5.2.

### 5.1 Plantillas y secciones huérfanas

- **18 plantillas** de páginas MX (`page.ciencia.json`, `page.about-us.json`,
  `page.bueno-desde-el-origen.json`, `product.regalo.json`, …). Ninguna página
  publicada las usa.
- **33 secciones** que ningún template ni el layout referencian.
- Otras **~60 secciones** que solo existen para esas 18 plantillas.

**Orden importante:** primero las plantillas, después las secciones. Al revés,
una plantilla queda apuntando a un `type` inexistente y Shopify **descarta el
archivo entero** (ver NOTAS-TECNICAS §1).

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
