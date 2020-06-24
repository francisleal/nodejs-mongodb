const mongoose = require('../database');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        unique: true, // cria email unico
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // não traz informação da senha do banco de dados
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetTokenExpires: {
        type: Date,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;