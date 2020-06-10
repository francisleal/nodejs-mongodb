const mongoose = require('mongoose');

const uri = '';
const config = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}

mongoose.connect(uri, config);
mongoose.set('useCreateIndex', true);

module.exports = mongoose;