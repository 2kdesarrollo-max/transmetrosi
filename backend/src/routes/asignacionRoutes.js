const express = require('express');
const router = express.Router();

const controller = require('../controllers/asignacionController');
const { authRequired, requirePerms } = require('../middleware/auth');

router.get(
  '/',
  authRequired,
  requirePerms('asignaciones:read'),
  controller.list
);

router.post(
  '/',
  authRequired,
  requirePerms('asignaciones:write'),
  controller.create
);

router.put(
  '/:id/finalizar',
  authRequired,
  requirePerms('asignaciones:write'),
  controller.finish
);

module.exports = router;
