const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authRequired } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.get('/me', authRequired, authController.me);

module.exports = router;
