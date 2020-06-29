const mongoose = require('../database');

// user referencia o id do Usuário
const NoteSchema = new mongoose.Schema({
    title: {
       type: String,
       required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;