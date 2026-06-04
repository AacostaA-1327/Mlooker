# Diagrama ER - Mlooker (Borrador Inicial)

```mermaid
erDiagram
    CREADOR ||--o{ ACTIVO : registra
    INVERSOR ||--o{ PARTICIPACION : compra
    ACTIVO ||--o{ PARTICIPACION : recibe

    CREADOR {
      BIGINT id PK
      VARCHAR nombre
      VARCHAR email
      VARCHAR pais
      BOOLEAN activo
      TIMESTAMP created_at
      TIMESTAMP updated_at
    }

    ACTIVO {
      BIGINT id PK
      BIGINT creador_id FK
      VARCHAR titulo
      VARCHAR tipo
      DECIMAL valoracion_total
      DECIMAL porcentaje_en_venta
      VARCHAR estado
      TIMESTAMP created_at
      TIMESTAMP updated_at
    }

    INVERSOR {
      BIGINT id PK
      VARCHAR nombre
      VARCHAR email
      VARCHAR tipo
      BOOLEAN kyc_verificado
      BOOLEAN activo
      TIMESTAMP created_at
      TIMESTAMP updated_at
    }

    PARTICIPACION {
      BIGINT id PK
      BIGINT inversor_id FK
      BIGINT activo_id FK
      DECIMAL porcentaje
      DECIMAL importe_invertido
      DECIMAL precio_por_unidad
      VARCHAR estado
      TIMESTAMP fecha_compra
      TIMESTAMP created_at
      TIMESTAMP updated_at
    }
```

## Notas de diseño

- Relacion principal de negocio:
  - `Creador 1:N Activo`
  - `Inversor N:M Activo` mediante `Participacion`
- `Participacion` permite trazabilidad de compras escalonadas y estado de ciclo de vida (`PENDIENTE`, `ACTIVA`, `CANCELADA`, `LIQUIDADA`).
- La logica de limites de participacion debe validarse en servicio de dominio.
