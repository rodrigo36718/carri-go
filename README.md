# Carri-GO

Plataforma web de delivery y encargos. El proyecto está dividido en dos aplicaciones: un frontend desarrollado con React y un backend desarrollado con Node.js, Express y PostgreSQL.

> **Importante para quienes prueben el proyecto:** antes de ejecutarlo, revisen y cambien las credenciales del archivo `backend/.env`, especialmente la contraseña de PostgreSQL y los secretos. No reutilicen las credenciales publicadas en un entorno real.

## Tabla de contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos](#requisitos)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [Configuración del entorno](#configuración-del-entorno)
- [Configuración de PostgreSQL](#configuración-de-postgresql)
- [Acceso al administrador](#acceso-al-administrador)
- [Rutas principales de la API](#rutas-principales-de-la-api)
- [Compilar el frontend](#compilar-el-frontend)
- [Solución de problemas](#solución-de-problemas)
- [Seguridad](#seguridad)

## Características

Carri-GO contempla distintos tipos de cuentas:

- **Cliente:** puede utilizar la plataforma como usuario.
- **Restaurante:** puede publicar productos para la sección Delivery.
- **Repartidor:** puede habilitar una o ambas modalidades desde una misma cuenta:
  - **Delivery:** pedidos de restaurantes.
  - **Encargos:** compras, mandados y trámites.

Los productos y servicios publicados quedan pendientes de aprobación y se administran desde el panel de administración.

## Tecnologías

### Frontend
- React
- JavaScript
- CSS
- React Router
- Axios

### Backend
- Node.js
- Express
- PostgreSQL
- `pg` (cliente de PostgreSQL)
- JSON Web Token (JWT)
- bcrypt
- Cloudinary (carga de imágenes)
- Nodemailer (dependencia incluida en el backend)

## Estructura del proyecto

```text
carri-go/
├── backend/
│   ├── bin/
│   ├── models/
│   ├── routes/
│   │   └── admin/
│   ├── views/
│   ├── public/
│   ├── carrigo.sql
│   ├── app.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── public/
    ├── src/
    └── package.json
```

## Requisitos

Instalá los siguientes programas antes de comenzar:

1. **Node.js LTS**, que incluye npm.
2. **PostgreSQL**.
3. Un cliente para administrar PostgreSQL, por ejemplo pgAdmin (opcional).
4. **Git**, para clonar el repositorio.

## Instalación y ejecución local

### 1. Clonar el repositorio

Abrí una terminal y ejecutá:

```bash
git clone https://github.com/rodrigo36718/carri-go.git
cd carri-go
```

### 2. Crear la base de datos

Desde PostgreSQL, creá una base de datos llamada:

```sql
CREATE DATABASE carrigo;
```

Después importá el archivo SQL incluido en el backend.

En Windows, desde la carpeta raíz del proyecto, podés ejecutar:

```bash
psql -U postgres -d carrigo -f backend/carrigo.sql
```

Si utilizás pgAdmin, seleccioná la base de datos `carrigo`, abrí la herramienta Query Tool, cargá el archivo `backend/carrigo.sql` y ejecutalo.

El script crea las tablas principales para usuarios, direcciones, restaurantes, categorías, productos, pedidos, encargos, servicios de repartidores, asignaciones, pagos, calificaciones, notificaciones e historial de estados.

### 3. Configurar las variables del backend

El backend utiliza variables de entorno. El archivo de configuración está en:

```text
backend/.env
```

Abrilo y reemplazá los valores por los de tu propia instalación. Como mínimo, verificá estos parámetros:

```env
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=carrigo
PG_PASSWORD=TU_CONTRASEÑA_DE_POSTGRESQL
PG_PORT=5432
JWT_SECRET=CAMBIAR_POR_UN_SECRETO_LARGO_Y_ALEATORIO

CLOUDINARY_URL=TU_URL_DE_CLOUDINARY

SMTP_HOST=TU_SERVIDOR_SMTP
SMTP_PORT=TU_PUERTO_SMTP
SMTP_USER=TU_USUARIO_SMTP
SMTP_PASS=TU_CONTRASEÑA_SMTP
```

- `PG_PASSWORD`: contraseña configurada para tu usuario de PostgreSQL.
- `JWT_SECRET`: reemplazalo por una clave privada, larga y aleatoria.
- `CLOUDINARY_URL`: configurala si vas a utilizar la carga de imágenes.
- Las variables `SMTP_*` corresponden a la configuración SMTP disponible en el archivo de entorno; completalas con los datos de tu proveedor si utilizás esa integración.

No copies literalmente los valores de ejemplo. Si alguna integración externa no se utiliza en tu prueba, verificá su configuración antes de probar esa funcionalidad.

**Aviso de seguridad:** en el estado actual del repositorio, `backend/.env` está incluido en Git. Por eso, no alcanza con cambiarlo localmente: las credenciales que hayan estado en ese archivo deben considerarse expuestas y deben rotarse. No subas nuevamente el archivo con tus contraseñas reales. En una futura limpieza del repositorio, el archivo debe dejar de estar versionado y agregarse a `.gitignore`.

### 4. Instalar e iniciar el backend

Abrí una terminal en la carpeta raíz del proyecto y ejecutá:

```bash
cd backend
npm install
npm start
```

El backend se inicia por defecto en:

```text
http://localhost:3001
```

Para comprobar la API, abrí:

```text
http://localhost:3001/api
```

La API devuelve un mensaje de funcionamiento y una lista de endpoints.

Dejá esta terminal abierta mientras utilizás la aplicación.

### 5. Instalar e iniciar el frontend

Abrí una **segunda terminal**. Desde la carpeta raíz del repositorio, ejecutá:

```bash
cd frontend
npm install
npm start
```

El frontend se inicia normalmente en:

```text
http://localhost:3000
```

Si el navegador no se abre automáticamente, ingresá esa dirección manualmente.

**Importante:** mantené abiertas las dos terminales: una para el backend y otra para el frontend.

## Acceso al administrador

El panel de administración está disponible en:

```text
http://localhost:3001/admin/login
```

Credenciales de prueba informadas para el proyecto:

| Campo | Valor |
|---|---|
| Correo | `admin1@gmail.com` |
| Contraseña | `admin123` |

**Nota sobre la base de datos:** el bloque de administrador incluido al final de `backend/carrigo.sql` contiene actualmente un hash de contraseña marcado como `placeholder`. Por lo tanto, importar el SQL tal como está no garantiza que la contraseña `admin123` funcione. Para utilizar ese acceso, la contraseña almacenada para `admin1@gmail.com` debe ser un hash bcrypt válido de `admin123`. No guardes contraseñas en texto plano.

Para generar un hash bcrypt desde la carpeta `backend`, con las dependencias instaladas, podés ejecutar:

```bash
node -e "require('bcrypt').hash('admin123', 10).then(console.log)"
```

Copiá el hash generado y actualizá el registro administrador en PostgreSQL:

```sql
UPDATE usuarios
SET password = 'PEGAR_AQUI_EL_HASH_BCRYPT'
WHERE email = 'admin1@gmail.com' AND rol = 'admin';
```

Si el usuario administrador no existe, primero debe crearse un registro con rol `admin` y una contraseña almacenada como hash bcrypt.

## Rutas principales de la API

El backend monta las rutas de la API bajo el prefijo `/api`.

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/register` | Registrar un usuario |
| POST | `/api/login` | Iniciar sesión y obtener un token |
| GET | `/api/productos` | Consultar productos aprobados |
| POST | `/api/productos` | Crear un producto (requiere token y rol restaurante) |
| PUT | `/api/productos/:id` | Actualizar un producto (requiere token y rol restaurante) |
| DELETE | `/api/productos/:id` | Eliminar un producto (requiere token y rol restaurante) |
| GET | `/api/servicios` | Consultar servicios de repartidores aprobados |
| POST | `/api/servicios` | Publicar o actualizar un servicio (requiere token y rol repartidor) |
| GET | `/api/admin/pendientes` | Consultar publicaciones pendientes (requiere token de administrador) |
| PUT | `/api/admin/productos/:id/aprobar` | Aprobar un producto (requiere token de administrador) |
| PUT | `/api/admin/servicios/:id/aprobar` | Aprobar un servicio (requiere token de administrador) |

Las rutas del panel web de administración se encuentran bajo `/admin`.

## Compilar el frontend

Para generar una versión de producción del frontend:

```bash
cd frontend
npm install
npm run build
```

La compilación se genera en la carpeta:

```text
frontend/build/
```

Este comando compila el frontend; no configura por sí solo el alojamiento del backend ni la base de datos.

## Solución de problemas

### Error de conexión con PostgreSQL

- Verificá que el servicio de PostgreSQL esté iniciado.
- Comprobá que exista la base de datos `carrigo`.
- Revisá `PG_USER`, `PG_PASSWORD`, `PG_HOST` y `PG_PORT` en `backend/.env`.
- Confirmá que hayas ejecutado `backend/carrigo.sql`.

### El puerto 3001 ya está en uso

Cerrá el proceso que esté utilizando el puerto o cambiá `PORT` en `backend/.env` y reiniciá el backend.

### El frontend no se conecta con el backend

- Confirmá que el backend esté ejecutándose en `http://localhost:3001`.
- Verificá que las solicitudes del frontend apunten al puerto correcto.
- Revisá la consola del navegador y la terminal del backend para identificar el error.

### No funciona el inicio de sesión del administrador

- Confirmá que exista `admin1@gmail.com` en la tabla `usuarios`.
- Verificá que el usuario tenga el rol `admin`.
- Asegurate de que la contraseña almacenada sea un hash bcrypt válido.
- Recordá que el hash de ejemplo del SQL está marcado como placeholder y debe reemplazarse.

### Error de módulo no encontrado al iniciar el backend

Verificá que estés ejecutando los comandos dentro de la carpeta `backend` y que la instalación de dependencias haya terminado correctamente:

```bash
cd backend
npm install
npm start
```

## Seguridad

- No publiques contraseñas reales, tokens, claves JWT ni credenciales de servicios externos.
- Cambiá las credenciales incluidas en `backend/.env` antes de probar el proyecto.
- Rotá cualquier secreto que haya sido subido previamente al repositorio.
- No uses las credenciales de demostración en producción.
- Utilizá HTTPS, validación de datos y una configuración segura de sesiones antes de desplegar el sistema públicamente.

---

Proyecto Carri-GO.
