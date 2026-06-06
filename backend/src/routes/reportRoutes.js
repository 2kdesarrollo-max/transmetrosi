const express = require('express');
const router = express.Router();

const controller = require('../controllers/reportController');
const { authRequired, requirePerms } = require('../middleware/auth');

router.get(
  '/estaciones',
  authRequired,
  requirePerms('reportes:read'),
  controller.estaciones
);

router.get(
  '/lineas',
  authRequired,
  requirePerms('reportes:read'),
  controller.lineas
);

router.get(
  '/buses-por-linea',
  authRequired,
  requirePerms('reportes:read'),
  controller.busesPorLinea
);

module.exports = router;
