const express = require('express');
const router = express.Router();

const controller = require('../controllers/estacionController');
const { authRequired, requirePerms } = require('../middleware/auth');

router.get(
  '/',
  authRequired,
  requirePerms('estaciones:read'),
  controller.list
);

router.get(
  '/:id',
  authRequired,
  requirePerms('estaciones:read'),
  controller.getById
);

router.post(
  '/',
  authRequired,
  requirePerms('estaciones:write'),
  controller.create
);

router.post(
  '/:id/accesos',
  authRequired,
  requirePerms('accesos:write'),
  controller.addAcceso
);

router.put(
  '/:id/operador',
  authRequired,
  requirePerms('operadores:write'),
  controller.upsertOperador
);

module.exports = router;
