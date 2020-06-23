const express = require('express');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (request, response) => {
    response.send({ ok: 'mano', id: request.userLoggedID })
});

module.exports = app => app.use('/projects', router);