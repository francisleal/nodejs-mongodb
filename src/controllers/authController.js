const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const mailer = require('../mailer/mailer');
const authConfig = require('../config/auth.json');

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

    // pega o email que vem da requisição
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

    // usa o metodo 'select' para trazer password do mongodb
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

router.post('/forgot_password', async (request, response) => {
    const { email } = request.body;

    try {
        const user = await User.findOne({ email });

        // gera um token utilizando 'crypto do nodejs'
        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();

        // set a data de inspiração do token em 1 hora
        now.setHours(now.getHours() + 1);

        if (!user) {
            return response.status(400).send({ error: 'User not found' });
        }

        // atualiza o banco de dados
        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetTokenExpires: now,
            }
        });

        // mailer.sendMail({
        //     to: email,
        //     from: 'francisleal1066@gmail.com',
        //     subject: "Hello ✔",
        //     text: `Informe o Token para recuperar sua senha - ${token}`,
        //     html: `Informe o Token para recuperar sua senha - <b>${token}</b>`,
        // }, (err) => {
        //     if (err) {
        //         return response.status(400).send({ error: 'Cannot send forgot password email' })
        //     }
        //     return response.send();
        // });

        return response.send({ token });

    } catch (error) {
        response.status(400).send({ error: 'User not found!' });
    }
});

router.post('/reset_password', async (request, response) => {
    const { email, token, password } = request.body;

    try {
        const user = await User.findOne({ email }).select('+passwordResetToken passwordResetTokenExpires');
        const now = new Date();

        if (!user) {
            return response.status(400).send({ error: 'User not found' });
        }

        if (token !== user.passwordResetToken) {
            return response.status(400).send({ error: 'Token invalid' })
        }

        if (now > user.passwordResetTokenExpires) {
            return response.status(400).send({ error: 'Token expired, generate a new one' });
        }

        user.password = password;

        await user.save();

        response.send({ sucess: 'Senha alterada com sucesso!' });

    } catch (error) {
        return response.status(400).send({ error: 'User not found for reset_password' });
    }
})

module.exports = app => app.use('/auth', router);