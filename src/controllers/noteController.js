const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Note = require('../models/note');

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (request, response) => {
    try {
        // procura todos as anotações que tem o relacionamento user
        const note = await Note.find().populate('user');

        return response.send({ note });

    } catch (err) {
        return response.status(400).send({ error: 'Error loading new Note' });
    }
});

router.get('/:noteId', async (request, response) => {
    try {
        // procura pelo id passado como parametro
        const note = await Note.findById(request.params.noteId).populate('user');

        return response.send({ note });

    } catch (err) {
        return response.status(400).send({ error: 'Error loading new Note' });
    }
});

router.post('/', async (request, response) => {
    try {
        // cria uma nova nota pegando o id da requisição passada pelo middleware
        const note = await Note.create({ ...request.body, user: request.userLoggedID });

        return response.send({ note });

    } catch (err) {
        return response.status(400).send({ error: 'Error creating new Note' });
    }
});

router.put('/:noteId', async (request, response) => {
    try {

        const { title, description, type } = request.body;

        // procura pelo id passado como parametro
        const note = await Note.findByIdAndUpdate(request.params.noteId, {
            title,
            description,
            type
        }, { new: true });

        return response.send({ note });

    } catch (err) {
        return response.status(400).send({ error: 'Error update Note' });
    }
});

router.delete('/:noteId', async (request, response) => {
    try {
        // procura pelo id passado como parametro
        await Note.findByIdAndRemove(request.params.noteId);

        return response.send({ sucesso: 'remove sucesso' });

    } catch (err) {
        return response.status(400).send({ error: 'Error delete Note' });
    }
});

module.exports = app => app.use('/notas', router);