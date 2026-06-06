const express = require('express');
const router = express.Router();

const controller = require('../controllers/ocupacionController');
const { authRequired, requirePerms } = require('../middleware/auth');

router.post(
  '/',
  authRequired,
  requirePerms('ocupacion:write'),
  controller.register
);

module.exports = router;
