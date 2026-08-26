# Digital Builders Software

PROYECTO: “Digital Builders Bots”
OBJETIVO MVP:
Crear un panel web multi-empresa para conectar bots (BuilderBot) mediante BOT_ID + TOKEN y mostrar estadísticas básicas por día. Debe ser simple, escalable y con UI moderna tecnológica (fondo negro/gris). No guardar conversaciones ni texto; solo contadores agregados.

DISEÑO / UI (CRÍTICO):
- Estilo ultra moderno, tecnológico, “software enterprise”.
- Fondo SIEMPRE negro o gris oscuro (#0B0B0F / #121217 aprox). Textos en blanco/grises. Acentos sutiles (cyan/azul) solo para highlights.
- Animación sutil en el hero/login: “onda/partículas” o “grid futurista” (NO pesado). Debe sentirse premium.
- Tipografía moderna (sans). Mucho aire, tarjetas con bordes suaves, sombras sutiles.
- Layout responsive (desktop primero, pero funcional en mobile).

AUTENTICACIÓN Y ROLES:
- Autenticación con email/password.
- Roles por empresa: owner y viewer.
- Un usuario puede pertenecer a varias empresas.
- RLS / permisos: cada usuario SOLO ve datos de sus empresas.

BASE DE DATOS (TABLAS):
1) companies
- id (uuid, pk)
- name (text)
- created_at (timestamp)

2) users (si la plataforma ya trae auth users, usar su tabla; sino crear users)
- id (uuid)
- email
- name
- created_at

3) company_users
- id (uuid)
- company_id (fk companies)
- user_id (fk users/auth)
- role (text: 'owner' | 'viewer')
- created_at

4) bots
- id (uuid, pk)
- company_id (fk companies)
- name (text)
- token (text, secreto)
- created_at
- last_event_at (timestamp nullable)
- status (text: 'active' | 'paused', default 'active')

5) events_daily
- id (uuid, pk)
- company_id (fk companies)
- bot_id (fk bots)
- date (date)
- msg_in_count (int default 0)
- msg_out_count (int default 0)
- handoff_count (int default 0)
- lead_count (int default 0)
- error_count (int default 0)
- updated_at (timestamp)

REGLAS DE PERMISOS (CRÍTICO):
- company_users: solo owners pueden invitar/gestionar.
- bots/events_daily: solo accesibles si el usuario pertenece a la company_id.
- No exponer tokens a viewers (solo owners pueden ver/copiar token).

API / ENDPOINT DE TRACKING (CRÍTICO):
Crear un endpoint HTTP:
POST /api/track
Body JSON:
{
  "bot_id": "uuid",
  "token": "string",
  "type": "msg_in" | "msg_out" | "handoff" | "lead" | "error",
  "date": "YYYY-MM-DD" (opcional)
}

Comportamiento:
- Validar bot_id existe y token coincide.
- Validar bot status = active (si paused, responder 403).
- Resolver date: si no viene, usar fecha actual del servidor.
- Upsert en events_daily por (company_id, bot_id, date).
- Incrementar el contador según type.
- Actualizar bots.last_event_at = now().
- Respuesta JSON: { "ok": true }

SEGURIDAD:
- El endpoint NO requiere login, pero SI requiere bot_id+token válidos.
- Rate limit básico por bot (si existe posibilidad). Si no, al menos validación y respuesta rápida.

PANTALLAS (MVP):
1) Login
- Fondo negro/gris, con animación sutil futurista.
- Logo arriba (cuando lo suba, usarlo).
- Formulario centrado, minimal.

2) Dashboard (por empresa)
- Selector de empresa si el usuario tiene más de una.
- KPIs en cards: Mensajes recibidos, Mensajes enviados, Derivaciones, Leads, Errores.
- Filtros: Hoy / 7 días / 30 días.
- Gráfico simple de línea o barras con últimos 14/30 días (sumando bots).
- “Estado del sistema”: última actividad (máximo last_event_at entre bots).

3) Bots (por empresa)
- Tabla/lista: nombre, estado, última actividad.
- Botón “Crear bot” (solo owner): name -> genera token automáticamente.
- Para cada bot (solo owner): botón “Copiar BOT_ID”, “Copiar TOKEN”, “Copiar ejemplo de payload”, “Copiar URL del endpoint”.
- Viewer solo ve nombre/estado/última actividad, NO token.

4) Gestión de usuarios (solo owner)
- Invitar usuario por email como viewer (simple).
- Listar miembros y rol.
- (Opcional) Cambiar rol / eliminar.

DATOS DE DEMO / SEED (para probar):
- Crear una empresa demo “Digital Builders (Demo)”.
- Crear un owner demo (mi usuario) como owner.
- Crear un bot demo y mostrar cómo enviar /api/track desde un ejemplo.

COPYS (TEXTOS):
- Nombre del producto: “Digital Builders Bots”
- Slogan corto en login: “Panel de métricas y control para tus bots.”
- En Bots: “Conectá BuilderBot enviando eventos a /api/track.”

ENTREGABLE:
- App funcionando end-to-end: login, multiempresa, bots, dashboard, endpoint track.
- UI moderna y tecnológica en fondo oscuro con animación sutil.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://digitalbuilders.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/045ee3b2-bca9-4526-acac-03117ecded7a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
