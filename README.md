# Urbont Website — Next.js / AWS Amplify

Sitio público de Urbont: landing, ciudades, altas de conductor y valet, login y
panel de usuario. Construido sobre **Next.js 15 (App Router)** y preparado para
desplegarse en **AWS Amplify Hosting** con SSR.

---

## Arranque local

```bash
npm install
cp .env.example .env.local   # completar los valores
npm run dev                  # http://localhost:3000
```

| Script              | Qué hace                                   |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Servidor de desarrollo en el puerto 3000   |
| `npm run build`     | Build de producción                        |
| `npm start`         | Sirve el build en el 3000 (respeta `PORT`) |
| `npm run typecheck` | Comprueba tipos sin emitir                 |
| `npm run test:otp`  | Prueba send + verify contra `localhost:3000` |

---

## Variables de entorno

Las que llevan `NEXT_PUBLIC_` viajan en el bundle del navegador; el resto sólo
existen en el servidor.

| Variable                        | Ámbito    | Para qué                                 |
| ------------------------------- | --------- | ---------------------------------------- |
| `APP_ENV`                       | Servidor  | `production` (defecto) o `development`   |
| `SUPABASE_URL`                  | Servidor  | Proyecto de Supabase                     |
| `SUPABASE_SERVICE_ROLE_KEY`     | Servidor  | Acceso completo desde los route handlers |
| `NEXT_PUBLIC_SUPABASE_URL`      | Navegador | Login con Google                         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Navegador | Clave publicable (RLS la limita)         |
| `JWT_SECRET`                    | Servidor  | Firma de los tokens de sesión y de OTP   |
| `TWILIO_ACCOUNT_SID`            | Servidor  | SMS del OTP                              |
| `TWILIO_AUTH_TOKEN`             | Servidor  | SMS del OTP                              |
| `TWILIO_PHONE_NUMBER`           | Servidor  | Número remitente                         |

**`JWT_SECRET` no tiene valor por defecto**: si falta, la aplicación falla al
arrancar en lugar de firmar con un secreto conocido. Generar uno con:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Sin Twilio, `/api/otp/send` devuelve el código en la respuesta (`devCode`) **sólo
con `APP_ENV=development`**; con el valor por defecto (`production`) responde 503.

Para probar el login por teléfono en local sin SMS, añade a `.env.local`:

```bash
APP_ENV=development
```

En Vercel/Amplify **no definas** `APP_ENV` (o déjala en `production`).

---

## Arquitectura

Frontend y backend viven en el mismo proyecto: las páginas son componentes de
cliente y los endpoints son route handlers bajo `src/app/api/`. Al compartir
origen no hay CORS, y las credenciales de Supabase nunca salen del servidor.

```
src/
├── app/
│   ├── layout.tsx          # metadata, SEO y JSON-LD
│   ├── providers.tsx       # i18n · React Query · Auth · Tooltip · Lenis
│   ├── template.tsx        # transición de entrada entre páginas
│   ├── page.tsx            # landing
│   ├── login/              # OTP por SMS + Google OAuth
│   ├── auth/callback/      # retorno de Google
│   ├── dashboard/          # panel de usuario según rol
│   ├── cities · conductor · valet · privacy · terms
│   └── api/                # 10 route handlers
├── components/             # UI compartida (shadcn/Radix)
├── context/auth-context.tsx
├── i18n/                   # 5 idiomas
└── lib/
    ├── supabase.ts         # cliente de navegador (sólo OAuth)
    ├── structured-data.ts  # schema.org
    └── server/             # env · jwt · otp · supabase · auth
```

### Autenticación

Dos vías que terminan en el mismo JWT de Urbont, así que el resto de la app no
distingue cómo se inició sesión:

- **Teléfono** — `/api/otp/send` firma un token con el hash del código y lo
  devuelve; `/api/otp/verify` lo valida. El código nunca se guarda en base de
  datos.
- **Google** — `signInWithOAuth` → `/auth/callback` → `/api/auth/oauth-web`,
  que valida el token contra Supabase y emite el JWT.

---

## Despliegue en AWS Amplify

### Requisitos verificados

| Requisito          | Estado                                                           |
| ------------------ | ---------------------------------------------------------------- |
| Versión de Next.js | **15.5.24** — Amplify soporta SSR para Next.js 12–15 (16 aún no) |
| Runtime de Node    | **≥ 20** (`engines`) — Amplify ofrece Node 20/22/24              |
| Plataforma         | **WEB_COMPUTE** — se detecta sola al no usar `output: 'export'`  |
| Build spec         | `amplify.yml` con `baseDirectory: .next`                         |
| Lockfile           | `package-lock.json` commiteado (lo exige `npm ci`)               |

### Pasos

1. **Conectar el repositorio** en la consola de Amplify
   (_New app → Host web app_) y elegir la rama.

2. **Build spec**: Amplify detecta `amplify.yml` automáticamente.

3. **Variables de entorno** — _App settings → Environment variables_: cargar las
   8 de la tabla de arriba. Sin ellas el build pasa, pero la aplicación falla en
   caliente.

4. **Desplegar.** Amplify ejecuta `npm ci` → `npm run build` y publica `.next`
   en la plataforma de cómputo.

5. **Dominio** (opcional): _App settings → Domain management_.

> No añadir `output: 'export'`. Convertiría el sitio en estático y los 10
> endpoints de `src/app/api/` dejarían de existir.

### Google OAuth

En Supabase (_Authentication → URL Configuration_) hay que añadir la URL de
callback del dominio de producción:

```
https://<dominio>/auth/callback
```

---

## Pendiente

Cuatro endpoints que el frontend llama y todavía no existen — los formularios
correspondientes no guardan nada:

| Endpoint                   | Lo llama          |
| -------------------------- | ----------------- |
| `/api/waitlist`            | landing, ciudades |
| `/api/demands`             | ciudades          |
| `/api/applications/driver` | alta de conductor |
| `/api/applications/valet`  | alta de valet     |

Las tablas `driver_applications` y `valet_applications` ya existen en la base de
datos.

+13055551234
