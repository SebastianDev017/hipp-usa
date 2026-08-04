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

### 1.3 Falso positivo: la página 404 se sirve cacheada

*Síntoma:* la 404 nueva no aparece por más que se recargue, mientras el resto de
las plantillas del mismo push ya están en vivo.

**No es un descarte.** Se verificó con `theme pull`: tanto `templates/404.json`
(con `"type": "main-404-usa"`) como `sections/main-404-usa.liquid` estaban en el
tema. Y con `?preview_theme_id=164136255709` la 404 nueva renderiza perfecto.

Shopify cachea el render del 404 del lado del servidor y no lo invalida al
publicar. `cf-cache-status` dice `DYNAMIC`, así que **no es la CDN**: pedir una
URL inexistente distinta cada vez tampoco lo evita.

Para verificar un cambio en la 404 sin esperar:

```
https://<tienda>/loquesea?preview_theme_id=<id del tema>
```

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
- **css-base.css estiliza CUALQUIER `<input>`, `<select>` y `<textarea>`.** Es la
  trampa más cara del tema base, así que va completa:

  ```css
  .form-input,
  input:not(.button):not([type=checkbox]):not([type=radio]):not(.button),
  select,
  textarea {
    padding: var(--form-input-padding);
    border-radius: 0;
    box-shadow: none;
    color: var(--form-input-color);
    outline: none;
  }
  /* y una segunda regla con la misma lista: */
  { font-family: var(--form-input-font); font-size: var(--form-input-font-size); }
  ```

  Los cuatro `:not()` suman especificidad **(0,4,1)**: le gana a una clase suelta
  (0,1,0) y también a un descendiente de dos clases (0,2,0). O sea que **todo**
  control de formulario del tema nuevo pierde por defecto `padding`,
  `border-radius`, `color` y `font-size`.

  Se cobró tres veces:

  1. `padding: 10px 20px` en el campo de 40px del stepper de cantidad → el
     número quedaba empujado fuera de la caja y el control se veía **vacío**.
  2. Arreglado el padding, el número **seguía sin verse en el drawer**:
     `--form-input-color` resuelve a `--ink`, que es exactamente el color de
     fondo del drawer. Contraste 1:1. En `/cart` el mismo bug era invisible
     porque ahí el fondo es claro.
  3. El `border-radius: 0` es un **literal**, no una variable: el buscador, el
     select de orden de la colección, el de variantes del PDP y los campos de
     contacto salían **cuadrados** en vez de pill.

  **Cualquier control nuevo declara esas cuatro propiedades con `!important`.**
  No es pereza: la hoja que gana es read-only y su selector no se supera sin
  repetir la clase cinco veces, que se lee peor. Está documentado en el bloque
  24 de `hipp-usa.css`.

  Los `[type=radio]` y `[type=checkbox]` están **excluidos** del selector, así
  que `.hp-tile__input` y compañía no necesitan nada.

---

## 5. `templates/customers/*.liquid` es código muerto

La tienda usa las **cuentas de cliente nuevas** de Shopify: el ícono de cuenta
del header lleva a `shopify.com/authentication/<id>/login`, hospedado por
Shopify. Las siete plantillas de `templates/customers/` (login, register,
account, addresses, order, reset_password, activate_account) **no se renderizan
nunca**.

Rediseñarlas sería trabajo tirado. El branding de esa pantalla se cambia desde
el admin (Configuración → Cuentas de clientes), no desde el tema.

---

## 6. Modelo de datos de la tienda

- Opción de variante: **`Boxes`** con valores `4` / `8` / `16` (en hipp.mx es
  `Número de cajas`). El PDP es agnóstico al nombre: con una sola opción los
  radios se llaman `name="id"` y su value **es** el id de la variante, así que
  el form nativo funciona sin JavaScript. Por eso **no hay** un input hidden
  `name="id"`: dos campos con ese nombre se mandarían los dos.
- La suscripción va contra **selling plans nativos**
  (`product.selling_plan_groups`), no contra el metafield `custom.suscripcion`
  ni contra una variante llamada "4 Suscripción" como en MX. Sirve igual con
  Shopify Subscriptions o con ReCharge.
- La página `/cart` es `sections/main-cart-usa.liquid`. Funciona **sin
  JavaScript**: las cantidades son `updates[]` **posicionales** (no por id de
  variante: dos líneas de la misma variante con planes de suscripción distintos
  se pisarían) y "Remove" es un `<a>` a `/cart/change`. Con JavaScript,
  `hipp-cart.js` intercepta los mismos data-attributes que el drawer y pide las
  **dos** secciones en el mismo request.

  El id de sección **no se puede hardcodear**: en una plantilla JSON Shopify lo
  emite como `template--<id>__<clave>` (acá `template--23099768406237__main-cart`),
  no como la clave a secas. Se lee del DOM vía `data-section-id`.

- `sections/main-product-usa.liquid` tiene el setting `subscription_ui` para
  cambiar entre el selector propio y el widget de la app
  (`<div class="subscriptions_app_embed_block"></div>`). Son **mutuamente
  excluyentes**: los dos escriben el campo `selling_plan` del mismo form.

- **Los planes cargados no coinciden entre productos ni con el copy.** Medido
  contra `/products/<handle>.js`:

  | Producto | Cadencias | Aplica a | Descuento |
  |---|---|---|---|
  | HiPP Combiotik | 3 / 4 / 5 semanas | las 3 variantes | 8% |
  | HiPP Comfort | 4 / 5 / 6 semanas | las 3 variantes | 8% |
  | HiPP AR | 4 / 5 / 6 semanas | las 3 variantes | 8% |

  El copy aprobado dice **7 / 8 / 9 semanas** y que la suscripción es solo del
  pack de 8. `subscription-cadence` tiene el setting `source` para leer las
  cadencias reales del producto que se elija, en vez de los números escritos a
  mano. Queda en "Bloques" por defecto: **es una decisión del cliente, no
  técnica.**
