const express = require('express');
const router = express.Router();

const controller = require('../controllers/dashboardController');
const { authRequired, requirePerms } = require('../middleware/auth');

router.get(
  '/overview',
  authRequired,
  requirePerms('dashboard:read'),
  controller.overview
);

module.exports = router;
