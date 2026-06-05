# Diagrama ER — Mlooker

Esquema alineado con las entidades JPA del proyecto (rama KAN-20).

```mermaid
erDiagram
    CREADOR ||--o{ ACTIVO : registra
    INVERSOR }o--o{ ACTIVO : invierte_en
    USUARIO }o--o| CREADOR : puede_referenciar
    USUARIO }o--o| INVERSOR : puede_referenciar

    CREADOR {
      BIGINT id PK
      VARCHAR nombre
      VARCHAR email UK
      BOOLEAN verificado
    }

    ACTIVO {
      BIGINT id PK
      BIGINT creador_id FK
      VARCHAR titulo
      VARCHAR tipo
      DOUBLE rendimiento_mensual
      DOUBLE precio_total
      INT cantidad_fracciones
      DOUBLE porcentaje_disponible
    }

    INVERSOR {
      BIGINT id PK
      VARCHAR nombre
      DOUBLE saldo
    }

    USUARIO {
      BIGINT id PK
      VARCHAR username UK
      VARCHAR password
      VARCHAR rol
      VARCHAR nombre
      BIGINT inversor_id
      BIGINT creador_id
    }

    INVERSOR_ACTIVO {
      BIGINT inversor_id FK
      BIGINT activo_id FK
    }
```

## Relaciones

| Relación | Cardinalidad | Implementación |
|----------|--------------|----------------|
| Creador → Activo | 1:N | `@ManyToOne` en `Activo`, `@OneToMany` en `Creador` |
| Inversor ↔ Activo | N:M | Tabla `inversor_activo` con `@JoinTable` |
| Usuario → Creador / Inversor | 0..1 | Campos `creadorId` / `inversorId` en `usuarios` |

## Notas

- La relación N:M modela la **cartera** del inversor; el importe y tokens poseídos en la demo web se gestionan también en `localStorage` hasta persistir transacciones.
- `verificado` en `creadores` controla quién puede usar el panel de publicación.
- Tipos de activo válidos: `MUSICA`, `ALBUM`.
