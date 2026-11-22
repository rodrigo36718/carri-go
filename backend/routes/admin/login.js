var express = require('express');
var router = express.Router();
var usuariosModel = require('../../models/usuariosModel');

router.get('/', function (req, res) {
  if (req.session && req.session.admin) {
    return res.redirect('/admin');
  }
  res.render('admin/login', {
    layout: 'admin/layout',
    error: false
  });
});

router.post('/', async function (req, res) {
  try {
    const email = req.body.email || req.body.usuario;
    const password = req.body.password;

    const usuario = await usuariosModel.validarLogin(email, password);

    if (!usuario || usuario.rol !== 'admin') {
      return res.render('admin/login', {
        layout: 'admin/layout',
        error: true,
        message: 'Email o contraseña incorrectos, o no sos administrador'
      });
    }

    req.session.admin = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email
    };

    res.redirect('/admin');
  } catch (error) {
    console.log(error);
    res.render('admin/login', {
      layout: 'admin/layout',
      error: true,
      message: 'Error al iniciar sesión'
    });
  }
});

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/admin/login');
});

module.exports = router;