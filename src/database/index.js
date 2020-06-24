const mongoose = require('mongoose');

const { uri } = require('../config/mongoUri.json');

const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}

mongoose.connect(uri, config);
mongoose.set('useCreateIndex', true);

module.exports = mongoose;