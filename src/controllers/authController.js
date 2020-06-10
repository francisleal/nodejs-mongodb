const express = require('express');

const User = require('../models/User');

const router = express.Router();

// end-point /auth/register
router.post('/register', async (request, response) => {

    const { email } = request.body;

    try {
        // verifica se o email já existe na base de dados
        if(await User.findOne({ email })) {
            return response.status(400).send({ error: 'User already exists'});
        }

        // cria novo usuario
        const user = await User.create(request.body);

        // não apresenta a senha no corpo da resposta
        user.password = undefined;

        return response.send({ user });

    } catch (err) {
        return response.status(400).send({ error: 'Registration failed ' });
    }
});

module.exports = app => app.use('/auth', router);