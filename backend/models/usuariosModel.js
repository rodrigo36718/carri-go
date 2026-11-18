const pool = require('./bd');
const bcrypt = require('bcrypt');

// Buscar usuario por email
async function getUsuarioByEmail(email) {
  try {
    const query = 'SELECT * FROM usuarios WHERE email = $1 LIMIT 1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Registrar nuevo usuario
async function registrarUsuario(usuario) {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(usuario.password, salt);

    const query = `
      INSERT INTO usuarios (
        nombre, apellido, email, password, telefono, rol,
        modalidad_delivery, modalidad_encargos
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, nombre, apellido, email, telefono, rol,
                modalidad_delivery, modalidad_encargos, created_at
    `;

    const values = [
      usuario.nombre,
      usuario.apellido,
      usuario.email,
      passwordHash,
      usuario.telefono || null,
      usuario.rol || 'cliente',
      Boolean(usuario.modalidad_delivery),
      Boolean(usuario.modalidad_encargos)
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Validar login
async function validarLogin(email, password) {
  try {
    const usuario = await getUsuarioByEmail(email);
    if (!usuario) return null;

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) return null;

    delete usuario.password;
    return usuario;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Traer usuario por ID
async function getUsuarioById(id) {
  try {
    const query = `
      SELECT id, nombre, apellido, email, rol, telefono,
             modalidad_delivery, modalidad_encargos, created_at
      FROM usuarios
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Actualizar las modalidades habilitadas para un repartidor
async function actualizarModalidades(id, modalidadDelivery, modalidadEncargos) {
  try {
    const query = `
      UPDATE usuarios
      SET modalidad_delivery = $2,
          modalidad_encargos = $3
      WHERE id = $1 AND rol = 'repartidor'
      RETURNING id, nombre, apellido, email, rol, telefono,
                modalidad_delivery, modalidad_encargos
    `;
    const result = await pool.query(query, [id, modalidadDelivery, modalidadEncargos]);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  getUsuarioByEmail,
  registrarUsuario,
  validarLogin,
  getUsuarioById,
  actualizarModalidades
};
