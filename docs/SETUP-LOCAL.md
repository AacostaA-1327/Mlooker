# Arrancar Mlooker en otro PC (sin subir contraseñas a Git)

## Qué compartís entre el equipo

| Compartir por Git (clone) | Compartir en privado (WhatsApp, clase, etc.) |
|---------------------------|-----------------------------------------------|
| Código del repo           | Contraseña MySQL de desarrollo                |
| Plantillas `.example`     | (Opcional) API key si cambiáis la de demo     |

**Nunca** commitear `application-local.properties`, `run-local.ps1` ni `web/.env`.

## Requisitos en cada PC

- Java 17+
- MySQL en marcha (puerto 3306)
- Node.js (para `web/`)

## API (puerto 8080) — elige un método

### Método A — Fichero local (recomendado)

```powershell
cd api\src\main\resources
copy application-local.properties.example application-local.properties
```

Edita `application-local.properties` y cambia `PON_TU_PASSWORD_MYSQL` por la contraseña que os hayan dado.

```powershell
cd api
.\mvnw.cmd spring-boot:run
```

### Método B — Script PowerShell

```powershell
cd api
copy run-local.ps1.example run-local.ps1
```

Edita `run-local.ps1`, pon la contraseña, y ejecuta:

```powershell
.\run-local.ps1
```

## Frontend (puerto 5173)

```powershell
cd web
copy .env.example .env
npm install
npm run dev
```

Abre http://localhost:5173

## Comprobar

- http://localhost:8080/health
- http://localhost:8080/api/v1/activos

Si la API no arranca, revisa usuario/contraseña MySQL y que el servicio MySQL esté activo.
