const express = require('express');
const router = express.Router();

const controller = require('../controllers/accesoController');
const { authRequired, requirePerms } = require('../middleware/auth');

router.get(
  '/',
  authRequired,
  requirePerms('accesos:read'),
  controller.list
);

router.get(
  '/meta',
  authRequired,
  requirePerms('accesos:read'),
  controller.meta
);

router.get(
  '/:id',
  authRequired,
  requirePerms('accesos:read'),
  controller.getById
);

router.post(
  '/',
  authRequired,
  requirePerms('accesos:write'),
  controller.create
);

router.delete(
  '/:id',
  authRequired,
  requirePerms('accesos:write'),
  controller.remove
);

module.exports = router;
