const express = require('express');
const router = express.Router();

const controller = require('../controllers/lineaController');
const { authRequired, requirePerms } = require('../middleware/auth');

router.get(
  '/',
  authRequired,
  requirePerms('lineas:read'),
  controller.list
);

router.get(
  '/:id',
  authRequired,
  requirePerms('lineas:read'),
  controller.getById
);

router.post(
  '/',
  authRequired,
  requirePerms('lineas:write'),
  controller.create
);

router.put(
  '/:id/estaciones',
  authRequired,
  requirePerms('lineas:write'),
  controller.setEstaciones
);

module.exports = router;
