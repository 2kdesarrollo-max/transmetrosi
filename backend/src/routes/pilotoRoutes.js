const express = require('express');
const router = express.Router();

const controller = require('../controllers/pilotoController');
const { authRequired, requirePerms } = require('../middleware/auth');

router.get(
  '/',
  authRequired,
  requirePerms('pilotos:read'),
  controller.list
);

router.get(
  '/:id',
  authRequired,
  requirePerms('pilotos:read'),
  controller.getById
);

router.post(
  '/',
  authRequired,
  requirePerms('pilotos:write'),
  controller.create
);

router.post(
  '/:id/historial',
  authRequired,
  requirePerms('pilotos:write'),
  controller.addHistorial
);

module.exports = router;
