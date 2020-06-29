const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (request, response, next) => {

    // variavel da requisição do Header de autorização
    const authHeader = request.headers.authorization;

    // verifica se não possi token
    if (!authHeader) {
        return response.status(401).send({ error: 'No token provided' });
    }

    // separa o token em duas partes 'Bearer' + token
    const parts = authHeader.split(' ');
    const [bearer, token] = parts;

    // verifica se o token está completo
    if (parts.length !== 2) {
        return response.status(401).send({ error: 'Token error' });
    }

    // verifca se o token foi mal formado
    if (!/Bearer/gi.test(bearer)) {
        return response.status(401).send({ error: 'Token malformatted' });
    }

    // verifica se o token é o mesmo do md5
    jwt.verify(token, authConfig.md5, (err, decoded) => {

        // verifica se o token está válido
        if (err) return response.status(401).send({ error: 'Token invalid' });

        // decodifica o id passado pelo generateToken()
        request.userLoggedID = decoded.id;

        return next();
    })
}