-- Carri-GO: modalidades de trabajo para repartidores
-- Ejecutar una sola vez sobre la base de datos carrigo.

ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS modalidad_delivery BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS modalidad_encargos BOOLEAN NOT NULL DEFAULT FALSE;

-- Los repartidores que ya existían conservan el acceso a ambas modalidades.
UPDATE usuarios
SET modalidad_delivery = TRUE,
    modalidad_encargos = TRUE
WHERE rol = 'repartidor'
  AND modalidad_delivery = FALSE
  AND modalidad_encargos = FALSE;
