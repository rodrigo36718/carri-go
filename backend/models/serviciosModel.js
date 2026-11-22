const pool = require('./bd');

async function getServiciosDisponibles() {
  const query = `
    SELECT s.*, u.nombre, u.apellido
    FROM servicios_repartidor s
    JOIN usuarios u ON u.id = s.repartidor_id
    WHERE s.disponible = true
      AND s.aprobado = true
    ORDER BY s.created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
}

async function publicarServicio(datos) {
  const existente = await pool.query(
    'SELECT id FROM servicios_repartidor WHERE repartidor_id = $1',
    [datos.repartidor_id]
  );

  if (existente.rows[0]) {
    const query = `
      UPDATE servicios_repartidor SET
        vehiculo = $1,
        capacidad = $2,
        zona = $3,
        telefono = $4,
        disponible = $5,
        imagen_url = COALESCE($6, imagen_url)
      WHERE repartidor_id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [
      datos.vehiculo,
      datos.capacidad || null,
      datos.zona || null,
      datos.telefono || null,
      datos.disponible !== undefined ? datos.disponible : true,
      datos.imagen_url || null,
      datos.repartidor_id
    ]);
    return result.rows[0];
  }

  const query = `
    INSERT INTO servicios_repartidor
      (repartidor_id, vehiculo, capacidad, zona, telefono, disponible, imagen_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const result = await pool.query(query, [
    datos.repartidor_id,
    datos.vehiculo,
    datos.capacidad || null,
    datos.zona || null,
    datos.telefono || null,
    true,
    datos.imagen_url || null
  ]);
  return result.rows[0];
}

async function getServicioByRepartidor(repartidorId) {
  const result = await pool.query(
    'SELECT * FROM servicios_repartidor WHERE repartidor_id = $1',
    [repartidorId]
  );
  return result.rows[0];
}

module.exports = {
  getServiciosDisponibles,
  publicarServicio,
  getServicioByRepartidor
};