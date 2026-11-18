var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ 
    message: 'API de Carri-GO funcionando correctamente',
    status: 'ok'
  });
});

module.exports = router;