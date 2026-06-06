const express = require('express');
const router = express.Router();

const controller = require('../controllers/municipalidadController');
const { authRequired, requirePerms } = require('../middleware/auth');

router.get(
  '/',
  authRequired,
  requirePerms('municipalidades:read'),
  controller.list
);

router.get(
  '/:id',
  authRequired,
  requirePerms('municipalidades:read'),
  controller.getById
);

router.post(
  '/',
  authRequired,
  requirePerms('municipalidades:write'),
  controller.create
);

module.exports = router;
