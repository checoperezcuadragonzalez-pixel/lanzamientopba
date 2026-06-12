# PBA Centro de Mando — Deploy en Vercel

## Qué necesitas
- Una cuenta de GitHub (gratis): github.com
- Una cuenta de Vercel (gratis): vercel.com
- El archivo `.zip` de esta carpeta (te lo entregué)

---

## PASO 1 — Sube el código a GitHub (5 min)

1. Ve a **github.com** → haz clic en "New repository"
2. Ponle de nombre: `pba-dashboard`
3. Selecciona "Private" (para que nadie más vea el código)
4. Clic en "Create repository"
5. En la página que aparece, busca la sección "…or upload an existing file"
6. Arrastra **todos los archivos** de esta carpeta (descomprimida) ahí
7. Clic en "Commit changes"

---

## PASO 2 — Conecta con Vercel (3 min)

1. Ve a **vercel.com** → "Add New Project"
2. Selecciona "Import Git Repository"
3. Conecta tu cuenta de GitHub
4. Elige el repositorio `pba-dashboard`
5. En "Framework Preset" selecciona **Next.js** (lo detecta solo)
6. Clic en **Deploy** — espera 2 minutos

---

## PASO 3 — Activa la base de datos (Vercel KV) (2 min)

Esto es lo que hace que TODOS vean los mismos datos en tiempo real.

1. En tu proyecto de Vercel → pestaña **Storage**
2. Clic en **Create Database** → elige **KV (Redis)**
3. Dale un nombre: `pba-production`
4. Selecciona la región más cercana (US East o EU West)
5. Clic en "Create"
6. Vercel automáticamente agrega las variables de entorno necesarias a tu proyecto
7. Ve a **Settings → Environment Variables** y verifica que existen:
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

Si las ves → ¡listo!

---

## PASO 4 — Redespliega (1 clic)

Después de conectar el KV:
1. Ve a tu proyecto en Vercel → pestaña **Deployments**
2. Clic en los 3 puntos del último deployment → "Redeploy"
3. Espera 1 minuto

---

## PASO 5 — Comparte el link (10 segundos)

Vercel te da un link tipo:
`https://pba-dashboard-xxx.vercel.app`

Mándalo a Marce, Joc, José y David. Todos van a ver exactamente los mismos datos en tiempo real.

**Opcional — custom domain:** si quieres un link más limpio como `pba.tudominio.com`, ve a **Settings → Domains** y agrégalo.

---

## Si algo falla

**Error "KV_URL is not defined":**
→ Asegúrate de haber hecho el Redeploy DESPUÉS de conectar el KV.

**Error de build:**
→ Verifica que subiste TODOS los archivos, incluyendo la carpeta `app/` completa.

**El dashboard carga pero no guarda:**
→ Revisa que el KV esté conectado al proyecto correcto (no a otro).

---

## Estructura del proyecto

```
pba-dashboard/
├── app/
│   ├── layout.js          ← HTML base con fuentes
│   ├── page.js            ← Todo el dashboard (React)
│   ├── globals.css        ← Variables de color
│   └── api/
│       └── state/
│           └── route.js   ← API que lee/escribe en Vercel KV
├── next.config.js
├── package.json
└── README.md (este archivo)
```

## Cómo funciona la memoria

- Cada vez que alguien hace +/− en una venta, palomea un checklist, agrega un lead o un ad, el dashboard hace un `POST /api/state` a Vercel KV.
- Cuando alguien ABRE el dashboard, hace un `GET /api/state` y obtiene el estado más reciente.
- El guardado tiene un delay de 0.8 segundos para no saturar la API.
- Si el KV no está disponible, el dashboard muestra el estado local de esa sesión.

## Costos

Todo es **gratis** en los tiers que necesitas:
- Vercel Hobby: gratis (proyectos personales)
- Vercel KV: 30,000 comandos/día gratis — el dashboard usa ~10-20 por sesión activa.

Si en algún momento superas los límites (cuando PBA tenga miles de usuarios), upgradeas a Vercel Pro ($20/mes).
