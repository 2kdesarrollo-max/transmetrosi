const express = require('express');
const router = express.Router();

const controller = require('../controllers/operadorController');
const { authRequired, requirePerms } = require('../middleware/auth');

router.get(
  '/',
  authRequired,
  requirePerms('operadores:read'),
  controller.list
);

router.get(
  '/:id',
  authRequired,
  requirePerms('operadores:read'),
  controller.getById
);

router.post(
  '/',
  authRequired,
  requirePerms('operadores:write'),
  controller.create
);

router.put(
  '/:id',
  authRequired,
  requirePerms('operadores:write'),
  controller.update
);

module.exports = router;
