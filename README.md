# OfiBowlIDG

Proyecto web completo para gestionar la quiniela semanal de la NFL para los colaboradores de **ID Global Solutions**. Incluye frontend en React (Vite + Tailwind + Framer Motion + shadcn/ui) y backend en Node.js (Express + PostgreSQL + JWT), listos para desplegarse en **Vercel** y **Railway** respectivamente.

## Estructura del repositorio

```
ofibowlidg/
├── frontend/   # Aplicación React preparada para Vercel
└── backend/    # API Express lista para Railway
```

## Características principales

- Registro e inicio de sesión con tokens JWT y contraseñas encriptadas.
- Dashboard de picks con cuenta regresiva y bloqueo automático 1 hora antes del kickoff del jueves.
- Registro de marca de tiempo para desempates.
- Panel administrativo para cargar resultados y recalcular ranking.
- Ranking semanal y acumulado accesibles para todo el personal autenticado.
- Interfaz totalmente en español y con branding de ID Global Solutions.
- Preparado para despliegues rápidos en Vercel (frontend) y Railway (backend + PostgreSQL).

## Requisitos previos

- Node.js 18+
- PostgreSQL 14+
- Cuenta en Vercel y Railway (opcional para despliegue en la nube).

## Ejecución rápida con Docker Compose

Si prefieres evitar instalaciones manuales, puedes levantar toda la pila (PostgreSQL, API y frontend) con un solo comando utilizando Docker Compose:

```bash
docker compose up --build
```

Esto dejará disponibles los servicios en:

- Frontend: http://localhost:5173
- API: http://localhost:4000/api
- PostgreSQL: localhost:5432 (usuario `ofibowl`, contraseña `ofibowl`, base `ofibowlidg`)

La base de datos se inicializa automáticamente con el esquema definido en `backend/prisma/schema.sql`. Para detener los servicios ejecuta `docker compose down`. Los datos persistirán en el volumen `db-data` mientras no lo elimines (`docker compose down -v`).

## Configuración del backend

1. Copia el archivo de variables de entorno:
   ```bash
   cd ofibowlidg/backend
   cp .env.example .env
   ```
2. Ajusta los valores de `.env`:
   ```env
   PORT=4000
    DATABASE_URL=postgres://usuario:password@host:5432/ofibowlidg
    JWT_SECRET=tu_secreto
    CORS_ALLOWED_ORIGINS=http://localhost:5173
    CORS_ALLOW_CREDENTIALS=false
    ```
   - Puedes listar varios orígenes separados por comas y, si requieres enviar cookies, cambia `CORS_ALLOW_CREDENTIALS` a `true`.
3. Inicializa la base de datos ejecutando el script `schema.sql` en tu instancia PostgreSQL:
   ```bash
   psql "$DATABASE_URL" -f prisma/schema.sql
   ```
4. Instala dependencias y ejecuta el servidor local:
   ```bash
   npm install
   npm run dev
   ```
5. El backend quedará disponible en `http://localhost:4000/api`.

### Despliegue en Railway

1. Crea un proyecto de PostgreSQL y otro de Node.js.
2. Sube las variables `DATABASE_URL` (la que provee Railway) y `JWT_SECRET`.
3. Configura el comando de inicio como `npm start` y el puerto `4000`.
4. Ejecuta el script `prisma/schema.sql` desde la consola de PostgreSQL para crear las tablas.

## Configuración del frontend

1. Copia las variables de entorno:
   ```bash
   cd ofibowlidg/frontend
   cp .env.example .env
   ```
2. Ajusta `VITE_API_URL` para apuntar a la URL pública del backend (por ejemplo, la URL de Railway).
3. Instala dependencias y levanta el entorno local:
   ```bash
   npm install
   npm run dev
   ```
4. Vercel detectará automáticamente el proyecto Vite. Configura la variable `VITE_API_URL` en el panel de Vercel para apuntar al backend.

### Recursos gráficos

Coloca los logos oficiales de los 32 equipos de la NFL dentro de `frontend/public/images/teams/` siguiendo el patrón `nombre-del-equipo.png`. Estos archivos se consumen en la landing para mostrar el mosaico de franquicias.

## Endpoints principales del backend

- `POST /api/auth/register` – Registro de colaboradores.
- `POST /api/auth/login` – Inicio de sesión.
- `GET /api/auth/profile` – Perfil autenticado.
- `GET /api/games/week/:num` – Juegos y estado de bloqueo.
- `POST /api/picks` – Registro/actualización de picks (autenticado).
- `GET /api/ranking` – Ranking semanal y acumulado (autenticado).
- `POST /api/results` – Carga de resultados (requiere rol admin).

## Consideraciones de negocio

- Los picks se bloquean automáticamente una hora antes del kickoff del primer partido del jueves. Cada envío actualiza la marca de tiempo para desempate.
- El ranking semanal toma la última semana con resultados cargados; el acumulado considera todas las semanas.
- Para asignar privilegios de administrador, actualiza el campo `role` del usuario a `admin` en la base de datos.

## Próximos pasos sugeridos

- Integrar un proveedor de correo para confirmar registros.
- Añadir pruebas automatizadas para endpoints críticos.
- Incorporar carga masiva de partidos desde la API oficial de la NFL.

¡Listo! Clona el repo, configura tus variables y sube OfiBowlIDG a producción.
