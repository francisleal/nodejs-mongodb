const express = require('express');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json')

const User = require('../models/User');

const router = express.Router();

// criação do token de validação de 1 dia obs: gera apartir do id do usuário
function generateToken(params = {}) {
    return jwt.sign(params, authConfig.md5, {
        expiresIn: 86400,
    });
}

// end-point /auth/register
router.post('/register', async (request, response) => {

    const { email } = request.body;

    try {
        // verifica se o email já existe na base de dados
        if (await User.findOne({ email })) {
            return response.status(400).send({ error: 'User already exists' });
        }

        // cria novo usuario
        const user = await User.create(request.body);

        // não apresenta a senha no corpo da resposta
        user.password = undefined;

        // retorna no corpo da resposta usuário e token
        return response.send({
            user,
            token: generateToken({ id: user.id })
        });

    } catch (err) {
        return response.status(400).send({ error: 'Registration failed ' });
    }
});

router.post('/authenticate', async (request, response) => {
    const { email, password } = request.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return response.status(400).send({ error: 'User not found' });
    }

    if (user.password !== password) {
        return response.status(400).send({ error: 'Invalid password' });
    }

    user.password = undefined;

    response.send({
        user,
        token: generateToken({ id: user.id })
    });
});

module.exports = app => app.use('/auth', router);