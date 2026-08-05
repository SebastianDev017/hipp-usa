# HiPP USA — estado del proyecto

Medido, no recordado. Fecha del corte: **4 de agosto de 2026**, commit `6da11b1`.
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

1. **Cadencias.** Los planes cargados no coinciden entre productos ni con el copy:

   | Producto | Cadencias cargadas |
   |---|---|
   | HiPP Combiotik | 3 / 4 / 5 semanas |
   | HiPP Comfort | 4 / 5 / 6 semanas |
   | HiPP AR | 4 / 5 / 6 semanas |

   El copy aprobado dice **7 / 8 / 9**. La sección `subscription-cadence` tiene el
   setting **Fuente de las cadencias**: "Bloques" (lo escrito a mano, por defecto)
   o "Planes de la tienda" (lee las reales del producto que se elija).

2. **Suscripción por variante.** Los planes aplican a los tres tamaños; el diseño
   dice *"the only bundle available as a subscription"* sobre el pack de 8.

3. **Precio de la caja suelta.** El CSV
   `Downloads\hipp-usa-caja-suelta-import.csv` la deja en **$29.00**, igual que
   dentro de los packs, para no romper la promesa de "$29 per box". Si se quiere
   que el bundle tenga ventaja real, es cambiar una columna. **Todavía no está
   importado.**

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
además es falsa. Conviene decidirla junto con el punto 3.3.

### 4.4 Comentario obsoleto en `theme-js.liquid`

Dice que `main-cart.liquid` carga `js-main-cart.js`. Esa sección ya no se usa.

### 4.5 Verificar Lighthouse

Nunca se corrió: la tienda está detrás de contraseña. Conviene hacerlo en
incógnito antes de entregar.

---

## 5. Para eliminar

**5.704 KB de assets, y 2.211 KB no los referencia ningún `.liquid`.**

Todo esto es legado del tema mexicano. Nada de lo nuevo lo toca.

### 5.1 Plantillas y secciones huérfanas

- **18 plantillas** de páginas MX (`page.ciencia.json`, `page.about-us.json`,
  `page.bueno-desde-el-origen.json`, `product.regalo.json`, …). Ninguna página
  publicada las usa.
- **33 secciones** que ningún template ni el layout referencian.
- Otras **~60 secciones** que solo existen para esas 18 plantillas.

**Orden importante:** primero las plantillas, después las secciones. Al revés,
una plantilla queda apuntando a un `type` inexistente y Shopify **descarta el
archivo entero** (ver NOTAS-TECNICAS §1).

### 5.2 Fuentes de la marca mexicana — 2.069 KB

- **Banana Grotesk**: 35 archivos, **2.012 KB**. Incluye siete `.svg` de ~139 KB
  cada uno, un formato que ningún navegador actual necesita.
- **Advert**: 4 archivos, 57 KB.

El tema nuevo usa Fraunces + Inter, self-hosted. Ninguna de estas dos se
referencia en ningún lado.

### 5.3 Imágenes sueltas — 99 KB

56 archivos (`arrow-1-blue.png`, iconos del tema viejo…) sin una sola referencia.

### 5.4 `templates/customers/*.liquid` — 7 archivos

**Código muerto.** La tienda usa las cuentas de cliente nuevas de Shopify: el
ícono del header lleva a una pantalla hospedada por ellos. Esas plantillas no se
renderizan nunca. El branding de esa pantalla se cambia en el admin.

### 5.5 Lo que NO hay que borrar

- **`assets/css-base.css`** — 146 KB, read-only, sigue sosteniendo estilos base.
- **`assets/js-commons.js`** — dejar de cargarlo sí, borrarlo no (5.4.1).
- Las tres `hipp-formula-*.png` — son el fallback de `formula-cards`.

---

## 6. Riesgo del calendario

Lo que falta del lado del tema es pulido y limpieza: nada bloquea.
Los tres bloqueantes de la sección 2 son de configuración y contenido, y **no
dependen de mí**. Si la fotografía de producto tarda, es lo que más puede correr
la fecha del 15 de agosto.
