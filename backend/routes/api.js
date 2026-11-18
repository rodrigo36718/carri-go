var express = require('express');
var router = express.Router();
var usuariosModel = require('../models/usuariosModel');
var jwt = require('jsonwebtoken');

// ======================
// RUTAS DE AUTENTICACIÓN
// ======================

// REGISTRO
router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono, rol } = req.body;

    // Validaciones básicas
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Faltan datos obligatorios'
      });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await usuariosModel.getUsuarioByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({
        error: true,
        message: 'El email ya está registrado'
      });
    }

    // Registrar el usuario (acepta rol: cliente, restaurante o repartidor)
    const nuevoUsuario = await usuariosModel.registrarUsuario({
      nombre,
      apellido,
      email,
      password,
      telefono,
      rol: rol || 'cliente'
    });

    res.status(201).json({
      error: false,
      message: 'Usuario registrado correctamente',
      usuario: nuevoUsuario
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: 'Error al registrar el usuario'
    });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Email y contraseña son obligatorios'
      });
    }

    const usuario = await usuariosModel.validarLogin(email, password);

    if (!usuario) {
      return res.status(401).json({
        error: true,
        message: 'Email o contraseña incorrectos'
      });
    }

    // Crear token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre
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
        telefono: usuario.telefono
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: 'Error al iniciar sesión'
    });
  }
});

// Ruta de prueba
router.get('/', (req, res) => {
  res.json({
    message: 'API de Carri-GO funcionando',
    endpoints: [
      'POST /api/register',
      'POST /api/login'
    ]
  });
});

module.exports = router;