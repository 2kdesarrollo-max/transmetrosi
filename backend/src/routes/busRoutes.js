const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const { authRequired, requirePerms } = require('../middleware/auth');

router.get(
  '/',
  authRequired,
  requirePerms('buses:read'),
  busController.getAllBuses
);

router.get(
  '/meta',
  authRequired,
  requirePerms('buses:read'),
  busController.meta
);

router.get(
  '/:id',
  authRequired,
  requirePerms('buses:read'),
  busController.getById
);

router.post(
  '/',
  authRequired,
  requirePerms('buses:write'),
  busController.create
);

router.put(
  '/:id/ocupacion',
  authRequired,
  requirePerms('buses:write', 'ocupacion:write'),
  busController.updateOcupacion
);

router.put(
  '/:id/estacion',
  authRequired,
  requirePerms('buses:write', 'ocupacion:write'),
  busController.setEstacionActual
);

router.put(
  '/:id/estado',
  authRequired,
  requirePerms('buses:write'),
  busController.setEstado
);

router.put(
  '/:id/parqueo',
  authRequired,
  requirePerms('buses:write'),
  busController.setParqueo
);

router.put(
  '/:id/linea',
  authRequired,
  requirePerms('buses:write'),
  busController.setLinea
);

router.put(
  '/:id/piloto',
  authRequired,
  requirePerms('buses:write'),
  busController.setPiloto
);

module.exports = router;
