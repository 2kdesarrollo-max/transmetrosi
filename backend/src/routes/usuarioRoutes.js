const express = require('express');
const router = express.Router();

const controller = require('../controllers/usuarioController');
const { authRequired, requirePerms } = require('../middleware/auth');

router.get('/meta', authRequired, requirePerms('usuarios:read'), controller.meta);
router.get('/', authRequired, requirePerms('usuarios:read'), controller.list);
router.post('/', authRequired, requirePerms('usuarios:write'), controller.create);
router.put('/:id', authRequired, requirePerms('usuarios:write'), controller.update);
router.put('/:id/password', authRequired, requirePerms('usuarios:write'), controller.setPassword);

module.exports = router;
