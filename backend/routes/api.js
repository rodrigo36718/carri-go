var express = require('express');
var router = express.Router();
var usuariosModel = require('../models/usuariosModel');
var jwt = require('jsonwebtoken');

const ROLES_PERMITIDOS = ['cliente', 'restaurante', 'repartidor'];
const MODALIDADES_PERMITIDAS = ['delivery', 'encargos'];

function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({ error: true, message: 'Token no proporcionado' });
  }

  try {
    req.usuario = jwt.verify(
      token,
      process.env.JWT_SECRET || 'carrigo_secret_key_cambiar'
    );
    next();
  } catch (error) {
    return res.status(401).json({ error: true, message: 'Token inválido o vencido' });
  }
}

// REGISTRO
router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono, rol } = req.body;
    const modalidades = req.body.modalidades || [];

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ error: true, message: 'Faltan datos obligatorios' });
    }

    const rolFinal = rol || 'cliente';
    if (!ROLES_PERMITIDOS.includes(rolFinal)) {
      return res.status(400).json({ error: true, message: 'El tipo de cuenta seleccionado no es válido' });
    }

    if (rolFinal === 'repartidor') {
      if (!Array.isArray(modalidades) || modalidades.some(m => !MODALIDADES_PERMITIDAS.includes(m))) {
        return res.status(400).json({ error: true, message: 'Las modalidades seleccionadas no son válidas' });
      }
      if (modalidades.length === 0) {
        return res.status(400).json({ error: true, message: 'Seleccioná al menos una modalidad de repartidor' });
      }
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
      rol: rolFinal,
      modalidad_delivery: rolFinal === 'repartidor' && modalidades.includes('delivery'),
      modalidad_encargos: rolFinal === 'repartidor' && modalidades.includes('encargos')
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

// LOGIN
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
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre,
        modalidad_delivery: usuario.modalidad_delivery,
        modalidad_encargos: usuario.modalidad_encargos
      },
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
        telefono: usuario.telefono,
        modalidad_delivery: usuario.modalidad_delivery,
        modalidad_encargos: usuario.modalidad_encargos
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Error al iniciar sesión' });
  }
});

// ACTUALIZAR MODALIDADES DEL REPARTIDOR
router.patch('/repartidor/modalidades', autenticarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'repartidor') {
      return res.status(403).json({ error: true, message: 'Esta opción es solo para cuentas de repartidor' });
    }

    const { modalidad_delivery, modalidad_encargos } = req.body;
    if (typeof modalidad_delivery !== 'boolean' || typeof modalidad_encargos !== 'boolean') {
      return res.status(400).json({ error: true, message: 'Indicá ambas modalidades como verdadero o falso' });
    }

    if (!modalidad_delivery && !modalidad_encargos) {
      return res.status(400).json({ error: true, message: 'Debés mantener al menos una modalidad activa' });
    }

    const usuarioActualizado = await usuariosModel.actualizarModalidades(
      req.usuario.id,
      modalidad_delivery,
      modalidad_encargos
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ error: true, message: 'No se encontró el usuario' });
    }

    res.json({
      error: false,
      message: 'Modalidades actualizadas correctamente',
      usuario: usuarioActualizado
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Error al actualizar las modalidades' });
  }
});

// Ruta de prueba
router.get('/', (req, res) => {
  res.json({
    message: 'API de Carri-GO funcionando',
    endpoints: [
      'POST /api/register',
      'POST /api/login',
      'PATCH /api/repartidor/modalidades'
    ]
  });
});

module.exports = router;
