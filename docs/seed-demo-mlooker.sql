-- Datos demo para Mlooker (MySQL Workbench)
-- Base de datos: mlooker
-- Ejecutar con la API parada o tras vaciar tablas si hay conflictos de IDs.

USE mlooker;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE activos;
TRUNCATE TABLE creadores;
TRUNCATE TABLE inversores;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO creadores (id, nombre, email) VALUES
  (1, 'Quevedo', 'quevedo@mlooker.demo'),
  (2, 'La Pantera', 'pantera@mlooker.demo'),
  (3, 'Lucho RK', 'lucho@mlooker.demo');

INSERT INTO inversores (id, nombre, saldo) VALUES
  (1, 'Alex Rivera', 12450.86);

-- rendimiento_mensual = precio por fracción aproximado (demo)
INSERT INTO activos (id, titulo, tipo, rendimiento_mensual, creador_id) VALUES
  (1, 'Buenas Noches', 'MUSICA', 14.50, 1),
  (2, 'Cayo la Noche', 'MUSICA', 9.20, 2),
  (3, 'Tour Maleante', 'MUSICA', 16.80, 3),
  (4, 'Columbia', 'MUSICA', 11.00, 1);
