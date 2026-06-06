const express = require('express');
const router = express.Router();

const controller = require('../controllers/guardiaController');
const { authRequired, requirePerms } = require('../middleware/auth');

router.get(
  '/guardias',
  authRequired,
  requirePerms('guardias:read'),
  controller.list
);

router.post(
  '/accesos/:accesoId/guardias',
  authRequired,
  requirePerms('guardias:write'),
  controller.create
);

module.exports = router;
