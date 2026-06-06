# Backend Transmetro (Express + Oracle XE 21c)

## Requisitos

- Node.js 18+ (recomendado)
- Docker

## Oracle XE 21c en Docker (local)

```bash
docker run -d --name oracle-xe \
  -p 1521:1521 \
  -e ORACLE_PASSWORD=oracle \
  gvenzl/oracle-xe:21-slim
```

El usuario SYS tendrá contraseña `oracle` (se usará posteriormente para crear el usuario de aplicación `transmetro` y migrar el schema).

## Variables de entorno

Copia `.env.example` a `.env` y ajusta según tu ambiente:

- `PORT`
- `ORACLE_USER`
- `ORACLE_PASSWORD`
- `ORACLE_CONNECT_STRING` (ej: `localhost:1521/XEPDB1`)
- `ORACLE_POOL_MIN`, `ORACLE_POOL_MAX`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

## Crear usuario y cargar schema/seed

1) Conéctate como SYS y crea el usuario de aplicación:

```sql
ALTER SESSION SET CONTAINER = XEPDB1;

CREATE USER transmetro IDENTIFIED BY transmetro2026;
GRANT CREATE SESSION, CREATE TABLE, CREATE SEQUENCE, CREATE TRIGGER, CREATE VIEW, CREATE PROCEDURE TO transmetro;
ALTER USER transmetro QUOTA UNLIMITED ON USERS;
```

2) Conéctate como `transmetro` y ejecuta:

- `database/schema.sql`
- `database/seed.sql`

## Instalación y arranque

```bash
npm install
npm run dev
```

## Credenciales iniciales (seed)

- `superadmin` / `ChangeMe2026!` (Super Admin)
- `adminemt` / `ChangeMe2026!` (Admin EMT)
- `operador` / `ChangeMe2026!` (Operador)
- `supervisor` / `ChangeMe2026!` (Supervisor de Línea)
- `auditor` / `ChangeMe2026!` (Auditor/Dirección)

## Healthcheck

- `GET /api/health`
- Respuesta esperada:
  - OK: `{ "db": "ok", "db_name": "<nombre>" }`
  - Error: `{ "db": "error", "message": "<detalle>" }`

## Notas de despliegue

Despliegue en Railway pendiente — requiere instancia Oracle externa accesible desde internet (Oracle Cloud Free Tier ATP es la opción evaluada).
