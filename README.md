# Digital Builders Software

Sistema personal de gestión para Digital Builders: clientes, finanzas y calendario, con landing pública de la agencia.

## Qué incluye

- **Landing pública** (`/`): página de marketing de la agencia (no forma parte del panel).
- **Dashboard** (`/dashboard`): resumen del mes (cobrado, gastado, balance), próximos cobros, próximos pagos y próximos eventos.
- **Clientes** (`/clientes`): fichas de empresas cliente (contacto, estado, notas, logo) con sus finanzas y eventos asociados.
- **Finanzas** (`/finanzas`): cobros y gastos en USD/UYU, únicos o recurrentes (mensual/anual), con estados pendiente/pagado/cancelado, vencimientos e historial. Al marcar como pagado un movimiento recurrente se genera automáticamente la próxima cuota.
- **Calendario** (`/calendario`): reuniones, entregas, pagos y recordatorios, con vista mensual y lista de próximos eventos.
- **Usuarios** (`/users`): alta y baja de usuarios del sistema (roles `professional` / `client`).

## Stack

- React 18 + TypeScript + Vite (PWA instalable)
- Tailwind CSS + shadcn/ui
- Supabase: Postgres con RLS, Auth (email/password), Storage y Edge Functions (`create-user`, `delete-user`)
- Multi-moneda USD/UYU con cotización manual guardada en `system_settings`

## Modelo de datos activo

- `clients` — fichas de empresas cliente
- `transactions` — cobros y gastos (tipo, estado, monto, moneda, vencimiento, recurrencia, cliente opcional)
- `calendar_events` — eventos del calendario (fecha, hora, tipo, cliente opcional)
- `profiles`, `user_roles` — usuarios y roles (`professional` gestiona todo; `client` reservado para un futuro portal)
- `system_settings` — configuración (cotización USD→UYU)

Las tablas del sistema anterior (catálogo, packs, suscripciones, bots, empresas) siguen en la base por seguridad pero ya no se usan desde la aplicación.

## Migraciones

Las migraciones viven en `supabase/migrations/`. La migración `20260908000000_personal_finance_calendar.sql` crea `transactions` y `calendar_events`; debe aplicarse en el proyecto Supabase para que los módulos de Finanzas y Calendario funcionen.

## Desarrollo local

```sh
npm i        # o bun install
npm run dev
npm run build
npm run lint
npm test
```

---

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://digitalbuilders.lovable.app

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/045ee3b2-bca9-4526-acac-03117ecded7a). Every change made in Lovable is committed straight to this repository, and pushes to `main` sync back into Lovable.
