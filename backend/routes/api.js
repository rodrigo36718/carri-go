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
    const { nombre, apellido, email, password, telefono, rol } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ error: true, message: 'Faltan datos obligatorios' });
    }

    const usuarioExistente = await usuariosModel.getUsuarioByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ error: true, message: 'El email ya está registrado' });
    }

    const nuevoUsuario = await usuariosModel.registrarUsuario({
      nombre, apellido, email, password, telefono, rol: rol || 'cliente'
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
      // Usa CLOUDINARY_URL del .env automáticamente

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

// Publicar / actualizar servicio (solo rol repartidor)
router.post('/servicios', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'repartidor') {
      return res.status(403).json({ error: true, message: 'Solo los repartidores pueden publicar servicios' });
    }

    const { vehiculo, capacidad, zona, telefono } = req.body;

    if (!vehiculo) {
      return res.status(400).json({ error: true, message: 'El vehículo es obligatorio' });
    }

    const servicio = await serviciosModel.publicarServicio({
      repartidor_id: req.usuario.id,
      vehiculo,
      capacidad,
      zona,
      telefono
    });

    res.status(201).json({ error: false, message: 'Servicio publicado', servicio });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Error al publicar el servicio' });
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

module.exports = router;