var express = require('express');
var router = express.Router();
var usuariosModel = require('../../models/usuariosModel');
var bcrypt = require('bcrypt');

router.get('/', function (req, res) {
  res.render('admin/login', {
    layout: 'admin/layout'
  });
});

router.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/admin/login');
});

router.post('/', async (req, res) => {
  try {
    const email = req.body.email || req.body.usuario;
    const password = req.body.password;

    const usuario = await usuariosModel.getUsuarioByEmail(email);

    if (!usuario || usuario.rol !== 'admin') {
      return res.render('admin/login', {
        layout: 'admin/layout',
        error: true
      });
    }

    const passwordOk = await bcrypt.compare(password, usuario.password);

    if (!passwordOk) {
      return res.render('admin/login', {
        layout: 'admin/layout',
        error: true
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
      error: true
    });
  }
});

module.exports = router;