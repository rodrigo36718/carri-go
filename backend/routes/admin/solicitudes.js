var express = require('express');
var router = express.Router();
var productosModel = require('../../models/productosModel');
var serviciosModel = require('../../models/serviciosModel');

function soloAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  return res.redirect('/admin/login');
}

router.use(soloAdmin);

// Panel principal
router.get('/', async function (req, res) {
  try {
    const productos = await productosModel.getProductosPendientes();
    const servicios = await serviciosModel.getServiciosPendientes();

    res.render('admin/solicitudes', {
      layout: 'admin/layout',
      admin: req.session.admin,
      productos,
      servicios
    });
  } catch (error) {
    console.log(error);
    res.render('admin/solicitudes', {
      layout: 'admin/layout',
      admin: req.session.admin,
      productos: [],
      servicios: [],
      error: 'Error al cargar solicitudes'
    });
  }
});

// Aprobar producto
router.get('/productos/:id/aprobar', async function (req, res) {
  try {
    await productosModel.actualizarEstadoProducto(req.params.id, 'aprobado');
  } catch (e) {
    console.log(e);
  }
  res.redirect('/admin');
});

// Rechazar producto
router.get('/productos/:id/rechazar', async function (req, res) {
  try {
    await productosModel.actualizarEstadoProducto(req.params.id, 'rechazado');
  } catch (e) {
    console.log(e);
  }
  res.redirect('/admin');
});

// Aprobar servicio
router.get('/servicios/:id/aprobar', async function (req, res) {
  try {
    await serviciosModel.actualizarEstadoServicio(req.params.id, 'aprobado');
  } catch (e) {
    console.log(e);
  }
  res.redirect('/admin');
});

// Rechazar servicio
router.get('/servicios/:id/rechazar', async function (req, res) {
  try {
    await serviciosModel.actualizarEstadoServicio(req.params.id, 'rechazado');
  } catch (e) {
    console.log(e);
  }
  res.redirect('/admin');
});

module.exports = router;