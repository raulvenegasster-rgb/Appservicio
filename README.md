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

## ¿Qué hago para verlo funcionando?

Si lo único que quieres es **ver el proyecto corriendo** sin tocar código, tienes dos caminos:

1. **Arranque inmediato con Docker Compose** (no instala nada extra en tu sistema).
2. **Arranque manual** instalando dependencias de frontend y backend por separado.

Ambas opciones se detallan abajo; elige la que te resulte más cómoda.

## Guía express: descargar, subir a GitHub y desplegar

Si solo quieres tomar el código tal cual, subirlo a tu cuenta de GitHub y después desplegar el frontend en Vercel (manteniendo el backend listo para Railway), sigue estos pasos resumidos:

1. **Descargar el proyecto**
   - En GitHub (o desde este entorno) haz clic en **Code → Download ZIP** o clona el repositorio con `git clone`.
   - Descomprime el ZIP (si aplica) y verifica que conserva la carpeta raíz `ofibowlidg/` con `frontend/` y `backend/` adentro.

2. **Crear tu repositorio en GitHub**
   - Inicia sesión en tu cuenta, pulsa **New repository** y nómbralo como prefieras (por ejemplo, `ofibowlidg`).
   - Sube todos los archivos descargados usando la opción de arrastrar y soltar carpetas en el navegador o, si prefieres Git, ejecuta:
     ```bash
     git init
     git add .
     git commit -m "Subir proyecto OfiBowlIDG"
     git branch -M main
     git remote add origin https://github.com/tu-usuario/ofibowlidg.git
     git push -u origin main
     ```

3. **Configurar variables de entorno en GitHub (opcional pero recomendado)**
   - En la sección **Settings → Secrets and variables → Actions** añade tus variables `DATABASE_URL` y `JWT_SECRET` si planeas ejecutar flujos CI/CD que las necesiten.

4. **Desplegar el frontend en Vercel**
   - Entra a [vercel.com](https://vercel.com), pulsa **New Project → Import Git Repository** y selecciona tu repo.
   - Al detectar la carpeta `frontend/`, Vercel usará el framework Vite automáticamente. Configura la variable `VITE_API_URL` apuntando a tu backend (por ahora puede ser la URL local o la que tengas en Railway).
   - Haz clic en **Deploy** y espera a que finalice la construcción. Obtendrás una URL pública para compartir.

5. **Desplegar el backend (Railway o servidor propio)**
   - Aunque Vercel solo aloja el frontend, necesitas que el backend esté en Railway (o en otro servidor Node.js con PostgreSQL). Sigue la sección [Despliegue en Railway](#despliegue-en-railway) más abajo para completar este paso.

Con esto habrás subido el código a tu GitHub y tendrás el frontend en Vercel sin pasos extra. Cuando quieras actualizar el proyecto, solo modifica tus archivos locales, haz `git commit` y `git push`; Vercel redeplegará automáticamente.

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

## Ejecución manual sin Docker

Si deseas ejecutar cada parte por separado (útil cuando quieres hacer cambios rápidos o no puedes usar Docker), sigue estos pasos:

### 1. Backend (API Express)

```bash
cd ofibowlidg/backend
cp .env.example .env               # crea tus variables locales
psql "postgres://usuario:pass@localhost:5432/postgres" -f prisma/schema.sql   # crea tablas (ajusta la URL a tu PostgreSQL)
npm install                        # instala dependencias
npm run dev                        # inicia el servidor en http://localhost:4000/api
```

- Asegúrate de que `DATABASE_URL` del `.env` apunte a una base PostgreSQL accesible.
- Si aún no tienes PostgreSQL instalado, puedes instalarlo localmente o usar cualquier servicio alojado y actualizar la URL.
- El comando `npm run dev` usa `nodemon` para recargar el servidor ante cambios.

### 2. Frontend (React + Vite)

En otra terminal:

```bash
cd ofibowlidg/frontend
cp .env.example .env               # apunta VITE_API_URL a tu backend (ej. http://localhost:4000/api)
npm install                        # instala dependencias del frontend
npm run dev                        # abre http://localhost:5173 con la app
```

- El frontend cargará picks, rankings y formularios usando la API que definiste en `VITE_API_URL`.
- Para cerrar la sesión localmente basta con pulsar el botón de salir; los tokens se guardan en `localStorage`.

Cuando quieras detener ambos servidores, presiona `Ctrl + C` en cada terminal.

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
