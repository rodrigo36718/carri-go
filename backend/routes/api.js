var express = require('express');
var router = express.Router();
var usuariosModel = require('../models/usuariosModel');
var productosModel = require('../models/productosModel');
var serviciosModel = require('../models/serviciosModel');
var jwt = require('jsonwebtoken');

// ======================
// MIDDLEWARE DE AUTH
// ======================
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: true, message: 'Token requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'carrigo_secret_key_cambiar', (err, usuario) => {
    if (err) {
      return res.status(403).json({ error: true, message: 'Token inválido' });
    }
    req.usuario = usuario;
    next();
  });
}

// ======================
// AUTENTICACIÓN
// ======================
router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono, rol, modalidad_delivery, modalidad_encargos } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ error: true, message: 'Faltan datos obligatorios' });
    }

    const usuarioExistente = await usuariosModel.getUsuarioByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ error: true, message: 'El email ya está registrado' });
    }

    const nuevoUsuario = await usuariosModel.registrarUsuario({
      nombre,
      apellido,
      email,
      password,
      telefono,
      rol: rol || 'cliente',
      modalidad_delivery: modalidad_delivery || false,
      modalidad_encargos: modalidad_encargos || false
    });

    res.status(201).json({
      error: false,
      message: 'Usuario registrado correctamente',
      usuario: nuevoUsuario
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Error al registrar el usuario' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Email y contraseña son obligatorios' });
    }

    const usuario = await usuariosModel.validarLogin(email, password);
    if (!usuario) {
      return res.status(401).json({ error: true, message: 'Email o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol, nombre: usuario.nombre },
      process.env.JWT_SECRET || 'carrigo_secret_key_cambiar',
      { expiresIn: '7d' }
    );

    res.json({
      error: false,
      message: 'Login correcto',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        telefono: usuario.telefono
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Error al iniciar sesión' });
  }
});

// ======================
// PRODUCTOS (RESTAURANTES)
// ======================

// Listar todos los productos (página Delivery)
router.get('/productos', async (req, res) => {
  try {
    const productos = await productosModel.getProductos();
    res.json({ error: false, productos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Error al obtener productos' });
  }
});

// Crear producto (solo rol restaurante) + imagen Cloudinary
router.post('/productos', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'restaurante') {
      return res.status(403).json({
        error: true,
        message: 'Solo los restaurantes pueden publicar productos'
      });
    }

    const { nombre, descripcion, precio } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({
        error: true,
        message: 'Nombre y precio son obligatorios'
      });
    }

    let imagen_url = null;

    // Si viene una imagen, la subimos a Cloudinary
    if (req.files && req.files.imagen) {
      const cloudinary = require('cloudinary').v2;

      const archivo = req.files.imagen;
      const resultado = await cloudinary.uploader.upload(archivo.tempFilePath, {
        folder: 'carrigo/productos'
      });
      imagen_url = resultado.secure_url;
    }

    const restaurante = await productosModel.getOrCreateRestaurante(req.usuario.id, {
      nombre: req.usuario.nombre + ' Restaurante'
    });

    const producto = await productosModel.crearProducto({
      restaurante_id: restaurante.id,
      nombre,
      descripcion,
      precio,
      imagen_url
    });

    res.status(201).json({
      error: false,
      message: 'Producto creado',
      producto
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: 'Error al crear el producto'
    });
  }
});
// Editar producto
router.put('/productos/:id', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'restaurante') {
      return res.status(403).json({ error: true, message: 'Solo los restaurantes pueden editar productos' });
    }

    const { nombre, descripcion, precio, imagen_url } = req.body;
    const productoId = req.params.id;

    const producto = await productosModel.actualizarProducto(productoId, {
      nombre,
      descripcion,
      precio,
      imagen_url
    });

    if (!producto) {
      return res.status(404).json({ error: true, message: 'Producto no encontrado' });
    }

    res.json({ error: false, message: 'Producto actualizado', producto });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Error al actualizar el producto' });
  }
});

// Eliminar producto
router.delete('/productos/:id', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'restaurante') {
      return res.status(403).json({ error: true, message: 'Solo los restaurantes pueden eliminar productos' });
    }

    const productoId = req.params.id;
    const eliminado = await productosModel.eliminarProducto(productoId);

    if (!eliminado) {
      return res.status(404).json({ error: true, message: 'Producto no encontrado' });
    }

    res.json({ error: false, message: 'Producto eliminado' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Error al eliminar el producto' });
  }
});

// ======================
// SERVICIOS DE REPARTIDOR (ENCARGOS)
// ======================

// Listar servicios disponibles (página Encargos + recarga de Mi Servicio)
router.get('/servicios', async (req, res) => {
  try {
    const servicios = await serviciosModel.getServiciosDisponibles();
    res.json({ error: false, servicios });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Error al obtener servicios' });
  }
});

// Publicar / actualizar servicio (solo rol repartidor)
router.post('/servicios', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'repartidor') {
      return res.status(403).json({
        error: true,
        message: 'Solo los repartidores pueden publicar servicios'
      });
    }

    const { vehiculo, capacidad, zona, telefono } = req.body;

    if (!vehiculo) {
      return res.status(400).json({
        error: true,
        message: 'El vehículo es obligatorio'
      });
    }

    let imagen_url = null;

    // Subir imagen a Cloudinary si viene
    if (req.files && req.files.imagen) {
      const cloudinary = require('cloudinary').v2;
      const archivo = req.files.imagen;
      const resultado = await cloudinary.uploader.upload(archivo.tempFilePath, {
        folder: 'carrigo/servicios'
      });
      imagen_url = resultado.secure_url;
    }

    const servicio = await serviciosModel.publicarServicio({
      repartidor_id: req.usuario.id,
      vehiculo,
      capacidad,
      zona,
      telefono,
      imagen_url
    });

    res.status(201).json({
      error: false,
      message: 'Servicio publicado',
      servicio
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: 'Error al publicar el servicio'
    });
  }
});

// ======================
// RUTA DE PRUEBA
// ======================
router.get('/', (req, res) => {
  res.json({
    message: 'API de Carri-GO funcionando',
    endpoints: [
      'POST /api/register',
      'POST /api/login',
      'GET  /api/productos',
      'POST /api/productos  (requiere token + rol restaurante)',
      'GET  /api/servicios',
      'POST /api/servicios  (requiere token + rol repartidor)'
    ]
  });
});
// ======================
// ADMIN – APROBACIONES
// ======================

function soloAdmin(req, res, next) {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: true, message: 'Solo admin' });
  }
  next();
}

// Listar pendientes
router.get('/admin/pendientes', verificarToken, soloAdmin, async (req, res) => {
  try {
    const pool = require('../models/bd');

    const productos = await pool.query(`
      SELECT p.*, r.nombre as restaurante_nombre
      FROM productos p
      JOIN restaurantes r ON r.id = p.restaurante_id
      WHERE p.aprobado = false
      ORDER BY p.created_at DESC
    `);

    const servicios = await pool.query(`
      SELECT s.*, u.nombre, u.apellido
      FROM servicios_repartidor s
      JOIN usuarios u ON u.id = s.repartidor_id
      WHERE s.aprobado = false
      ORDER BY s.created_at DESC
    `);

    res.json({
      error: false,
      productos: productos.rows,
      servicios: servicios.rows
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Error al listar pendientes' });
  }
});

// Aprobar producto
router.put('/admin/productos/:id/aprobar', verificarToken, soloAdmin, async (req, res) => {
  try {
    const pool = require('../models/bd');
    const result = await pool.query(
      'UPDATE productos SET aprobado = true WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: true, message: 'Producto no encontrado' });
    }
    res.json({ error: false, message: 'Producto aprobado', producto: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Error al aprobar' });
  }
});

// Aprobar servicio
router.put('/admin/servicios/:id/aprobar', verificarToken, soloAdmin, async (req, res) => {
  try {
    const pool = require('../models/bd');
    const result = await pool.query(
      'UPDATE servicios_repartidor SET aprobado = true WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: true, message: 'Servicio no encontrado' });
    }
    res.json({ error: false, message: 'Servicio aprobado', servicio: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Error al aprobar' });
  }
});

module.exports = router;