# HiPP USA — notas técnicas

Cosas que costaron tiempo de encontrar y que el historial de git no explica,
porque el sync de 2 vías con Shopify reescribe los commits.

---

## 1. Shopify descarta archivos enteros en la subida, y el sync de GitHub no avisa

Ya pasó dos veces con síntomas distintos y la misma causa de fondo: **Shopify
valida al subir, y cuando un archivo no pasa lo descarta completo en silencio.**
El sync desde GitHub no reporta nada. El error solo aparece empujando por CLI:

```bash
shopify theme push --theme <id> --allow-live --only <archivo>
```

### 1.1 Un setting de video que apunta a un archivo inexistente

*Síntoma:* la home devolvía 404.

`templates/index.json` (y otros 8 templates) referenciaban videos
`shopify://files/videos/...` que viven en los Files de la tienda **mexicana**.
Shopify descartó los 9 templates enteros → sin `index.json` no hay home, sin
`collection.json` no hay ninguna colección.

Las referencias `shopify://shop_images/` **no** rompen el template: la imagen
queda en blanco y ya. Las de video sí.

### 1.2 Un `"default": ""` en el schema de una sección

*Síntoma:* `/products/*` seguía sirviendo el PDP mexicano viejo aunque el
template nuevo estaba en el repo.

`sections/main-product-usa.liquid` tenía:

```json
{ "type": "text", "id": "subscription_pending_note", "default": "" }
```

Shopify responde `Invalid schema: setting with id=... default no puede estar en
blanco` y **no sube el archivo**. Como la sección nunca llegó al tema,
`templates/product.json` quedó referenciando un `type` inexistente y también fue
descartado.

**Ni `shopify theme check` ni el `validate_theme` de Shopify lo detectan.** Los
dos daban OK. Si un setting no tiene valor por defecto, hay que **omitir la
clave `default`**, no ponerla vacía.

### Cómo diagnosticarlo rápido

Comparar lo que hay en el tema live contra el repo:

```bash
shopify theme pull --theme <id> --nodelete --path /tmp/live
diff -rq /tmp/live sections/
```

Si falta un archivo, empujarlo solo por CLI y leer el error.

---

## 2. Operativa del repo: el sync es de 2 vías

Cada `shopify theme push` hace que `shopify[bot]` commitee de vuelta a `main`,
reformateando los JSON (pretty-print + una cabecera `/* auto-generated */`). O
sea que **los templates JSON son JSONC, no JSON puro**: `JSON.parse` a secas
falla contra ellos.

Después de empujar por CLI:

```bash
git fetch origin && git reset --hard origin/main
```

Si no, el push a git sale rechazado.

El bot también borra de `settings_data.json` los app embeds de apps que no están
instaladas en esta tienda (quedaban de la MX: Klaviyo, Smile.io, Rebuy, Triple
Whale, Judge.me). Eso es limpieza deseable, no hay que revertirlo.

---

## 3. El tema base manda sobre lo que se puede escribir

- `assets/css-base.css` son 146 KB minificados en 4 líneas, sin sourcemap, con
  las reglas de header, footer y product-card dispersas en varios offsets.
  **Es READ-ONLY.** El rebrand va por capas nuevas cargadas después.
- `assets/theme.css` declara `html { font-size: 62.5% }`, o sea que **1rem =
  10px**. Todo el CSS nuevo va en px.
- Sus ~850 reglas asumen `line-height: normal`. Por eso el `line-height: 1.6`
  del diseño se declara en los contenedores raíz de la capa nueva
  (`.hp-wrap`, `.hp-nav__inner`, …) y **no** en `body`.
- `css-base.css` usa `html { scroll-padding-top: calc(var(--header-height) +
  var(--announcement-bar-height)) }` pero **no declara ninguna de las dos**: la
  calc quedaba inválida y los anchors terminaban tapados por el header sticky.
  `hipp-usa.css` las declara y `hipp-usa.js` mide la altura real.
- Hay 1.19 MB de JS en 29 bundles de webpack **en modo desarrollo y sin código
  fuente**. No se puede recompilar. Tampoco se puede borrar el chunk `commons`:
  los entries usan `deferredModules` contra él y borrarlo mata todo el JS en
  silencio. Los entries sueltos (`js-main-collection.js`, `js-main-product.js`)
  sí se pueden dejar de cargar sin afectar al resto.

---

## 4. Trampas de CSS que ya se pagaron

- `.hp-reveal` se declara **duplicada** (`.hp-reveal.hp-reveal`). Con una sola
  clase, cualquier componente que declare su propio `transition` shorthand más
  abajo en el archivo gana por orden de cascada y anula el fade.
- **Nunca poner `hp-reveal` sobre un `.hp-btn`**: el `transform: none` del
  estado final anula el `translateY(-1px)` del hover. Va sobre un wrapper.
- `scroll-behavior` en `body` **no se propaga al viewport** ni se hereda (CSSOM
  View Module lo dice explícito, a diferencia de `overflow`). Va en `html`.
- El header sticky con `z-index: 50` abre contexto de apilado: el panel de
  navegación móvil que vive adentro no puede superar ese 50 frente al resto de
  la página por más que declare 70. Por eso el CTA fijo está en 40.
- Un ancestro con `backdrop-filter` convierte a sus hijos `position: fixed` en
  posicionados respecto de él. Por eso la barra de progreso y el cart drawer
  viven fuera del header.

---

## 5. Modelo de datos de la tienda

- Opción de variante: **`Boxes`** con valores `4` / `8` / `16` (en hipp.mx es
  `Número de cajas`). El PDP es agnóstico al nombre: con una sola opción los
  radios se llaman `name="id"` y su value **es** el id de la variante, así que
  el form nativo funciona sin JavaScript. Por eso **no hay** un input hidden
  `name="id"`: dos campos con ese nombre se mandarían los dos.
- La suscripción va contra **selling plans nativos**
  (`product.selling_plan_groups`), no contra el metafield `custom.suscripcion`
  ni contra una variante llamada "4 Suscripción" como en MX. Sirve igual con
  Shopify Subscriptions o con ReCharge.
- `sections/main-product-usa.liquid` tiene el setting `subscription_ui` para
  cambiar entre el selector propio y el widget de la app
  (`<div class="subscriptions_app_embed_block"></div>`). Son **mutuamente
  excluyentes**: los dos escriben el campo `selling_plan` del mismo form.
