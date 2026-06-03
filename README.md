# Mlooker

Marketplace de tokenización de regalías musicales.

| Módulo | Descripción |
|--------|-------------|
| [`api/`](api/) | API REST Spring Boot + MySQL |
| [`web/`](web/) | Frontend React (Vite) conectado a la API |

## Arranque local (KAN-19)

### 1. API (puerto 8080)

Definir variables de entorno MySQL:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/mlooker"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="tu_password"
```

En el perfil `local` se cargan credenciales de demo (`admin`/`admin`, API Key `dev-api-key`) y se siembran canciones si la tabla está vacía.

```powershell
cd api
.\mvnw.cmd spring-boot:run
```

### 2. Frontend (puerto 5173)

Copiar variables de entorno:

```powershell
cd web
copy .env.example .env
npm install
npm run dev
```

Abrir http://localhost:5173 — el marketplace lista activos reales de MySQL. **Invertir** hace `POST /api/v1/inversores/{id}/invertir` (requiere `X-API-Key` en `.env`).

### CORS

`WebConfig` + `@CrossOrigin` en controladores permiten peticiones desde `http://localhost:5173`.

### Endpoints usados por el frontend

| Método | Ruta |
|--------|------|
| GET | `/api/v1/activos` |
| GET | `/api/v1/inversores/{id}` |
| POST | `/api/v1/inversores/{id}/invertir` |
