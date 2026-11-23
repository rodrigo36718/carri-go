# Carri-GO

Plataforma web de delivery y encargos.  
Los **restaurantes** publican platos, los **repartidores** publican su servicio, y un **administrador** debe aprobar esas publicaciones antes de que se muestren en Delivery y Encargos.

---

## Tecnologías

| Capa          | Tecnología                          |
|---------------|-------------------------------------|
| Frontend      | React (Create React App)            |
| Backend       | Node.js + Express                   |
| Base de datos | PostgreSQL                          |
| Vistas admin  | Handlebars (HBS)                    |
| Auth          | JWT (API) + sesiones (panel admin)  |
| Imágenes      | Cloudinary (opcional)               |

---

## Puertos

| Servicio              | URL / Puerto                        |
|-----------------------|-------------------------------------|
| Frontend (React)      | http://localhost:3000               |
| Backend (API + Admin) | http://localhost:3001               |  
| PostgreSQL            | localhost:5432 (por defecto)        |

---

## Roles de usuario

| Rol             | Qué puede hacer |
|-----------------|-----------------|
| **cliente**     | Ver Delivery y Encargos, pedir platos y encargos |
| **restaurante** | Publicar platos desde **Mis Platos**. Quedan en estado *pendiente* hasta que el admin los apruebe |
| **repartidor**  | Publicar su servicio desde **Mi Servicio**. Queda *pendiente* hasta que el admin lo apruebe |
| **admin**       | Entrar al panel en el backend y **aprobar o rechazar** platos y servicios |

Solo los platos y servicios con estado **aprobado** aparecen en Delivery y Encargos.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) (v16 o superior)
- [PostgreSQL](https://www.postgresql.org/) (v13 o superior)
- [pgAdmin](https://www.pgadmin.org/) (recomendado) o cliente SQL
- Git
- Cuenta en [Cloudinary](https://cloudinary.com/) (solo si vas a subir imágenes)

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/rodrigo36718/carri-go.git
cd carri-go