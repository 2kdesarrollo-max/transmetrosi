const express = require('express');
const router = express.Router();

const controller = require('../controllers/parqueoController');
const { authRequired, requirePerms } = require('../middleware/auth');

router.get(
  '/',
  authRequired,
  requirePerms('parqueos:read'),
  controller.list
);

router.post(
  '/',
  authRequired,
  requirePerms('parqueos:write'),
  controller.create
);

router.get(
  '/:id/lineas-permitidas',
  authRequired,
  requirePerms('parqueos:read'),
  controller.listAllowedLineas
);

router.put(
  '/:id/lineas-permitidas',
  authRequired,
  requirePerms('parqueos:write'),
  controller.setAllowedLineas
);

module.exports = router;
