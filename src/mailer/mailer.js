const nodemailer = require('nodemailer');

const configMail = require('../config/mail.json');

const { host, port, user, pass } = configMail;

const transport = nodemailer.createTransport({
    host, port, auth: { user, pass }
});

module.exports = transport;