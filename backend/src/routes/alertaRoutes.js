const express = require('express');
const router = express.Router();

const controller = require('../controllers/alertaController');
const { authRequired, requirePerms } = require('../middleware/auth');

router.get(
  '/',
  authRequired,
  requirePerms('alertas:read'),
  controller.list
);

router.put(
  '/:id/leida',
  authRequired,
  requirePerms('alertas:write'),
  controller.markRead
);

module.exports = router;
