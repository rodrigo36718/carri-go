const pool = require('./bd');

// Listar todos los productos disponibles (para Delivery)
async function getProductos() {
  const query = `
    SELECT p.*, r.nombre as restaurante_nombre
    FROM productos p
    JOIN restaurantes r ON r.id = p.restaurante_id
    WHERE p.disponible = true
      AND r.activo = true
      AND p.aprobado = true
    ORDER BY p.created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
}

// Listar productos de un restaurante específico
async function getProductosByRestaurante(restauranteId) {
  const query = `
    SELECT * FROM productos 
    WHERE restaurante_id = $1 
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [restauranteId]);
  return result.rows;
}

// Crear un producto (solo restaurante)
async function crearProducto(producto) {
  const query = `
    INSERT INTO productos (restaurante_id, nombre, descripcion, precio, imagen_url, disponible)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const values = [
    producto.restaurante_id,
    producto.nombre,
    producto.descripcion || null,
    producto.precio,
    producto.imagen_url || null,
    producto.disponible !== undefined ? producto.disponible : true
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Buscar o crear el restaurante del usuario
async function getOrCreateRestaurante(usuarioId, datos = {}) {
  // Primero buscamos si ya tiene restaurante
  let result = await pool.query(
    'SELECT * FROM restaurantes WHERE usuario_id = $1',
    [usuarioId]
  );

  if (result.rows[0]) {
    return result.rows[0];
  }

  // Si no tiene, lo creamos
  const insert = await pool.query(
    `INSERT INTO restaurantes (usuario_id, nombre, descripcion, telefono)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [
      usuarioId,
      datos.nombre || 'Mi Restaurante',
      datos.descripcion || null,
      datos.telefono || null
    ]
  );
  return insert.rows[0];
}
// Actualizar producto
async function actualizarProducto(id, datos) {
  const query = `
    UPDATE productos 
    SET nombre = $1, 
        descripcion = $2, 
        precio = $3, 
        imagen_url = COALESCE($4, imagen_url)
    WHERE id = $5
    RETURNING *
  `;
  const values = [
    datos.nombre,
    datos.descripcion || null,
    datos.precio,
    datos.imagen_url || null,
    id
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
}

// Eliminar producto
async function eliminarProducto(id) {
  const result = await pool.query(
    'DELETE FROM productos WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rowCount > 0;
}
module.exports = {
  getProductos,
  getProductosByRestaurante,
  crearProducto,
  getOrCreateRestaurante,
  actualizarProducto,
  eliminarProducto
};