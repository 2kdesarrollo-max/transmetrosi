const express = require('express');
const router = express.Router();

const controller = require('../controllers/refuerzoController');
const { authRequired, requirePerms } = require('../middleware/auth');

router.get(
  '/meta',
  authRequired,
  requirePerms('refuerzos:read'),
  controller.meta
);

router.get(
  '/',
  authRequired,
  requirePerms('refuerzos:read'),
  controller.list
);

router.post(
  '/',
  authRequired,
  requirePerms('refuerzos:write'),
  controller.create
);

router.put(
  '/:id/estado',
  authRequired,
  requirePerms('refuerzos:write'),
  controller.setEstado
);

module.exports = router;
